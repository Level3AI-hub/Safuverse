import type { NewTaskActionFunction } from "hardhat/types/tasks";
import { AbiCoder } from "ethers";
import fs from "fs";
const abiCoder = new AbiCoder();

const { encode: encodeAbiParameters } = abiCoder;
const licenseTypes = [
  "None",
  "UNLICENSED",
  "MIT",
  "GPL-2.0",
  "GPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "MPL-2.0",
  "OSL-3.0",
  "Apache-2.0",
  "AGPL-3.0",
  "BUSL-1.1",
] as const;

const getLicenseType = (license: string): number | null => {
  const index = licenseTypes.indexOf(license as (typeof licenseTypes)[number]);
  if (index === -1) return null;
  return index + 1;
};

const extractAllLicenses = (metadata: string): string[] => {
  const regex = /\/\/\s*\t*SPDX-License-Identifier:\s*\t*(.*?)[\s\\]/g;
  const matches = [...metadata.matchAll(regex)];
  return matches.map((match) => match[1]);
};

const extractOneLicenseFromSourceFile = (source: string): string | null => {
  const licenses = extractAllLicenses(source);
  if (licenses.length === 0) return null;
  return licenses[0];
};

type MultichainVerifyArgs = {
  contractName: string;
  address: string;
  deployArgs: string[];
};

const taskMultichainVerify: NewTaskActionFunction<
  MultichainVerifyArgs
