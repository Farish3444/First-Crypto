var DappToken = artifacts.require("./DappToken.sol")

contract('DappToken',function(accounts){

    var tokenInstance;

    it("initialize the contacts with the correct values",function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name,'DApp Token','has the correct name')
            return tokenInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol,"DAPP","has correct symbol");
            return tokenInstance.standard();
        }).then(function(standard){
            assert.equal(standard,"DApp Token v1.0");
        });
    });



    it('allocate the total supply upon deployement',function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(),1000000,'set the total supply to 1000000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance){
            assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply of the admin')
        });
    });



    it('transfer token owenrship',function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],9999999999999);
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0,'error message must containe revert' );
            return tokenInstance.transfer.call(accounts[1],250000,{from: accounts[0]});
        }).then(function(success){
            assert.equal(success,true,'it returns true');
            return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]});
        }).then(function(receipt){
            assert.equal(receipt.logs.length,1,"trigger one event");
            assert.equal(receipt.logs[0].event,"Transfer",'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from,accounts[0],'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to,accounts[1],'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value,250000,"logs the transfer amount");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance){
            assert.equal(balance.toNumber(),250000,'adds the amount to the reciever account');
            return tokenInstance.balanceOf(accounts[0]); 
        }).then(function(balance){
            assert.equal(balance.toNumber(),750000,"deduct the amount from the sending account");
        });
    })



    it('approves tokens for delegated transfer',()=>{
        return DappToken.deployed().then((instance)=>{
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1],100);

        }).then((success)=>{
            assert.equal(success,true,'it returns true');
            return tokenInstance.approve(accounts[1],100,{from:accounts[0]});
        }).then((receipt)=>{
            assert.equal(receipt.logs.length,1,"trigger one event");
            assert.equal(receipt.logs[0].event,"Approval",'should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner,accounts[0],'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._spender,accounts[1],'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value,100,"logs the transfer amount");
            return tokenInstance.allowance(accounts[0],accounts[1]);
        }).then((allowance)=>{
            assert.equal(allowance.toNumber(),100,'stores the allowance for delegated transfer');
        }); 
    })

    it('handle delegate token transfer',function(){
        return DappToken.deployed().then(function(instance){
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];

            return tokenInstance.transfer(fromAccount,100,{from: accounts[0]});
        }).then(function(reciept){
            return tokenInstance.approve(spendingAccount,10,{from:fromAccount});
        }).then(function(reciept){
            return tokenInstance .transferFrom(fromAccount,toAccount,9999,{from:  spendingAccount});
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0,'cannot transfer valuer larger than balance');
            return tokenInstance.transferFrom(fromAccount,toAccount,20,{from: spendingAccount});  
        }).then(assert.fail).catch(function(error){
            assert(error.message.indexOf('revert') >= 0,'cannot transfer valure larger then approved amount');
            return tokenInstance.transferFrom.call(fromAccount,toAccount,10,{from: spendingAccount});
        }).then((success)=>{
            assert.equal(success,true)
            return tokenInstance.transferFrom(fromAccount,toAccount,10,{from:spendingAccount});

        }).then(receipt=>{
            assert.equal(receipt.logs.length,1,"trigger one event");
            assert.equal(receipt.logs[0].event,"Transfer",'should be the "Tranfer" event');
            assert.equal(receipt.logs[0].args._from,fromAccount,'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args._to,toAccount,'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args._value,10,"logs the transfer amount");
            return tokenInstance.balanceOf(fromAccount);
        }).then(balance=>{
            assert.equal(balance.toNumber(),90,'deducts the amounts from the sending account')
            return tokenInstance.balanceOf(toAccount);
        }).then(balance=>{
            assert.equal(balance.toNumber(),10,'add the amount from the receiving account' );
            return tokenInstance.allowance(fromAccount,spendingAccount)
        }).then((allowance)=>{
            assert.equal(allowance,0,'deduced the amount of the alloance')
        });
    });




























    






















});
