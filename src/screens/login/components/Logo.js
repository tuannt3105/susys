import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';

import logoImg from '../../../images/dananghospital.png';
import styles from '../stylesheet/Logo';

export default class Logo extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Image source={logoImg} style={styles.image} />
                <Text style={styles.text}>KHOA NGOẠI BỎNG - TẠO HÌNH</Text>
            </View>
        );
    }
}
