import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateWithAI } from "@/lib/ai/provider";
import { validateGenerateRequest } from "@/lib/utils/validation";
import { hasGenerationsLeft } from "@/lib/utils/limits";

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    // 2. Get user profile for limit checking
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, monthly_generation_count, monthly_generation_limit, brand_voice")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "User profile not found." },
        { status: 404 }
      );
    }

    const profileData = profile as any;

    // 3. Check generation limit
    if (
      !hasGenerationsLeft(
        profileData.plan,
        profileData.monthly_generation_count
      )
    ) {
      return NextResponse.json(
        {
          error: "Monthly generation limit reached. Please upgrade your plan.",
          code: "LIMIT_REACHED",
          plan: profileData.plan,
          used: profileData.monthly_generation_count,
          limit: profileData.monthly_generation_limit,
        },
        { status: 429 }
      );
    }

    // 4. Validate request body
    const body = await request.json();
    const validation = validateGenerateRequest(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { data: requestData } = validation;

    // 5. Use profile brand voice as fallback
    const brandVoice = requestData.brandVoice || profileData.brand_voice || undefined;

    // 6. Call AI provider
    const result = await generateWithAI({
      ...requestData,
      brandVoice,
    });

    if (!result.outputs || result.outputs.length === 0) {
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    // 7. Save generation to database
    const { data: generation, error: saveError } = await (supabase as any)
      .from("generations")
      .insert({
        user_id: user.id,
        mode: requestData.mode,
        platform: requestData.platform,
        input_text: requestData.inputText,
        tone: requestData.tone,
        output_language: requestData.outputLanguage,
        brand_voice: brandVoice || null,
        outputs: result.outputs,
        is_saved: true,
      })
      .select()
      .single();

    if (saveError) {
      console.error("Failed to save generation:", saveError);
      // Don't fail the request if saving fails - return the results anyway
    }

    // 8. Increment usage count
    const { error: updateError } = await (supabase as any)
      .from("profiles")
      .update({
        monthly_generation_count: profileData.monthly_generation_count + 1,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to update usage count:", updateError);
    }

    // 9. Track usage event
    await (supabase as any).from("usage_events").insert({
      user_id: user.id,
      event_type: "generation_created",
      metadata: {
        mode: requestData.mode,
        platform: requestData.platform,
        generation_id: generation?.id,
      },
    });

    // 10. Return results
    return NextResponse.json({
      success: true,
      outputs: result.outputs,
      generationId: generation?.id,
      usage: {
        used: profileData.monthly_generation_count + 1,
        limit: profileData.monthly_generation_limit,
        remaining:
          profileData.monthly_generation_limit -
          (profileData.monthly_generation_count + 1),
      },
    });
  } catch (error) {
    console.error("Generate API error:", error);

    const err = error as Error;
    
    // Handle AI provider errors gracefully
    if (err.message?.includes("AI_API_KEY")) {
      return NextResponse.json(
        { error: "AI service is not configured. Please contact support." },
        { status: 503 }
      );
    }

    if (err.message?.includes("Rate limit") || err.message?.includes("429")) {
      return NextResponse.json(
        { error: "AI service is temporarily busy. Please try again in a moment." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
