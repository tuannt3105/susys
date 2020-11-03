/**
*| Component        : DayOff
*| Author       	: ANS804 - daonx@ans-asia.com
*| Modify           : ANS806 - trieunb@ans-asia.com
*| Created date 	: 2018-08-09
*| Update date 		: 2018-09-06
*| Description   	: Insert DayOff
*/
/*============================================================================*/
//import library
import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Alert,
    Dimensions
}   from "react-native";
import {
    Container, 
    Content, 
    Form, 
    Icon,
    Item, 
    Picker,
    Input,
    DatePicker,
    Textarea,
    Button
}   from 'native-base';
import { connect }              from 'react-redux';
import Moment                   from 'moment';
import SectionedMultiSelect     from 'react-native-sectioned-multi-select';
import Spinner                  from 'react-native-loading-spinner-overlay';
//import api
import { getHoursApi }          from '../../app/api/offtime';
import { saveDayOffApi }         from '../../app/api/offtime';
//import component
import HeaderComponent          from '../../app/components/HeaderComponent';
import { ItemDateTime }         from '../../app/components/ItemDateTimeComponent';
import { ItemDateTimeFromTo }   from '../../app/components/ItemDateTimeFromTo';
import { setDateHorizontal }    from '../../app/components/Common';
//import styles common
import {
    DEVICE_WIDTH,
    COLOR_TEXT,
    colorsSelect,
    styleCommon,
    itemInput,
    itemSelect,
    form,
    COLOR_MAIN,
    styleMessageError,
}   from '../../app/stylesheet/Common';
// import validate
import { 
    validatejs, 
    validateDateFromTo,
    validateCompareOtherDate
}   from '../../app/components/Validate';
// import styles DrawerNavigator

//ANS848 - TriVH - 2019/04/05 add dayoff table component
import { DayOffTable }    from './components/DayOffTable';
//End: ANS848 - TriVH - 2019/04/05 add dayoff table component


const SCREEN_NAME = "DayOff";

class AddDayOff extends Component {
    static navigationOptions = ({ navigation }) => ({
        headerStyle: {
            backgroundColor: 'white',
            borderBottomWidth: 1,
            borderBottomColor: '#D4D4D4',
            elevation: 0,
        },
        headerLeft: <Icon name={'arrow-back'} onPress={() => { navigation.goBack() }} style={{ color: COLOR_MAIN }} />,
        headerLeftContainerStyle: {
            paddingLeft: 10,
        },
        title: "Add DayOff",
        headerTitleStyle: {
            color: COLOR_MAIN,
            fontSize: 19,
            fontWeight: 'normal',
            fontFamily: 'Roboto_medium',
            alignItems: 'center',
            justifyContent: 'center',
        },             
        headerTitleContainerStyle: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerRight: <Icon/>,
    });
    // constructor
    constructor(props) {
        super(props);
        this.state = {
            isLoading       : false,
            requesterId     : [],
            hours           : 0,
            listDayOffType  : [],
            listHaftDayOff  : [{number:'0',name:'Sáng'},{number:'1',name:'Chiều'}],
            dayOffType      : [],
            haftDayOff      : [],
            approver_id     : [],
            dateFrom        : new Date(),
            dateTo          : new Date(),
            dateList        : [new Date()],
            reason          : '',
            note            : '',
            listUser        : [],
            dateHorizontal  : 'row',
            errorRequesterId: '',
            errorDayOffType: '',
            errorHaftDayOff: '',
            errorApproverid: '',
            errorReason: '',
            errorNote: '',
            errorDate: '',
            isValidateDateTime: false,
        };
        this._changeDateList = this._changeDateList.bind(this); // binding method for child table list
    };
    componentWillMount() {
        this.getData();     
        // add event
        Dimensions.addEventListener('change', () => {
            let deviceWidth = Dimensions.get('window').width;        
            this.setState({
                dateHorizontal: setDateHorizontal(deviceWidth)
            });
        });
    }
    // get data
    getData = async () => {
        await this.setState({
            isLoading       :   true,
            dateHorizontal  : setDateHorizontal(DEVICE_WIDTH),
            listUser        : this.props.userList,
            userInfo        : this.props.userInfo,
            requesterId     : [this.props.userInfo.user_id],
            approver_id     : this.props.approveList,
            listDayOffType  : this.props.dayOffType
        });
        // get hours off day
        await this.getHours();
    }
    // refer flextime
    getHours = async () => {
        let data = {
            year            :   (new Date()).getFullYear(),
            requesterId     :   this.state.requesterId[0],
            target_id       :   0,
            branch_id       :   this.props.branch.branch_id,
        }
        let response = await getHoursApi(data);
        await this.setState({
            isLoading           :   false,
            hours               :   response.data.hours,
            approver_id         :   response.data.approverlist,
        });
    }
    // render text for item Requester
    _renderTextRequester = () => {
        var text = '';

        if (this.state.requesterId[0]) {
            text = this.state.requesterId[0].user_name;
        } else {
            text = 'Requester';
        }

        return text;
    }

