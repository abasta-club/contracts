// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @title AbastaDAOToken
/// @author Alvaro Fariña <farinalvaro@gmail.com>
/// @notice implements the ERC1155 standard for AbastaDAO
contract AbastaDAOToken is ERC1155, Ownable, ERC1155Supply {

    string public constant  name = "Abasta DAO Token";
    string public constant symbol = "ABT";

    constructor()
        ERC1155(
            "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu"
        )
    {
        mint(msg.sender, 1, 300);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public onlyOwner {
        _mint(to, id, amount, "0x00");
    }

    function mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts
    ) public onlyOwner {
        _mintBatch(to, ids, amounts, "0x00");
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
}
