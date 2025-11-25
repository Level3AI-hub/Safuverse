// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title RaisedFundsTimelock
 * @author SafuPad Team
 * @notice Timelock contract for raised funds when community control is triggered
 *
 * When a token stays below starting market cap for 3 consecutive months:
 * 1. Raised funds are transferred to this timelock contract
 * 2. 48-hour timelock starts
 * 3. Platform team reviews community input
 * 4. After 48 hours, funds can be:
 *    - Released to platform address (if no decision made)
 *    - Released to custom address (based on community decision)
 */
contract RaisedFundsTimelock is Ownable, ReentrancyGuard {

    struct TimelockEntry {
        address token;
        uint256 amount;
        uint256 unlockTime;
        address beneficiary;
        bool executed;
        bool cancelled;
    }

    uint256 public constant TIMELOCK_DURATION = 48 hours;

    mapping(address => TimelockEntry) public timelocks; // token => TimelockEntry
    address public platformAddress;

    event FundsLocked(
        address indexed token,
        uint256 amount,
        uint256 unlockTime,
        address beneficiary
    );

    event FundsReleased(
        address indexed token,
        uint256 amount,
        address indexed recipient
    );

    event BeneficiaryUpdated(
        address indexed token,
        address oldBeneficiary,
        address newBeneficiary
    );

    event TimelockCancelled(address indexed token);

    constructor(address _platformAddress) Ownable(msg.sender) {
        require(_platformAddress != address(0), "Invalid platform address");
        platformAddress = _platformAddress;
    }

    /**
     * @notice Lock funds for 48 hours
     * @dev Only callable by owner (LaunchpadManager)
     * @param token Token address (for tracking)
     * @param beneficiary Default beneficiary (platform address)
     */
    function lockFunds(
        address token,
        address beneficiary
    ) external payable onlyOwner nonReentrant {
        require(msg.value > 0, "No funds to lock");
        require(token != address(0), "Invalid token");
        require(beneficiary != address(0), "Invalid beneficiary");
        require(!timelocks[token].executed, "Already executed");
        require(timelocks[token].amount == 0, "Timelock already exists");

        uint256 unlockTime = block.timestamp + TIMELOCK_DURATION;

        timelocks[token] = TimelockEntry({
            token: token,
            amount: msg.value,
            unlockTime: unlockTime,
            beneficiary: beneficiary,
            executed: false,
            cancelled: false
        });

        emit FundsLocked(token, msg.value, unlockTime, beneficiary);
    }

    /**
     * @notice Update beneficiary based on community decision
     * @dev Only callable by owner before execution
     * @param token Token address
     * @param newBeneficiary New beneficiary address
     */
    function updateBeneficiary(
        address token,
        address newBeneficiary
    ) external onlyOwner {
        TimelockEntry storage entry = timelocks[token];
        require(entry.amount > 0, "No timelock exists");
        require(!entry.executed, "Already executed");
        require(!entry.cancelled, "Timelock cancelled");
        require(newBeneficiary != address(0), "Invalid beneficiary");

        address oldBeneficiary = entry.beneficiary;
        entry.beneficiary = newBeneficiary;

        emit BeneficiaryUpdated(token, oldBeneficiary, newBeneficiary);
    }

    /**
     * @notice Release funds after 48-hour timelock
     * @dev Anyone can call this after timelock expires
     * @param token Token address
     */
    function releaseFunds(address token) external nonReentrant {
        TimelockEntry storage entry = timelocks[token];
        require(entry.amount > 0, "No timelock exists");
        require(!entry.executed, "Already executed");
        require(!entry.cancelled, "Timelock cancelled");
        require(block.timestamp >= entry.unlockTime, "Timelock not expired");

        uint256 amount = entry.amount;
        address recipient = entry.beneficiary;

        entry.executed = true;

        payable(recipient).transfer(amount);

        emit FundsReleased(token, amount, recipient);
    }

    /**
     * @notice Emergency cancel timelock (only owner)
     * @dev Refunds to LaunchpadManager
     * @param token Token address
     */
    function cancelTimelock(address token) external onlyOwner nonReentrant {
        TimelockEntry storage entry = timelocks[token];
        require(entry.amount > 0, "No timelock exists");
        require(!entry.executed, "Already executed");
        require(!entry.cancelled, "Already cancelled");

        uint256 amount = entry.amount;
        entry.cancelled = true;

        payable(owner()).transfer(amount);

        emit TimelockCancelled(token);
    }

    /**
     * @notice Update platform address
     * @param _platformAddress New platform address
     */
    function updatePlatformAddress(address _platformAddress) external onlyOwner {
        require(_platformAddress != address(0), "Invalid address");
        platformAddress = _platformAddress;
    }

    /**
     * @notice Get timelock info
     * @param token Token address
     */
    function getTimelockInfo(address token) external view returns (
        uint256 amount,
        uint256 unlockTime,
        address beneficiary,
        bool executed,
        bool cancelled,
        uint256 timeRemaining
    ) {
        TimelockEntry memory entry = timelocks[token];
        uint256 remaining = 0;
        if (entry.unlockTime > block.timestamp) {
            remaining = entry.unlockTime - block.timestamp;
        }

        return (
            entry.amount,
            entry.unlockTime,
            entry.beneficiary,
            entry.executed,
            entry.cancelled,
            remaining
        );
    }

    receive() external payable {}
}
