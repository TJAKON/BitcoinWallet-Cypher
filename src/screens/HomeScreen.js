import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ImageBackground,TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { observer } from 'mobx-react';
import mobXStore from './MobXStore';
import apiEndpoints from './apiEndpoints';
import { Appbar, Card, Title, Paragraph, TextInput as PaperTextInput } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  const [selectedNetwork, setSelectedNetwork] = useState('Bitcoin');
  const [privateKey, setPrivateKey] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    mobXStore.fetchLivePrice();
  }, []);

  const navigateToSendScreen = () => {
    navigation.navigate('Send');
  };

  const navigateToHistoryScreen = () => {
    navigation.navigate('History');
  };

  const checkLivePrice = () => {
    mobXStore.fetchLivePrice();
  };
  
//   correct
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
  
  // correct
  const importWallet = async () => {
    const onSuccess = (walletAddress, RpcProvider) => {
      setWalletAddress(walletAddress);
      console.log({
        "wallet address": walletAddress,
        "privatekey": privateKey,
        "Netowrk Chosen": selectedNetwork,
        "provider": RpcProvider,
      });
      console.log('Wallet imported successfully!');
      alert('Wallet imported successfully!\nAddress: ' + walletAddress);
    };
  
    const onError = (error) => {
      // Handle errors appropriately, e.g., show an alert
      console.error('Error importing wallet:', error);
      alert('Error importing wallet: ' + error.message);
    };
  
    try {
      const isValidAddress = mobXStore.verifyAddress(privateKey, selectedNetwork);
  
      if (isValidAddress) {
        if (isValidAddress[1] === 'Bitcoin') {
          mobXStore.setWalletAddressBitcoin(privateKey, onSuccess, onError);
        } else if (isValidAddress[1] === "Polygon") {
          mobXStore.setWalletAddressPolygon(privateKey, onSuccess, onError);
        } else {
          console.error('Unsupported network:', isValidAddress[1]);
        }
      } else {
        console.error('Invalid wallet address for the selected network.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred.');
    }
  };
  
  
  
  

  return (
    <View style={styles.container}>
      <ImageBackground
        // source={require('./backgroundImage.jpg')}
        style={styles.backgroundContainer}
      >
        <Text style={styles.backgroundText}>Cypher Wallet</Text>
      </ImageBackground>

      <Appbar.Header>
        {/* <Appbar.Content style={styles.header} title="Wallet Information" /> */}
        <Text style={styles.header}>Wallet Information</Text>
      </Appbar.Header>
      
       {/* Live prices */}
       <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>Live Prices</Title>
          <Paragraph style={styles.cardText}>{`1 Bitcoin = ${mobXStore.livePriceBitcoin} USD`}</Paragraph>
          <Paragraph style={styles.cardText}>{`1 USTD = ${mobXStore.livePriceUsdt} USD`}</Paragraph>
          <Button style={styles.buttonContainer} title="Check Live Price" onPress={checkLivePrice} />
        </Card.Content>
      </Card>

      {/* Wallet address input */}
      <View style={styles.inputContainer}>
      <Text style={styles.label}>Wallet Private Key: </Text>
        <PaperTextInput
          style={styles.input}
          onChangeText={(text) => setPrivateKey(text)}
          // onChangeText={(text) => setWalletAddress(text)}
          value={privateKey}
          placeholder="Enter wallet Private key"
        />
        <Button style={styles.buttonContainer} title="Import Wallet" onPress={importWallet} />
        <Text>Wallet Address: {walletAddress}</Text>
      </View>

      {/* Network selection */}
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

     

      {/* Button to check and update live price */}
      <View style={styles.buttonContainer}>
        <Button title="Send Crypto" onPress={navigateToSendScreen} />
        <Button title="Transaction History" onPress={navigateToHistoryScreen} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'black',
    flex: 1,
    // justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 10,
    alignItems:"flex-end",
    color: '#3498db',
  },
  backgroundContainer: {
    flex: 1,
    maxHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundText: {
    color: 'black',
    fontSize: 32,
    fontWeight: 'bold',
  },
  inputContainer: {
    margin: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    color: 'black',
  },
  input: {
    height: 40,
    backgroundColor: 'white',
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
});



export default observer(HomeScreen);
