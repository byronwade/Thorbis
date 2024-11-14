import React from "react";
import Script from "next/script";
import { initializeTrackers } from "../index";

interface ThorbisScriptProps {
	debug?: boolean;
	devServerUrl?: string;
}

export function ThorbisScript({ debug = false, devServerUrl = "http://localhost:3001" }: ThorbisScriptProps) {
	const initScript = `
		(function() {
			// Create debug container first
			if (${debug}) {
				const debugContainer = document.createElement('div');
				debugContainer.id = 'thorbis-debug-container';
				document.body.appendChild(debugContainer);
			}

			// Define the initialization function
			const initializeAnalytics = ${initializeTrackers.toString()};

			// Initialize the analytics instance
			const analytics = initializeAnalytics({
				debug: ${debug},
				sampleRate: 1,
				batchInterval: 1000,
				onEvent: async function(events) {
					if (${debug}) {
						console.group('📊 Thorbis Analytics Event');
						events.forEach(event => console.log('Event:', event));
						console.groupEnd();
					}

					try {
						await fetch('${devServerUrl}/events', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								'X-Thorbis-Debug': 'true'
							},
							body: JSON.stringify({
								events,
								timestamp: Date.now(),
								debug: ${debug},
								source: window.location.href
							})
						});
					} catch (error) {
						console.error('Failed to send events:', error);
					}
				}
			});

			// Assign to window object
			window.ThorbisAnalytics = {
				q: [],
				l: Date.now(),
				debug: ${debug},
				trackers: analytics
			};

			// Initialize debug display
			if (${debug}) {
				function updateDebugDisplay() {
					const debugContainer = document.getElementById('thorbis-debug-container');
					if (!debugContainer) return;
					
					const debugData = {
						activeTrackers: Array.from(window.ThorbisAnalytics.trackers.trackers.keys()),
						events: window.ThorbisAnalytics.trackers.getEvents(),
						session: window.ThorbisAnalytics.trackers.trackers.get('session')?.getEvents(),
						user: window.ThorbisAnalytics.trackers.trackers.get('user')?.getEvents(),
					};
					
					debugContainer.innerHTML = \`
						<div style="
							position: fixed;
							bottom: 20px;
							right: 20px;
							background: rgba(0, 0, 0, 0.85);
							color: #00ff00;
							padding: 15px;
							border-radius: 8px;
							font-family: monospace;
							font-size: 12px;
							max-width: 300px;
							max-height: 400px;
							overflow: auto;
							z-index: 9999;
							transition: all 0.3s ease;
							box-shadow: 0 2px 10px rgba(0,0,0,0.3);
						">
							<div style="
								margin-bottom: 10px;
								border-bottom: 1px solid #333;
								cursor: pointer;
								display: flex;
								justify-content: space-between;
								align-items: center;
								padding-bottom: 5px;
							" onclick="this.parentElement.style.opacity = this.parentElement.style.opacity === '0.1' ? '1' : '0.1'">
								<strong>Thorbis Debug</strong>
								<span style="color: #666;">▼</span>
							</div>
							<pre style="margin: 0; white-space: pre-wrap;">\${JSON.stringify(debugData, null, 2)}</pre>
						</div>
					\`;
				}

				// Update display every second
				window.setInterval(updateDebugDisplay, 1000);
				
				// Initial update with delay to ensure DOM is ready
				window.setTimeout(updateDebugDisplay, 100);
			}
		})();
	`;

	return <Script id="thorbis-analytics" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: initScript }} />;
}
