import { Text, View, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function DateTimePickerApp({setScheduledNotificationDate}) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState('-');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        console.log('Day = ' + tempDate.getDay());
        //https://docs.expo.dev/versions/latest/sdk/notifications/#getnotificationchannelgroupsasync-promisenotificationchannelgroup
        //Note: Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday.
        console.log(parseInt(tempDate.getDay() + 1)); //convert to int, to add 1 as Expo notifications date range starts from Sunday(1) - Saturday(7) while getDay starts from 0-6.
        let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
        let fTime = 'Hours: ' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
        
        let scheduledNotification = tempDate.getFullYear() + '/' + (tempDate.getMonth()) + '/' + tempDate.getDate() + '/' + tempDate.getHours() + '/' + tempDate.getMinutes();
        
        setText(fDate + '\n' + fTime)
        
        console.log(fDate + '\n' + fTime)
        setScheduledNotificationDate(scheduledNotification)
    }

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style = {{fontWeight: 'bold', fontSize:20}}>{text}</Text>
        <View style={{margin:20}}>
            <TouchableOpacity style={styles.dateTimePickerBtnStyle} onPress={() => showMode('date')}>
                <Text style={styles.buttonText}>Select a Date</Text>
            </TouchableOpacity>
        </View>
        <View style={{margin:20}}>
            <TouchableOpacity style={styles.dateTimePickerBtnStyle} onPress={() => showMode('time')}>
                <Text style={styles.buttonText}>Select a Time</Text>
            </TouchableOpacity>
        </View>
        {show && (
            <DateTimePicker
            testID= 'dateTimePicker'
            value={date}
            mode={mode}
            is24Hour={true}
            display='default'
            onChange={onChange}
            />
        )}
      </View>
    );
  }

  const styles = StyleSheet.create({
    dateTimePickerBtnStyle: {
        height:50,
        borderRadius:5,
        backgroundColor:'#F29913',
        width:150,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText: {
        color:'white',
        fontSize:20
    },
})