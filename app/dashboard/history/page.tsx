"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatDate, truncate } from "@/lib/utils";
import type { Generation } from "@/types/database";
import {
  Copy,
  Check,
  Trash2,
  Search,
  History,
  Filter,
  ChevronDown,
} from "lucide-react";

const MODE_LABELS: Record<string, string> = {
  customer_reply: "Customer Reply",
  product_description: "Product Description",
  seo_title: "SEO Title",
  review_response: "Review Response",
  refund_response: "Refund Response",
  late_shipping: "Late Shipping",
  faq_answer: "FAQ Answer",
};

const MODE_COLORS: Record<string, string> = {
  customer_reply: "bg-blue-100 text-blue-700",
  product_description: "bg-purple-100 text-purple-700",
  seo_title: "bg-orange-100 text-orange-700",
  review_response: "bg-yellow-100 text-yellow-700",
  refund_response: "bg-red-100 text-red-700",
  late_shipping: "bg-indigo-100 text-indigo-700",
  faq_answer: "bg-teal-100 text-teal-700",
};

export default function HistoryPage() {
  const { toast } = useToast();
  const supabase = createClient();

  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const fetchGenerations = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase
      .from("generations")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_saved", true)
      .order("created_at", { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (filterMode !== "all") {
      query = query.eq("mode", filterMode);
    }

    const { data, error } = await query;
    if (error) {
      toast({ title: "Error loading history", variant: "destructive" });
    } else {
      setGenerations(data || []);
    }
    setLoading(false);
  }, [supabase, filterMode, page, toast]);

  useEffect(() => {
    fetchGenerations();
  }, [fetchGenerations]);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Copied to clipboard!" });
  };

  const handleDelete = async (id: string) => {
    const { error } = await (supabase as any)
      .from("generations")
      .update({ is_saved: false })
      .eq("id", id);

    if (error) {
      toast({ title: "Failed to delete", variant: "destructive" });
    } else {
      setGenerations((prev) => prev.filter((g) => g.id !== id));
      toast({ title: "Deleted" });
    }
  };

  const filteredGenerations = generations.filter((g) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      g.input_text.toLowerCase().includes(q) ||
      g.mode.toLowerCase().includes(q) ||
      g.platform.toLowerCase().includes(q)
    );
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">History</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your saved generations — search, copy, and manage them
        </p>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by message or mode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="flex h-10 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All modes</option>
          {Object.entries(MODE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : filteredGenerations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <History className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="font-medium text-muted-foreground mb-2">
            {searchQuery || filterMode !== "all"
              ? "No results found"
              : "No saved generations yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? "Try a different search term"
              : "Generate some replies and they'll appear here"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGenerations.map((gen) => {
            const outputs = gen.outputs as string[];
            const isExpanded = expandedId === gen.id;

            return (
              <Card
                key={gen.id}
                className="hover:border-primary/20 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span
                          className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                            MODE_COLORS[gen.mode] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {MODE_LABELS[gen.mode] || gen.mode}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {gen.platform}
                        </span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {gen.tone}
                        </span>
                        <span className="text-xs text-muted-foreground uppercase">
                          {gen.output_language}
                        </span>
                      </div>

                      {/* Input text */}
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium text-foreground">Input: </span>
                        {truncate(gen.input_text, 120)}
                      </p>

                      {/* Outputs */}
                      {isExpanded ? (
                        <div className="space-y-3 mt-3">
                          {outputs.map((output, i) => (
                            <div
                              key={i}
                              className="bg-muted/50 rounded-xl p-3 group relative"
                            >
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Option {i + 1}
                              </p>
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {output}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2 h-7 text-xs gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleCopy(output, `${gen.id}-${i}`)}
                              >
                                {copiedId === `${gen.id}-${i}` ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          {outputs.length} option{outputs.length !== 1 ? "s" : ""} generated
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(gen.created_at)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : gen.id)
                          }
                          title={isExpanded ? "Collapse" : "Expand"}
                        >
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                        {outputs[0] && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              handleCopy(outputs[0], `${gen.id}-quick`)
                            }
                            title="Copy first option"
                          >
                            {copiedId === `${gen.id}-quick` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() => handleDelete(gen.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {filteredGenerations.length === PAGE_SIZE && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => setPage((p) => p + 1)}
          >
            Load more
          </Button>
        </div>
      )}
    </div>
  );
}
