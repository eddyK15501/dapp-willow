const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Escrow', () => {
  let buyer, seller, lender, inspector;
  let realEstate;
  let escrow;

  it('Deploys the contracts, saves the addresses', async () => {
    [buyer, seller, lender, inspector] = await ethers.getSigners();

    // Deploy Real Estate Contract
    const rsFactory = await ethers.getContractFactory('RealEstate');
    realEstate = await rsFactory.deploy();
    console.log(realEstate.target);

    // Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        'https://ipfs.io/ipfs/QmdGJNJwL9aN1E25iAc8L2aR33SFQ8e2qDrnc7V26WJm2d?filename=1.json'
      );
    await transaction.wait();

    // Deploy Escrow Contract
    const escrowFactory = await ethers.getContractFactory('Escrow');
    escrow = await escrowFactory.deploy(
      realEstate.target,
      seller.address,
      lender.address,
      inspector.address
    );
    console.log(escrow.target);

    const result = await escrow.nftAddress();
    console.log(result);

    expect(result).to.be.equal(realEstate.target);
  });
});
