import { NextRequest, NextResponse } from "next/server";
import { verifyMessage } from "ethers";

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, signature, message } = await request.json();

    if (!walletAddress || !signature || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify the signature
    const recoveredAddress = verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    // In production, generate JWT token and create/update user in database
    return NextResponse.json({
      success: true,
      user: {
        walletAddress: walletAddress.toLowerCase(),
        authenticated: true,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 401 }
    );
  }
}
