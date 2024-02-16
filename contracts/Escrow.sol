// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC721 {
    function transferFrom(
        address _from, 
        address _to, 
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public lender;
    address public inspector;

    constructor(
        address _nftAddress, 
        address payable _seller, 
        address _lender, 
        address _inspector
    ) {
        nftAddress = _nftAddress;
        seller = _seller;
        lender = _lender;
        inspector = _inspector;
    }

    function list(uint256 _nftId) public {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
    }
}
