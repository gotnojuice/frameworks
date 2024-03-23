// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";

contract ftr is ERC1155, ERC1155Pausable, Ownable, ERC1155Burnable {
    uint256 public totalSupply = 25;
    mapping(address => bool) public addressPurchasedftr;

    constructor(address initialOwner)
        ERC1155("ipfs://QmS7EELNg1AVFp7vhww7sisL8ThsPVfJWhWdDHXakMKyGc")
        Ownable(initialOwner)
    {}

    event ftrPurchased(uint256 FID, address buyer);

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(address account) public onlyOwner {
        _mint(account, 0, 1, new bytes(0));
    }

    function buyftr(uint256 FID) public payable {
        require(
            !addressPurchasedftr[msg.sender],
            "Each address can only buy one feed takeover right."
        );
        require(totalSupply > 0, "All the feed takeover rights are gone!");

        if (balanceOf(msg.sender, 0) > 0) {
            require(msg.value == 0.0025 ether, "Incorrect payment amount");
        }

        totalSupply--;
        addressPurchasedftr[msg.sender] = true;
        emit ftrPurchased(FID, msg.sender);
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, data);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override onlyOwner {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override onlyOwner {
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    // The following functions are overrides required by Solidity.

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal override(ERC1155, ERC1155Pausable) {
        super._update(from, to, ids, values);
    }
}
