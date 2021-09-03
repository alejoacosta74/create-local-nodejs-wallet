
const Web3 = require("web3");
const {JANUS} = require("./constants");
const prompt = require("prompt");
var fs = require('fs');
var colors = require("colors/safe");

const getPassword = () =>  {
	return new Promise ((resolve, reject) => {
		const properties = [
			{
			replace: '*',
			name: 'password',
			hidden: true,
			description: '(choose encryption password)'
			}
		];
		prompt.message = colors.brightRed("Enter password");
		prompt.start();
		prompt.get(properties, function (err, result) {
			if (err) { 
				reject(err);
			}
			resolve(result.password);
		});
	})
}

const main = async () => {
	try {
		const web3 = new Web3(JANUS);
		let password = await getPassword();
		let account = web3.eth.accounts.create(web3.utils.randomHex(32));
		let wallet = web3.eth.accounts.wallet.add(account);
		let keystore = wallet.encrypt(password);
		let keyStoreJson = JSON.stringify(keystore, null, 2);
		console.log("Account address: ", account.address);
		fs.writeFileSync("keystore.json", keyStoreJson);
		
	} catch (e) {
		console.log("Error in script:\n", e);
	}
} 

main()