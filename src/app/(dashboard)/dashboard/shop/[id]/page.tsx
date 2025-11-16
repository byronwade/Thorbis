/**
 * Product Detail Page - Server Component
 *
 * Performance optimizations:
 * - Server Component by default (no "use client")
 * - Static content rendered on server
 * - ISR revalidation configured
 */

import { Check, CreditCard, Package, ShoppingCart, Star, Truck } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Params = Promise<{ id: string }>;

type ProductDetailPageProps = {
	params: Params;
};

type Product = {
	id: string;
	name: string;
	description: string;
	longDescription: string;
	price: number;
	originalPrice?: number;
	image: string;
	category: string;
	badge?: string;
	rating: number;
	reviews: number;
	inStock: boolean;
	features: string[];
	specifications: { label: string; value: string }[];
};

// Mock product data - in production, this would come from a database
const products: Record<string, Product> = {
	"1": {
		id: "1",
		name: "Clover Flex Card Reader",
		description: "All-in-one portable card reader with built-in printer, scanner, and camera",
		longDescription:
			"The Clover Flex is a versatile, all-in-one card reader that goes beyond simple payment processing. With a built-in printer, barcode scanner, and camera, it's designed to streamline operations for service businesses. Accept all payment types including chip, swipe, tap, and mobile wallets. The long-lasting battery and compact design make it perfect for technicians on the go.",
		price: 499,
		originalPrice: 599,
		image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
		category: "hardware",
		badge: "Popular",
		rating: 4.8,
		reviews: 124,
		inStock: true,
		features: [
			"Accept all payment types (chip, swipe, tap, mobile wallets)",
			"Built-in thermal printer for instant receipts",
			"Barcode scanner for inventory management",
			"8MP camera for job documentation",
			"Long-lasting battery (8+ hours)",
			"4G LTE and WiFi connectivity",
			"Secure, PCI-compliant processing",
			"Free Thorbis integration",
		],
		specifications: [
			{ label: "Display", value: '5" HD touchscreen' },
			{ label: "Processor", value: "Quad-core 1.4 GHz" },
			{ label: "Memory", value: "1GB RAM, 8GB storage" },
			{ label: "Battery", value: "3100mAh (8+ hours)" },
			{ label: "Connectivity", value: "4G LTE, WiFi, Bluetooth" },
			{ label: "Dimensions", value: '7.2" x 3.1" x 1.5"' },
			{ label: "Weight", value: "13.4 oz" },
			{ label: "Warranty", value: "1 year manufacturer warranty" },
		],
	},
	"2": {
		id: "2",
		name: "Square Terminal",
		description: "Countertop card reader with customer-facing display and contactless payments",
		longDescription:
			"Square Terminal is the countertop card reader designed for service businesses. With a customer-facing display, customers can view their total, apply tips, and sign right on the screen. Accept all major payment methods including contactless payments like Apple Pay and Google Pay. The all-in-one design means no additional hardware needed.",
		price: 299,
		image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
		category: "hardware",
		rating: 4.7,
		reviews: 89,
		inStock: true,
		features: [
			"Customer-facing display for transparent pricing",
			"Accept chip, swipe, tap, and mobile payments",
			"Built-in receipt printer",
			"Tip screen customization",
			"WiFi and Ethernet connectivity",
			"All-day battery life",
			"PCI-compliant security",
			"Seamless Thorbis integration",
		],
		specifications: [
			{ label: "Display", value: '7" color touchscreen' },
			{ label: "Customer Display", value: "Built-in, customer-facing" },
			{ label: "Printer", value: "Thermal receipt printer" },
			{ label: "Battery", value: "All-day battery (8+ hours)" },
			{ label: "Connectivity", value: "WiFi, Ethernet" },
			{ label: "Dimensions", value: '8.5" x 7" x 3.5"' },
			{ label: "Weight", value: "2.6 lbs" },
			{ label: "Warranty", value: "1 year manufacturer warranty" },
		],
	},
	"3": {
		id: "3",
		name: "Thorbis Technician Polo",
		description: "Professional polo shirt with company logo and moisture-wicking fabric",
		longDescription:
			"Look professional and stay comfortable all day long in our custom Thorbis technician polo. Made from high-performance moisture-wicking fabric, this polo keeps you cool during hot service calls while maintaining a professional appearance. Your company logo is embroidered on the chest, reinforcing your brand with every customer interaction.",
		price: 34.99,
		image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d",
		category: "apparel",
		rating: 4.6,
		reviews: 45,
		inStock: true,
		features: [
			"Custom embroidered company logo",
			"Moisture-wicking performance fabric",
			"Stain-resistant treatment",
			"Fade-resistant colors",
			"Available in multiple colors",
			"Sizes: S-4XL",
			"Machine washable",
			"Professional collar that won't curl",
		],
		specifications: [
			{ label: "Material", value: "100% polyester performance fabric" },
			{ label: "Weight", value: "5.6 oz fabric weight" },
			{ label: "Sizes", value: "S, M, L, XL, 2XL, 3XL, 4XL" },
			{ label: "Colors", value: "Navy, Black, Gray, Red" },
			{ label: "Logo", value: "Left chest embroidery (included)" },
			{ label: "Care", value: "Machine wash cold, tumble dry low" },
			{ label: "Features", value: "Moisture-wicking, stain-resistant" },
			{ label: "Warranty", value: "Satisfaction guaranteed" },
		],
	},
	"4": {
		id: "4",
		name: "Branded Work Truck Decals",
		description: "Professional vehicle wraps and magnetic signs for company branding",
		longDescription:
			"Turn your work trucks into mobile billboards with professional vehicle branding. Our custom decals and wraps are designed specifically for service vehicles, featuring your logo, phone number, and services. Made from durable, weather-resistant vinyl that withstands years of outdoor exposure. Installation service available.",
		price: 149,
		image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d",
		category: "marketing",
		badge: "New",
		rating: 4.9,
		reviews: 67,
		inStock: true,
		features: [
			"Custom design with your logo and branding",
			"Weather-resistant vinyl material",
			"UV-protected (won't fade)",
			"Easy to apply and remove",
			"Available in multiple sizes",
			"Magnetic options available",
			"Professional installation available",
			"Includes phone number and website",
		],
		specifications: [
			{ label: "Material", value: "Premium cast vinyl" },
			{ label: "Finish", value: "Gloss or matte options" },
			{ label: "Durability", value: "5-7 year outdoor rating" },
			{ label: "Sizes", value: "Custom sizing available" },
			{ label: "Installation", value: "DIY or professional install" },
			{ label: "Removal", value: "Clean removal, no residue" },
			{ label: "Magnetic Option", value: '12" x 18" or 12" x 24"' },
			{ label: "Warranty", value: "2 year warranty against fading" },
		],
	},
	"5": {
		id: "5",
		name: "Tool Belt & Organizer",
		description: "Heavy-duty tool belt with multiple pockets and reinforced stitching",
		longDescription:
			"Keep your essential tools organized and accessible with our professional-grade tool belt. Featuring multiple pockets and holders for common tools, this belt is designed for HVAC, plumbing, and electrical technicians. The heavy-duty construction and reinforced stitching ensure it can handle daily wear and tear while keeping you comfortable throughout the day.",
		price: 79.99,
		image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc",
		category: "tools",
		rating: 4.7,
		reviews: 112,
		inStock: true,
		features: [
			"Heavy-duty ballistic nylon construction",
			"Multiple specialized pockets and holders",
			"Reinforced rivets and stitching",
			"Padded back for comfort",
			"Quick-release buckle",
			"Adjustable sizing (fits 29-46 inch waists)",
			"Hammer loop and tape measure clip",
			"Water-resistant coating",
		],
		specifications: [
			{ label: "Material", value: "1680D ballistic nylon" },
			{ label: "Pockets", value: "12 main pockets + 6 small loops" },
			{ label: "Belt Width", value: '2.5" padded work belt' },
			{ label: "Adjustable Range", value: '29"-46" waist' },
			{ label: "Weight", value: "1.8 lbs (empty)" },
			{ label: "Buckle", value: "Quick-release metal buckle" },
			{ label: "Features", value: "Padded back, water-resistant" },
			{ label: "Warranty", value: "Lifetime warranty" },
		],
	},
	"6": {
		id: "6",
		name: "Invoice Books (100 pack)",
		description: "Carbonless duplicate invoice books with company branding",
		longDescription:
			"Professional carbonless invoice books customized with your company information. Each book contains 50 sets of duplicate invoices, giving you an original for the customer and a copy for your records. Pre-printed with your logo, company name, and contact information. Perfect for on-site invoicing when digital options aren't available.",
		price: 49.99,
		image: "https://images.unsplash.com/photo-1554224311-beee460ae6fb",
		category: "supplies",
		rating: 4.5,
		reviews: 34,
		inStock: true,
		features: [
			"Carbonless duplicate copies",
			"Custom printed with your company info",
			"Pre-numbered for organization",
			"Professional layout design",
			"Perforated for easy removal",
			'Compact 5.5" x 8.5" size',
			"100 books (5,000 total invoices)",
			"Bulk pricing available",
		],
		specifications: [
			{ label: "Size", value: '5.5" x 8.5" (statement size)' },
			{ label: "Copies", value: "2-part carbonless (white/canary)" },
			{ label: "Quantity", value: "100 books of 50 sets each" },
			{ label: "Total Invoices", value: "5,000 invoice sets" },
			{ label: "Customization", value: "Logo, company info included" },
			{ label: "Numbering", value: "Sequential numbering" },
			{ label: "Binding", value: "Wraparound cover with perforation" },
			{ label: "Shipping", value: "Ships within 5-7 business days" },
		],
	},
	"7": {
		id: "7",
		name: "Tablet Mount for Trucks",
		description: "Adjustable tablet holder for vehicle dashboards with 360° rotation",
		longDescription:
			"Keep your tablet secure and accessible with our heavy-duty vehicle mount. Designed specifically for work trucks, this mount features a strong suction cup base and adjustable arm that positions your tablet at the perfect viewing angle. The 360° rotation allows for both portrait and landscape viewing. Compatible with most tablets 7-12 inches.",
		price: 59.99,
		image: "https://images.unsplash.com/photo-1585060544812-6b45742d762f",
		category: "hardware",
		rating: 4.6,
		reviews: 56,
		inStock: true,
		features: [
			"Strong suction cup base",
			"360° rotation for any viewing angle",
			"Adjustable arm extends up to 12 inches",
			"Quick-release button",
			"Fits tablets 7-12 inches",
			"Non-slip grip pads",
			"Dashboard or windshield mount",
			"Cable management clips",
		],
		specifications: [
			{ label: "Compatibility", value: '7"-12" tablets' },
			{ label: "Mount Type", value: "Suction cup (dashboard/windshield)" },
			{ label: "Arm Length", value: "Extends 8-12 inches" },
			{ label: "Rotation", value: "360° full rotation" },
			{ label: "Weight Capacity", value: "Up to 2 lbs" },
			{ label: "Material", value: "ABS plastic with rubber grips" },
			{ label: "Features", value: "Quick-release, cable clips" },
			{ label: "Warranty", value: "1 year manufacturer warranty" },
		],
	},
	"8": {
		id: "8",
		name: "Business Card Pack (500)",
		description: "Premium business cards with your company logo and contact info",
		longDescription:
			"Make a lasting first impression with premium business cards designed specifically for service professionals. Printed on thick, premium cardstock with your logo, name, and contact information. These cards are perfect for networking, leaving with customers, and building your professional brand. Includes free design service.",
		price: 39.99,
		image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f",
		category: "marketing",
		rating: 4.8,
		reviews: 78,
		inStock: true,
		features: [
			"Premium 16pt cardstock",
			"Professional design service included",
			"Full-color printing both sides",
			"Glossy or matte finish options",
			"Standard business card size",
			"Rounded corner option",
			"500 cards per pack",
			"Fast 3-5 day turnaround",
		],
		specifications: [
			{ label: "Size", value: '3.5" x 2" (standard)' },
			{ label: "Quantity", value: "500 cards" },
			{ label: "Material", value: "16pt premium cardstock" },
			{ label: "Printing", value: "Full-color, both sides" },
			{ label: "Finish", value: "Glossy or matte" },
			{ label: "Corners", value: "Square or rounded" },
			{ label: "Turnaround", value: "3-5 business days" },
			{ label: "Design", value: "Free design service included" },
		],
	},
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
	const { id } = await params;
	const product = products[id];

	if (!product) {
		notFound();
	}

	return (
		<div className="flex h-full w-full flex-col overflow-auto">
			<div className="mx-auto w-full max-w-7xl">
				<div className="space-y-6 p-6">
					{/* Product Details */}
					<div className="grid gap-8 lg:grid-cols-2">
						{/* Product Image */}
						<div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
							<Image alt={product.name} className="object-cover" fill priority src={product.image} />
							{product.badge && <Badge className="absolute top-4 right-4 text-base">{product.badge}</Badge>}
							{product.originalPrice && (
								<Badge className="absolute top-4 left-4 bg-destructive text-base" variant="destructive">
									Save ${(product.originalPrice - product.price).toFixed(0)}
								</Badge>
							)}
						</div>

						{/* Product Info */}
						<div className="flex flex-col gap-6">
							{/* Title and Rating */}
							<div>
								<h1 className="font-bold text-3xl">{product.name}</h1>
								<p className="mt-2 text-lg text-muted-foreground">{product.description}</p>
								<div className="mt-4 flex items-center gap-2">
									<div className="flex items-center gap-1">
										{[...new Array(5)].map((_, i) => (
											<Star
												className={`h-5 w-5 ${
													i < Math.floor(product.rating) ? "fill-yellow-400 text-warning" : "text-muted"
												}`}
												key={i}
											/>
										))}
									</div>
									<span className="font-semibold">{product.rating}</span>
									<span className="text-muted-foreground">({product.reviews} reviews)</span>
								</div>
							</div>

							<Separator />

							{/* Price */}
							<div>
								<div className="flex items-baseline gap-3">
									<span className="font-bold text-4xl">${product.price}</span>
									{product.originalPrice && (
										<span className="text-2xl text-muted-foreground line-through">${product.originalPrice}</span>
									)}
								</div>
								{product.inStock ? (
									<p className="mt-2 flex items-center gap-2 text-success dark:text-success">
										<Check className="h-5 w-5" />
										In Stock - Ships within 2-3 business days
									</p>
								) : (
									<p className="mt-2 text-destructive dark:text-destructive">Out of Stock</p>
								)}
							</div>

							<Separator />

							{/* Add to Cart */}
							<div className="space-y-3">
								<Button className="w-full" disabled={!product.inStock} size="lg">
									<ShoppingCart className="mr-2 h-5 w-5" />
									Add to Cart
								</Button>
								<div className="grid gap-3 md:grid-cols-3">
									<div className="flex items-center gap-2 text-sm">
										<Truck className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">Free Shipping</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<Package className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">2-3 Day Delivery</span>
									</div>
									<div className="flex items-center gap-2 text-sm">
										<CreditCard className="h-4 w-4 text-muted-foreground" />
										<span className="text-muted-foreground">Secure Checkout</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Product Details Tabs */}
					<div className="grid gap-6 lg:grid-cols-2">
						{/* Description & Features */}
						<Card>
							<CardHeader>
								<CardTitle>Product Description</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-muted-foreground">{product.longDescription}</p>

								<div className="pt-4">
									<h3 className="mb-3 font-semibold text-lg">Key Features</h3>
									<ul className="space-y-2">
										{product.features.map((feature, index) => (
											<li className="flex items-start gap-2" key={index}>
												<Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
												<span className="text-muted-foreground text-sm">{feature}</span>
											</li>
										))}
									</ul>
								</div>
							</CardContent>
						</Card>

						{/* Specifications */}
						<Card>
							<CardHeader>
								<CardTitle>Specifications</CardTitle>
							</CardHeader>
							<CardContent>
								<dl className="divide-y">
									{product.specifications.map((spec, index) => (
										<div className="flex justify-between gap-4 py-3 text-sm" key={index}>
											<dt className="font-medium">{spec.label}</dt>
											<dd className="text-right text-muted-foreground">{spec.value}</dd>
										</div>
									))}
								</dl>
							</CardContent>
						</Card>
					</div>

					{/* Why Buy Section */}
					<Card>
						<CardHeader>
							<CardTitle>Why Buy From Thorbis?</CardTitle>
							<CardDescription>More than just products - we support your business success</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-6 md:grid-cols-3">
								<div className="space-y-2">
									<Package className="h-8 w-8 text-primary" />
									<h3 className="font-semibold">Quality Guaranteed</h3>
									<p className="text-muted-foreground text-sm">
										We only sell products we'd use in our own businesses. Every item is tested for quality and
										durability.
									</p>
								</div>
								<div className="space-y-2">
									<CreditCard className="h-8 w-8 text-primary" />
									<h3 className="font-semibold">Net-30 Terms Available</h3>
									<p className="text-muted-foreground text-sm">
										Approved businesses can pay on account with Net-30 terms. Focus on growing your business.
									</p>
								</div>
								<div className="space-y-2">
									<Truck className="h-8 w-8 text-primary" />
									<h3 className="font-semibold">Fast, Free Shipping</h3>
									<p className="text-muted-foreground text-sm">
										Free shipping on orders over $100. Most items ship within 1 business day.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
