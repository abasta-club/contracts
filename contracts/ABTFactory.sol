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
    uint256 public constant PARTNER = 1;
    uint256 public constant SUPPORTER = 2;

    /* ========== STATE VARIABLES ========== */
    IERC20 public paymentToken;
    uint256 subscriptionFee;

    /* ========== EVENTS ========== */
    event UriSet(address account, string uri);
    event FundsWithdrawn(address indexed withdrawer, uint256 amount);
    event PaymentTokenSet(address indexed setter, address newPaymentToken);
    event SubscriptionFeeSet(
        address indexed setter,
        uint256 newSubscriptionFee
    );

    constructor(
        string memory _uri,
        IERC20 _paymentToken,
        uint256 _subscriptionFee,
        address _owner
    ) ERC1155(_uri) {
        require(
            address(_paymentToken) != address(0),
            "ABTFactory: payment token is not valid"
        );
        require(
            _subscriptionFee > 0,
            "ABTFactory: subscription fee is not valid"
        );

        if (_owner != msg.sender && _owner != address(0)) {
            transferOwnership(_owner);
        }

        paymentToken = _paymentToken;
        subscriptionFee = _subscriptionFee;
    }

    /* ========== MODIFIERS ========== */
    modifier onlyPartners() {
        // TODO: require msg.sender to be on a whitelist
        require(true, "ABTFactory: address not whitelisted as partner");
        _;
    }

    modifier onlySupporters() {
        // TODO: require msg.sender to be on a whitelist
        require(true, "ABTFactory: address not whitelisted as supporter");
        _;
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

    function isVolunteer(address) internal pure returns (bool) {
        // TODO: check against a volunteer's whitelist
        return true;
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function claimPartnership(bool asVolunteer) external onlyPartners {
        // TODO: require msg.sender to not own any tokens yet
        if (asVolunteer) {
            require(
                isVolunteer(msg.sender),
                "ABTFactory: address not whitelisted as volunteer"
            );
        } else {
            paymentToken.transferFrom(
                msg.sender,
                address(this),
                subscriptionFee
            );
        }
        _mint(msg.sender, PARTNER, 1, "0x00");
        // TODO: emit event
    }

    function claimSupporter(bool asVolunteer) external onlySupporters {
        // TODO: require msg.sender to not own any tokens yet
        if (asVolunteer) {
            require(
                isVolunteer(msg.sender),
                "ABTFactory: address not whitelisted as volunteer"
            );
        } else {
            paymentToken.transferFrom(
                msg.sender,
                address(this),
                subscriptionFee
            );
        }
        _mint(msg.sender, SUPPORTER, 1, "0x00");
    }

    // TODO: add restriction on transfer to only whitelisted addresses with no tokens
    // could potentially move the modifiers restrictions on the mint functions to the transfer function

    /// @notice allows owner to set the URI of the token
    function setURI(string memory _uri) public onlyOwner {
        _setURI(_uri);

        emit UriSet(msg.sender, _uri);
    }
}
