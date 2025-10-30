"use client";

/**
 * Reviews Management Component - Multi-Platform Review Monitoring
 *
 * Features:
 * - Monitor reviews from Google, Facebook, Yelp
 * - AI-suggested responses
 * - Sentiment analysis
 * - Bulk response templates
 */

import { Facebook, Search, Star, ThumbsUp } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

type ReviewPlatform = "google" | "facebook" | "yelp";
type ReviewSentiment = "positive" | "neutral" | "negative";

type Review = {
  id: string;
  platform: ReviewPlatform;
  author: string;
  rating: number;
  sentiment: ReviewSentiment;
  text: string;
  date: Date;
  responded: boolean;
  response?: string;
};

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    platform: "google",
    author: "John Smith",
    rating: 5,
    sentiment: "positive",
    text: "Excellent service! The technician was professional, on time, and fixed our AC unit quickly. Highly recommend!",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responded: false,
  },
  {
    id: "2",
    platform: "facebook",
    author: "Sarah Johnson",
    rating: 4,
    sentiment: "positive",
    text: "Great experience overall. Only complaint is the wait time for scheduling, but the actual service was fantastic.",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    responded: true,
    response:
      "Thank you for your feedback, Sarah! We're working on improving our scheduling times.",
  },
  {
    id: "3",
    platform: "yelp",
    author: "Mike Davis",
    rating: 3,
    sentiment: "neutral",
    text: "Service was okay. Price was a bit higher than expected but the work was done correctly.",
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
    responded: false,
  },
];

const getPlatformIcon = (platform: ReviewPlatform) => {
  switch (platform) {
    case "google":
      return <Search className="h-4 w-4" />;
    case "facebook":
      return <Facebook className="h-4 w-4" />;
    case "yelp":
      return <Star className="h-4 w-4" />;
  }
};

const getSentimentColor = (
  sentiment: ReviewSentiment
): "default" | "secondary" | "destructive" => {
  switch (sentiment) {
    case "positive":
      return "default";
    case "neutral":
      return "secondary";
    case "negative":
      return "destructive";
  }
};

const formatTimeAgo = (date: Date): string => {
  const hours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function ReviewsManagement() {
  const [activeTab, setActiveTab] = useState<ReviewPlatform | "all">("all");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const filteredReviews =
    activeTab === "all"
      ? MOCK_REVIEWS
      : MOCK_REVIEWS.filter((r) => r.platform === activeTab);

  const avgRating = (
    MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length
  ).toFixed(1);

  return (
    <div className="flex h-full flex-col">
      {/* Stats Cards */}
      <div className="grid gap-4 border-b p-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Avg. Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{avgRating}</div>
            <p className="text-muted-foreground text-xs">
              Based on {MOCK_REVIEWS.length} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Google Reviews
            </CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {MOCK_REVIEWS.filter((r) => r.platform === "google").length}
            </div>
            <p className="text-muted-foreground text-xs">4.9 avg rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Facebook Reviews
            </CardTitle>
            <Facebook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {MOCK_REVIEWS.filter((r) => r.platform === "facebook").length}
            </div>
            <p className="text-muted-foreground text-xs">4.7 avg rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Response Rate</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {Math.round(
                (MOCK_REVIEWS.filter((r) => r.responded).length /
                  MOCK_REVIEWS.length) *
                  100
              )}
              %
            </div>
            <p className="text-muted-foreground text-xs">Within 24 hours</p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Tabs */}
      <Tabs
        className="flex h-full flex-col"
        onValueChange={(value) => setActiveTab(value as ReviewPlatform | "all")}
        value={activeTab}
      >
        <div className="border-b px-4">
          <TabsList className="h-12 w-full justify-start rounded-none border-0 bg-transparent p-0">
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
            <TabsTrigger value="yelp">Yelp</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent className="m-0 flex-1 overflow-auto p-4" value={activeTab}>
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 font-medium">No reviews found</p>
                  <p className="text-muted-foreground text-sm">
                    Reviews will appear here when customers leave feedback
                  </p>
                </div>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          {getPlatformIcon(review.platform)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {review.author}
                            </span>
                            <Badge className="capitalize" variant="outline">
                              {review.platform}
                            </Badge>
                            <Badge
                              variant={getSentimentColor(review.sentiment)}
                            >
                              {review.sentiment}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-sm">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  className={`h-3 w-3 ${
                                    i < review.rating
                                      ? "fill-yellow-500 text-yellow-500"
                                      : "text-muted"
                                  }`}
                                  key={i}
                                />
                              ))}
                            </div>
                            <span>•</span>
                            <span>{formatTimeAgo(review.date)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm">{review.text}</p>

                    {review.responded && review.response && (
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <p className="mb-1 font-medium text-sm">
                          Your Response:
                        </p>
                        <p className="text-muted-foreground text-sm">
                          {review.response}
                        </p>
                      </div>
                    )}

                    {!review.responded && (
                      <>
                        {respondingTo === review.id ? (
                          <div className="space-y-2">
                            <Textarea
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Type your response here..."
                              rows={4}
                              value={responseText}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => {
                                  // Handle response submission
                                  setRespondingTo(null);
                                  setResponseText("");
                                }}
                                size="sm"
                              >
                                Post Response
                              </Button>
                              <Button
                                onClick={() => {
                                  setRespondingTo(null);
                                  setResponseText("");
                                }}
                                size="sm"
                                variant="outline"
                              >
                                Cancel
                              </Button>
                              <Button size="sm" variant="outline">
                                AI Suggest
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => setRespondingTo(review.id)}
                            size="sm"
                            variant="outline"
                          >
                            Respond
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
