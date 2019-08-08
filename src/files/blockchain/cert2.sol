pragma solidity ^0.5.8;
contract CredentiaCert {
    string data = '<data>';
    string proof = '<proof>';
    
    address owner;
    address client = <holder>;
    
    constructor() public {
        owner = msg.sender;
    }

    function getData() public view returns(address, address, string memory, string memory) {
        return (owner, client, data, proof);
    } 

    function setData(string memory v_data, string memory v_proof) public {
        require(msg.sender==owner);
        data = v_data;
        proof = v_proof;
    }
}
