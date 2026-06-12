export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          plan: "free" | "starter" | "pro";
          monthly_generation_limit: number;
          monthly_generation_count: number;
          billing_customer_id: string | null;
          subscription_status:
            | "active"
            | "inactive"
            | "past_due"
            | "canceled"
            | "trialing"
            | null;
          subscription_period_end: string | null;
          brand_voice: string | null;
          default_language: "en" | "tr" | "bilingual";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          plan?: "free" | "starter" | "pro";
          monthly_generation_limit?: number;
          monthly_generation_count?: number;
          billing_customer_id?: string | null;
          subscription_status?:
            | "active"
            | "inactive"
            | "past_due"
            | "canceled"
            | "trialing"
            | null;
          subscription_period_end?: string | null;
          brand_voice?: string | null;
          default_language?: "en" | "tr" | "bilingual";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          plan?: "free" | "starter" | "pro";
          monthly_generation_limit?: number;
          monthly_generation_count?: number;
          billing_customer_id?: string | null;
          subscription_status?:
            | "active"
            | "inactive"
            | "past_due"
            | "canceled"
            | "trialing"
            | null;
          subscription_period_end?: string | null;
          brand_voice?: string | null;
          default_language?: "en" | "tr" | "bilingual";
          updated_at?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          user_id: string;
          mode:
            | "customer_reply"
            | "product_description"
            | "seo_title"
            | "review_response"
            | "refund_response"
            | "late_shipping"
            | "faq_answer";
          platform:
            | "etsy"
            | "shopify"
            | "trendyol"
            | "amazon"
            | "instagram"
            | "woocommerce"
            | "other";
          input_text: string;
          tone:
            | "friendly"
            | "professional"
            | "apologetic"
            | "persuasive"
            | "concise";
          output_language: "en" | "tr" | "bilingual";
          brand_voice: string | null;
          outputs: Json;
          is_saved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          mode:
            | "customer_reply"
            | "product_description"
            | "seo_title"
            | "review_response"
            | "refund_response"
            | "late_shipping"
            | "faq_answer";
          platform?:
            | "etsy"
            | "shopify"
            | "trendyol"
            | "amazon"
            | "instagram"
            | "woocommerce"
            | "other";
          input_text: string;
          tone?:
            | "friendly"
            | "professional"
            | "apologetic"
            | "persuasive"
            | "concise";
          output_language?: "en" | "tr" | "bilingual";
          brand_voice?: string | null;
          outputs?: Json;
          is_saved?: boolean;
          created_at?: string;
        };
        Update: {
          is_saved?: boolean;
          outputs?: Json;
        };
      };
      usage_events: {
        Row: {
          id: string;
          user_id: string | null;
          event_type:
            | "signup"
            | "generation_created"
            | "checkout_started"
            | "subscription_updated"
            | "copy_clicked"
            | "login"
            | "plan_changed";
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type:
            | "signup"
            | "generation_created"
            | "checkout_started"
            | "subscription_updated"
            | "copy_clicked"
            | "login"
            | "plan_changed";
          metadata?: Json;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      admin_set_user_plan: {
        Args: {
          target_email: string;
          new_plan: string;
          new_limit?: number;
        };
        Returns: void;
      };
      reset_monthly_generation_counts: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
export type UsageEvent = Database["public"]["Tables"]["usage_events"]["Row"];
export type Plan = Profile["plan"];
