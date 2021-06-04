# Sample React Dapp

This directory has a sample Dapp to interact with your contracts, built using
React.

## Running the Dapp

This project uses [`create-react-app`](https://create-react-app.dev/), so most
configuration files are handled by it.

To run it, you just need to execute `npm start` in a terminal, and open
[http://localhost:3000](http://localhost:3000).

To learn more about what `create-react-app` offers, you can read
[its documentation](https://create-react-app.dev/docs/getting-started).

## Architecture of the Dapp

This Dapp consists of multiple React Components, which you can find in
`src/components`.

Most of them are presentational components, have no logic, and just render HTML.

The core functionality is implemented in `src/components/Dapp.js`, which has
examples of how to connect to the user's wallet, initialize your Ethereum
connection and contracts, read from the contract's state, and send transactions.

You can use the `Dapp` component as a starting point for your project. It has
comments explaining each part of its code, and indicating what's specific to
this project, and what can be reused.

## Troubleshooting

### metamask chainId issue
If you are using MetaMask with Hardhat Network, you might get an error like this when you send a transaction:

Incompatible EIP155-based V 2710 and chain id 31337. See the second parameter of the Transaction construct

reference:
https://hardhat.org/metamask-issue.html

solution:
https://github.com/MetaMask/metamask-extension/issues/10290
The solution is to manually change the project's configuration so that 1337 is used as chainId. This causes unnecessary friction.


## Feedback, help and news

Feel free to reach us through this repository or
[our Telegram Support Group](https://t.me/BuidlerSupport).

Also you can [follow Nomic Labs on Twitter](https://twitter.com/nomiclabs).

**Happy _buidling_!**
