// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// mock contract using the ERC20 standard
contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialBalance
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialBalance);
    }
}
