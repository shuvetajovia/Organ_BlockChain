const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const path = require('path');

console.log("\n========================================");
console.log("  OrganChain - Contract Deployment Tool ");
console.log("========================================\n");

console.log("Reading contract source...");
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
  console.log(" ✔ Contract source loaded from:", contractPath);

  console.log("Compiling DonorContract.sol...");
  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  if (output.errors) {
    output.errors.forEach(err => {
        const level = err.severity === 'error' ? '  ✖ ERROR' : '  ⚠ WARN ';
        console.log(`${level}: ${err.formattedMessage}`);
    });
    if (output.errors.some(e => e.severity === 'error')) {
        console.log("\nCompilation failed. Aborting deployment.\n");
        process.exit(1);
    }
  }
  console.log("✔ Compilation successful");
  const contract = output.contracts['DonorContract.sol']['DonorContract'];
  
  const abi = contract.abi;
  const bytecode = contract.evm.bytecode.object;
  console.log("Connecting to Ganache at http://127.0.0.1:7545...");

  const web3 = new Web3("http://127.0.0.1:7545");
  const accounts = await web3.eth.getAccounts();
  const netId = await web3.eth.net.getId();
  
  console.log("✔ Connected. Deploying contract from account", accounts[0], "...");
  console.log(` ✔ Network ID: ${netId}`);

  console.log("Deploying contract...")
  const deployedContract = await new web3.eth.Contract(abi)
      .deploy({ data: "0x" + bytecode })
      .send({ from: accounts[0], gas: 6000000 });
   
  console.log("✔ Contract deployed successfully");
  console.log(`  ✔ Address: ${deployedContract.options.address}`);
  console.log(`  ✔ ABI saved to: build/contracts/DonorContract.json`);
  console.log("\n  Deployment complete!\n");

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
  console.log(" ✔ Done writing contract JSON");
}

main().catch(console.error);
