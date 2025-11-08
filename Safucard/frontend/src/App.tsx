import React, { useEffect, useState, useRef } from "react";
import { useAccount } from "wagmi";
import { useWriteContract, useReadContract } from "wagmi";
import axios from "axios";
import contractABI from "../contract-abi.json";
import priceABI from "../price-abi.json";
import * as fabric from "fabric";
import { FaDownload, FaSearch } from "react-icons/fa";
import { Nav } from "./components/nav";

interface TextBox {
  x: number;
  y: number;
  width: number;
  align: "left" | "center" | "right";
  size: number;
  color?: string;
}

const contractAddress = "0x7Eb73a8dE1cf916A8a6eCA6C7Da218d2a4A72e65";
interface Metadata {
  name: string;
  description: string;
  image: string;
}
interface ApiResponse {
  first: string;
  last: string;
  status: string;
  count: string;
  user: string;
  memecoiner: boolean;
  builder: boolean;
  defi: boolean;
}

type LatestRoundData = [
  roundId: bigint, // roundId
  answer: bigint, // answer (e.g., price * 1e8)
  startedAt: bigint, // startedAt (timestamp)
  updatedAt: bigint, // updatedAt (timestamp)
  answeredInRound: bigint // answeredInRound
];

const App: React.FC = () => {
  const [address, setAddress] = useState<string>("");
  const [status, setStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [src, setImg] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { writeContractAsync } = useWriteContract();
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null); // New ref for fabric instance
  const account = useAccount();
  const [savedMetadata, setSavedMetadata] = useState<string | null>(null);
  const { data: priceData } = useReadContract({
    abi: priceABI,
    functionName: "latestRoundData",
    address: "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE",
    args: [],
  });

  useEffect(() => {
    if (account.isConnected) {
      setAddress(account.address || "");
    }
  }, [account]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  useEffect(() => {
    const canvasEl = canvasRef.current;
    const gencanvas = new fabric.Canvas(canvasEl as HTMLCanvasElement);
    gencanvas.width = 500;
    gencanvas.height = 500;
    fabricCanvasRef.current = gencanvas; // Store in ref

    return () => {
      gencanvas.dispose();
    };
  }, [canvasRef]);

  const generateImage = async (
    first: string,
    last: string,
    status: string,
    count: string,
    cat: string,
    defi: boolean,
    builder: boolean,
    meme: boolean
  ) => {
    const f = address.slice(0, 4);
    const l = address.slice(-3);
    const canvas = fabricCanvasRef.current;
    const fontRegular = new FontFace(
      "Poppins",
      'url("https://fonts.gstatic.com/s/poppins/v24/pxiEyp8kv8JHgFVrJJbecnFHGPezSQ.woff2") format("woff2")',
      { weight: "400", style: "normal" }
    );
    const fontBold = new FontFace(
      "Poppins",
      'url("https://fonts.gstatic.com/s/poppins/v24/pxiByp8kv8JHgFVrLEj6Z1xlFd2JQEk.woff2") format("woff2")',
      { weight: "700", style: "normal" }
    );

    // load them before drawing anything
    await Promise.all([fontRegular.load(), fontBold.load()]);
    document.fonts.add(fontRegular);
    document.fonts.add(fontBold);

    // ensure the browser has them ready (request a specific weight)
    await document.fonts.load('400 16px "Poppins"');
    await document.fonts.load('700 16px "Poppins"');
    await document.fonts.ready;

    if (!canvas) return;
    canvas.clear();
    const boxes = {
      holder: {
        x: 0.2,
        y: 0.236,
        width: 0.3,
        align: "left",
        size: 14,
      } as TextBox,
      tx: {
        x: 0.739,
        y: 0.238,
        width: 0.26,
        align: "left",
        size: 8,
      } as TextBox,
      first: {
        x: 0.507,
        y: 0.443,
        width: 0.11,
        align: "left",
        size: 8,
      } as TextBox,
      last: {
        x: 0.665,
        y: 0.443,
        width: 0.11,
        align: "right",
        size: 8,
      } as TextBox,
      tag: {
        x: 0.49,
        y: 0.58,
        width: 0.3,
        align: "center",
        size: 30,
        color: "#ffb003",
      } as TextBox,
      unknown: {
        x: 0.56,
        y: 0.788,
        width: 0.15,
        align: "center",
        size: 10,
        color: "#ffb003",
      } as TextBox,
    };

    const addText = (
      text: string,
      box: {
        x: number;
        y: number;
        width: number;
        align: "left" | "center" | "right";
        size: number;
        color?: string;
      }
    ) => {
      const absWidth = box.width * 500;
      const txt = new fabric.Textbox(text.toString(), {
        fontSize: box.size,
        fill: box.color || "#D3D3D3",
        fontWeight: "bold",
        fontFamily: "Poppins",
        textAlign: box.align,
        width: absWidth,
        selectable: false,
        charSpacing: 100,
      });

      txt.set({
        left: box.x * 500,
        top: box.y * 500,
      });
      canvas.add(txt);
      canvas.renderAll();
    };

    const bgImg = new Image();
    bgImg.crossOrigin = "anonymous";
    bgImg.src = "/token.jpg";
    bgImg.onload = () => {
      console.log(bgImg);
      const bg = new fabric.FabricImage(bgImg, {
        originX: "left",
        originY: "top",
        scaleX: 500 / bgImg.width,
        scaleY: 500 / bgImg.height,
        selectable: false,
      });
      canvas.backgroundImage = bg;
      canvas.renderAll();
      Object.entries(boxes).forEach(([key, box]) => {
        const textMap: Record<string, string> = {
          holder: `${f}...${l}`,
          tx: count,
          first: first !== "null" ? first : "NONE",
          last: last !== "null" ? last : "NONE",
          tag: status,
          unknown: cat,
        };
        addText(textMap[key], box);
      });

      if (meme) {
        console.log("m");
        const memecoiner = new Image();
        memecoiner.crossOrigin = "anonymous";
        memecoiner.src = "/memecoiner.png";
        memecoiner.onload = () => {
          const memer = new fabric.FabricImage(memecoiner, {
            left: 272,
            top: 254,
            scaleX: 100 / memecoiner.width,
            scaleY: 25 / memecoiner.height,
            selectable: false,
          });
          canvas.add(memer);
          canvas.renderAll();
        };
      }

      if (builder) {
        const builderimg = new Image();
        builderimg.crossOrigin = "anonymous";
        builderimg.src = "/builder.png";
        builderimg.onload = () => {
          const build = new fabric.FabricImage(builderimg, {
            left: !defi ? 200 : 260,
            top: 113,
            scaleX: !defi ? 100 / builderimg.width : 65 / builderimg.width,
            scaleY: 20 / builderimg.height,
            selectable: false,
          });
          canvas.add(build);
          canvas.renderAll();
        };
      }
      if (defi) {
        const defiImg = new Image();
        defiImg.crossOrigin = "anonymous";
        defiImg.src = "/defi.png";
        defiImg.onload = () => {
          const def = new fabric.FabricImage(defiImg, {
            left: !builder ? 200 : 170,
            top: 113,
            scaleX: !builder ? 110 / defiImg.width : 79 / defiImg.width,
            scaleY: 20 / defiImg.height,
            selectable: false,
          });
          canvas.add(def);
          canvas.renderAll();
        };
      }

      const fishImgEl = new Image();
      fishImgEl.crossOrigin = "anonymous";
      fishImgEl.src = `/${status}.png`;
      fishImgEl.onload = async () => {
        const fish = new fabric.FabricImage(fishImgEl, {
          left: 73,
          top: 180,
          scaleX: 170 / fishImgEl.width,
          scaleY: 260 / fishImgEl.height,
          selectable: false,
        });
        canvas.add(fish);
        canvas.renderAll();
        setImg(canvas.toDataURL({ format: "png", multiplier: 2 }));
        const blob = await canvas.toBlob({ format: "png", multiplier: 2 });
        if (blob) {
          const file = new File([blob], "MySafucard.png", {
            type: "image/png",
          });
          setSelectedFile(file);
        }
      };
    };
  };

  const downloadCanvas = () => {
    const link = document.createElement("a");
    link.href = src!;
    link.download = "My_Safucard.png";
    link.click();
  };

  const calculate = async () => {
    try {
      if (!address.trim()) {
        alert("Address cannot be empty!");
        return;
      }

      setLoading(true);
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_API_URL}/api/address/${address.toLowerCase()}`
      );
      console.log(response.data.memecoiner);

      console.log(response);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await generateImage(
        response.data.first,
        response.data.last,
        response.data.status,
        response.data.count,
        response.data.user,
        response.data.defi,
        response.data.builder,
        response.data.memecoiner
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStatus(true);
    } catch (err) {
      alert("Failed to fetch data. Please try again!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pinToIPFS = async (
    file: File | null,
    data: any | null,
    metadata: boolean
  ) => {
    try {
      if (metadata == false) {
        const formData = new FormData();
        if (file) {
          formData.append("file", file); // Attach the file as a Blob
        } else {
          throw new Error("File is null and cannot be uploaded.");
        }

        const upload = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/nft/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const url = upload.data.url;

        return { success: true, pinataUrl: url };
      } else {
        const upload = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/nft/uploadMetadata`,
          data
        );

        const url = upload.data.url;
        return { success: true, pinataUrl: url };
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };
  const mintNFT = async () => {
    let url = "";
    //error handling
    setLoading(true);
    if (savedMetadata) {
      try {
        const [, answer, , ,] = priceData as LatestRoundData;
        console.log(answer);
        const price = BigInt(answer); // 8 decimals
        const usd = BigInt(5 * 1e18); // 5 USD in 18 decimals

        const nativeValue = (usd * BigInt(1e8)) / price;
        await writeContractAsync({
          abi: contractABI,
          functionName: "mintNFT",
          address: contractAddress,
          args: [savedMetadata],
          value: nativeValue,
        });

        setLoading(false);
        return {
          success: true,
          status: "✅ NFT minted successfully!",
        };
      } catch (error) {
        console.log(error);
        setLoading(false);
        return {
          success: false,
          status: "😢 Something went wrong while minting your NFT.",
        };
      }
    } else {
      try {
        const res = await pinToIPFS(selectedFile!, null, false);

        url = res.pinataUrl;
      } catch (error) {
        return {
          success: false,
          status: "😢 Something went wrong while uploading your image.",
        };
      }
      //make metadata
      const metadata: Metadata = {
        name: `Safucard`,
        description: `${address}'s Safucard`,
        image: url,
      };

      //make pinata call
      const pinataResponse = await pinToIPFS(null, metadata, true);
      if (!pinataResponse.success) {
        return {
          success: false,
          status: "😢 Something went wrong while uploading your tokenURI.",
        };
      }
      const tokenURI = pinataResponse.pinataUrl;
      setSavedMetadata(tokenURI);
      console.log(tokenURI);
      try {
        const [, answer, , ,] = priceData as LatestRoundData;
        const price = BigInt(answer); // 8 decimals
        const usd = BigInt(5 * 1e18); // 5 USD in 18 decimals

        const nativeValue = (usd * BigInt(1e8)) / price;
        await writeContractAsync({
          abi: contractABI,
          functionName: "mintNFT",
          address: contractAddress,
          args: [tokenURI],
          value: nativeValue,
        });

        setLoading(false);
        return {
          success: true,
          status: "✅ NFT minted successfully!",
        };
      } catch (error) {
        setLoading(false);
        return {
          success: false,
          status: "😢 Something went wrong while minting your NFT.",
        };
      }
    }
  };
  return (
    <div>
      <Nav />
      {status ? (
        <div className="bg-black relative rounded-xl flex flex-col lg:flex-row mt-1 min-h-[90vh] px-5 lg:px-50 justify-center items-center gap-10 lg:gap-40 2xl:gap-70">
          <div className="lg:flex-col lg:justify-center">
            <img
              src={src as string}
              ref={imgRef}
              className="h-75 w-75 md:h-90 md:w-90 2xl:h-106 2xl:w-106"
            />
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => downloadCanvas()}
              className="border-2 border-[#FFB000] cursor-pointer justify-center flex gap-4 items-center font-[500] font-poppins px-6 p-6 lg:text-2xl text-xl  2xl:text-4xl rounded-full lg:rounded-4xl tracking-widest text-[#FFB000]"
            >
              Download <FaDownload className="" />
            </button>
            <button
              onClick={() => mintNFT()}
              className="bg-[#FFB000] flex gap-3 items-center cursor-pointer 2xl:text-4xl p-5 lg:text-2xl text-xl px-13 rounded-full lg:rounded-4xl font-poppins font-[500] tracking-widest
"
            >
              Mint as NFT <img src="/nft.png" className="h-10" />
            </button>
            <p className="text-[#FFB000] text-center font-poppins font-[500] text-sm lg:text-lg -mt-2">
              Mint for upcoming airdrop
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-black relative rounded-xl mt-1 h-[90vh] md:pt-20">
          <img
            src="/Builder1.png"
            className="h-30 hidden lg:block absolute top-10 right-10 md:ml-10"
          />
          <img
            src="/Degen1.png"
            className="h-30 hidden lg:block absolute bottom-10 left-10 md:ml-10"
          />
          <img
            src="/Memer1.png"
            className="h-30 hidden lg:block absolute bottom-10 right-10 md:ml-10"
          />
          <div className="flex flex-col lg:flex-row pt-10 lg:pt-0">
            <img src="/Lfo.png" className="md:h-80 md:ml-10 2xl:h-90 hidden lg:block 2xl:ml-15" />
            <img src="/LfoM.png" className="lg:hidden h-[40vh]" alt="LfoM" />

            <div className=" md:mt-30 -ml-25 hidden lg:block ">
              <img src="/Arrowbox.png" className="md:h-65 2xl:h-70" alt="Arrowbox" />
            </div>
            <div className="relative lg:hidden mx-auto">
              <img src="/Arrowmobile.png" className="md:h-65" alt="Arrowbox" />
            </div>
          </div>

          <form
            onSubmit={async (event) => {
              event.preventDefault();
              await calculate();
            }}
            className=" w-[90%] lg:mt-2 mt-13 absolute left-1/2 transform -translate-x-1/2 bottom-5 relative md:w-140 2xl:w-160 2xl:mt-10 lg:pl-6 pl-2 text-xl 2xl:h-18 text-left flex border-2 border-[#FFB000] items-center rounded-xl bg-[#FFB000]/20 font-semibold text-gray-500  focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <input
              placeholder="Search"
              onChange={handleChange}
              value={address}
              className="flex grow-1 focus:outline-none placeholder:text-[#FFB000] placeholder:text-sm text-sm lg:placeholder:text-xl lg:text-xl text-[#FFB000]"
            />
            <div
              className="flex items-center bg-[#FFB000] rounded-r-xl p-4 lg:p-6 2xl:p-6"
              onClick={() => {
                calculate();
              }}
            >
              <FaSearch className="text-black" />
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center h-full">
          <img src="/logo.png" className="h-19 animate-pulse" />
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default App;
