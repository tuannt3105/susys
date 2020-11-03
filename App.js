/**
*| Component        : 
*| Author       	: 
*| Created date 	: 
*| Description   	:
*/
/*============================================================================*/
//import library
import React, { Component } from 'react';
// import DrawerNavigator from './src/common/drawerNavigator';
import MyApp          from './src/app/App';

import { Provider }   from 'react-redux';
import store          from './src/app/stores/store';

export default class App extends Component<Props>{
    render() {
        return(
          <Provider store={store}>
            <MyApp />
          </Provider>
        );
    }
}
