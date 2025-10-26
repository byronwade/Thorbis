"use client";

import {
  Calendar,
  FileText,
  Hash,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PostType = "announcement" | "discussion" | "poll" | "event" | "content";
type ReactionType = "like" | "celebrate" | "support" | "insightful";

type Post = {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  type: PostType;
  timestamp: Date;
  isPinned?: boolean;
  category?: string;
  tags?: string[];
  reactions: {
    type: ReactionType;
    count: number;
    userReacted: boolean;
  }[];
  comments: number;
  shares: number;
  views: number;
};

const MS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MS_PER_MINUTE = MS_PER_SECOND * SECONDS_PER_MINUTE;

// Mock data - in production, this would come from your database
const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: {
      name: "Sarah Johnson",
      role: "CEO",
    },
    content:
      "🎉 Exciting news team! We've just closed our biggest quarter yet with a 45% increase in revenue. This wouldn't have been possible without each and every one of you. Thank you for your dedication and hard work. Let's keep this momentum going!",
    type: "announcement",
    timestamp: new Date(Date.now() - MS_PER_MINUTE * 30),
    isPinned: true,
    category: "Company News",
    tags: ["announcement", "success"],
    reactions: [
      { type: "like", count: 42, userReacted: false },
      { type: "celebrate", count: 28, userReacted: true },
    ],
    comments: 15,
    shares: 3,
    views: 127,
  },
  {
    id: "2",
    author: {
      name: "Mike Chen",
      role: "Training Manager",
    },
    content:
      "New HVAC certification training starts next Monday! We have 5 spots remaining. This is a great opportunity to expand your skills and increase your earning potential. Check the training portal for details and to register.",
    type: "content",
    timestamp: new Date(Date.now() - MS_PER_MINUTE * 120),
    category: "Training",
    tags: ["training", "hvac", "certification"],
    reactions: [
      { type: "like", count: 18, userReacted: false },
      { type: "insightful", count: 7, userReacted: false },
    ],
    comments: 8,
    shares: 2,
    views: 89,
  },
  {
    id: "3",
    author: {
      name: "David Martinez",
      role: "Lead Technician",
    },
    content:
      "Pro tip for new techs: Always check the air filter first! I can't tell you how many 'broken' AC units I've fixed by simply replacing a clogged filter. Save yourself time and the company money by starting with the basics. 🔧",
    type: "discussion",
    timestamp: new Date(Date.now() - MS_PER_MINUTE * 360),
    category: "Best Practices",
    tags: ["tips", "ac", "troubleshooting"],
    reactions: [
      { type: "like", count: 34, userReacted: false },
      { type: "insightful", count: 19, userReacted: true },
    ],
    comments: 11,
    shares: 8,
    views: 156,
  },
];

type RecentCompanyPostsProps = {
  limit?: number;
};

export function RecentCompanyPosts({ limit = 3 }: RecentCompanyPostsProps) {
  const recentPosts = MOCK_POSTS.slice(0, limit);

  const formatTimestamp = (date: Date) => {
    const MINUTES_PER_HOUR = 60;
    const HOURS_PER_DAY = 24;

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / MS_PER_MINUTE);
    const hours = Math.floor(minutes / MINUTES_PER_HOUR);
    const days = Math.floor(hours / HOURS_PER_DAY);

    if (minutes < MINUTES_PER_HOUR) {
      return `${minutes}m ago`;
    }
    if (hours < HOURS_PER_DAY) {
      return `${hours}h ago`;
    }
    if (days < 7) {
      return `${days}d ago`;
    }
    return date.toLocaleDateString();
  };

  const getReactionIcon = (type: ReactionType) => {
    switch (type) {
      case "like":
        return "👍";
      case "celebrate":
        return "🎉";
      case "support":
        return "❤️";
      case "insightful":
        return "💡";
      default:
        return "👍";
    }
  };

  const getPostTypeIcon = (type: PostType) => {
    switch (type) {
      case "announcement":
        return <Hash className="h-4 w-4" />;
      case "poll":
        return <TrendingUp className="h-4 w-4" />;
      case "event":
        return <Calendar className="h-4 w-4" />;
      case "content":
        return <FileText className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h3 className="font-semibold text-lg">Recent Company Posts</h3>
          <p className="text-muted-foreground text-sm">
            Latest updates from your team
          </p>
        </div>
        <Button asChild size="sm" variant="outline">
          <Link href="/dashboard/communication">View All</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentPosts.map((post, index) => {
          const totalReactions = post.reactions.reduce(
            (sum, reaction) => sum + reaction.count,
            0
          );

          return (
            <div key={post.id}>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="text-xs">
                      {post.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm">
                          {post.author.name}
                        </p>
                        <span className="text-muted-foreground text-xs">•</span>
                        <span className="text-muted-foreground text-xs">
                          {formatTimestamp(post.timestamp)}
                        </span>
                      </div>
                    </div>

                    <p className="line-clamp-2 text-sm leading-relaxed">
                      {post.content}
                    </p>

                    {post.category && (
                      <Badge className="text-xs" variant="secondary">
                        {getPostTypeIcon(post.type)}
                        <span className="ml-1">{post.category}</span>
                      </Badge>
                    )}

                    <div className="flex items-center gap-4 text-muted-foreground text-xs">
                      {totalReactions > 0 && (
                        <button
                          className="flex items-center gap-1 transition-colors hover:text-foreground"
                          type="button"
                        >
                          <div className="-space-x-0.5 flex">
                            {post.reactions.slice(0, 3).map((reaction, idx) => (
                              <span
                                className="flex h-4 w-4 items-center justify-center rounded-full bg-muted text-[10px]"
                                key={idx}
                              >
                                {getReactionIcon(reaction.type)}
                              </span>
                            ))}
                          </div>
                          <span>{totalReactions}</span>
                        </button>
                      )}
                      {post.comments > 0 && (
                        <button
                          className="flex items-center gap-1 transition-colors hover:text-foreground"
                          type="button"
                        >
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{post.comments}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {index < recentPosts.length - 1 && <Separator className="mt-4" />}
            </div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" size="sm" variant="ghost">
          <Link href="/dashboard/communication">
            <MessageCircle className="mr-2 h-4 w-4" />
            View All Posts in Company Feed
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
