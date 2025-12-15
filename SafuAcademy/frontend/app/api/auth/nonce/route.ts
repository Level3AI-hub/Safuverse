import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

// Simple in-memory store for nonces (in production, use Redis or database)
const nonceStore = new Map<string, { nonce: string; timestamp: number }>();

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json();

    if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    const nonce = randomBytes(16).toString("hex");
    const message = `Sign this message to authenticate with SafuAcademy.\n\nWallet: ${walletAddress}\nNonce: ${nonce}`;

    // Store nonce with timestamp
    nonceStore.set(walletAddress.toLowerCase(), {
      nonce,
      timestamp: Date.now(),
    });

    // Clean up old nonces (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, value] of nonceStore.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        nonceStore.delete(key);
      }
    }

    return NextResponse.json({ nonce, message });
  } catch (error) {
    console.error("Nonce generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
