/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput, parseEther } from "frog";
import { handle } from "frog/next";
import { createWalletClient, http, createPublicClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";
import { PinataFDK } from "pinata-fdk";
import abi from "./abi.json";

const fdk = new PinataFDK({
  pinata_jwt: process.env.PINATA_JWT || "",
  pinata_gateway: "",
});

const CONTRACT = process.env.CONTRACT_ADDRESS as `0x` || ""

const account = privateKeyToAccount((process.env.PRIVATE_KEY as `0x`) || "");

const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

const walletClient = createWalletClient({
  account,
  chain: baseSepolia,
  transport: http(process.env.ALCHEMY_URL),
});

// imports, viem clients, etc.. 

async function checkBalance(address: any) {
  try {
    const balance = await publicClient.readContract({
      address: CONTRACT,
      abi: abi.abi,
      functionName: "balanceOf",
      args: [address, 0],
    });
    const readableBalance = Number(balance);
    return readableBalance;
  } catch (error) {
    console.log(error);
    return error;
  }
}

async function remainingSupply() {
  try {
    const balance = await publicClient.readContract({
      address: CONTRACT,
      abi: abi.abi,
      functionName: "totalSupply",
    });
    const readableBalance = Number(balance);
    return readableBalance;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
});

app.use(
  "/finish",
  fdk.analyticsMiddleware({ frameId: "lemon-sale", customId: "purchased" }),
);

// app analytics...

app.frame("/", async (c) => {
  const balance = await remainingSupply();
  if (typeof balance === "number" && balance === 0) {
    return c.res({
      image:
        "https://dweb.mypinata.cloud/ipfs/QmPKezYb6DYpya211spHR2zLsEXFvqrNn6k4Hps6HmW1dj",
      imageAspectRatio: "1:1",
      intents: [
        <Button.Link href="https://gotnojuice.substack.com/">
          Find out more about JUICE
        </Button.Link>,
      ],
      title: "FTRs - SOLD OUT",
    });
  } else {
    return c.res({
      action: "/finish",
      image:
        "https://dweb.mypinata.cloud/ipfs/QmPKezYb6DYpya211spHR2zLsEXFvqrNn6k4Hps6HmW1dj",
      imageAspectRatio: "1:1",
      intents: [
        <Button.Transaction target="/buy/0.0025">
          Buy for 0.0025 ETH
        </Button.Transaction>,
        
      ],
      title: "Feed Takeover Rights",
    });
  }
});

app.frame("/finish", (c) => {
  return c.res({    
    image:
        "https://dweb.mypinata.cloud/ipfs/QmPKezYb6DYpya211spHR2zLsEXFvqrNn6k4Hps6HmW1dj",
      imageAspectRatio: "1:1",
      intents: [
        <Button.Link href="https://gotnojuice.substack.com/">
          Find out more about JUICE
        </Button.Link>,
    ],
    title: "Feed Takeover Rights",
  });
});

app.transaction("/buy/:price", async (c) => {
  
  const price = c.req.param('price')

  return c.contract({
    abi: abi.abi,
    // @ts-ignore
    chainId: "eip155:84532",
    functionName: "buyFtr",
    args: [c.frameData?.fid],
    to: CONTRACT,
    value: parseEther(`${price}`),
  });
});

// end of the file exports

export const GET = handle(app);
export const POST = handle(app);