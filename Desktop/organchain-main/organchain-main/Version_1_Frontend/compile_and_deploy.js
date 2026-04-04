const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const path = require('path');

async function main() {
  const contractPath = path.resolve(__dirname, 'contracts', 'DonorContract.sol');
  const source = fs.readFileSync(contractPath, 'utf8');

  var input = {
      language: 'Solidity',
      sources: {
          'DonorContract.sol': {
              content: source
          }
      },
      settings: {
          outputSelection: {
              '*': {
                  '*': ['*']
              }
          }
      }
  };

  console.log("Compiling contract...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
      console.log(output.errors);
  }
  const contract = output.contracts['DonorContract.sol']['DonorContract'];
  
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;

  const web3 = new Web3("http://127.0.0.1:7545");
  const accounts = await web3.eth.getAccounts();
  const netId = await web3.eth.net.getId();

  console.log("Deploying contract from account", accounts[0], "...");
  const deployedContract = await new web3.eth.Contract(abi)
      .deploy({ data: "0x" + bytecode })
      .send({ from: accounts[0], gas: 6000000 });
      
  console.log("Contract deployed at address:", deployedContract.options.address);

  const finalJson = {
      contractName: "DonorContract",
      abi: abi,
      networks: {
          [netId]: {
              address: deployedContract.options.address
          }
      }
  };

  const buildPath = path.resolve(__dirname, 'build', 'contracts');
  if (!fs.existsSync(buildPath)) {
      fs.mkdirSync(buildPath, {recursive: true});
  }
  fs.writeFileSync(path.resolve(buildPath, 'DonorContract.json'), JSON.stringify(finalJson, null, 2));
  console.log("Done writing contract JSON");
}

main().catch(console.error);
