const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Escrow', () => {});

describe('Real Estate', () => {
    it('Deploy RealEstate.sol. Saves the addresses', async () => {
        const signers = await ethers.getSigners();
        const buyer = signers[0];
        const seller = signers[1];
        
        // Deploy Real Estate Contract
        const rsFactory = await ethers.getContractFactory('RealEstate');
        const realEstate = await rsFactory.deploy();
        console.log(realEstate.target);

        // Mint
        // let transaction = await realEstate.mint("https://ipfs.io/ipfs/QmdGJNJwL9aN1E25iAc8L2aR33SFQ8e2qDrnc7V26WJm2d?filename=1.json") 
    })
});