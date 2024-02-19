// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "hardhat/console.sol";

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    address payable public seller;
    address public lender;
    address public inspector;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    modifier onlySeller() {
        require(msg.sender == seller, "Only the seller can call this method.");
        _;
    }

    modifier onlyBuyer(uint256 _nftId) {
        require(
            msg.sender == buyer[_nftId],
            "Only the buyer can call this method."
        );
        _;
    }

    modifier onlyInspector() {
        require(
            msg.sender == inspector,
            "Only the inspector can call this method."
        );
        _;
    }

    modifier onlyApprovers(uint256 _nftId) {
        require(
            msg.sender == buyer[_nftId] ||
                msg.sender == seller ||
                msg.sender == lender,
            "Unauthorized approver."
        );
        _;
    }

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

    function list(
        uint256 _nftId,
        uint256 _purchasePrice,
        uint256 _escrowAmount,
        address _buyer
    ) public payable onlySeller {
        // Transfer NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);

        isListed[_nftId] = true;
        purchasePrice[_nftId] = _purchasePrice;
        escrowAmount[_nftId] = _escrowAmount;
        buyer[_nftId] = _buyer;
    }

    function depositDownpay(uint256 _nftId) public payable onlyBuyer(_nftId) {
        require(msg.value >= escrowAmount[_nftId]);
    }

    function updateInspectionStatus(
        uint256 _nftId,
        bool _passed
    ) public onlyInspector {
        inspectionPassed[_nftId] = _passed;
    }

    function approveSale(uint256 _nftId) public onlyApprovers(_nftId) {
        approval[_nftId][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftId) public onlySeller {
        require(escrowAmount[_nftId] > 0, "Down payment is missing.");
        require(inspectionPassed[_nftId], "Inspection must be passed.");
        require(approval[_nftId][buyer[_nftId]], "Buyer must approve sale.");
        require(approval[_nftId][seller], "Seller must approve sale.");
        require(approval[_nftId][lender], "Lender must approve sale.");
        require(address(this).balance >= purchasePrice[_nftId], "Full payment is required.");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    receive() external payable {}
}
