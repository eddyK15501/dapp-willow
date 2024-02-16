// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "hardhat/console.sol";

contract RealEstate is ERC721URIStorage, Ownable {
    uint256 private _tokenId;
    constructor(address initialOwner) 
        ERC721("Real Estate", "REAL") 
        Ownable(initialOwner) 
    {}

    function mint(string memory tokenURI) public onlyOwner returns(uint256) {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenURI);

        return _tokenId;
    }

    function totalSupply() public view returns(uint256) {
        return _tokenId;
    }
}
