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
        // https://ipfs.io/ipfs/QmdGJNJwL9aN1E25iAc8L2aR33SFQ8e2qDrnc7V26WJm2d?filename=1.json
        // let transaction = await realEstate.mint("https://ipfs.io/ipfs/QmdGJNJwL9aN1E25iAc8L2aR33SFQ8e2qDrnc7V26WJm2d?filename=1.json") 
    })
});