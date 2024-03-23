import { privateKeyToAccount } from "viem/accounts"
import hre from "hardhat";

async function main() {

  const account = privateKeyToAccount(process.env.TEST_PRIVATE_KEY as `0x` || "")

  const contract = await hre.viem.deployContract("ftr", [account.address]);

  console.log("Contract deployed to:", contract.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});