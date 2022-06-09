// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title AbastaDAOToken
/// @author Alvaro Fariña <farinalvaro@gmail.com>
/// @notice implements the ERC1155 standard for AbastaDAO
contract AbastaDAOToken is ERC1155, Ownable, ERC1155Supply {
    /* ========== LIBRARIES ========== */
    using SafeERC20 for IERC20;

    /* ========== CONSTANTS ========== */
    string public constant name = "Abasta DAO Token";
    string public constant symbol = "ABT";

    uint256 public constant PARTNER = 1;
    uint256 public constant SUPPORTER = 2;

    /* ========== EVENTS ========== */
    event UriSet(address account, string uri);

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu"
        )
    {
        mint(msg.sender, 1, 300);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal override(ERC1155, ERC1155Supply) {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
    }

    // TODO: add function to swap from one token to another
    // it should burn the received token and mint a new one of the other type

    /* ========== RESTRICTED FUNCTIONS ========== */
    /// @notice mints tokens to the given address
    // TODO: restrict access only to whitelisted addresses
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public {
        _mint(to, id, amount, "0x00");
    }

    /// @notice allows owner to set the URI of the token
    function setURI(string memory _uri) public onlyOwner {
        _setURI(_uri);
        emit UriSet(msg.sender, _uri);
    }

    /// @notice allows owner to withdraw funds from contract
    function withdrawFunds(address token, uint256 amount) public onlyOwner {
        IERC20(token).transfer(msg.sender, amount);
    }
}
