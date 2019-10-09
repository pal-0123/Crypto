var Token = artifacts.require("./Token.sol");

module.exports = function(deploy){
    deploy.deploy(Token,10000);
}