    _renderTextDayOff = (time, value) => {
        var text = '';

        if (time == '') {
            text = value;
        } else {
            text = Moment(time).format('YYYY/MM/DD');
        }

        return text;
    };

    addDayOff = async () => {
        let data    =   await this.getDataRequest();
        let check   =   await this.checkData(data);
        if (check) {
            Alert.alert(
              'Confirm',
              'Do you want to Insert DayOff',
              [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'OK', onPress: () => this.saveData(data)},
              ],
              { cancelable: false }
            )
        }
    }
    saveData = async(data) => {
        await this.setState({isLoading : true});
        let response    =   await saveDayOffApi(data);
        if (response.data.status) {
            Alert.alert(
              'Success',
              'DayOff have been saved successfully',
              [
                {text: 'OK', onPress: () => this.props.navigation.navigate('Offtime')},
              ],
              { cancelable: false }
            )
        }else {
            if (response.data.message == '112'){
                Alert.alert('Error','The off day has register been exits!');
            }else{
                Alert.alert('Error','Save Failed!');
            }
        }
        await this.setState({isLoading : false});
    }
    checkData(data) {
        //Trieunb - Update code - 2018/09/10
        let isValidate = true;
        let errorDate = undefined;
        if (data.dayOffType == 4 || data.dayOffType == 6 || data.dayOffType == 2) {
            errorDate = validatejs('required', data.dateFrom);
        } else {
            errorDate = this.checkCompareOtherDate();
        }
        this.setState({
            errorApproverid     : validatejs('required', data.approver_id),
            errorDayOffType     : validatejs('required', data.dayOffType),
            errorHaftDayOff     : validatejs('required', data.haftDayOff),
            errorReason         : validatejs('required', data.reason),
            errorNote           : validatejs('required', data.note),
            isValidateDateTime  : true,
            errorDate           : errorDate,
        });
        if (typeof this.state.errorDayOffType !== 'undefined') {
            isValidate  =    false;
        }
        if ((data.dayOffType==4||data.dayOffType==6) && data.haftDayOff == -1) {
            this.setState({
                errorHaftDayOff       :   'Required',
            });
            isValidate  =    false;
        }
        if (typeof this.state.errorApproverid !== 'undefined') {
            isValidate  =    false;
        }
        if (!this.checkDateFromTo(this.state.dateFrom, this.state.dateTo, 'date').status) {
            isValidate  =    false;
        }
        if (typeof this.state.errorDate !== 'undefined') {
            isValidate  =    false;
        }
        if (typeof this.state.errorReason !== 'undefined') {
            isValidate  =    false;
        }
        if (typeof this.state.errorNote !== 'undefined') {
            isValidate  =    false;
        }
        return isValidate;
    }
    getDataRequest = () => {
        let dateFrom    = !!this.state.dateFrom ? Moment(this.state.dateFrom).format('YYYY-MM-DD') : '';
        let dateTo      = !!this.state.dateTo ? Moment(this.state.dateTo).format('YYYY-MM-DD') : '';
        // if(this.state.dayOffType[0]==4||this.state.dayOffType[0]==6){
        //     dateTo = dateFrom;
        // }

        // ANS848 - TriVH - 2019/04/11 check list date
        if(this.state.dayOffType[0] != '4' && this.state.dayOffType[0] != '6' && this.state.dayOffType[0] != '2'){
            dateFrom = [];
            dateTo = [];
            if(this.state.dateList && this.state.dateList.length > 0) {
                this.state.dateList.forEach(function(date) {
                    let tmpDate = date[0] ? Moment(date[0]).format('YYYY-MM-DD') : '';
                    dateFrom.push(tmpDate);
                });
            }
        }
        // END: ANS848 - TriVH - 2019/04/11 check list date
        let data = {
            requesterId     : this.state.requesterId[0],
            hours           : this.state.hours,
            dayOffId        : 0,
            dayOffType      : this.state.dayOffType[0],
            haftDayOff      : (this.state.haftDayOff[0] == 0 || this.state.haftDayOff[0] == 1) ? this.state.haftDayOff[0] : -1,
            reason          : this.state.reason,
            note            : this.state.note,
            approver_id     : this.state.approver_id,
            dateFrom        : dateFrom,
            dateTo          : dateTo,
            row             : 0,
            user_id         : this.state.userInfo.user_id,
            branch_id       : this.props.branch.branch_id,
        }
        return data;
    }

    checkDateFromTo = (from, to, mode) => {
        return validateDateFromTo(from, to, mode);
    }

    _changeDateList = (dateList, errorDate) => {
        this.setState({
            dateList: dateList,
            errorDate: errorDate
        });
    }

    checkCompareOtherDate = (date) => {
        return validateCompareOtherDate(this.state.dateList);
    }

    render() {
        //setState render
        const { listUser, userInfo, listDayOffType, isLoading }    =   this.state;
        let formDate =  <View style={styleCommon.line}>
                            <View style={styleCommon.w100p}>
                                <DayOffTable {... this.state} changeDateList={this._changeDateList}/>
                            </View>
                        </View>;
                    if(this.state.dayOffType[0] == '4' || this.state.dayOffType[0] == '6'){
                        formDate =<View style={styleCommon.line}>
                                    <View style={styleCommon.w50p}>
                                        <ItemDateTime
                                            textDateTime={this._renderTextDayOff(this.state.dateFrom, 'Day off')}
                                            mode='date'
                                            onDateTimeSelected={(date) => {
                                                this.setState({
                                                    dateFrom: date,
                                                    dateTo: date,
                                                    errorDate: validatejs('checkDateCompareCurrentDate', Moment(date).format('YYYY-MM-DD'))
                                                });
                                            }}
                                            dateTime={this.state.dateFrom}
                                            errorDate={this.state.errorDate}
                                        />
                                    </View>
                                    <View style={styleCommon.w50p}>
                                        <View style={[styleCommon.vItem, styleCommon.border, !!this.state.errorHaftDayOff ? styleMessageError.errorBorder : '']}>
                                            <View style={styleCommon.vIcon}>
                                                <Icon active name='keypad' style={styleCommon.iconFont} />
                                                {/* selectToggleTextColor: */}
                                            </View>
                                            <View style={itemSelect.vSelect}>
                                                <SectionedMultiSelect
                                                    items={this.state.listHaftDayOff}
                                                    single={true}
                                                    hideSearch={true}
                                                    uniqueKey='number'
                                                    displayKey='name'
                                                    selectText='Half day off'
                                                    confirmText='Select'
                                                    showCancelButton={true}
                                                    colors={colorsSelect}
                                                    styles={{ selectToggle: itemSelect.selectToggle }}
                                                    onSelectedItemsChange={(selectedItems) => {
                                                        this.setState({ 
                                                            haftDayOff: selectedItems, 
                                                            errorHaftDayOff: validatejs('required', selectedItems)
                                                        });
                                                    }}
                                                    selectedItems={this.state.haftDayOff}
                                                />
                                            </View>
                                        </View>
                                        <View style={!!this.state.errorHaftDayOff ? styleMessageError.viewError : styleMessageError.viewNone}>
                                            <Text style={styleMessageError.errorColorText}>{this.state.errorHaftDayOff}</Text>
                                        </View>
                                    </View>
                                </View>;
                    }
                    if(this.state.dayOffType[0] == '2') {
                        formDate = <ItemDateTimeFromTo
                            textDateTimeFrom={this._renderTextDayOff(this.state.dateFrom, 'Date From')}
                            textDateTimeTo={this._renderTextDayOff(this.state.dateTo, 'Date To')}
                            mode='date'
                            onDateTimeFromSelected={(time) => this.setState({
                                                                dateFrom: time,
                                                                isValidateDateTime: true })}
                            onDateTimeToSelected={(time) => this.setState({ 
                                                                dateTo: time, 
                                                                isValidateDateTime: true })}
                            dateFrom={this.state.dateFrom}
                            dateTo={this.state.dateTo}
                            dateHorizontal={this.state.dateHorizontal}
                            validate={this.state.isValidateDateTime}
                            valDateFromTo={this.checkDateFromTo}
                        />;
                    }
        return (
            <Container>
                <Content>
                    <Form>
                        <View style={styleCommon.vWrap}>
                            {/* Requester */}
                            <View style={[styleCommon.vItem, styleCommon.border]}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='person' style={styleCommon.iconFont}/>
                                </View>
                                <View style={itemSelect.vSelect}>
                                    <SectionedMultiSelect
                                        items={listUser}
                                        single={true}
                                        uniqueKey='user_id'
                                        displayKey='user_display'
                                        selectText={userInfo.user_id + ' : ' + userInfo.full_name}
                                        confirmText='Select'
                                        searchPlaceholderText='Search Requester'
                                        showCancelButton={true}
                                        colors={colorsSelect}
                                        styles={{ selectToggle: itemSelect.selectToggle }}
                                        onSelectedItemsChange={async(selectedItems) => {
                                            await this.setState({ 
                                                requesterId     : selectedItems,
                                                errorRequesterId: validatejs('required', selectedItems)
                                            });
                                            await this.getHours();
                                        }}
                                        selectedItems={this.state.requesterId}
                                    />
                                </View>
                            </View>

                            {/* Remaining hours */}
                            <View style={[styleCommon.vItem, styleCommon.border,styleCommon.disabled]}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='md-alarm' style={styleCommon.iconFont}/>
                                </View>
                                <View style={itemSelect.vSelect}>
                                    <Text>{this.state.hours}h</Text>
                                </View>
                            </View>

                            {/* Approver */}
                            <View style={[styleCommon.vItem, styleCommon.border, !!this.state.errorApproverid ? styleMessageError.errorBorder : '']}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='people' style={styleCommon.iconFont}/>
                                </View>
                                <View style={itemSelect.vSelect}>
                                    <SectionedMultiSelect
                                        items={listUser}
                                        uniqueKey='user_id'
                                        displayKey='user_display'
                                        selectText='Approver'
                                        confirmText='Select'
                                        searchPlaceholderText='Search Approver'
                                        showCancelButton={true}
                                        showChips={false}
                                        colors={colorsSelect}
                                        styles={{ selectToggle: itemSelect.selectToggle }}
                                        onSelectedItemsChange={(selectedItems) => {
                                            this.setState({ 
                                                approver_id: selectedItems,
                                                errorApproverid: validatejs('required', selectedItems) 
                                            });
                                        }}
                                        selectedItems={this.state.approver_id}
                                    />
                                </View>
                            </View>
                            <View style={!!this.state.errorApproverid ? styleMessageError.viewError : styleMessageError.viewNone}>
                                <Text style={styleMessageError.errorColorText}>{this.state.errorApproverid}</Text>
                            </View>
                            {/* Date off type */}
                            <View style={[styleCommon.vItem, styleCommon.border, !!this.state.errorDayOffType ? styleMessageError.errorBorder : '']}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='keypad' style={styleCommon.iconFont} />
                                    {/* selectToggleTextColor: */}
                                </View>
                                <View style={itemSelect.vSelect}>
                                    <SectionedMultiSelect
                                        items={listDayOffType}
                                        single={true}
                                        hideSearch={true}
                                        uniqueKey='number'
                                        displayKey='name'
                                        selectText='Day off type'
                                        confirmText='Select'
                                        showCancelButton={true}
                                        colors={colorsSelect}
                                        styles={{ selectToggle: itemSelect.selectToggle }}
                                        onSelectedItemsChange={async(selectedItems) => {
                                            await this.setState({ 
                                                dayOffType: selectedItems, 
                                                errorDayOffType: validatejs('required', selectedItems)
                                            });
                                        }}
                                        selectedItems={this.state.dayOffType}
                                    />
                                </View>
                            </View>
                            <View style={!!this.state.errorDayOffType ? styleMessageError.viewError : styleMessageError.viewNone}>
                                <Text style={styleMessageError.errorColorText}>{this.state.errorDayOffType}</Text>
                            </View>
                            {/* Date From To */}
                            {formDate}

                            {/* Reason */}
                            <View style={styleCommon.vItem}>
                                <View style={styleCommon.vTextArea}>
                                    <Textarea
                                        style={[styleCommon.border, styleCommon.font, !!this.state.errorReason ? styleMessageError.errorBorder : '']}
                                        rowSpan={3}
                                        placeholder='Reason'
                                        onChangeText={(text) => this.setState({ reason: text })}
                                        placeholderTextColor={COLOR_TEXT} 
                                        onBlur={() => {
                                            this.setState({
                                                errorReason: validatejs('required', this.state.reason)
                                            });
                                        }}
                                        />
                                        <Text style={styleMessageError.errorColorText}>{this.state.errorReason}</Text>
                                </View>
                            </View>

                            {/* Note */}
                            <View style={styleCommon.vItem}>
                                <View style={styleCommon.vTextArea}>
                                    <Textarea
                                        style={[styleCommon.border, styleCommon.font, !!this.state.errorNote ? styleMessageError.errorBorder : '']}
                                        rowSpan={3}
                                        placeholder='Backup công việc:'
                                        onChangeText={(text) => this.setState({ note: text })}
                                        placeholderTextColor={COLOR_TEXT}
                                        onBlur={() => {
                                            this.setState({
                                                errorNote: validatejs('required', this.state.note)
                                            });
                                        }}
                                        />
                                        <Text style={styleMessageError.errorColorText}>{this.state.errorNote}</Text>
                                </View>
                            </View>

                            <View style={styleCommon.vItemButton}>
                                <Button full primary 
                                    style={[styleCommon.itemButton, styleCommon.itemButtonColorMain]}
                                    onPress={() =>  {this.addDayOff()}}        
                                >
                                    <Text style={styleCommon.itemButtonMain}>SAVE</Text>
                                </Button>
                            </View>
                        </View>
                    </Form>
                </Content>
                <View>
					<Spinner visible={isLoading} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
				</View>
            </Container>
        )
    }
}
// export default DayOff;
/*============================================================================*/
const mapStateToProps = (state) => {
	return {
		userInfo		:	state.auth.userInfo,
		userList		:	state.auth.listUser,
        approveList     :   state.auth.approveList,
        dayOffType      :   state.auth.dayOffType,
        branch          :   state.auth.branch
	};
}
const mapDispatchToProps = (dispatch) => {
	return {
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(AddDayOff);
/*============================================================================*/