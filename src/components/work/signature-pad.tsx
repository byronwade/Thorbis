"use client";

import { Check, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Signature Pad Component - Client Component
 *
 * HTML5 canvas-based signature capture with touch and mouse support.
 * Returns a base64-encoded PNG image of the signature.
 */

type SignaturePadProps = {
	onSignatureChange?: (signature: string | null) => void;
	className?: string;
	disabled?: boolean;
};

export function SignaturePad({
	onSignatureChange,
	className,
	disabled = false,
}: SignaturePadProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [hasSignature, setHasSignature] = useState(false);
	const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(
		null,
	);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		// Set canvas size
		const rect = canvas.getBoundingClientRect();
		canvas.width = rect.width * window.devicePixelRatio;
		canvas.height = rect.height * window.devicePixelRatio;
		ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

		// Set drawing style
		ctx.strokeStyle = "#000000";
		ctx.lineWidth = 2;
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
	}, []);

	const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return null;
		}

		const rect = canvas.getBoundingClientRect();
		let clientX: number;
		let clientY: number;

		if ("touches" in e) {
			clientX = e.touches[0]?.clientX ?? 0;
			clientY = e.touches[0]?.clientY ?? 0;
		} else {
			clientX = e.clientX;
			clientY = e.clientY;
		}

		return {
			x: clientX - rect.left,
			y: clientY - rect.top,
		};
	};

	const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
		if (disabled) {
			return;
		}

		e.preventDefault();
		const coords = getCoordinates(e);
		if (!coords) {
			return;
		}

		setIsDrawing(true);
		setLastPoint(coords);
	};

	const draw = (e: React.MouseEvent | React.TouchEvent) => {
		if (!isDrawing || disabled) {
			return;
		}

		e.preventDefault();
		const coords = getCoordinates(e);
		if (!(coords && lastPoint)) {
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!ctx) {
			return;
		}

		ctx.beginPath();
		ctx.moveTo(lastPoint.x, lastPoint.y);
		ctx.lineTo(coords.x, coords.y);
		ctx.stroke();

		setLastPoint(coords);
		setHasSignature(true);
	};

	const stopDrawing = () => {
		if (!isDrawing) {
			return;
		}

		setIsDrawing(false);
		setLastPoint(null);

		if (hasSignature && onSignatureChange) {
			const canvas = canvasRef.current;
			if (canvas) {
				const signature = canvas.toDataURL("image/png");
				onSignatureChange(signature);
			}
		}
	};

	const clearSignature = () => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		if (!(ctx && canvas)) {
			return;
		}

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		setHasSignature(false);
		setIsDrawing(false);
		setLastPoint(null);
		if (onSignatureChange) {
			onSignatureChange(null);
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>Sign Below</CardTitle>
				<CardDescription>
					Draw your signature using your mouse, trackpad, or finger
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="relative">
					<canvas
						className={cn(
							"bg-muted/30 h-48 w-full cursor-crosshair touch-none rounded-lg border-2 border-dashed",
							disabled && "cursor-not-allowed opacity-50",
						)}
						onMouseDown={startDrawing}
						onMouseLeave={stopDrawing}
						onMouseMove={draw}
						onMouseUp={stopDrawing}
						onTouchEnd={stopDrawing}
						onTouchMove={draw}
						onTouchStart={startDrawing}
						ref={canvasRef}
					/>
					{!hasSignature && (
						<div className="pointer-events-none absolute inset-0 flex items-center justify-center">
							<p className="text-muted-foreground text-sm">
								Click and drag to sign
							</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-between">
					<Button
						disabled={!hasSignature || disabled}
						onClick={clearSignature}
						size="sm"
						type="button"
						variant="outline"
					>
						<RotateCcw className="mr-2 size-4" />
						Clear
					</Button>
					{hasSignature && (
						<div className="text-success dark:text-success flex items-center gap-2 text-sm">
							<Check className="size-4" />
							Signature captured
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