> = async (args, hre) => {
  // Local interfaces/types
  interface Artifact {
    sourceName: string;
    contractName: string;
    abi: any[];
  }

  interface ContractOutput {
    metadata?: string;
  }

  interface BuildInfo {
    output: {
      contracts: Record<string, Record<string, ContractOutput>>;
    };
  }

  interface SourceFile {
    content: string;
  }

  interface Metadata {
    settings?: Record<string, any>;
    language: string;
    sources: Record<string, SourceFile>;
    compiler: { version: string };
  }

  interface AbiInput {
    name?: string;
    type: string;
    internalType?: string;
  }

  interface AbiEntry {
    type?: string;
    inputs?: AbiInput[];
    [k: string]: any;
  }

  interface EtherscanResponse {
    status: string;
    result: any;
    message?: string;
  }

  interface CheckStatusResponse {
    status: string;
    result: string;
    message?: string;
  }

  const {
    contractName: contractName_,
    address,
    deployArgs: deployArgs_,
  } = args;
     const deployArgs: any[] = (deployArgs_ || []).filter(
       (arg: string) => arg.trim() !== ""
     );


  // Get the artifact using standard Hardhat artifacts
  const artifact = (await hre.artifacts.readArtifact(
    contractName_
  ));

     const buildRaw = await hre.artifacts.getBuildInfoId(contractName_);
    // Get the build info path and read the file
    const buildInfoPath = `artifacts/build-info/${buildRaw}.output.json`;

  if (!buildInfoPath) throw new Error("Build info path not found");

  const buildInfo = JSON.parse(
    fs.readFileSync(buildInfoPath, "utf-8")
  ) as BuildInfo;


  const contractOutput: ContractOutput =
    buildInfo.output.contracts[`project/${artifact.sourceName}`][artifact.contractName];
  const metadataString: string | undefined = contractOutput.metadata;
  const abi = artifact.abi;

  if (!metadataString) throw new Error("Metadata not found");

  const metadata = JSON.parse(metadataString) as Metadata;
  const compilationTarget = metadata.settings?.compilationTarget as
    | Record<string, string>
    | undefined;
  if (!compilationTarget) throw new Error("Compilation target not found");

  const contractFilepath = Object.keys(compilationTarget)[0];
  const contractName = compilationTarget[contractFilepath];
  console.log(contractFilepath, contractName)
  if (!contractFilepath || !contractName)
    throw new Error("Contract name not found");

  const contractNamePath = `${contractFilepath}:${contractName}`
 

  if(!buildRaw) {
     throw new Error(
       `Build not found for ${contractFilepath}. Make sure you compiled with Hardhat (npx hardhat compile) and metadata wasn't stripped.`
     );
  }
  const build = JSON.parse(fs.readFileSync(`artifacts/build-info/${buildRaw}.json`, "utf-8")) ;
  if (!build || !build.input) {
    throw new Error(
      `Build info not found for ${contractFilepath}. Make sure you compiled with Hardhat (npx hardhat compile) and metadata wasn't stripped.`
    );
  }

  // get real source content (buildInfo.input.sources)
  const buildInput = build.input;
  const sourceObj = buildInput.sources[contractFilepath];
  if (!sourceObj || !sourceObj.content) {
    throw new Error(
      `Source content not found in buildInfo for ${contractFilepath}`
    );
  }
   const sourceLicenseType = extractOneLicenseFromSourceFile(
     sourceObj.content as string
   );

  if (!sourceLicenseType) throw new Error("License not found");

  const licenseType = getLicenseType(sourceLicenseType);
  if (!licenseType) throw new Error("License not supported");

  const settings: Record<string, any> = { ...metadata.settings };
  delete settings.compilationTarget;
  const solcInput: {
    language: string;
    settings: Record<string, any>;
    sources: Record<string, { content: string }>;
  } = {
    language: metadata.language,
    settings,
    sources: {} as Record<string, { content: string }>,
  };
  for (const sourcePath of Object.keys(metadata.sources)) {
    const source = buildInput.sources[sourcePath];
    // only content as this fails otherwise
    solcInput.sources[sourcePath] = {
      content: source.content,
    };
  }

  const solcInputString: string = JSON.stringify(solcInput);
  console.log(`Verifying ${contractName} (${address}) ...`);

  const description = abi.find(
    (x: AbiEntry) => "type" in x && x.type === "constructor"
  ) as AbiEntry | undefined;
  const constructorArguments: string | undefined =
    deployArgs.length > 0 && description?.inputs
      ? (encodeAbiParameters(description.inputs as any, deployArgs) as string)
      : undefined;

  const formData = new FormData();
  formData.append("chainId", 56);
  formData.append("contractaddress", address);
  formData.append("sourceCode", solcInputString);
  formData.append("codeformat", "solidity-standard-json-input");
  formData.append("contractName", contractNamePath);
  formData.append("compilerversion", `v${metadata.compiler.version}`);
  if (constructorArguments)
    formData.append("constructorArguements", constructorArguments.slice(2));
  formData.append("licenseType", licenseType.toString());

  const baseUrl = "https://api.etherscan.io/api";

  const response = await fetch(
    `${baseUrl}?module=contract&action=verifysourcecode&apikey=${process.env.ETHERSCAN_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const responseData = (await response.json()) as EtherscanResponse;
  const status = responseData.status;
  if (status !== "1") throw new Error("Submission failed");

  const guid = responseData.result;
  if (!guid) throw new Error("Submission failed");

  async function checkStatus(): Promise<"success" | null> {
    const statusRequest = await fetch(
      `${baseUrl}?module=contract&action=checkverifystatus&apikey=${process.env.ETHERSCAN_API_KEY}&guid=${guid}`
    );
    const statusResponse = (await statusRequest.json()) as CheckStatusResponse;

    if (statusResponse.result === "Pending in queue") return null;
    if (
      statusResponse.result !== "Fail - Unable to verify" &&
      statusResponse.status === "1"
    )
      return "success";

    throw new Error("Verification failed");
  }

  let result: "success" | null | undefined;
  while (!result) {
    await new Promise((resolve) => setTimeout(resolve, 10 * 1000));
    result = await checkStatus();
  }

  if (result === "success") {
    console.log(`Verification successful for ${contractName} (${address})`);
  }
};

export default taskMultichainVerify;
