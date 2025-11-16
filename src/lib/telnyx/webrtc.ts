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

import { Buffer } from "node:buffer";

/**
 * WebRTC connection options
 */
export type WebRTCConnectionOptions = {
  username?: string;
  password?: string;
  expires_at?: number;
  ttl?: number;
};

/**
 * WebRTC credential response
 */
export type WebRTCCredential = {
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
};

const TELNYX_CREDENTIAL_NAME_MAX_LENGTH = 64;

/**
 * Generate WebRTC credentials for a user
 *
 * These credentials are used to authenticate the WebRTC client
 * and establish a connection to Telnyx's WebRTC platform.
 */
export async function generateWebRTCToken(params: {
  username: string;
  ttl?: number; // Time to live in seconds (default: 86400 = 24 hours)
}): Promise<{
  success: boolean;
  credential?: WebRTCCredential;
  error?: string;
}> {
  try {
    const apiKey = process.env.TELNYX_API_KEY;

    if (!apiKey) {
      return {
        success: false,
        error: "TELNYX_API_KEY is not configured",
      };
    }

    // Sanitize username - Telnyx requires only letters and numbers
    // Remove all special characters (@, ., -, _, etc.) and replace with empty string
    const sanitizedUsername = params.username.replace(/[^a-zA-Z0-9]/g, "");

    const baseName =
      sanitizedUsername.length > 0
        ? sanitizedUsername
        : Buffer.from(params.username || "user").toString("hex");
    const uniqueSuffix = Date.now().toString(36);
    const prefixLength = Math.max(
      1,
      TELNYX_CREDENTIAL_NAME_MAX_LENGTH - uniqueSuffix.length
    );
    const credentialPrefix = baseName.slice(0, prefixLength);
    const staticName = `${credentialPrefix}${uniqueSuffix}`;
    const listResponse = await fetch(
      "https://api.telnyx.com/v2/credential_connections",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    if (listResponse.ok) {
      const listData = await listResponse.json();

      // Delete old credentials that match this user's sanitized username
      if (listData.data && Array.isArray(listData.data)) {
        const userCredentials = listData.data.filter((cred: any) =>
          cred.connection_name?.startsWith(credentialPrefix)
        );

        for (const cred of userCredentials) {
          try {
            await fetch(
              `https://api.telnyx.com/v2/credential_connections/${cred.id}`,
              {
                method: "DELETE",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
              }
            );
          } catch (_error) {
            // Continue anyway - deletion errors shouldn't block new credential creation
          }
        }
      }
    }

    const generatedPassword = generateRandomPassword(32);

    // Use Telnyx REST API to create WebRTC credentials
    // Documentation: https://developers.telnyx.com/api/v2/webrtc/credentials
    const response = await fetch(
      "https://api.telnyx.com/v2/credential_connections",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          connection_name: staticName,
          user_name: staticName,
          password: generatedPassword,
          ttl: params.ttl || 86_400,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      // If the API endpoint isn't available, try the simpler credentials endpoint
      const altPassword = generateRandomPassword(32);
      const altResponse = await fetch(
        "https://api.telnyx.com/v2/texml_credentials",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            connection_name: staticName,
            user_name: staticName, // Both must be unique!
            password: altPassword,
          }),
        }
      );

      if (!altResponse.ok) {
        const _altErrorText = await altResponse.text();
        throw new Error(`Telnyx API error: ${response.status} - ${errorText}`);
      }

      const altData = await altResponse.json();

      const credential: WebRTCCredential = {
        username: altData.data?.user_name || staticName,
        password: altData.data?.password || altPassword,
        expires_at: Date.now() + (params.ttl || 86_400) * 1000,
        realm: "sip.telnyx.com",
        sip_uri: `sip:${staticName}@sip.telnyx.com`,
        stun_servers: [
          "stun:stun.telnyx.com:3478",
          "stun:stun.telnyx.com:3479",
        ],
        turn_servers: [
          {
            urls: [
              "turn:turn.telnyx.com:3478?transport=udp",
              "turn:turn.telnyx.com:3478?transport=tcp",
            ],
            username: altData.data?.user_name || staticName,
            credential: altData.data?.password || generateRandomPassword(24),
          },
        ],
      };
      return {
        success: true,
        credential,
      };
    }
    const data = await response.json();

    // Map Telnyx API response to our credential format
    const credential: WebRTCCredential = {
      username: data.data?.user_name || staticName,
      password: data.data?.password || generatedPassword,
      expires_at: data.data?.expires_at
        ? new Date(data.data.expires_at).getTime()
        : Date.now() + (params.ttl || 86_400) * 1000,
      realm: data.data?.realm || "sip.telnyx.com",
      sip_uri: data.data?.sip_uri || `sip:${staticName}@sip.telnyx.com`,
      stun_servers: data.data?.ice_servers?.stun || [
        "stun:stun.telnyx.com:3478",
        "stun:stun.telnyx.com:3479",
      ],
      turn_servers: data.data?.ice_servers?.turn || [
        {
          urls: [
            "turn:turn.telnyx.com:3478?transport=udp",
            "turn:turn.telnyx.com:3478?transport=tcp",
          ],
          username: data.data?.user_name || staticName,
          credential: data.data?.password,
        },
      ],
    };
    return {
      success: true,
      credential,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate WebRTC token",
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
export function formatSIPUri(
  phoneNumber: string,
  realm = "sip.telnyx.com"
): string {
  // Remove any non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, "");

  // Format as SIP URI
  return `sip:${cleanNumber}@${realm}`;
}

/**
 * Generate a random password for WebRTC credentials
 */
function generateRandomPassword(length = 32): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }

  return password;
}

/**
 * WebRTC connection configuration for @telnyx/webrtc client
 */
export type WebRTCClientConfig = {
  credential: WebRTCCredential;
  iceServers: RTCIceServer[];
  debug?: boolean;
  ringbackFile?: string;
  ringtoneFile?: string;
};

/**
 * Create WebRTC client configuration
 */
export function createWebRTCConfig(
  credential: WebRTCCredential,
  debug = false
): WebRTCClientConfig {
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
export function createReactNativeWebRTCConfig(
  credential: WebRTCCredential
): WebRTCClientConfig {
  return createWebRTCConfig(credential, true); // Enable debug for mobile
}

/**
 * Web browser WebRTC configuration helper
 */
export function createBrowserWebRTCConfig(
  credential: WebRTCCredential
): WebRTCClientConfig {
  return createWebRTCConfig(credential, false);
}

/**
 * Test WebRTC connectivity
 *
 * Checks if the browser/device can connect to STUN/TURN servers
 */
export async function testWebRTCConnectivity(
  credential: WebRTCCredential
): Promise<{
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
        if (candidateType === "srflx") {
          stunReachable = true;
        }
        if (candidateType === "relay") {
          turnReachable = true;
        }
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
    return {
      success: false,
      stunReachable: false,
      turnReachable: false,
      error:
        error instanceof Error ? error.message : "Failed to test connectivity",
    };
  }
}
