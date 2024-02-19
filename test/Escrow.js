const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
  return ethers.parseUnits(n.toString(), 'ether');
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
    transaction = await escrow
      .connect(seller)
      .list(1, tokens(200), tokens(40), buyer.address);
    await transaction.wait();
  });

  describe('Deployment', () => {
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

    it('Returns purchase price', async () => {
      const result = await escrow.purchasePrice(1);
      expect(result).to.be.equal(tokens(200));
    });

    it('Returns escrow amount', async () => {
      const result = await escrow.escrowAmount(1);
      expect(result).to.be.equal(tokens(40));
    });

    it('Returns buyer address', async () => {
      const result = await escrow.buyer(1);
      expect(result).to.be.equal(buyer.address);
    });
  });

  describe('Deposits', () => {
    it('Updates contract balance', async () => {
      const transaction = await escrow
        .connect(buyer)
        .depositDownpay(1, { value: tokens(40) });
      await transaction.wait();

      // Get balance with ethers.js provider
      const contractBalance = await ethers.provider.getBalance(escrow.target);
      expect(contractBalance).to.be.equal(tokens(40));
    });
  });

  describe('Inspection', () => {
    it('Updates inspection status', async () => {
      const transaction = await escrow
        .connect(inspector)
        .updateInspectionStatus(1, true);
      await transaction.wait();

      const result = await escrow.inspectionPassed(1);
      expect(result).to.be.equal(true);
    });
  });

  describe('Approval', () => {
    it('Updates approval status', async () => {
      let transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      expect(await escrow.approval(1, buyer.address)).to.be.equal(true);
      expect(await escrow.approval(1, seller.address)).to.be.equal(true);
      expect(await escrow.approval(1, lender.address)).to.be.equal(true);
    });
  });

  describe('Sale', async () => {
    beforeEach(async () => {
      let transaction = await escrow.connect(buyer).depositDownpay(1, { value: tokens(40) });
      await transaction.wait();

      transaction = await escrow.connect(inspector).updateInspectionStatus(1, true);
      await transaction.wait();

      transaction = await escrow.connect(buyer).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(seller).approveSale(1);
      await transaction.wait();

      transaction = await escrow.connect(lender).approveSale(1);
      await transaction.wait();

      await lender.sendTransaction({ to: escrow.target, value: tokens(160) });

      transaction = await escrow.connect(seller).finalizeSale(1);
      await transaction.wait();
    });

    it('Updates contract balance', async () => {
      expect(await escrow.getBalance()).to.be.equal(0);
    });

    it('Updates ownership of property NFT', async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address);
    });
  });
});
