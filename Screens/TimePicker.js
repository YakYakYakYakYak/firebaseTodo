import { Text, View, Button, Platform} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'

export default function TimePickerApp({setScheduledNotificationDate}) {
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [text, setText] = useState('Empty');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);

        let tempDate = new Date(currentDate);
        console.log('Day = ' + tempDate.getDay());
        //https://docs.expo.dev/versions/latest/sdk/notifications/#getnotificationchannelgroupsasync-promisenotificationchannelgroup
        //Note: Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday.
        console.log(parseInt(tempDate.getDay() + 1)); //convert to int, to add 1 as Expo notifications date range starts from Sunday(1) - Saturday(7) while getDay starts from 0-6.
        let fTime = 'Hours' + tempDate.getHours() + ' | Minutes: ' + tempDate.getMinutes();
        
        let scheduledNotification = tempDate.getHours() + '/' + tempDate.getMinutes();
        
        setText(fTime)
        
        console.log(fTime)
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
            <Button title='TimePicker' onPress={() => showMode('time')}/>
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
