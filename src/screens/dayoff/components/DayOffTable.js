import React, { Component }                     from 'react';
import { View, Text, TouchableOpacity, Alert }  from 'react-native';
import { Icon, DatePicker, Picker }             from 'native-base';
import { Table, TableWrapper, Row, Cell }       from 'react-native-table-component';
import Moment                                   from 'moment';

import { styleDayOffTable }                     from '../stylesheet/DayOffTable';
import { styleCommon }                          from '../../../app/stylesheet/Common';
// import validate
import { validatejs }                           from '../../../app/components/Validate';
import { ItemDateTime }                         from '../../../app/components/ItemDateTimeComponent';

export class DayOffTable extends Component {
    constructor(props) {
        super(props);

        this.state  = {
            tableHead: [['DATE']],
            tableData: [this.props.dateList],
            errorDate: this.props.errorDate,
        }
    }

    _addItem = () => {
        let dateNow = new Date();
        let tblTmp  = this.state.tableData;
        tblTmp.push(
            [dateNow]
        );
        this.setState({
            tableData: tblTmp
        });
        //change in parent item
        this.props.changeDateList(this.state.tableData);
    }

    _removeItemByIndex = (index) => {
        const that = this;
        Alert.alert(
        '',
        'Would you want to remove a item?',
        [
        {},
        {
            text    : 'Cancel',
            style   : 'cancel',
        },
        {
            text    : 'OK', 
            onPress : () => {
                let tblTmp = that.state.tableData;
                if(tblTmp.length == 1) {
                    this._addItem();
                }
                tblTmp.splice(index, 1);
                that.setState({
                    tableData: tblTmp
                });
                //change in parent item
                this.props.changeDateList(this.state.tableData);
            }
        }],
        {cancelable: false},
        );
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

    render() {
        const addButton = () => (
            <TouchableOpacity onPress={() => this._addItem()}>
                <View style={styleDayOffTable.actionIcon}>
                    <Icon active name='md-add' style={styleCommon.iconFont} />
                </View>
            </TouchableOpacity>
        );

        const removeButton = (index) => (
            <TouchableOpacity onPress={() => this._removeItemByIndex(index)}>
                <View style={styleDayOffTable.actionIcon}>
                    <Icon active name='md-remove' style={styleCommon.iconFont} />
                </View>
            </TouchableOpacity>
        );

        const changeDate = (index, cellIndex) => (
            <ItemDateTime
            textDateTime={this._renderTextDayOff(this.state.tableData[index][cellIndex], 'Day off')}
            mode='date'
            onDateTimeSelected={(date) => {
                let tblTmp  = this.state.tableData;
                tblTmp[index].splice(cellIndex, 1, date);
                this.setState({
                    tableData: tblTmp
                });
                //change date list in parent item
                this.props.changeDateList(this.state.tableData, this.state.errorDate);
            }}
            dateTime={this.state.tableData[index][cellIndex]}
            errorDate={this.state.errorDate}
            />
        );

        return (
        <View style={ styleDayOffTable.container }>
        <Table borderStyle={ styleDayOffTable.table } style={styleDayOffTable.table}> 
        {
            this.state.tableHead.map((rowData, index) => (
                <TableWrapper key={ index } style={styleDayOffTable.head}>
                    <Cell key='0' data={addButton()} textStyle={styleDayOffTable.text}/>
                    {
                        rowData.map((cellData, cellIndex) => (
                            <Cell key={ cellIndex + 1 } data={cellData} style={styleDayOffTable.cellDateTime} textStyle={styleDayOffTable.text}/>
                        ))
                    }
                    <Cell key={rowData.length + 1} data='' textStyle={styleDayOffTable.text}/>
              </TableWrapper>
              ))
        }
        {
            this.state.tableData.map((rowData, index) => (
                <TableWrapper key={ index } style={styleDayOffTable.wrapper}>
                    <Cell key='0' data={ index + 1 } textStyle={styleDayOffTable.text}/>
                    {
                        rowData.map((cellData, cellIndex) => (
                            <Cell key={ cellIndex + 1 } data={changeDate(index, cellIndex)} style={styleDayOffTable.cellDateTime} textStyle={styleDayOffTable.text}/>
                        ))
                    }
                    <Cell key={rowData.length + 1} data={removeButton(index)} textStyle={styleDayOffTable.text}/>
              </TableWrapper>
            ))
        }
        </Table>
        </View>
        )
    }
};