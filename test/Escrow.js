const { expect } = require('chai');
const { ethers } = require('hardhat');

// Convert into equivalent value in wei
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether');
}

describe('Escrow', () => {});

describe('Real Estate', () => {
    it('Sample test. Deploy RealEstate.sol smart contract. Saves the addresses', async () => {
        [owner] = await ethers.getSigners();
        const realEstate = await ethers.getContractFactory('RealEstate');
        const rsDeployed = await realEstate.deploy(owner);

        console.log(rsDeployed.target);
    })
});