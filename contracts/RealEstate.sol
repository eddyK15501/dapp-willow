// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "hardhat/console.sol";

contract RealEstate is ERC721URIStorage {
    uint256 private _tokenId;
    constructor() ERC721("Real Estate", "REAL") {}

    function mint(string memory tokenURI) public returns(uint256) {
        _tokenId++;
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenURI);

        return _tokenId;
    }

    function totalSupply() public view returns(uint256) {
        return _tokenId;
    }
}
