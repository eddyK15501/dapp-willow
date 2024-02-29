// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

async function main() {
  // Get ether accounts for deployment
  [buyer, seller, lender, inspector] = await ethers.getSigners();

  // Deploy Real Estate Contract
  const rsFactory = await ethers.getContractFactory('RealEstate');
  const realEstate = await rsFactory.deploy();
  await realEstate.deployed();

  console.log(`Real Estate Contract deployed at: ${realEstate.address}`);

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
    realEstate.address,
    seller.address,
    lender.address,
    inspector.address
  );
  await escrow.deployed();

  console.log(`Escrow Contract deployed at: ${escrow.address}`);

  // Approve NFT properties to the Escrow contract
  for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).approve(escrow.address, i + 1);
    await transaction.wait();
  }

  // List properties
  let transaction = await escrow.connect(seller).list(1, tokens(200), tokens(40), buyer.address);
  await transaction.wait();

  transaction = await escrow.connect(seller).list(2, tokens(300), tokens(60), buyer.address);
  await transaction.wait();

  transaction = await escrow.connect(seller).list(3, tokens(250), tokens(50), buyer.address);
  await transaction.wait();

  console.log('Deployment finished.');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
