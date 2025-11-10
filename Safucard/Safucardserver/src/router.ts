import express from "express";
import { calculateTotalBNBValue } from "./packages/balance";
import { getFirstMemecoin } from "./packages/firstMemecoin";
import { getLastMemecoin } from "./packages/firstMemecoin";
import { getUserCategory } from "./packages/status";
import { getCount } from "./packages/count";
import { PinataSDK } from "pinata";
import multer from "multer";
import { File, Blob } from "node:buffer";
// Removed the import of Blob from "buffer" as it conflicts with the global Blob type
import "dotenv/config";
import bodyParser from "body-parser";
import "dotenv/config";
import { Readable } from "stream";
import { getDefiDegen } from "./packages/defi";
import { getMemecoiner } from "./packages/memecoin";
import { isBuilder } from "./packages/builder";
import crypto from "crypto";

const pinata = new PinataSDK({
  pinataJwt: `${process.env.JWT}`,
  pinataGateway: `${process.env.GATEWAY_URL}`,
});

// File upload configuration with size limits and type validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});

/**
 * Safely compare bearer tokens using constant-time comparison to prevent timing attacks
 */
function isValidBearerToken(providedToken: string | undefined): boolean {
  const expectedToken = `Bearer ${process.env.UPLOAD_KEY}`;

  if (!providedToken || typeof providedToken !== 'string') {
    return false;
  }

  if (providedToken.length !== expectedToken.length) {
    return false;
  }

  try {
    const providedBuffer = Buffer.from(providedToken, 'utf8');
    const expectedBuffer = Buffer.from(expectedToken, 'utf8');

    return crypto.timingSafeEqual(providedBuffer, expectedBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Validate Ethereum address format
 */
function isValidEthereumAddress(address: string): boolean {
  return typeof address === "string" && /^0x[a-fA-F0-9]{40}$/.test(address);
}

const router = express.Router();
router.use(bodyParser.json());

router.get("/address/:address", async (req, res) => {
  try {
    const { address } = req.params;
    console.log(`Searching for wallet with user ID: ${address}`);

    // Validate address format
    if (!address) {
      res.status(400).json({
        error: "No Address provided",
      });
      return;
    }

    if (!isValidEthereumAddress(address)) {
      res.status(400).json({
        error: "Invalid Ethereum address format",
      });
      return;
    }
    const [r, f, l, u, c, d, m, b] = await Promise.all([
      calculateTotalBNBValue(address),
      getFirstMemecoin(address),
      getLastMemecoin(address),
      getUserCategory(address),
      getCount(address),
      getDefiDegen(address),
      getMemecoiner(address),
      isBuilder(address),
    ]);

    console.log("m", m);
    console.log("b", b);

    res.status(200).json({
      status: r.status,
      first: f,
      last: l,
      user: u,
      count: c,
      defi: d,
      memecoiner: m,
      builder: b,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error fetching wallet: ${err.message}`);
      res.status(500).json({ error: err.message });
    } else {
      console.error("Error fetching wallet:", err);
      res.status(500).json({ error: err });
    }
  }
});

router.post("/nft/upload", upload.single("file"), async (req, res) => {
  try {
    // Use constant-time comparison for bearer token
    if (!isValidBearerToken(req.headers.authorization)) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
      res.status(400).json({
        error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}`
      });
      return;
    }

    // Validate file size (additional check beyond multer limit)
    if (req.file.size > MAX_FILE_SIZE) {
      res.status(400).json({
        error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      });
      return;
    }

    const blob = new Blob([req.file.buffer]);
    const file = new File([blob], req.file.originalname, {
      type: req.file.mimetype,
    });

    const uploadResult = await pinata.upload.public.file(file, {
      metadata: {
        name: req.file.originalname,
      },
    });
    console.log(uploadResult);
    const url = `https://ipfs.io/ipfs/${uploadResult.cid}`;
    res.status(200).json({ message: "File uploaded successfully", url: url });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "An error occurred during upload" });
    }
  }
});

router.post("/nft/uploadMetadata", async (req, res) => {
  try {
    // Use constant-time comparison for bearer token
    if (!isValidBearerToken(req.headers.authorization)) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const metadata = req.body;
    if (!metadata) {
      res.status(400).json({ error: "No metadata provided" });
      return;
    }
    console.log("Metadata received:", metadata);
    const blob = new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    });
    const uploadResult = await pinata.upload.public.file(blob as globalThis.File);
    console.log(uploadResult);
    const url = `https://ipfs.io/ipfs/${uploadResult.cid}`;
    res
      .status(200)
      .json({ message: "Metadata uploaded successfully", url: url });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Metadata upload error:", error);
      res.status(500).json({ error: "An error occurred during metadata upload" });
    }
  }
});

export default router;
