/**
 * KB Search - Client Component
 *
 * Global search bar with autocomplete for knowledge base
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { searchKBArticles } from "@/actions/kb";
import type { KBArticleWithRelations } from "@/lib/kb/types";

interface KBSearchProps {
  className?: string;
  placeholder?: string;
  showButton?: boolean;
}

export function KBSearch({
  className,
  placeholder = "Search knowledge base...",
  showButton = true,
}: KBSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<KBArticleWithRelations[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search as user types (debounced)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      const result = await searchKBArticles(query, { limit: 5 });
      if (result.success && result.articles) {
        setResults(result.articles);
        setShowResults(true);
      }
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/kb/search?q=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleResultClick = (categorySlug: string, articleSlug: string) => {
    router.push(`/kb/${categorySlug}/${articleSlug}`);
    setShowResults(false);
    setQuery("");
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            className="pl-10"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        {showButton && (
          <Button type="submit" disabled={!query.trim() || isSearching}>
            Search
          </Button>
        )}

        {/* Autocomplete results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-card shadow-lg">
            <div className="max-h-96 space-y-1 overflow-y-auto p-2">
              {results.map((article) => (
                <button
                  key={article.id}
                  type="button"
                  onClick={() =>
                    handleResultClick(article.category.slug, article.slug)
                  }
                  className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                >
                  <div className="font-medium">{article.title}</div>
                  {article.excerpt && (
                    <div className="text-muted-foreground text-xs line-clamp-1">
                      {article.excerpt}
                    </div>
                  )}
                  <div className="text-muted-foreground text-xs">
                    {article.category.title}
                  </div>
                </button>
              ))}
              <div className="border-t pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full rounded-md px-3 py-2 text-left text-sm font-medium text-primary hover:bg-accent"
                >
                  View all results for "{query}"
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

