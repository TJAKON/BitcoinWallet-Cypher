import { makeAutoObservable, action } from 'mobx';
import axios from 'axios';
import { Linking } from 'react-native'; 
import apiEndpoints from './apiEndpoints';
import { ethers, parseUnits } from 'ethers';
import { Buffer } from 'buffer';

import Bitcoin from 'react-native-expo-bitcoinjs-lib'
global.Buffer = Buffer



class WalletStore {
  RpcProvider = '';
  signer;
  provider;
  WalletPrivateKey = '';
  livePriceBitcoin = 0;
  WalletAddress = '';
  RecieversAddress = '';
  livePriceUsdt = 0;
  transactionHistory = [];
  broadcasting = ``;

  
  setApiEndpoint(endpoint) {
    this.apiEndpoint = endpoint;
  }
  fetchLivePrice() {
    axios.get(apiEndpoints.bitcoinPrice).then((response) => {
      this.setLivePriceBitcoin(response.data.bitcoin.usd);
      console.log(this.livePriceBitcoin)
      return this.livePriceBitcoin
    }) .catch((error) => {
        console.error('Error fetching live price:', error);
      });

    axios.get(apiEndpoints.usdtPrice).then((response) => {
      this.setLivePriceUsdt(response.data.data.rateUsd);
      console.log(this.livePriceUsdt)
      return this.livePriceUsdt
    }) .catch((error) => {
        console.error('Error fetching live price:', error);
      });
  }
  constructor() {
    makeAutoObservable(this, {
      setWalletAddress: action,
      setLivePrice: action,
      addToTransactionHistory: action,
      addToBroadcasting:action,
    });
  }
// correct
  setWalletAddressBitcoin(privateKey, onSuccess, onError) {
    try {
      const keyPair = Bitcoin.ECPair.fromWIF(privateKey)
      // console.log(keyPair)
      console.log(Bitcoin.networks.testnet)
      const bitcoinAddress = keyPair.getAddress()
      console.log("backend",bitcoinAddress)
      // const bitcoinAddress = payment.address(testnet);
      this.WalletPrivateKey = privateKey;
      this.WalletAddress = bitcoinAddress;
      this.RpcProvider = "";
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(this.WalletAddress,this.RpcProvider);
      }
    } catch (error) {
      console.error('Error importing wallet:', error.message);
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
    }
  }
  setWalletAddressPolygon(privateKey, onSuccess, onError) {
    try {
      // provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/974a213860b54adf82f5cffff7fac289');
      // signer = provider.getSigner()
      provider = ethers.getDefaultProvider('sepolia');
      const wallet = new ethers.Wallet(privateKey, provider);
      this.RpcProvider = provider;
      this.WalletAddress = wallet.address;
      this.WalletPrivateKey = privateKey;
      // this.signers = signer;
      // console.log(this.RpcProvider,this.WalletPrivateKey,this.WalletAddress)
      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(this.WalletAddress, this.RpcProvider);
      }
    } catch (error) {
      console.error('Error importing wallet:', error.message);
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
    }
  }
  setLivePriceBitcoin(price) {
    this.livePriceBitcoin = price;
  }
  setLivePriceUsdt(price) {
    this.livePriceUsdt = price;
  }
  addToTransactionHistory(transaction) {
    this.transactionHistory.push(transaction);
  }
  addToBroadcasting(linktotransaction){
    this.broadcasting = linktotransaction;
  }

  //  when you are using your address for transaction then uncomment this function other wise below down function some test
  // accounsts for the transaction for bitcoin only 
  // sendTransactionBitcoin = async (receiverAddress, amount, selectedNetwork) => {
  //   const transactionAmount = amount;
  //   const privateKey = this.WalletPrivateKey
  //   const fromAddress =this.WalletAddress
  //   const toAddress = receiverAddress

  //   const network = Bitcoin.networks.testnet;
  //   const keyPair = Bitcoin.ECPair.fromWIF(privateKey, network);
  //   console.log(keyPair.getAddress())

  //   try {
  //     const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${fromAddress}/full`).then(console.log("call-1"));
  //     const utxos = response.data.txs.filter((utxo) => utxo.confirmations > 0 && utxo.vout_sz >= 2);
  //     // const utxos = response.data.txs;
  //     console.log(response.data.txs)
  //     const txb = new Bitcoin.TransactionBuilder(network);

  //     let totalAmount = 0;
  //     utxos.forEach((utxo) => {
  //       txb.addInput(utxo.hash, utxo.vout_sz ); 
  //       totalAmount += utxo.total;
  //     });

  //     const satoshiToSend = Math.floor(amount * 1e8);
  //     const fee = 50000; 
  //     if (totalAmount < satoshiToSend + fee) {
  //       throw new Error('Insufficient funds');
  //     }

  //     // txb.addOutput(toAddress, totalAmount);
  //     txb.addOutput(toAddress, satoshiToSend);
  //     txb.addOutput(fromAddress, totalAmount - satoshiToSend - fee);

  //     utxos.forEach((utxo, index) => {
  //       txb.sign(index, keyPair);
  //     });
      
  //     const rawTransaction = txb.build().toHex();
  //     try {
  //       const broadcastResponse = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {
  //         tx: rawTransaction,
  //       }).then(console.log("call-2"));

  //       const transactionDetails = {
  //         id: this.transactionHistory.length + 1, 
  //         status: broadcastResponse.data.status,
  //         amount: `${amount} BTC`,
  //         fee: `${broadcastResponse.data.gasPrice} Satoshi`, 
  //       };
    
  //       this.addToTransactionHistory(transactionDetails);

  //       const transactionHash = broadcastResponse.data.hash;
  //       const blockExplorerLink = `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`
  //       this.addToBroadcasting(blockExplorerLink)
  //       console.log('Broadcast Response:', broadcastResponse.data);
  //       console.log('View Transaction on BlockCypher Explorer:', `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`).then(console.log("call-3"));

  //       console.log('Broadcast Response:', broadcastResponse.data);
  //     } catch (error) {
  //       if (error.response) {
  //         // The request was made, and the server responded with a status code
  //         console.error('Error Response Data:', error.response.data);
  //       } else if (error.request) {
  //         // The request was made but no response was received
  //         console.error('Error Request Data:', error.request);
  //       } else {
  //         // Something happened in setting up the request that triggered an Error
  //         console.error('Error Message:', error.message);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //   }

  //   try {
  //     // Example wallets
  //     const walletA = {
  //       addr: 'myv9cYu3SFHxeZBm2x44cZUzQNBbjEDsJm',
  //       publickey: '033d49f37184cd0ff95328068a3a5833a7fdb7126ff68224506553933dce7be12f',
  //       privateKey: 'cW9pDTXZVeWS1S8wotiL1HtVZafU921W4JyGfJNSv4FtrEjaE9Ho',
  //     };
  //     const walletB = {
  //       addr: 'mvipu3Y1FCf8PqBCWNDEW9HrUU8q5MmX7n',
  //       publickey: '02ecd01fecbb8c25b110e1804594baff2ce2eeebb2b5ad870768cf40940ce48ecb',
  //       privateKey: 'cSmJZ79uMQQHAGa5s3m3AYosgV8qHVTNUQsH4wiVXYAcdSKz4td9',
  //     };

  //     async function sendBTC(fromAddress, toAddress, privateKey, publicKey, amount) {
  //       const network = Bitcoin.networks.testnet;
  //       const keyPair = Bitcoin.ECPair.fromWIF(privateKey, network);
  //       console.log(keyPair.getAddress())

  //       // Fetch UTXOs
  //       try {
  //         const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${fromAddress}/full`).then(console.log("call-1"));
  //         const utxos = response.data.txs.filter((utxo) => utxo.confirmations > 0 && utxo.vout_sz >= 2);
  //         // const utxos = response.data.txs;
  //         console.log(response.data.txs)
  //         const txb = new Bitcoin.TransactionBuilder(network);

  //         let totalAmount = 0;
  //         utxos.forEach((utxo) => {
  //           txb.addInput(utxo.hash, utxo.vout_sz ); 
  //           totalAmount += utxo.total;
  //         });

  //         const satoshiToSend = Math.floor(amount * 1e8);
  //         const fee = 50000; 
  //         if (totalAmount < satoshiToSend + fee) {
  //           throw new Error('Insufficient funds');
  //         }

  //         // txb.addOutput(toAddress, totalAmount);
  //         txb.addOutput(toAddress, satoshiToSend);
  //         txb.addOutput(fromAddress, totalAmount - satoshiToSend - fee);

  //         utxos.forEach((utxo, index) => {
  //           txb.sign(index, keyPair);
  //         });
          
  //         const rawTransaction = txb.build().toHex();
  //         try {
  //           const broadcastResponse = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {
  //             tx: rawTransaction,
  //           }).then(console.log("call-2"));

  //           const transactionDetails = {
  //             id: this.transactionHistory.length + 1, 
  //             status: broadcastResponse.data.status,
  //             amount: `${amount} BTC`,
  //             fee: `${broadcastResponse.data.gasPrice} Satoshi`, 
  //           };
        
  //           this.addToTransactionHistory(transactionDetails);

  //           const transactionHash = broadcastResponse.data.hash;
  //           const blockExplorerLink = `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`
  //           this.addToBroadcasting(blockExplorerLink)
  //           console.log('Broadcast Response:', broadcastResponse.data);
  //           console.log('View Transaction on BlockCypher Explorer:', `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`).then(console.log("call-3"));

  //           console.log('Broadcast Response:', broadcastResponse.data);
  //         } catch (error) {
  //           if (error.response) {
  //             // The request was made, and the server responded with a status code
  //             console.error('Error Response Data:', error.response.data);
  //           } else if (error.request) {
  //             // The request was made but no response was received
  //             console.error('Error Request Data:', error.request);
  //           } else {
  //             // Something happened in setting up the request that triggered an Error
  //             console.error('Error Message:', error.message);
  //           }
  //         }
  //       } catch (error) {
  //         console.error('Error:', error.message);
  //       }
  //     }

  //     sendBTC(walletA.addr, walletB.addr, walletA.privateKey, walletA.publickey, transactionAmount);
  //   } catch (error) {
  //     console.error('Error sending Bitcoin transaction:', error.message);
  //   }
  // };

  sendTransactionBitcoin = async (receiverAddress, amount, selectedNetwork) => {
    const transactionAmount = amount;
    try {
      // Example wallets
      const walletA = {
        addr: 'myv9cYu3SFHxeZBm2x44cZUzQNBbjEDsJm',
        publickey: '033d49f37184cd0ff95328068a3a5833a7fdb7126ff68224506553933dce7be12f',
        privateKey: 'cW9pDTXZVeWS1S8wotiL1HtVZafU921W4JyGfJNSv4FtrEjaE9Ho',
      };
      const walletB = {
        addr: 'mvipu3Y1FCf8PqBCWNDEW9HrUU8q5MmX7n',
        publickey: '02ecd01fecbb8c25b110e1804594baff2ce2eeebb2b5ad870768cf40940ce48ecb',
        privateKey: 'cSmJZ79uMQQHAGa5s3m3AYosgV8qHVTNUQsH4wiVXYAcdSKz4td9',
      };

      async function sendBTC(fromAddress, toAddress, privateKey, publicKey, amount) {
        const network = Bitcoin.networks.testnet;
        const keyPair = Bitcoin.ECPair.fromWIF(privateKey, network);
        console.log(keyPair.getAddress())

        // Fetch UTXOs
        try {
          const response = await axios.get(`https://api.blockcypher.com/v1/btc/test3/addrs/${fromAddress}/full`).then(console.log("call-1"));
          const utxos = response.data.txs.filter((utxo) => utxo.confirmations > 0 && utxo.vout_sz >= 2);
          // const utxos = response.data.txs;
          console.log(response.data.txs)
          const txb = new Bitcoin.TransactionBuilder(network);

          let totalAmount = 0;
          utxos.forEach((utxo) => {
            txb.addInput(utxo.hash, utxo.vout_sz ); 
            totalAmount += utxo.total;
          });

          const satoshiToSend = Math.floor(amount * 1e8);
          const fee = 50000; 
          if (totalAmount < satoshiToSend + fee) {
            throw new Error('Insufficient funds');
          }

          // txb.addOutput(toAddress, totalAmount);
          txb.addOutput(toAddress, satoshiToSend);
          txb.addOutput(fromAddress, totalAmount - satoshiToSend - fee);

          utxos.forEach((utxo, index) => {
            txb.sign(index, keyPair);
          });
          
          const rawTransaction = txb.build().toHex();
          try {
            const broadcastResponse = await axios.post('https://api.blockcypher.com/v1/btc/test3/txs/push', {
              tx: rawTransaction,
            }).then(console.log("call-2"));

            const transactionDetails = {
              id: this.transactionHistory.length + 1, 
              status: broadcastResponse.data.status,
              amount: `${amount} BTC`,
              fee: `${broadcastResponse.data.gasPrice} Satoshi`, 
            };
        
            this.addToTransactionHistory(transactionDetails);

            const transactionHash = broadcastResponse.data.hash;
            const blockExplorerLink = `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`
            this.addToBroadcasting(blockExplorerLink)
            console.log('Broadcast Response:', broadcastResponse.data);
            console.log('View Transaction on BlockCypher Explorer:', `https://api.blockcypher.com/v1/btc/test3/txs/${transactionHash}`).then(console.log("call-3"));

            console.log('Broadcast Response:', broadcastResponse.data);
          } catch (error) {
            if (error.response) {
              // The request was made, and the server responded with a status code
              console.error('Error Response Data:', error.response.data);
            } else if (error.request) {
              // The request was made but no response was received
              console.error('Error Request Data:', error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.error('Error Message:', error.message);
            }
          }
        } catch (error) {
          console.error('Error:', error.message);
        }
      }

      sendBTC(walletA.addr, walletB.addr, walletA.privateKey, walletA.publickey, transactionAmount);
    } catch (error) {
      console.error('Error sending Bitcoin transaction:', error.message);
    }
  };

  sendTransactionPolygon = async (toAddress, amount, onSuccess, onError) => {
    try {
      // const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/974a213860b54adf82f5cffff7fac289").then(console.log("call-sepolia-testnet"))
      const provider = new ethers.JsonRpcProvider("https://polygon-mumbai.infura.io/v3/974a213860b54adf82f5cffff7fac289")
      const wallet = new ethers.Wallet(this.WalletPrivateKey, provider);
      console.log(provider)
        const amountStr = String(amount)
        // Sign the transaction
      const signedTransaction = await wallet.sendTransaction({
        to: toAddress,
        value: parseUnits(amountStr, 'ether')
      }).then(console.log("send successfully"));

      const receipt = await signedTransaction.wait();
      console.log(receipt)

      const transactionDetails = {
        id: this.transactionHistory.length + 1, 
        status: receipt.status,
        amount: `${amount} MAT`,
        fee: `${receipt.gasPrice} Gwei`, 
      };
  
      this.addToTransactionHistory(transactionDetails);

      if (onSuccess && typeof onSuccess === 'function') {
        onSuccess(amount);
      }
      
      const blockExplorerLink = `https://mumbai.polygonscan.com/tx/${receipt.hash}`;
      this.addToBroadcasting(blockExplorerLink);
      // Open the link using Linking
      Linking.openURL(blockExplorerLink);

      return blockExplorerLink;
    } catch (error) {
      console.error('Error sending transaction:', error.message);
      if (onError && typeof onError === 'function') {
        onError(error.message);
      }
    }
  };


  verifyAddress(privateKey, network) {
    try {
      if (network === 'Bitcoin') {
        return [true,"Bitcoin"];
      } else if (network === 'Polygon') {
        return [true,"Polygon"];
      } else {
        console.error('Invalid network:', network);
        return false;
      }
    } catch (error) {
      console.error('Error verifying address:', error.message);
      return false;
    }
  }
}

const mobXStore = new WalletStore();
export default mobXStore;
