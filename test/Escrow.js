const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
};

describe('Escrow', () => {
  let buyer, seller, lender, inspector;
  let realEstate, escrow;

  beforeEach(async () => {
    // Get ether accounts for testing
    [buyer, seller, lender, inspector] = await ethers.getSigners();

    // Deploy Real Estate Contract
    const rsFactory = await ethers.getContractFactory('RealEstate');
    realEstate = await rsFactory.deploy();

    // Deploy Escrow Contract
    const escrowFactory = await ethers.getContractFactory('Escrow');
    escrow = await escrowFactory.deploy(
      realEstate.target,
      seller.address,
      lender.address,
      inspector.address
    );

    // Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        'https://ipfs.io/ipfs/QmdGJNJwL9aN1E25iAc8L2aR33SFQ8e2qDrnc7V26WJm2d?filename=1.json'
      );
    await transaction.wait();

    // Approve property
    transaction = await realEstate.connect(seller).approve(escrow.target, 1);
    await transaction.wait();

    // List property
    transaction = await escrow.connect(seller).list(1);
    await transaction.wait();
  });

  describe('Deployment expectations', () => {
    it('Returns NFT Address', async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.target);
    });

    it('Returns seller', async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
    });

    it('Returns lender', async () => {
        const result = await escrow.lender();
        expect(result).to.be.equal(lender.address);
    });

    it('Returns inspector', async () => {
        const result = await escrow.inspector();
        expect(result).to.be.equal(inspector.address);
    });
  });

  describe('Listing', () => {
    it('Updates ownership', async () => {
        expect(await realEstate.ownerOf(1)).to.be.equal(escrow.target);
    });

    it('Listed NFT property is updated and marked as true', async () => {
        expect(await escrow.isListed(1)).to.be.equal(true);
    });
  })
});
