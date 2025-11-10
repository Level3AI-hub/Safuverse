import "dotenv/config";
// Replace with your Alchemy API Ke
const baseURL = `https://bnb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`;

export async function getMemecoiner(address: string): Promise<boolean> {
  try {
    const data = {
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [
        {
          fromBlock: "0x0",
          fromAddress: address,
          category: ["external", "erc20", "erc721", "erc1155"],
          excludeZeroValue: false,
          toAddress: "0x5c952063c7fc8610FFDB798152D69F0B9550762b",
        },
      ],
    };

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error(`Alchemy API error: ${response.status} ${response.statusText}`);
      return false;
    }

    let result;
    try {
      result = await response.json();
    } catch (parseError) {
      console.error("Failed to parse Alchemy API response:", parseError);
      return false;
    }

    console.log(result);

    // Validate response structure
    if (result?.result?.transfers && Array.isArray(result.result.transfers)) {
      return result.result.transfers.length > 0;
    } else {
      console.error("Unexpected Alchemy API response structure:", result);
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}
