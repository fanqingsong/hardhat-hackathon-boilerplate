import React from "react";

import { ethers } from "ethers";

import DeviceListArtifact from "../contracts/DeviceList.json";
import contractAddress from "../contracts/contract-address.json";

import { Loading } from "./Loading";

import { TransactionErrorMessage } from "./TransactionErrorMessage";
import { WaitingForTransactionMessage } from "./WaitingForTransactionMessage";


const ERROR_CODE_TX_REJECTED_BY_USER = 4001;

export class DeviceList extends React.Component {
  constructor(props) {
    super(props);

    this.initialState = {
      deviceListData: undefined,

      newDevice: undefined,

      txBeingSent: undefined,
      transactionError: undefined,
      networkError: undefined,
    };

    this.state = this.initialState;

    this.onNewDeviceChange = this.onNewDeviceChange.bind(this);
    this.onNewDeviceSubmit = this.onNewDeviceSubmit.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onDeviceToggle = this.onDeviceToggle.bind(this);
  }

  onNewDeviceChange(e) {
    let newDevice = e.target.value;

    this.setState({"newDevice": newDevice})
  }

  async onNewDeviceSubmit(e) {
    let newDevice = this.state.newDevice;

    await this._createDevice(newDevice);

    this.setState({'newDevice':""})

    this._getDeviceListData();
  }

  async onDeviceToggle(id) {
    let deviceListData = this.state.deviceListData;
    let devices = deviceListData.devices;

    devices.forEach(oneDevice => {
      let _id = oneDevice.id;

      if (id === _id) {
        oneDevice.completed = !oneDevice.completed;
      }
    });

    this.setState({deviceListData});

    await this._toggleDevice(id);

    this._getDeviceListData();
  }

  onFormSubmit(e) {
    e.preventDefault();
  }

  render() {
    let deviceListData = this.state.deviceListData;
    console.log(deviceListData);

    let newDevice = this.state.newDevice || "";

    return (
      <div className="container p-4">
        <div className="row">
            <div className="col-12">
                <form onSubmit={this.onFormSubmit}>
                    <input onChange={this.onNewDeviceChange} value={newDevice} type="text" className="form-control" placeholder="Add device..." required></input>
                    <input onClick={this.onNewDeviceSubmit} type="submit" name="submit"></input>
                </form>

                <ul id="taskList" className="list-unstyled">
                    { deviceListData && 
                        deviceListData.devices.map((oneDevice) =>
                            <li key={oneDevice.id.toString()}>
                                <label>
                                    <input type="checkbox" onChange={(e)=>this.onDeviceToggle(oneDevice.id)} checked={oneDevice.completed}/>
                                    <span className="content">{oneDevice.deviceName}</span>
                                </label>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>        
      </div>
    );
  }

  componentDidMount() {
    this._initialize()
  }

  componentWillUnmount() {
    // We poll the user's balance, so we have to stop doing that when Dapp
    // gets unmounted
    this._stopPollingData();

    this.setState = (state,callback)=>{
      return;
    };
  }

  async _initialize() {
    await this._intializeEthers();

    try {
      await this._deviceList.deployed();

      this._startPollingData();

      this._getDeviceListData();
    } catch (error) {
      this.setState({ networkError: 'Token contract not found on this network.' });
    }
  }

  async _intializeEthers() {
    // We first initialize ethers by creating a provider using window.ethereum
    this._provider = new ethers.providers.Web3Provider(window.ethereum);

    // We initialize the contract using the provider and the token's
    // artifact and address. You can do this same thing with your contracts.
    this._deviceList = await new ethers.Contract(
      contractAddress.DeviceList,
      DeviceListArtifact.abi,
      this._provider.getSigner(0)
    );
  }

  _startPollingData() {
    this._pollDataInterval = setInterval(() => this._getDeviceListData(), 10000);

    this._getDeviceListData();
  }

  _stopPollingData() {
    clearInterval(this._pollDataInterval);
    this._pollDataInterval = undefined;
  }

  async _getDeviceListData() {
    let deviceCount = await this._deviceList.deviceCount();

    console.log("--- deviceCount:")
    console.log(deviceCount.toNumber())

    deviceCount = deviceCount.toNumber();

    let devices = []
    for(let i=1; i<=deviceCount; i++) {
        const device = await this._deviceList.Devices(i);

        console.log(device)
        console.log(device.id.toNumber())
        console.log(device.deviceName)
        console.log(device.completed)

        let one_device = {
            id: device.id.toNumber(),
            deviceName: device.deviceName,
            completed: device.completed
        }

        devices.push(one_device);
    }

    this.setState({ deviceListData: { deviceCount, devices } });
  }

  async _createDevice(deviceName) {
    try {
      this._dismissTransactionError();

      const tx = await this._deviceList.createDevice(deviceName);

      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  async _toggleDevice(id) {
    try {
      this._dismissTransactionError();

      const tx = await this._deviceList.toggleCompleted(id);

      this.setState({ txBeingSent: tx.hash });

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      if (error.code === ERROR_CODE_TX_REJECTED_BY_USER) {
        return;
      }

      console.error(error);
      this.setState({ transactionError: error });
    } finally {
      this.setState({ txBeingSent: undefined });
    }
  }

  _dismissTransactionError() {
    this.setState({ transactionError: undefined });
  }

  _dismissNetworkError() {
    this.setState({ networkError: undefined });
  }

  _resetState() {
    this.setState(this.initialState);
  }
}
