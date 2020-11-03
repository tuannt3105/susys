import { 
    LOGIN_REQUEST, 
    LOGIN_SUCCESS, 
    LOGIN_FAILURE, 
    CHECK_TOKEN, 
    USER_LIST, 
    APPROVE_LIST, 
    FLEXT_TIME_TYPE,
    DAYOFF_TYPE
}   from '../actions/types';
import { 
    put, 
    call, 
    take, 
    fork, 
    cancel, 
    takeLatest 
}   from 'redux-saga/effects';
import { 
    checkAccount, 
    getUser 
}   from '../api/auth';
import { 
    listUserApi, 
    listLibraryCodeApi 
}   from '../api/common';
import { getFlextimeApi }   from '../api/offtime';

export function* doLogin() {
    while (true) {
        try {
            let action = yield take(LOGIN_REQUEST);
            let checkLogin = yield checkAccount(action.payload);
            let response = checkLogin.data;
            /*let response = {};
            response.status = true;
            response.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFkbWluIiwicGFzc3dvcmQiOiJhZG1pbiIsImlhdCI6MTYwMzQ2MjQ5OSwiZXhwIjoxNjAzNTQ4ODk5fQ.h3AHmu73iClHic1n0L57cF26j5wBnjL2HzbNucdF2g4";
            response.user = {
                            "email": "admin",
                            "password": "admin"
                        };*/
            if (response.status) {
                //data payload
                let data = {
                    status  : response.status,
                    token   : response.token,
                    user    : response.user,
                };
                //set reducer user login
                yield put({ type: LOGIN_SUCCESS, payload: data });
            } else {
                yield put({ type: LOGIN_FAILURE, payload: {status  : 'aa'
                } });
            }
        } catch (error) {
            yield put({ type: LOGIN_FAILURE, payload: {status  : 'bb'} });
        }
    }
}
