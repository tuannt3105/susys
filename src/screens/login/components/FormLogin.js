/**
*| Component        :   User
*| Author       	:   tuannt
*| Created date 	:   2020-09-12
*| Description   	:
*/
/*============================================================================*/
//import library
import React, { Component } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, Image, KeyboardAvoidingView,
    Animated,
    Easing,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';
import {
    createDrawerNavigator, StackNavigator,
    createStackNavigator, DrawerItems, SafeAreaView
} from 'react-navigation'
/*============================================================================*/
//import redux action
import { login } from '../../../app/actions/authAction'
import styles from '../stylesheet/FormLogin';

import { LoginInput } from '../../../app/components/Common';
import Logo from './Logo';

import usernameImg from '../../../images/username.png';
import passwordImg from '../../../images/password.png';
import eyeImg from '../../../images/eye_black.png';
import spinner from '../../../images/loader.gif';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;
/*============================================================================*/
//export class FormLogin
class FormLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showPass: true,
            press: false,
            isLoading: false,
            email: '',
            password: '',
        };

        this.showPass = this.showPass.bind(this);
        this.buttonAnimated = new Animated.Value(0);
        this.growAnimated = new Animated.Value(0);
        this._onPress = this._onPress.bind(this);
    }
    showPass() {
        this.state.press === false
            ? this.setState({ showPass: false, press: true })
            : this.setState({ showPass: true, press: false });
    }
    _onPress() {
        if (this.state.isLoading) return;

        this.setState({ isLoading: true });
        Animated.timing(this.buttonAnimated, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();

        setTimeout(() => {
            this._onGrow();
        }, 2000);

        setTimeout(() => {
            this.props.navigation.navigate('Home')
            this.setState({ isLoading: false });
            this.buttonAnimated.setValue(0);
            this.growAnimated.setValue(0);
        }, 2300);
    }
    _onGrow() {
        Animated.timing(this.growAnimated, {
            toValue: 1,
            duration: 200,
            easing: Easing.linear,
        }).start();
    }
    componentWillReceiveProps = (nextProps) => {
        this.props.chilldmethod(false);
        if (nextProps.dataLogin.status && nextProps.dataLogin.token != '') {
            AsyncStorage.setItem('token', nextProps.dataLogin.token);
            nextProps.navigation.navigate('DrawerNavigator');
        } else {
            Alert.alert(
                'Error!',
                'User Name or Password invalid!'+nextProps.dataLogin.status,
            )
        }
    }
    userLogin = async() => {
        if (this.state.email === '' || this.state.password === '') {
            Alert.alert(
                'Error!',
                'User name and Password required!',
            )
        } else {
            await this.props.chilldmethod(true);
            await this.props.doLogin(this.state.email, this.state.password);
        }
    }
    render() {
        const changeWidth = this.buttonAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [DEVICE_WIDTH - MARGIN, MARGIN],
        });
        const changeScale = this.growAnimated.interpolate({
            inputRange: [0, 1],
            outputRange: [1, MARGIN],
        });
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
                <View style={styles.logoContainer}>
                    <Logo />
                </View>
                <View style={styles.formContainer}>
                    <View style={styles.userContainer}>
                        <LoginInput
                            source={usernameImg}
                            placeholder="Username"
                            autoCapitalize={'none'}
                            returnKeyType={'next'}
                            autoCorrect={false}
                            onChangeText={(text) => this.setState({ email: text })}
                            onSubmitEditing={() => this.password.focus()}
                        />
                    </View>
                    <View style={styles.passContainer}>
                        <LoginInput
                            source={passwordImg}
                            secureTextEntry={this.state.showPass}
                            placeholder="Password"
                            returnKeyType={'go'}
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            onChangeText={(text) => this.setState({ password: text })}
                            inputRef={(input) => this.password = input}
                        />
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={styles.btnEye}
                            onPress={this.showPass}>
                            <Image source={eyeImg} style={styles.iconEye} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.btnContainer}>
                        <Animated.View style={{ width: changeWidth }}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={this._onPress}
                                activeOpacity={1}>
                                <Text style={styles.text}>LOGIN</Text>
                            </TouchableOpacity>
                            <Animated.View
                                style={[styles.circle, { transform: [{ scale: changeScale }] }]}
                            />
                        </Animated.View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
}
/*============================================================================*/
const mapStateToProps = (state, ownProps) => {
    return {
        dataLogin   : state.auth.payload,
        userInfo    : state.auth.userInfo,
        userList    : state.auth.listUser
    };
}
const mapDispatchToProps = (dispatch) => {
    return {
        doLogin: (email, password) => { dispatch(login(email, password)) },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(FormLogin);
/*============================================================================*/
