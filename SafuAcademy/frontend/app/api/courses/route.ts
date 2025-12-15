import { NextResponse } from "next/server";

// This API route returns courses from the blockchain
// The actual data is fetched client-side using wagmi's useReadContract
// This route can be used for server-side data or caching

export async function GET() {
  try {
    // In a full implementation, you would fetch courses from the blockchain
    // or from a database that syncs with the blockchain
    return NextResponse.json({
      message: "Use client-side wagmi hooks to fetch courses from the smart contract",
      contractAddress: "0xD0cB04cB20Dff62E26b7069B95Fa9fF3D4694d13",
    });
  } catch (error) {
    console.error("Courses fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
