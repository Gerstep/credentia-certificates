pragma solidity ^0.5.8;
contract CredentiaCert {
    string data = '<data>';
    string proof = '<proof>';
    
    address owner;
    address client = <holder>;
    
    constructor() public {
        owner = msg.sender;
    }

    function getData() public view returns(string memory) {
        return data;
    } 
    function getProof() public view returns(string memory) {
        return proof;
    }

    function setData(string memory v_data, string memory v_proof) public {
        require(msg.sender==owner);
        data = v_data;
        proof = v_proof;
    }
}
