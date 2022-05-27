// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import '@openzeppelin/contracts/access/Ownable.sol';

contract NFTRoyaltyPayer is Ownable {
    // Mapping from account to token address to amount
    mapping(address => mapping(address => uint256)) private _balances;
}
