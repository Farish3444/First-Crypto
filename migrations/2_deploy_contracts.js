const DappToken = artifacts.require("./DappToken.sol");
const DappTokenSale = artifacts.require("./DappTokenSale.sol");

module.exports = function(deployer) {
  deployer.deploy(DappToken,1000000).then(()=>{
    return deployer.deploy(DappTokenSale,DappToken.address);
  });
};

