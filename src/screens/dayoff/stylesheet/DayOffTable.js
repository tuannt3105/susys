import { StyleSheet, Dimensions } from 'react-native';

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
export const styleDayOffTable = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 16, 
        paddingTop: 30, 
        backgroundColor: '#FFFFFF' 
    },
    tableBorder: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#BDC3C7',
    },
    table: {
        borderRadius: 5
    },
    head: {
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#F1F8FF'
    },
    wrapper: {
        flexDirection: 'row'
    },
    title: {
        flex: 1,
        backgroundColor: '#F6F8FA'
    },
    row: { 
        height: 28
    },
    text: { 
        textAlign: 'center' 
    },
    cellNo: {
        width: 50,
    },
    cellAction: {
        width: 50,
    },
    cellDateTime: {
        width: 200,
        paddingBottom: 10
    },
    actionIcon: {
        alignItems: 'center'
    }
});