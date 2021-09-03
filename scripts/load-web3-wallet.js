
const Web3 = require("web3");
const {JANUS} = require("./constants");
const KEYSTORE = require("./keystore.json");
const prompt = require("prompt");
var colors = require("colors/safe");
const bs58 = require('bs58');

const getPassword = () =>  {
	return new Promise ((resolve, reject) => {
		const properties = [
			{
			replace: '*',
			name: 'password',
			hidden: true,
			description: '(account password)'
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
		let wallet = web3.eth.accounts.wallet.decrypt([KEYSTORE], password);
		console.log("wallet address(hex): ", wallet[0].address);
		const bytes = Buffer.from(wallet[0].address.slice(2), 'hex')
		const bs58address = bs58.encode(bytes)
		console.log("wallet address(bs58): ", bs58address);
	} catch (e) {
		console.log("Error in script:\n", e);
	}
} 

main()