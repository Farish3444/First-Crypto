pragma solidity ^0.4.2;

import './DappToken.sol';

contract DappTokenSale{

    address admin;
    DappToken public tokenContract;

    function DappTokenSale( DappToken _tokenContract ) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
    }

}