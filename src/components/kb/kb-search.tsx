/**
 * KB Search - Client Component
 *
 * Global search bar with autocomplete for knowledge base
 */

"use client";

import { Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { searchKBArticles } from "@/actions/kb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { KBArticleWithRelations } from "@/lib/kb/types";
import { cn } from "@/lib/utils";

type KBSearchProps = {
  className?: string;
  placeholder?: string;
  showButton?: boolean;
};

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
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <div className="relative flex-1">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 size-4 text-muted-foreground" />
          <Input
            className="pl-10"
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setShowResults(true)}
            placeholder={placeholder}
            ref={inputRef}
            type="search"
            value={query}
          />
          {isSearching && (
            <Loader2 className="-translate-y-1/2 absolute top-1/2 right-3 size-4 animate-spin text-muted-foreground" />
          )}
        </div>
        {showButton && (
          <Button disabled={!query.trim() || isSearching} type="submit">
            Search
          </Button>
        )}

        {/* Autocomplete results dropdown */}
        {showResults && results.length > 0 && (
          <div className="absolute top-full z-50 mt-2 w-full rounded-lg border bg-card shadow-lg">
            <div className="max-h-96 space-y-1 overflow-y-auto p-2">
              {results.map((article) => (
                <button
                  className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent"
                  key={article.id}
                  onClick={() =>
                    handleResultClick(article.category.slug, article.slug)
                  }
                  type="button"
                >
                  <div className="font-medium">{article.title}</div>
                  {article.excerpt && (
                    <div className="line-clamp-1 text-muted-foreground text-xs">
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
                  className="w-full rounded-md px-3 py-2 text-left font-medium text-primary text-sm hover:bg-accent"
                  onClick={handleSubmit}
                  type="button"
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
