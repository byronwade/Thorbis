/**
 * Telnyx WebRTC Service - Real-Time Communications
 *
 * Handles WebRTC operations for browser and React Native calling:
 * - WebRTC token generation
 * - Credential management
 * - Connection configuration
 *
 * Compatible with both web browsers and React Native apps.
 */

import { telnyxClient } from "./client";

/**
 * WebRTC connection options
 */
export interface WebRTCConnectionOptions {
  username?: string;
  password?: string;
  expires_at?: number;
  ttl?: number;
}

/**
 * WebRTC credential response
 */
export interface WebRTCCredential {
  username: string;
  password: string;
  expires_at: number;
  realm: string;
  sip_uri: string;
  stun_servers: string[];
  turn_servers: Array<{
    urls: string[];
    username: string;
    credential: string;
  }>;
}

/**
 * Generate WebRTC credentials for a user
 *
 * These credentials are used to authenticate the WebRTC client
 * and establish a connection to Telnyx's WebRTC platform.
 */
export async function generateWebRTCToken(params: {
  username: string;
  ttl?: number; // Time to live in seconds (default: 86400 = 24 hours)
}): Promise<{ success: boolean; credential?: WebRTCCredential; error?: string }> {
  try {
    // In a real implementation, you would call:
    // const credential = await telnyxClient.credential_connections.create({
    //   connection_name: params.username,
    //   ttl: params.ttl || 86400,
    // });

    // For now, we'll return a mock structure matching Telnyx's format
    // You'll need to implement the actual API call when ready
    const credential: WebRTCCredential = {
      username: params.username,
      password: generateRandomPassword(),
      expires_at: Date.now() + (params.ttl || 86400) * 1000,
      realm: "sip.telnyx.com",
      sip_uri: `sip:${params.username}@sip.telnyx.com`,
      stun_servers: ["stun:stun.telnyx.com:3478", "stun:stun.telnyx.com:3479"],
      turn_servers: [
        {
          urls: ["turn:turn.telnyx.com:3478?transport=udp", "turn:turn.telnyx.com:3478?transport=tcp"],
          username: params.username,
          credential: generateRandomPassword(),
        },
      ],
    };

    return {
      success: true,
      credential,
    };
  } catch (error) {
    console.error("Error generating WebRTC token:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate WebRTC token",
    };
  }
}

/**
 * Validate WebRTC credential expiration
 */
export function isCredentialExpired(credential: WebRTCCredential): boolean {
  return Date.now() >= credential.expires_at;
}

/**
 * Get time until credential expires (in seconds)
 */
export function getCredentialTimeToLive(credential: WebRTCCredential): number {
  const ttl = Math.floor((credential.expires_at - Date.now()) / 1000);
  return Math.max(0, ttl);
}

/**
 * Format SIP URI for calling
 */
export function formatSIPUri(phoneNumber: string, realm: string = "sip.telnyx.com"): string {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Format as SIP URI
  return `sip:${cleanNumber}@${realm}`;
}

/**
 * Generate a random password for WebRTC credentials
 */
function generateRandomPassword(length: number = 32): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password;
}

/**
 * WebRTC connection configuration for @telnyx/webrtc client
 */
export interface WebRTCClientConfig {
  credential: WebRTCCredential;
  iceServers: RTCIceServer[];
  debug?: boolean;
  ringbackFile?: string;
  ringtoneFile?: string;
}

/**
 * Create WebRTC client configuration
 */
export function createWebRTCConfig(credential: WebRTCCredential, debug: boolean = false): WebRTCClientConfig {
  // Convert Telnyx credential format to RTCIceServer format
  const iceServers: RTCIceServer[] = [
    // STUN servers
    ...credential.stun_servers.map((url) => ({
      urls: url,
    })),
    // TURN servers
    ...credential.turn_servers.map((server) => ({
      urls: server.urls,
      username: server.username,
      credential: server.credential,
    })),
  ];

  return {
    credential,
    iceServers,
    debug,
  };
}

/**
 * React Native WebRTC configuration helper
 *
 * Provides configuration specific to React Native apps
 */
export function createReactNativeWebRTCConfig(credential: WebRTCCredential): WebRTCClientConfig {
  return createWebRTCConfig(credential, true); // Enable debug for mobile
}

/**
 * Web browser WebRTC configuration helper
 */
export function createBrowserWebRTCConfig(credential: WebRTCCredential): WebRTCClientConfig {
  return createWebRTCConfig(credential, false);
}

/**
 * Test WebRTC connectivity
 *
 * Checks if the browser/device can connect to STUN/TURN servers
 */
export async function testWebRTCConnectivity(credential: WebRTCCredential): Promise<{
  success: boolean;
  stunReachable: boolean;
  turnReachable: boolean;
  error?: string;
}> {
  try {
    // Create a test peer connection
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: credential.stun_servers },
        ...credential.turn_servers.map((server) => ({
          urls: server.urls,
          username: server.username,
          credential: server.credential,
        })),
      ],
    });

    let stunReachable = false;
    let turnReachable = false;

    // Listen for ICE candidates to test connectivity
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        const candidateType = event.candidate.type;
        if (candidateType === "srflx") stunReachable = true;
        if (candidateType === "relay") turnReachable = true;
      }
    };

    // Create a dummy offer to trigger ICE gathering
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Wait for ICE gathering to complete
    await new Promise<void>((resolve) => {
      const checkState = () => {
        if (pc.iceGatheringState === "complete") {
          resolve();
        } else {
          setTimeout(checkState, 100);
        }
      };
      checkState();
    });

    // Clean up
    pc.close();

    return {
      success: true,
      stunReachable,
      turnReachable,
    };
  } catch (error) {
    console.error("Error testing WebRTC connectivity:", error);
    return {
      success: false,
      stunReachable: false,
      turnReachable: false,
      error: error instanceof Error ? error.message : "Failed to test connectivity",
    };
  }
}
