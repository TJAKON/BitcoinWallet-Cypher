// import './shim'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStackNavigator from './src/navigation/StackNavigator';
// import { Buffer } from 'buffer';
// import  Buffer  from 'react-native-buffer';
// const Buffer = require('buffer/').Buffer
// global.Buffer = Buffer;

// if (typeof global.crypto === 'undefined') {
//   console.error('Crypto is not available. Check the order of imports.');
// }

const App = () => {
  return (
    <NavigationContainer>
      <MainStackNavigator />
    </NavigationContainer>
  );
};

export default App;



