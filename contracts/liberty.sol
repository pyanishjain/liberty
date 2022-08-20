// SPDX-License-Identifier: MIT

// Note: Easiest way to run this contract is to use https://remix.ethereum.org
// With this there is not need for local setup
// After we deploy this testnet like Mumbain Testnet we got 2 things
// Contrac ABI and Contract Address 

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/ERC721.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Counters.sol";


contract Liberty is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor () ERC721("Liberty", "LZY"){}

    struct Item {
        uint256 id;
        address creator;
        string uri;
    }

    mapping (uint256 => Item) public Items;

    function createItem(string memory uri) public returns (uint256){
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);

        Items[newItemId] = Item(newItemId, msg.sender, uri);

        return newItemId;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

       return Items[tokenId].uri;
    }
} 

