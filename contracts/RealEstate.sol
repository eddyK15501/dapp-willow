// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract RealEstate is ERC721, Ownable {
    uint256 private _nextTokenId;
    constructor(address initialOwner) 
        ERC721("Real Estate", "REAL") 
        Ownable(initialOwner) 
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function totalSupply() public view returns(uint256) {
        return _nextTokenId;
    }
}
