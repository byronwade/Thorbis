"use client"

import { cn } from "@/lib/utils"
import { animate, AnimationPlaybackControls, useMotionValue } from "framer-motion"
import React, { CSSProperties, useEffect, useId, useRef } from "react"

// Type definitions
interface ResponsiveImage {
	src: string
	alt?: string
	srcSet?: string
}

interface AnimationConfig {
	preview?: boolean
	scale: number
	speed: number
}

interface NoiseConfig {
	opacity: number
	scale: number
}

export interface EtherealShadowProps {
	type?: "preset" | "custom"
	presetIndex?: number
	customImage?: ResponsiveImage
	sizing?: "fill" | "stretch"
	color?: string
	animation?: AnimationConfig
	noise?: NoiseConfig
	style?: CSSProperties
	className?: string
	children?: React.ReactNode
}

function mapRange(
	value: number,
	fromLow: number,
	fromHigh: number,
	toLow: number,
	toHigh: number
): number {
	if (fromLow === fromHigh) {
		return toLow
	}
	const percentage = (value - fromLow) / (fromHigh - fromLow)
	return toLow + percentage * (toHigh - toLow)
}

const useInstanceId = (): string => {
	const id = useId()
	const cleanId = id.replace(/:/g, "")
	const instanceId = `shadowoverlay-${cleanId}`
	return instanceId
}

export function EtherealShadow({
	sizing = "fill",
	color = "rgba(128, 128, 128, 1)",
	animation,
	noise,
	style,
	className,
	children,
}: EtherealShadowProps) {
	const id = useInstanceId()
	const animationEnabled = animation && animation.scale > 0
	const feTurbulenceRef = useRef<SVGFETurbulenceElement>(null)
	const feColorMatrixRef = useRef<SVGFEColorMatrixElement>(null)
	const hueRotateMotionValue = useMotionValue(180)
	const baseFreqX = useMotionValue(mapRange(animation?.scale ?? 30, 0, 100, 0.001, 0.0005))
	const baseFreqY = useMotionValue(mapRange(animation?.scale ?? 30, 0, 100, 0.004, 0.002))
	const hueRotateAnimation = useRef<AnimationPlaybackControls | null>(null)
	const turbulenceAnimation = useRef<AnimationPlaybackControls | null>(null)

	const displacementScale = animation ? mapRange(animation.scale, 1, 100, 20, 100) : 0
	const animationDuration = animation ? mapRange(animation.speed, 1, 100, 1000, 50) : 1

	useEffect(() => {
		if (!animationEnabled || !animation) return

		// Wait for refs to be available
		const initAnimation = () => {
			if (!feTurbulenceRef.current || !feColorMatrixRef.current) {
				requestAnimationFrame(initAnimation)
				return
			}

			// Animate hue rotation
			if (hueRotateAnimation.current) {
				hueRotateAnimation.current.stop()
			}

			hueRotateMotionValue.set(0)

			hueRotateAnimation.current = animate(hueRotateMotionValue, 360, {
				duration: animationDuration / 25,
				repeat: Infinity,
				repeatType: "loop",
				repeatDelay: 0,
				ease: "linear",
				delay: 0,
				onUpdate: (value: number) => {
					if (feColorMatrixRef.current) {
						feColorMatrixRef.current.setAttribute("values", String(value))
					}
				},
			})

			// Animate turbulence baseFrequency for breathing effect
			const minFreqX = mapRange(animation.scale, 0, 100, 0.001, 0.0005)
			const maxFreqX = minFreqX * 3
			const minFreqY = mapRange(animation.scale, 0, 100, 0.004, 0.002)
			const maxFreqY = minFreqY * 3

			baseFreqX.set(minFreqX)
			baseFreqY.set(minFreqY)

			const updateTurbulence = () => {
				if (feTurbulenceRef.current) {
					const x = baseFreqX.get()
					const y = baseFreqY.get()
					feTurbulenceRef.current.setAttribute("baseFrequency", `${x},${y}`)
				}
			}

			// Subscribe to motion value changes
			const unsubscribeX = baseFreqX.on("change", updateTurbulence)
			const unsubscribeY = baseFreqY.on("change", updateTurbulence)

			// Initial update
			updateTurbulence()

			// Start animation
			if (turbulenceAnimation.current) {
				turbulenceAnimation.current.stop()
			}

			turbulenceAnimation.current = animate(
				[baseFreqX, baseFreqY],
				[maxFreqX, maxFreqY],
				{
					duration: animationDuration,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut",
				}
			)

			return () => {
				if (hueRotateAnimation.current) {
					hueRotateAnimation.current.stop()
				}
				if (turbulenceAnimation.current) {
					turbulenceAnimation.current.stop()
				}
				unsubscribeX()
				unsubscribeY()
			}
		}

		const cleanup = initAnimation()
		return cleanup
	}, [animationEnabled, animationDuration, hueRotateMotionValue, baseFreqX, baseFreqY, animation])

	return (
		<div
			className={cn("relative overflow-hidden w-full h-full", className)}
			style={style}
		>
			<div
				style={{
					position: "absolute",
					inset: -displacementScale,
					filter: animationEnabled ? `url(#${id}) blur(4px)` : "none",
				}}
			>
				{animationEnabled && (
					<svg
						style={{
							position: "absolute",
							width: "100%",
							height: "100%",
							pointerEvents: "none",
						}}
					>
						<defs>
							<filter id={id}>
								<feTurbulence
									ref={feTurbulenceRef}
									result="undulation"
									numOctaves="2"
									baseFrequency="0.001,0.004"
									seed="0"
									type="turbulence"
								/>
								<feColorMatrix
									ref={feColorMatrixRef}
									in="undulation"
									type="hueRotate"
									values="180"
								/>
								<feColorMatrix
									in="dist"
									result="circulation"
									type="matrix"
									values="4 0 0 0 1  4 0 0 0 1  4 0 0 0 1  1 0 0 0 0"
								/>
								<feDisplacementMap
									in="SourceGraphic"
									in2="circulation"
									scale={displacementScale}
									result="dist"
								/>
								<feDisplacementMap
									in="dist"
									in2="undulation"
									scale={displacementScale}
									result="output"
								/>
							</filter>
						</defs>
					</svg>
				)}

				<div
					style={{
						backgroundColor: color,
						maskImage: `url('https://framerusercontent.com/images/ceBGguIpUU8luwByxuQz79t7To.png')`,
						maskSize: sizing === "stretch" ? "100% 100%" : "cover",
						maskRepeat: "no-repeat",
						maskPosition: "center",
						width: "100%",
						height: "100%",
					}}
				/>
			</div>

			{children && (
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
					{children}
				</div>
			)}

			{noise && noise.opacity > 0 && (
				<div
					style={{
						position: "absolute",
						inset: 0,
						backgroundImage: `url("https://framerusercontent.com/images/g0QcWrxr87K0ufOxIUFBakwYA8.png")`,
						backgroundSize: noise.scale * 200,
						backgroundRepeat: "repeat",
						opacity: noise.opacity / 2,
					}}
				/>
			)}
		</div>
	)
}
