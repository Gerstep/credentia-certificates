//import wallet from 'ethereumjs-wallet';
import { injectable } from 'inversify';
import solc           from 'solc';
import fs             from 'fs';
import path           from 'path';
import Web3           from 'web3';
import sha256         from 'crypto-js/sha256';

import { Logger }     from './Logger';
import env from '../environments/environment';

@injectable()
export class SmartContract {
  private web3: Web3;

  // @ts-ignore
  constructor(private logger: Logger) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(env.blockchain.httpProvider));
  }

  async deployContract(holder: string, data: any) {
    const certPath = path.resolve(__dirname, '..', env.blockchain.certPath);
    const source = fs.readFileSync(certPath, 'UTF-8');
    const json = JSON.stringify(data);

    const jsonContractSource = JSON.stringify({
      language: 'Solidity',
      sources: {
        'cert2.sol': {
          content: source
            .replace('<holder>', holder)
            .replace('<data>', json)
            .replace('<proof>', sha256(json).toString())
        }
      },
      settings: {
        outputSelection: {
          '*': {
            '*': ['*']
          }
        }
      }
    });
    const smc = JSON.parse(solc.compile(jsonContractSource));
    const bytecode = smc.contracts['cert2.sol'].CredentiaCert.evm.bytecode.object;
    const abi = smc.contracts['cert2.sol'].CredentiaCert.abi;

    // Contract object
    const contract = new this.web3.eth.Contract(abi);

    const deploy = contract.deploy({data: '0x' + bytecode, arguments: []}).encodeABI();

    try {
      const count = await this.web3.eth.getTransactionCount(env.blockchain.address);
      const transactionObject: any = {
        data: deploy,
        from: env.blockchain.address,
        nonce: count
      };

      const estimate = await this.web3.eth.estimateGas(transactionObject);
      transactionObject.gas = estimate;
      const signedTx = await this.web3.eth.accounts.signTransaction(transactionObject, env.blockchain.privateKey);
      const txId: string = await new Promise((res, rej) => {
        this.web3.eth.sendSignedTransaction(signedTx.rawTransaction)
          .on('transactionHash', function (transactionHash) {
            res(transactionHash);
          })
          .on('error', function (err) {
            rej(err);
          });
      });

      return {txId, abi};
    } catch (error) {
      this.logger.error(error);
    }
  }

  createAccount() {
    const res = this.web3.eth.accounts.create();

    return {
      address: res.address,
      privateKey: res.privateKey
    };
  }
// not adapt
  async resignContract(txHashCreateContract: string, abi:any, data: any){ 
    const receipt = await this.web3.eth.getTransactionReceipt(txHashCreateContract);
    const contractHash = receipt.contractAddress;
    const Contract = new this.web3.eth.Contract(abi, contractHash);
    const dt = await new Promise((res, _rej)=>{
      Contract.methods.setData(data).call().then(r=>{res(r)});
    });
    return dt;
  }

  async getSMData(txHashCreateContract: string, abi: any) {
    const receipt = await this.web3.eth.getTransactionReceipt(txHashCreateContract);
    const contractHash = receipt.contractAddress;

    const Contract = new this.web3.eth.Contract(abi, contractHash);

    const dt = await new Promise((res, _rej)=>{
      Contract.methods.getData().call().then(r=>{res(r)});
    });

    return dt;
  }
}
