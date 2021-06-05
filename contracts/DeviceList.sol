
pragma solidity ^0.5.0;

// We import this library to be able to use console.log
import "@nomiclabs/buidler/console.sol";

contract DeviceList {
  // An address type variable is used to store ethereum accounts.
  address public owner;

  uint public deviceCount = 0;

  struct Device {
    uint id;
    string deviceName;
    bool completed;
  }

  mapping(uint => Device) public Devices;

  event DeviceCreated(
    uint id,
    string deviceName,
    bool completed
  );

  event DeviceCompleted(
    uint id,
    bool completed
  );

  constructor() public {
    owner = msg.sender;

    createDevice("Default Device");
  }

  function createDevice(string memory _deviceName) public {
    // We can print messages and values using console.log
    console.log(
        "create one device (%s) by %s",
        _deviceName,
        msg.sender
    );

    deviceCount++;

    Devices[deviceCount] = Device(deviceCount, _deviceName, false);

    console.log(
        "one device %s",
        Devices[deviceCount].deviceName
    );

    emit DeviceCreated(deviceCount, _deviceName, false);
  }

  function toggleCompleted(uint _id) public {
    // We can print messages and values using console.log
    console.log(
        "toggle one device %s by %s",
        _id,
        msg.sender
    );

    Device memory _Device = Devices[_id];

    _Device.completed = !_Device.completed;

    Devices[_id] = _Device;

    emit DeviceCompleted(_id, _Device.completed);
  }
}
