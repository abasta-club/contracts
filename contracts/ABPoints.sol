// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/// @title ABPoints
/// @author Alvaro Fariña <farinalvaro@gmail.com>
/// @notice implements the ERC20 standard for AbastaDAO
contract ABPoints is ERC20, Ownable {
    constructor() ERC20("Abasta Points", "ABP") {}

    function mint(address receiver, uint256 amount) external onlyOwner {
        _mint(receiver, amount);
    }
}
