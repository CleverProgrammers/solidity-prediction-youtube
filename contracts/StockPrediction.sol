pragma solidity ^0.8.0;

contract StockPrediction {
    address public owner;
    uint public predictionStartTime;
    uint public predictionEndTime;
    int public currentPrice;
    mapping(address => int) public bets;
    address[] public bettors;
    mapping(address => uint256) public betAmounts;

    uint public lastCheckedTime;
    bool public isBettingActive;
    address public lastWinner;

    struct Bet {
        address bettor;
        int amount;
    }

    struct BetInfo {
        address bettor;
        int amount;
        uint256 betAmount;
    }

    constructor() {
        owner = msg.sender;
        predictionEndTime = block.timestamp + 5 minutes; // Set default end time to 5 minutes after contract deployment
        isBettingActive = false;
    }

    function getAllBets() public view returns (BetInfo[] memory) {
        BetInfo[] memory allBets = new BetInfo[](bettors.length);
        for (uint i = 0; i < bettors.length; i++) {
            allBets[i].bettor = bettors[i];
            allBets[i].amount = bets[bettors[i]];
            allBets[i].betAmount = betAmounts[bettors[i]];
        }
        return allBets;
    }

    function startPrediction(int _currentPrice) public {
        require(msg.sender == owner, "Only owner can start prediction");
        currentPrice = _currentPrice;
        predictionStartTime = block.timestamp;
        predictionEndTime = block.timestamp + 5 minutes; // Set the prediction end time to 5 minutes after the start time
        isBettingActive = true;
    }

    function enterBet(int _prediction) public payable {
        require(block.timestamp < predictionEndTime, "Prediction time is over");
        require(msg.value > 0.001 ether, "Minimum bet is 0.001 ether");
        bets[msg.sender] = _prediction;
        bettors.push(msg.sender);
        betAmounts[msg.sender] = msg.value;
    }

    function finalizePrediction(int _currentPrice) public {
        require(block.timestamp >= predictionEndTime, "Prediction time is not over yet");
        require(isBettingActive, "Betting is not active");

        int closestPrediction = bets[bettors[0]];
        uint closestDistance = abs(currentPrice, closestPrediction);
        address payable winner = payable(bettors[0]);

        for (uint i = 1; i < bettors.length; i++) {
            int prediction = bets[bettors[i]];
            uint distance = abs(currentPrice, prediction);
            if (distance < closestDistance) {
                closestPrediction = prediction;
                closestDistance = distance;
                winner = payable(bettors[i]);
            }
        }

        uint pool = address(this).balance;
        require(pool > 0, "No ether in pool");
        require(winner != address(0), "No winner");
        winner.transfer(pool);
        lastWinner = winner;

        predictionStartTime = 0;
        predictionEndTime = 0;
        currentPrice = 0;
        isBettingActive = false;

        for (uint i = 0; i < bettors.length; i++) {
            bets[bettors[i]] = 0;
        }
        bettors = new address[](0);
    }
    function resetLastWinner() public {
        require(msg.sender == owner, "Only owner can reset last winner");
        lastWinner = address(0);
    }

    function isPredictionOver() public view returns (bool) {
        if (block.timestamp >= predictionEndTime) {
            return true;
        }
        return false;
    }

    function getPoolAmount() public view returns (uint) {
    return address(this).balance;
}


    function abs(int x, int y) internal pure returns (uint) {
        return x >= y ? uint(x - y) : uint(y - x);
    }
}
