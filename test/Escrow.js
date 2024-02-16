const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Escrow', () => {});

describe('Real Estate', () => {
    it('Deploy RealEstate.sol. Saves the addresses', async () => {
        // Deploy Real Estate Contract
        [owner] = await ethers.getSigners();
        const rsFactory = await ethers.getContractFactory('RealEstate');
        const realEstate = await rsFactory.deploy(owner);
        console.log(realEstate.target);

        // Mint
        let transaction = await realEstate.safeMint() 
    })
});