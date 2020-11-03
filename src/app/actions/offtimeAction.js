/**
*| Component        : 
*| Author       	: 
*| Created date 	: 
*| Description   	:
*/
/*============================================================================*/
//import library
import { OFFTIME_REQUEST } from './types';

export const offtimeSearch = (data) => ({
    type: OFFTIME_REQUEST,
    payload:  data
});
