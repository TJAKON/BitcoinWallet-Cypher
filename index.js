import { AppRegistry } from 'react-native';
import App from './App'; // Adjust the path based on your project structure
import { name as appName } from './app.json';

// Register the main component
AppRegistry.registerComponent(appName, () => App);

// Run the app
AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('app-root') || document.getElementById('root'), // Adjust the root tag as needed
});
