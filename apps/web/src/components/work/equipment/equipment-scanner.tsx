/**
 * Equipment Scanner Component
 *
 * Captures photos and analyzes equipment using Google Vision API
 * - Serial number extraction
 * - Brand/model identification
 * - HVAC-specific analysis
 * - Document/label scanning
 */

"use client";

import {
	AlertTriangle,
	Barcode,
	Camera,
	Check,
	Copy,
	FileText,
	Loader2,
	RefreshCw,
	Settings2,
	Upload,
	X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type AnalysisType = "equipment" | "document" | "barcode" | "text";

type SerialNumber = {
	value: string;
	confidence: number;
	type: "serial" | "model" | "part" | "unknown";
};

type HVACInfo = {
	type: string;
	manufacturer?: string;
	estimatedAge?: string;
	efficiency?: string;
};

type EquipmentAnalysis = {
	equipmentType?: string;
	brand?: string;
	model?: string;
	serialNumbers: SerialNumber[];
	allText: string;
	labels: Array<{ description: string; score: number }>;
	logos: Array<{ description: string; score: number }>;
	conditionHints: string[];
	hvacInfo?: HVACInfo;
};

type ScanResult = {
	success: boolean;
	type: AnalysisType;
	data:
		| EquipmentAnalysis
		| { text: string }
		| { barcodes: Array<{ format: string; rawValue: string }> };
};

interface EquipmentScannerProps {
	onScanComplete?: (result: ScanResult) => void;
	onSerialExtracted?: (serial: string, type: string) => void;
	defaultType?: AnalysisType;
	className?: string;
	compact?: boolean;
}

export function EquipmentScanner({
	onScanComplete,
	onSerialExtracted,
	defaultType = "equipment",
	className,
	compact = false,
}: EquipmentScannerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isScanning, setIsScanning] = useState(false);
	const [isCameraActive, setIsCameraActive] = useState(false);
	const [scanType, setScanType] = useState<AnalysisType>(defaultType);
	const [result, setResult] = useState<ScanResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Start camera
	const startCamera = useCallback(async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: "environment",
					width: { ideal: 1920 },
					height: { ideal: 1080 },
				},
			});
			streamRef.current = stream;
			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				videoRef.current.play();
			}
			setIsCameraActive(true);
			setError(null);
		} catch (err) {
			console.error("Camera access error:", err);
			setError("Unable to access camera. Please check permissions.");
		}
	}, []);

	// Stop camera
	const stopCamera = useCallback(() => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		setIsCameraActive(false);
	}, []);

	// Capture photo from camera
	const capturePhoto = useCallback(() => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext("2d");
		if (ctx) {
			ctx.drawImage(video, 0, 0);
			const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
			setPreview(dataUrl);
			stopCamera();
		}
	}, [stopCamera]);

	// Handle file upload
	const handleFileUpload = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (e) => {
				setPreview(e.target?.result as string);
			};
			reader.readAsDataURL(file);
		},
		[],
	);

	// Analyze image
	const analyzeImage = useCallback(async () => {
		if (!preview) return;

		setIsScanning(true);
		setError(null);
		setResult(null);

		try {
			const response = await fetch("/api/vision/analyze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: preview,
					type: scanType,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || "Analysis failed");
			}

			const scanResult: ScanResult = await response.json();
			setResult(scanResult);

			// Notify parent
			onScanComplete?.(scanResult);

			// Extract serial if equipment analysis
			if (
				scanType === "equipment" &&
				scanResult.data &&
				"serialNumbers" in scanResult.data
			) {
				const equipmentData = scanResult.data as EquipmentAnalysis;
				const primarySerial = equipmentData.serialNumbers.find(
					(s) => s.type === "serial",
				);
				if (primarySerial) {
					onSerialExtracted?.(primarySerial.value, primarySerial.type);
				}
			}
		} catch (err) {
			console.error("Analysis error:", err);
			setError(err instanceof Error ? err.message : "Analysis failed");
		} finally {
			setIsScanning(false);
		}
	}, [preview, scanType, onScanComplete, onSerialExtracted]);

	// Reset scanner
	const reset = useCallback(() => {
		setPreview(null);
		setResult(null);
		setError(null);
		stopCamera();
	}, [stopCamera]);

	// Copy to clipboard
	const copyToClipboard = useCallback((text: string) => {
		navigator.clipboard.writeText(text);
	}, []);

	// Handle dialog close
	const handleOpenChange = useCallback(
		(open: boolean) => {
			if (!open) {
				stopCamera();
			}
			setIsOpen(open);
		},
		[stopCamera],
	);

	// Render equipment analysis result
	const renderEquipmentResult = (data: EquipmentAnalysis) => (
		<div className="space-y-4">
			{/* Equipment Info */}
			{(data.brand || data.equipmentType) && (
				<div className="flex items-center gap-2 flex-wrap">
					{data.brand && (
						<Badge variant="secondary" className="text-sm">
							{data.brand}
						</Badge>
					)}
					{data.equipmentType && (
						<Badge variant="outline" className="text-sm">
							{data.equipmentType}
						</Badge>
					)}
				</div>
			)}

			{/* HVAC Info */}
			{data.hvacInfo && (
				<Card>
					<CardHeader className="py-2 px-3">
						<CardTitle className="text-sm">HVAC Details</CardTitle>
					</CardHeader>
					<CardContent className="py-2 px-3 space-y-1">
						<p className="text-sm">
							<span className="text-muted-foreground">Type:</span>{" "}
							{data.hvacInfo.type}
						</p>
						{data.hvacInfo.manufacturer && (
							<p className="text-sm">
								<span className="text-muted-foreground">Manufacturer:</span>{" "}
								{data.hvacInfo.manufacturer}
							</p>
						)}
						{data.hvacInfo.efficiency && (
							<p className="text-sm">
								<span className="text-muted-foreground">Efficiency:</span>{" "}
								{data.hvacInfo.efficiency}
							</p>
						)}
						{data.hvacInfo.estimatedAge && (
							<p className="text-sm">
								<span className="text-muted-foreground">Age:</span>{" "}
								{data.hvacInfo.estimatedAge}
							</p>
						)}
					</CardContent>
				</Card>
			)}

			{/* Serial Numbers */}
			{data.serialNumbers.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-medium">Extracted Numbers</h4>
					{data.serialNumbers.map((serial, i) => (
						<div
							key={i}
							className="flex items-center justify-between p-2 bg-muted rounded-md"
						>
							<div>
								<p className="font-mono text-sm">{serial.value}</p>
								<p className="text-xs text-muted-foreground capitalize">
									{serial.type} • {Math.round(serial.confidence * 100)}%
									confidence
								</p>
							</div>
							<Button
								variant="ghost"
								size="icon"
								className="h-8 w-8"
								onClick={() => copyToClipboard(serial.value)}
							>
								<Copy className="h-4 w-4" />
							</Button>
						</div>
					))}
				</div>
			)}

			{/* Condition Hints */}
			{data.conditionHints.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-medium">Condition Notes</h4>
					<div className="flex flex-wrap gap-1">
						{data.conditionHints.map((hint, i) => (
							<Badge key={i} variant="outline" className="text-xs">
								{hint}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* Labels */}
			{data.labels.length > 0 && (
				<div className="space-y-2">
					<h4 className="text-sm font-medium">Detected Labels</h4>
					<div className="flex flex-wrap gap-1">
						{data.labels.slice(0, 8).map((label, i) => (
							<Badge key={i} variant="secondary" className="text-xs">
								{label.description}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);

	// Compact trigger button
	if (compact) {
		return (
			<Dialog open={isOpen} onOpenChange={handleOpenChange}>
				<DialogTrigger asChild>
					<Button variant="outline" size="sm" className={className}>
						<Camera className="h-4 w-4 mr-2" />
						Scan
					</Button>
				</DialogTrigger>
				<DialogContent className="max-w-lg">
					<DialogHeader>
						<DialogTitle>Equipment Scanner</DialogTitle>
						<DialogDescription>
							Take a photo or upload an image to analyze equipment
						</DialogDescription>
					</DialogHeader>
					{renderScannerContent()}
				</DialogContent>
			</Dialog>
		);
	}

	// Full scanner content
	function renderScannerContent() {
		return (
			<div className="space-y-4">
				{/* Scan Type Selector */}
				<Select
					value={scanType}
					onValueChange={(v) => setScanType(v as AnalysisType)}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select scan type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="equipment">
							<div className="flex items-center gap-2">
								<Settings2 className="h-4 w-4" />
								Equipment Analysis
							</div>
						</SelectItem>
						<SelectItem value="document">
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Document OCR
							</div>
						</SelectItem>
						<SelectItem value="barcode">
							<div className="flex items-center gap-2">
								<Barcode className="h-4 w-4" />
								Barcode Scan
							</div>
						</SelectItem>
						<SelectItem value="text">
							<div className="flex items-center gap-2">
								<FileText className="h-4 w-4" />
								Text Only
							</div>
						</SelectItem>
					</SelectContent>
				</Select>

				{/* Camera/Preview Area */}
				<div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
					{isCameraActive ? (
						<video
							ref={videoRef}
							className="w-full h-full object-cover"
							playsInline
							muted
						/>
					) : preview ? (
						<img
							src={preview}
							alt="Preview"
							className="w-full h-full object-contain"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<div className="text-center text-muted-foreground">
								<Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
								<p>No image selected</p>
							</div>
						</div>
					)}

					{/* Camera controls overlay */}
					{isCameraActive && (
						<div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
							<Button onClick={capturePhoto}>
								<Camera className="h-4 w-4 mr-2" />
								Capture
							</Button>
							<Button variant="outline" onClick={stopCamera}>
								Cancel
							</Button>
						</div>
					)}
				</div>

				{/* Hidden canvas for capture */}
				<canvas ref={canvasRef} className="hidden" />

				{/* Action Buttons */}
				{!isCameraActive && !preview && (
					<div className="flex gap-2">
						<Button onClick={startCamera} className="flex-1">
							<Camera className="h-4 w-4 mr-2" />
							Open Camera
						</Button>
						<Button
							variant="outline"
							onClick={() => fileInputRef.current?.click()}
							className="flex-1"
						>
							<Upload className="h-4 w-4 mr-2" />
							Upload Image
						</Button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							className="hidden"
							onChange={handleFileUpload}
						/>
					</div>
				)}

				{/* Preview Actions */}
				{preview && !result && (
					<div className="flex gap-2">
						<Button
							onClick={analyzeImage}
							disabled={isScanning}
							className="flex-1"
						>
							{isScanning ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Analyzing...
								</>
							) : (
								<>
									<Check className="h-4 w-4 mr-2" />
									Analyze
								</>
							)}
						</Button>
						<Button variant="outline" onClick={reset}>
							<X className="h-4 w-4" />
						</Button>
					</div>
				)}

				{/* Error Display */}
				{error && (
					<div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
						<AlertTriangle className="h-4 w-4" />
						<p className="text-sm">{error}</p>
					</div>
				)}

				{/* Results */}
				{result && (
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<h3 className="font-medium">Analysis Results</h3>
							<Button variant="ghost" size="sm" onClick={reset}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Scan Another
							</Button>
						</div>

						{result.type === "equipment" &&
							renderEquipmentResult(result.data as EquipmentAnalysis)}

						{result.type === "text" && (
							<div className="p-3 bg-muted rounded-md">
								<p className="text-sm whitespace-pre-wrap">
									{(result.data as { text: string }).text}
								</p>
							</div>
						)}

						{result.type === "barcode" && (
							<div className="space-y-2">
								{(
									result.data as {
										barcodes: Array<{ format: string; rawValue: string }>;
									}
								).barcodes.map((bc, i) => (
									<div
										key={i}
										className="flex items-center justify-between p-2 bg-muted rounded-md"
									>
										<div>
											<p className="font-mono text-sm">{bc.rawValue}</p>
											<p className="text-xs text-muted-foreground">
												{bc.format}
											</p>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => copyToClipboard(bc.rawValue)}
										>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						)}
					</div>
				)}
			</div>
		);
	}

	// Full card version
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Camera className="h-5 w-5" />
					Equipment Scanner
				</CardTitle>
				<CardDescription>
					Scan equipment labels, serial numbers, and documents
				</CardDescription>
			</CardHeader>
			<CardContent>{renderScannerContent()}</CardContent>
		</Card>
	);
}
