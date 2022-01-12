const DappTokenSale = artifacts.require("./DappTokenSale.sol");

contract('DappTokenSale',function(accounts){

    var tokenSaleInstance;

    it('initialize the contract with the correct value',()=>{
        return DappTokenSale.deployed().then(instance=>{
            tokenSaleInstance = instance;
            return tokenSaleInstance.address
        }).then(address=>{
        assert.notEqual(address,0x0,'has contract address')
        return tokenSaleInstance.tokenContract();
        }).then(address=>{
        assert.notEqual(address,0x0,'has token contract address')

        })
    })
})