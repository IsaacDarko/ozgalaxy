//https://eth-goerli.g.alchemy.com/v2/9v0sWbJumkzHA9nMQ4-G8cWywh_yHVlf
require("@nomiclabs/hardhat-waffle");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    goerli: {
      url:'https://eth-goerli.g.alchemy.com/v2/9v0sWbJumkzHA9nMQ4-G8cWywh_yHVlf',
      accounts: [ '04bb0a2f90f47bafc116ab13aa755f33a7902602c0f1a3bd5f68488a85b1658e' ]
    }
  }
};
