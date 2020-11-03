/**
*| Component        : Action
*| Author       	: tuannt
*| Created date 	: 2020-09-12
*| Description   	:
*/
/*============================================================================*/
//import library
import { LOGIN_REQUEST, CHECK_TOKEN } from './types';

export const login = (email, password) => ({
    type: LOGIN_REQUEST,
    payload: { email, password }
});

export const checkToken = (token) => ({
    type: CHECK_TOKEN,
    payload: { token }
});