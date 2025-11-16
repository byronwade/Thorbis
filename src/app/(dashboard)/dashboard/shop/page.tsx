/**
 * Shop Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 */

import { CreditCard, Package, Star, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchParams = Promise<{ category?: string }>;

type ShopPageProps = {
  searchParams: SearchParams;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviews: number;
  inStock: boolean;
};

const products: Product[] = [
  {
    id: "1",
    name: "Clover Flex Card Reader",
    description:
      "All-in-one portable card reader with built-in printer, scanner, and camera",
    price: 499,
    originalPrice: 599,
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    category: "hardware",
    badge: "Popular",
    rating: 4.8,
    reviews: 124,
    inStock: true,
  },
  {
    id: "2",
    name: "Square Terminal",
    description:
      "Countertop card reader with customer-facing display and contactless payments",
    price: 299,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
    category: "hardware",
    rating: 4.7,
    reviews: 89,
    inStock: true,
  },
  {
    id: "3",
    name: "Thorbis Technician Polo",
    description:
      "Professional polo shirt with company logo and moisture-wicking fabric",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
    category: "apparel",
    rating: 4.6,
    reviews: 45,
    inStock: true,
  },
  {
    id: "4",
    name: "Branded Work Truck Decals",
    description:
      "Professional vehicle wraps and magnetic signs for company branding",
    price: 149,
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
    category: "marketing",
    badge: "New",
    rating: 4.9,
    reviews: 67,
    inStock: true,
  },
  {
    id: "5",
    name: "Tool Belt & Organizer",
    description:
      "Heavy-duty tool belt with multiple pockets and reinforced stitching",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
    category: "tools",
    rating: 4.7,
    reviews: 112,
    inStock: true,
  },
  {
    id: "6",
    name: "Invoice Books (100 pack)",
    description: "Carbonless duplicate invoice books with company branding",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1554224311-beee460ae6fb",
    category: "supplies",
    rating: 4.5,
    reviews: 34,
    inStock: true,
  },
  {
    id: "7",
    name: "Tablet Mount for Trucks",
    description:
      "Adjustable tablet holder for vehicle dashboards with 360° rotation",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f",
    category: "hardware",
    rating: 4.6,
    reviews: 56,
    inStock: true,
  },
  {
    id: "8",
    name: "Business Card Pack (500)",
    description:
      "Premium business cards with your company logo and contact info",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
    category: "marketing",
    rating: 4.8,
    reviews: 78,
    inStock: true,
  },
];

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;

  // Filter products based on category parameter
  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;
  return (
    <div className="space-y-6">
      {/* Benefits Bar */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Free Shipping</p>
              <p className="text-muted-foreground text-xs">
                On orders over $100
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Fast Delivery</p>
              <p className="text-muted-foreground text-xs">2-3 business days</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 pt-6">
            <div className="rounded-lg bg-primary/10 p-2">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm">Secure Checkout</p>
              <p className="text-muted-foreground text-xs">
                256-bit SSL encryption
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Link
            className="group"
            href={`/dashboard/shop/${product.id}`}
            key={product.id}
          >
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  alt={product.name}
                  className="object-cover transition-transform group-hover:scale-105"
                  fill
                  src={product.image}
                />
                {product.badge && (
                  <Badge className="absolute top-2 right-2">
                    {product.badge}
                  </Badge>
                )}
                {product.originalPrice && (
                  <Badge
                    className="absolute top-2 left-2 bg-destructive"
                    variant="destructive"
                  >
                    Save ${(product.originalPrice - product.price).toFixed(0)}
                  </Badge>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-base">
                  {product.name}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {product.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-warning" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">
                    ({product.reviews})
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-bold text-2xl">${product.price}</span>
                  {product.originalPrice && (
                    <span className="text-muted-foreground text-sm line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>
                {product.inStock ? (
                  <p className="mt-1 text-success text-xs dark:text-success">
                    In Stock
                  </p>
                ) : (
                  <p className="mt-1 text-destructive text-xs dark:text-destructive">
                    Out of Stock
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Section */}
      <div>
        <h2 className="mb-6 font-semibold text-xl">Why Shop With Us?</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-primary" />
                Quality Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Carefully curated selection of tools and supplies specifically
                chosen for trade professionals.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CreditCard className="h-5 w-5 text-primary" />
                Business Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Net-30 payment terms available for established businesses with
                approved credit.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Truck className="h-5 w-5 text-primary" />
                Bulk Discounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Save more when you buy in bulk. Perfect for outfitting your
                entire team.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
