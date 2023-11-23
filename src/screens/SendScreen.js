import React, { useState } from 'react';
import { ethers } from 'ethers';
import { View, Text, TextInput, Button, StyleSheet, Linking, Alert } from 'react-native';
import { Appbar, Card, Title, Paragraph, TextInput as PaperTextInput } from 'react-native-paper';
import mobXStore from './MobXStore';
import apiEndpoints from './apiEndpoints';
import { Picker } from '@react-native-picker/picker';
import { Buffer } from 'buffer';
global.Buffer = Buffer;


const SendScreen = () => {
  const [receiverAddress, setReceiverAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [blockExplorerLink, setblockExplorerLink] = useState('')
  const [selectedNetwork, setSelectedNetwork] = useState('Bitcoin'); // Default value
  const linktotransaction = mobXStore.broadcasting
  
  const handleNetworkChange = (value) => {
    setSelectedNetwork(value);
    // SendScreen.setSelectedNetwork(value)
    if (value === 'Bitcoin') {
      mobXStore.setApiEndpoint(apiEndpoints.bitcoinPrice);
    } 
    else if (value === 'Polygon') {
      mobXStore.setApiEndpoint(apiEndpoints.polygonPrice);
    }
  };

  // const network = "Polygon"

  // const handleSendTransaction = async () => {
  // const amountNumber = parseFloat(amount);
  // if (isNaN(amountNumber) || amountNumber <= 0) {
  //   Alert.alert('Invalid Amount', 'Please enter a valid amount.');
  //   return;
  // }

  // if (selectedNetwork === 'Bitcoin') {
  //   try {
  //     const onSuccess = () => {
  //       alert('Send bitcoin successfully!');
  //     };
    
  //     const onError = (error) => {
  //       console.error('Error sending ethers:', error);
  //       // alert('Error importing wallet:', error)
  //     };
  //     // Assuming sendTransaction method for Bitcoin is present in mobXStore
  //     // await mobXStore.sendTransactionBitcoin(receiverAddress, amountNumber);
  //     await mobXStore.sendTransactionBitcoin(receiverAddress,amountNumber,selectedNetwork, onSuccess, onError);
  //   } catch (error) {
  //     console.error('Error sending Bitcoin transaction:', error.message);
  //     Alert.alert('Transaction failed', error.message);
  //   }
  // } else if (selectedNetwork === 'Polygon') {
  //   try {
  //     const onSuccess = () => {
  //       alert('Send Matic successfully!');
  //     };
    
  //     const onError = (error) => {
  //       console.error('Error sending Matic:', error);
  //       // alert('Error importing wallet:', error)
  //     };
  //     // Assuming sendTransactionPolygon method for Polygon is present in mobXStore
  //     await mobXStore.sendTransactionPolygon(receiverAddress, amountNumber,selectedNetwork, onSuccess, onError);
  //       // setblockExplorerLink(blockExplorerLink)
  //       Alert.alert('Transaction sent successfully');
  //   } catch (error) {
  //     console.error('Error sending Polygon transaction:', error.message);
  //     Alert.alert('Transaction failed', error.message);
  //   }
  // }
  // };

  const handleSendTransaction = async () => {
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount.');
      return;
    }
  
    try {
      if (selectedNetwork === 'Bitcoin') {
        const onSuccess = () => {
          alert('Send bitcoin successfully!');
        };
  
        const onError = (error) => {
          console.error('Error sending bitcoins:', error);
          // alert('Error sending bitcoins:', error.message);
        };
  
        await mobXStore.sendTransactionBitcoin(receiverAddress, amountNumber, selectedNetwork, onSuccess, onError);
        setblockExplorerLink(blockExplorerLink)
      } else if (selectedNetwork === 'Polygon') {
        const onSuccess = (amount) => {
          alert(`${amount} Matic send successfully!`);
        };
  
        const onError = (error) => {
          console.error('Error sending Matic:', error);
          // alert('Error sending Matic:', error.message);
        };
  
        await mobXStore.sendTransactionPolygon(receiverAddress, amountNumber, selectedNetwork, onSuccess, onError);
        setblockExplorerLink(blockExplorerLink);
      }
  
      Alert.alert('Transaction sent successfully');
    } catch (error) {
      console.error('Error sending transaction:', error.message);
      Alert.alert('Transaction failed', error.message);
    }
  };
  
  

  const handleOpenLink = () => {
    Linking.openURL(linktotransaction);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.container}> */}
        {/* <Text style={styles.header}>Live Transaction Status</Text>
         <Card style={styles.card}>
          <Card.Content style={styles.pickerContainer}>
            <View key={txid} style={txid}>
              <Text style={styles.statusText}>Status: {status}</Text>
              <Text style={styles.amountText}>Amount: {sendingAmount}</Text>
              <Text style={styles.feeText}>GAS Fee: {Gasfee}</Text>
            </View>
          </Card.Content>
         </Card> */}
      {/* </View> */}
      <Text style={styles.header}>Send Digital Currencies</Text>

         <Card style={styles.card}>
          <Card.Content style={styles.pickerContainer}>
          <Text style={styles.label}>Select Network: </Text>
          <Picker
            selectedValue={selectedNetwork}
            onValueChange={(itemValue) => handleNetworkChange(itemValue)}
            style={{ height: 50, width: 150 }}
          >
            <Picker.Item label="Bitcoin" value="Bitcoin" />
            <Picker.Item label="Polygon" value="Polygon" />
          </Picker>
          </Card.Content>
        </Card>

      {/* Receiver address input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Receiver Address:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setReceiverAddress(text)}
          value={receiverAddress}
          placeholder="Enter receiver address"
        />
      </View>

      {/* Amount input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Amount (BTC/USDT):</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setAmount(text)}
          value={amount}
          placeholder="Enter amount"
          keyboardType="numeric"
        />
      </View>

      {/* Send button */}
      <Button title="Send" onPress={handleSendTransaction} />

      
      {/* Block Explorer link */}
      <Text 
        style={styles.blockExplorerLink}
        onPress={handleOpenLink}>
        Transaction Link on Block Explorer
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  input: {
    height: 40,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  blockExplorerLink: {
    marginTop: 20,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 10,
    marginHorizontal: 30,
  },
  card: {
    margin: 16,
    backgroundColor: '#ecf0f1',
  },
  cardTitle: {
    color: '#2c3e50',
  },
  cardText: {
    color: '#7f8c8d',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
});

export default SendScreen;
