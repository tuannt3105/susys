/**
*| Component        : 
*| Author       	: 
*| Created date 	: 
*| Description   	:
*/
/*============================================================================*/
//import library
import { AppRegistry, YellowBox } from 'react-native';
import App from './App';
//import component

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
//register app
AppRegistry.registerComponent('source', () => App);
