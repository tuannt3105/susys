/**
*| Component        : 
*| Author       	: 
*| Created date 	: 
*| Description   	:
*/
/*============================================================================*/
//import library
import { combineReducers } from 'redux';
import auth from './authReducer';
import offtime from './offtimeReducer';

const Reducers = combineReducers({
    auth, offtime
});

export default Reducers
