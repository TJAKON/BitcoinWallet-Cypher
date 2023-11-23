
1) you need to change the node modules because of depericiated packages 

file name path = E:\Projects\CryptoNativeWallet\CryptoWalletApp\node_modules\react-native\index.js

  // Deprecated Prop Types
  get ColorPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').ColorPropType;
  },

  get EdgeInsetsPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').EdgeInsetsPropType;
  },

  get PointPropType(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').PointPropType;
  },

  get ViewPropTypes(): $FlowFixMe {
    return require('deprecated-react-native-prop-types').ViewPropTypes;
  },


2) also need to change the library essential imports like buffer to bypass the error related to buffer 

file path = E:\Projects\CryptoNativeWallet\CryptoWalletApp\node_modules\react-native-expo-bitcoinjs-lib\src\index.js

import { Buffer } from 'buffer';
global.Buffer = Buffer

