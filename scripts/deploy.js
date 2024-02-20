// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require('hardhat');

async function main() {
  // Get ether accounts for deployment
  [buyer, seller, lender, inspector] = await ethers.getSigners();

  // Deploy Real Estate Contract
  const rsFactory = await ethers.getContractFactory('RealEstate');
  const realEstate = await rsFactory.deploy();
  await realEstate.deployed();

  console.log(`Real Estate Contract deployed at: ${realEstate.target}`);

  // Mint NFT properties as the seller
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate
      .connect(seller)
      .mint(
        `https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${
          i + 1
        }.json`
      );
    await transaction.wait();
  }

  console.log(`NFT properties minted...`);

  // Deploy Escrow Contract
  const escrowFactory = await ethers.getContractFactory('Escrow');
  const escrow = await escrowFactory.deploy(
    realEstate.target,
    seller.address,
    lender.address,
    inspector.address
  );
  await escrow.deployed();

  // Approve NFT properties to the Escrow contract
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).approve(escrow.address, i + 1);
    await transaction.wait();
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
