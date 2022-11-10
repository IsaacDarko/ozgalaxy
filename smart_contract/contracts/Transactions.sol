// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Transactions {
    uint256 transactionCount;
    //defining the transfer event
    event Transfer( address from, address receiver, uint256 amount, string message, uint256 timestamp, string keyword );

    struct TransferStruct {
        address from;
        address receiver;
        uint256 amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    TransferStruct[] transactions;

    function addToBlockchain( address payable receiver, uint256 amount, string calldata message, string calldata keyword ) public {
        //updating the transaction count
        transactionCount += 1;
        //saving the new transaction to memory
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword )
        );
        //firing the transfer event to the blockchain
        emit Transfer( msg.sender, receiver, amount, message, block.timestamp, keyword );
    }

    function getAllTransactions() public view returns (TransferStruct[] memory)
    {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }
}
