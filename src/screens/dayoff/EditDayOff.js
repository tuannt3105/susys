/**
*| Component        : Day off
*| Author       	: ANS804 - daonx@ans-asia.com
*| Modify           : ANS806 - trieunb@ans-asia.com
*| Created date 	: 2018-08-09
*| Update date 		: 2018-09-06
*| Description   	: Edit Day off
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
import DateTimePicker           from 'react-native-modal-datetime-picker';
//import api
import { getInfoApi }           from '../../app/api/common';
import { listUserApi }          from '../../app/api/common';
import { listLibraryCodeApi }   from '../../app/api/common';
import { getDayOffApi }         from '../../app/api/offtime';
import { saveDayOffApi }        from '../../app/api/offtime';
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
    validateDateFromTo
}   from '../../app/components/Validate';
// import styles DrawerNavigator

const SCREEN_NAME = "Day off";

class EditDayOff extends Component {
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
        title: "Edit Day Off",
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
            user_id         : '',
            name            : '',
            hours           : 0,
            listDayOffType  : [],
            listHaftDayOff  : [{number:'-1',name:''},{number:'0',name:'Sáng'},{number:'1',name:'Chiều'}],
            dayOffType      : 0,
            haftDayOff      : -1,
            approver_id     : [],
            dateFrom        : new Date(),
            dateTo          : new Date(),
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
    };
    componentWillMount() {
        this.getData();
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

    // render text for item Flextime Type
    _renderTextDateOffType = () => {
        var text = '';
        text = 'DayOff Type';
        return text;
    };

    // render text for item Approver
    _renderTextApprover = () => {
        var text = '';
        text = 'Approver';
        return text;
    };

    // render text for item Date From, Date To
    _renderTextDayOff = (time, isFrom) => {
        var text = '';

        if (time == '') {
            if (isFrom) {
                text = 'Date From';
            } else {
                text = 'Date To';
            }
        } else {
            text = Moment(time).format('YYYY/MM/DD');
        }

        return text;
    };

    // render text for item Reason
    _renderTextReason = () => {
        var text = '';

        // reason is not exist then display text
        text = 'Reason';

        return text;
    };

    // render text for item Note
    _renderTextNote = () => {
        var text = '';
        text = 'Note';

        return text;
    };
    // get data
    getData = async () => {
        await this.setState({
            isLoading       :   true,
            dateHorizontal  :   setDateHorizontal(DEVICE_WIDTH),
            userInfo        :   this.props.userInfo,
            branch          :   this.props.branch,
            listType        :   this.props.flexTimeType,
            listUser        :   this.props.userList,
            dayoff_id       :   this.props.navigation.getParam('dayoff_id'),
            approver_id     :   this.props.approveList,
            listDayOffType  :   this.props.dayOffType
        });
        // refer day off
        await this.referDayOff();
    }
    // refer day off
    referDayOff = async () => {
        let data = {
            dayoff_id     :   this.state.dayoff_id,
            branch_id     :   this.state.branch.branch_id,
        }
        let response = await getDayOffApi(data);
        await this.setState({
            isLoading           :   false,
            user_id             :   response.data.dayoff[0].user_id,
            name                :   response.data.dayoff[0].full_name,
            // approver_id         :   response.data.approveruser,
            // approvalstatus      :   response.data.approvalstatus[0],
            dayOffType          :   response.data.dayoff[0].dayoff_type,
            haftDayOff 			: 	response.data.dayoff[0]. halfdayoff_div,
            dateFrom            :   new Date(response.data.dayoff[0].offdateFrom),
            dateTo              :   new Date(response.data.dayoff[0].offdateto),
            reason              :   response.data.dayoff[0].reason,
            note                :   response.data.dayoff[0].note,
        });
    }
    updateDayOff = async () => {
        let data = await this.getDataRequest();
        let check       =   await this.checkData(data);
        if (check) {
            Alert.alert(
                'Confirm',
                'Do you want to update day off',
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
        let isValidate = true;
        this.setState({
            errorApproverid     : validatejs('required', data.approver_id),
            errorDayOffType     : validatejs('required', data.dayOffType),
            errorHaftDayOff     : validatejs('required', data.haftDayOff),
            errorReason         : validatejs('required', data.reason),
            errorNote           : validatejs('required', data.note),
            isValidateDateTime  : true,
            errorDate           : validatejs('required', data.dateFrom),
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
        let data = {
            requesterId     : this.props.navigation.getParam('dayoff_id'),
            hours           : this.state.hours,
            dayOffId        : this.props.navigation.getParam('dayoff_id'),
            dayOffType      : this.state.dayOffType,
            haftDayOff      : this.state.haftDayOff,
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
    render() {
        //setState render
        const { listUser, userInfo, listDayOffType }    =   this.state;
        let buttonUpdate = null;
        let formDate =<View style={styleCommon.line}>
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
												haftDayOff: selectedItems[0],
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
					</View>
					if(this.state.dayOffType[0]!=4&&this.state.dayOffType[0]!=6){
						formDate = <ItemDateTimeFromTo
							textDateTimeFrom={this._renderTextDayOff(this.state.dateFrom, 'Date From')}
							textDateTimeTo={this._renderTextDayOff(this.state.dateTo, 'Date To')}
							mode='date'
							onDateTimeFromSelected={(dateTo) => this.setState({
																dateFrom: dateTo,
																isValidateDateTime: true })}
							onDateTimeToSelected={(dateTo) => this.setState({
																dateTo: dateTo,
																isValidateDateTime: true })}
							dateTimeFrom={this.state.dateFrom}
							dateTimeTo={this.state.dateTo}
							dateHorizontal={this.state.dateHorizontal}
							validate={this.state.isValidateDateTime}
							valDateFromTo={this.checkDateFromTo}
						/>
					}
				 //button update
				if (this.state.userInfo.user_auth > 0 || this.state.requester_id == this.state.userInfo.user_id ) {
					buttonUpdate = <Button full primary style={[styleCommon.itemButton, styleCommon.itemButtonColorMain]} onPress={() => this.updateFlexTime()}>
									   <Text style={styleCommon.itemButtonMain}>UPDATE</Text>
								   </Button>
				}
        return (
            <Container>
                <Content>
                    <Form>
                        <View style={styleCommon.vWrap}>
                            {/* Requester */}
                            <View style={[styleCommon.vItem, styleCommon.border, styleCommon.disabled]}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='person' style={styleCommon.iconFont}/>
                                </View>
                                <Text>{this.state.user_id + ' : ' + this.state.name}</Text>
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
                            <View style={[styleCommon.vItem, styleCommon.border]}>
                                <View style={styleCommon.vIcon}>
                                    <Icon active name='people' style={styleCommon.iconFont}/>
                                </View>
                                <View style={itemSelect.vSelect}>
                                    <SectionedMultiSelect
                                        items={listUser}
                                        uniqueKey='user_id'
                                        displayKey='user_display'
                                        selectText={this._renderTextApprover()}
                                        confirmText='Select'
                                        searchPlaceholderText='Search Approver'
                                        showCancelButton={true}
                                        showChips={false}
                                        colors={colorsSelect}
                                        styles={{ selectToggle: itemSelect.selectToggle }}
                                        onSelectedItemsChange={(selectedItems) => {
                                            this.setState({ approver_id: selectedItems });
                                        }}
                                        selectedItems={this.state.approver_id}
                                    />
                                </View>
                            </View>

                            {/* Date off type */}
                            <View style={[styleCommon.vItem, styleCommon.border]}>
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
                                        selectText={this._renderTextDateOffType()}
                                        confirmText='Select'
                                        searchPlaceholderText='Date off type'
                                        showCancelButton={true}
                                        colors={colorsSelect}
                                        styles={{ selectToggle: itemSelect.selectToggle }}
                                        onSelectedItemsChange={(selectedItems) => {
                                            this.setState({ dayOffType: selectedItems });
                                        }}
                                        selectedItems={this.state.dayOffType}
                                    />
                                </View>
                            </View>

                            {/* Date From To */}
                            {formDate}

                            {/* Reason */}
                            <View style={styleCommon.vItem}>
                                <View style={styleCommon.vTextArea}>
                                    <Textarea
                                        style={[styleCommon.border, styleCommon.font]}
                                        rowSpan={3}
                                        placeholder={this._renderTextReason()}
                                        onChangeText={(text) => this.setState({ reason: text })}
                                        placeholderTextColor={COLOR_TEXT} 
                                        value={this.state.reason}/>
                                </View>
                            </View>

                            {/* Note */}
                            <View style={styleCommon.vItem}>
                                <View style={styleCommon.vTextArea}>
                                    <Textarea
                                        style={[styleCommon.border, styleCommon.font]}
                                        rowSpan={3}
                                        placeholder={this._renderTextNote()}
                                        onChangeText={(text) => this.setState({ note: text })}
                                        placeholderTextColor={COLOR_TEXT}
                                        value={this.state.note}/>
                                </View>
                            </View>

                            <View  style={styleCommon.vItemButton}>
								{buttonUpdate}
								<Button full primary style={[styleCommon.itemButton, styleCommon.itemButtonColorNotMain]} onPress={() => this.props.navigation.navigate('Offtime')}>
									<Text style={styleCommon.itemButtonNotMain}>BACK</Text>
								</Button>
							</View>
                        </View>
                    </Form>
                </Content>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditDayOff);
/*============================================================================*/