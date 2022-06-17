// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title ABTFactory
/// @author Alvaro Fariña <farinalvaro@gmail.com>
/// @notice implements the ERC1155 standard for AbastaDAO
contract ABTFactory is ERC1155, Ownable, ERC1155Supply {
    /* ========== LIBRARIES ========== */
    using SafeERC20 for IERC20;

    /* ========== CONSTANTS ========== */
    string public constant name = "Abasta DAO";
    string public constant symbol = "ABT";

    /* ========== STATE VARIABLES ========== */
    IERC20 public paymentToken;
    uint256 subscriptionFee;

    /* ========== EVENTS ========== */
    event UriSet(address account, string uri);
    event PaymentTokenSet(address indexed account, address token);
    event SubscriptionFeeSet(address indexed account, uint256 fee);
    event FundsWithdrawn(address indexed account, uint256 amount);

    constructor(IERC20 _paymentToken, uint256 _subscriptionFee)
        ERC1155(
            "https://ipfs.io/ipfs/bafkreidu6rvsvmtatpsszjoc5wlhfnakqjzlipiuy2gefljktn23nmxopu"
        )
    {
        paymentToken = _paymentToken;
        subscriptionFee = _subscriptionFee;
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
    // TODO: restrict access only to MINTER_ROLE
    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) public {
        paymentToken.transferFrom(msg.sender, address(this), subscriptionFee);

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

        emit FundsWithdrawn(msg.sender, amount);
    }

    function setPaymentToken(IERC20 _paymentToken) public onlyOwner {
        paymentToken = _paymentToken;

        emit PaymentTokenSet(msg.sender, address(_paymentToken));
    }

    function setSubscriptionFee(uint256 _subscriptionFee) public onlyOwner {
        subscriptionFee = _subscriptionFee;

        emit SubscriptionFeeSet(msg.sender, _subscriptionFee);
    }
}
