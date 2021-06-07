import React from "react";

// All the logic of this dapp is contained in the Dapp component.
// These other components are just presentational ones: they don't have any
// logic. They just render HTML.
import { NoWalletDetected } from "./NoWalletDetected";

import { DeviceList } from "./DeviceList";
import { Token } from "./Token";

export class Dapp extends React.Component {
  constructor(props) {
    super(props);

    // We store multiple things in Dapp's state.
    // You don't need to follow this pattern, but it's an useful example.
    this.initialState = {
      // The user's address
      selectedAddress: undefined,
    };

    this.state = this.initialState;
  }

  render() {
    // Ethereum wallets inject the window.ethereum object. If it hasn't been
    // injected, we instruct the user to install MetaMask.
    if (window.ethereum === undefined) {
      return <NoWalletDetected />;
    }

    // If everything is loaded, we render the application.
    return (
      <div>
        <DeviceList></DeviceList>
        {/* <Token></Token> */}
      </div>
    );
  }

  componentDidMount() {
    if (window.ethereum) {

      // The next thing we need to do, is try to connect their wallet.
      // When the wallet gets connected, we are going to save the users's address
      // in the component's state. 
      if (!this.state.selectedAddress) {
        this._connectWallet();
      }
    }
  }

  componentWillUnmount() {
  }

  async _connectWallet() {
    // This method is run when the user clicks the Connect. It connects the
    // dapp to the user's wallet, and initializes it.

    // To connect to the user's wallet, we have to run this method.
    // It returns a promise that will resolve to the user's address.
    const [selectedAddress] = await window.ethereum.enable();

    // Once we have the address, we can initialize the application.
    this._initialize(selectedAddress);

    // We reinitialize it whenever the user changes their account.
    window.ethereum.on("accountsChanged", ([newAddress]) => {
      // `accountsChanged` event can be triggered with an undefined newAddress.
      // This happens when the user removes the Dapp from the "Connected
      // list of sites allowed access to your addresses" (Metamask > Settings > Connections)
      // To avoid errors, we reset the dapp state 
      if (newAddress === undefined) {
        return this._resetState();
      }
      
      this._initialize(newAddress);
    });
    
    // We reset the dapp state if the network is changed
    window.ethereum.on("networkChanged", ([networkId]) => {
      this._resetState();
    });
  }

  async _initialize(userAddress) {
    // This method initializes the dapp
    // We first store the user's address in the component's state
    this.setState({
      selectedAddress: userAddress,
    });
  }

  // This method resets the state
  _resetState() {
    this.setState(this.initialState);
  }
}
