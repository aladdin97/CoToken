const CoToken = artifacts.require("./CoToken.sol");

module.exports = function(deployer) {
  deployer.deploy(CoToken);
};
