// This is a script for deploying your contracts. You can adapt it to deploy
// yours, or create new ones.
async function main() {
  // This is just a convenience check
  if (network.name === "buidlerevm") {
    console.warn(
      "You are trying to deploy a contract to the Buidler EVM network, which" +
        "gets automatically created and destroyed every time. Use the Buidler" +
        " option '--network localhost'"
    );
  }

  // ethers is avaialble in the global scope
  const [deployer] = await ethers.getSigners();
  console.log(
    "Deploying the contracts with the account:",
    await deployer.getAddress()
  );

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy();
  await token.deployed();

  console.log("Token address:", token.address);

  const DeviceList = await ethers.getContractFactory("DeviceList");
  const deviceList = await DeviceList.deploy();
  await deviceList.deployed();

  console.log("DeviceList address:", deviceList.address);


  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(token, deviceList);
}

function saveFrontendFiles(token, deviceList) {
  const fs = require("fs");
  const contractsDir = __dirname + "/../frontend/src/contracts";

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ Token: token.address,
                    DeviceList: deviceList.address }, undefined, 2)
  );

  fs.copyFileSync(
    __dirname + "/../artifacts/Token.json",
    contractsDir + "/Token.json"
  );

  fs.copyFileSync(
    __dirname + "/../artifacts/DeviceList.json",
    contractsDir + "/DeviceList.json"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
