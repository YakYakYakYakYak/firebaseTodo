import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { firebase } from '../config';
import React, { useState, useEffect } from 'react'
import * as Alarm from './Alarm.js';
import DateTimePickerApp from './DateTimePicker.js';

// add a task
export default function AdHocTask() {
    const taskRef = firebase.firestore().collection('tasks');
    const [userInput, setUserInput] = useState('');

    //Set alarm to true/false
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const [alarmInitiated, setAlarmInitiated] = useState(false);
    
    //to send to DateTimePicker for user to pick schedule notification date.
    const [scheduledNotificationDate, setScheduledNotificationDate] = useState('42');

    const [user, setUser] = useState(' ');
    const [timeStamps, setTimeStamps] = useState(' ');
    const [identifier, setIdentifier] = useState(' ');
    const [scheduledDate, setScheduledDate] = useState(' ');

    const [YYMMDD, setYYMMDD] = useState(0);
    const [tempMonth, setTempMonth] = useState(0);

    useEffect(() => {
        var tempM = 0 //temp Month
        var tempD = 0 // temp Day
        console.log(scheduledNotificationDate)
        let arr = scheduledNotificationDate.split('/')//split scheduledNotificationDate to input to schedulePushNotification to set alarm
        tempM = parseInt(arr[1]) + 1
        setTempMonth(tempM)
        //add 0 infront if number < 10
        if(tempM < 10) {
            tempM = ('0' + tempM).slice(-2)
        }
        tempD = parseInt(arr[2])
        if(tempD < 10) {
            tempD = ('0' + tempD).slice(-2)
        }
        setYYMMDD((arr[0]+'-' + tempM + '-'+tempD))
    },[scheduledNotificationDate]);

    //when alarm identifier changes, send data to be stored on database.
    useEffect(() => {
        // if task has scheduled notification
        if(identifier != ' ' && isEnabled) {
            console.log(identifier+'test')
            const data = {
                heading: user,
                timeOfCreation: timeStamps,
                isCompleted: false,
                alarmIdentifier: identifier,
                notificationDate: scheduledDate,
                YYMMDD: YYMMDD,
                dotColor: '#F29913',
                marked: true
            };
            taskRef
                .add(data)
                .then(() => {
                    setUserInput('');
                    // release the keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                })
        }
        //else if task has no scheduled notification
        else if(identifier == 'NULL' && !isEnabled) {
            const data = {
                heading: user,
                timeOfCreation: timeStamps,
                isCompleted: false,
                alarmIdentifier: identifier,
            };
            taskRef
                .add(data)
                .then(() => {
                    setUserInput('');
                    // release the keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                })
            setIdentifier(' ')
        }
        setAlarmInitiated(false);
      }, [identifier]);

    // add a task
    const addTask = () => {
        if(userInput == '') {
            alert('Please enter a name for the task.')
            return;
        }
        var tempScheduledDate = ''
        //check if there is a valid user input
        console.log(alarmInitiated+' starting of addtask')
        if(userInput && userInput.length > 0) {
            //get timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            console.log(identifier+'before')
            
            setUser(userInput);
            setTimeStamps(timestamp);
            console.log(alarmInitiated+ 'before in addtask')
            console.log(alarmInitiated+ 'after in addtask')
            if(!isEnabled) {
                setIdentifier('NULL')
            }
        }
        if(!alarmInitiated && isEnabled) {
            //set alarm
            let arr = scheduledNotificationDate.split('/')//split scheduledNotificationDate to input to schedulePushNotification to set alarm
            console.log(arr)
            //logic to configure notificationTime to be stored and displayed to users.
            tempScheduledDate += (arr[2]+'/'+tempMonth+'/'+arr[0]+' - ')
            if(parseInt(arr[3]) < 10) {
                tempScheduledDate += '0'
            }
            tempScheduledDate += (arr[3] + ':')
            if(parseInt(arr[4]) < 10) {
                tempScheduledDate += '0'
            }
            tempScheduledDate += arr[4]
            if(parseInt(arr[3]) < 12) {
                tempScheduledDate += 'AM'
            } else {
                tempScheduledDate += 'PM'
            }            
            setScheduledDate(tempScheduledDate);
            Alarm.schedulePushNotification(arr[0], arr[1], arr[2], arr[3], arr[4], userInput, {setIdentifier}); //year, month, date, hour, mins, fn to grab alarm identifier key
            console.log(scheduledNotificationDate+' scheduledNotificationDate test')
            console.log(alarmInitiated+ 'before in if state')
            setAlarmInitiated(true);
            console.log(alarmInitiated+ 'after in if state')
        }
    }
    return (
<View style={{flex:1}}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new task'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(heading) => setUserInput(heading)}
                    value={userInput}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addTask}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>    
            </View>
            <View style={{alignItems:'center'}}>
            <TouchableOpacity 
                        style={isEnabled? styles.btnOn : styles.btnOff} 
                        value = {isEnabled} 
                        onPress={() => {
                            toggleSwitch()
                        }}>
                        <Text style={styles.btnText}>Toggle to set notification.</Text>
                    </TouchableOpacity>
            </View>
            {isEnabled == true ? <DateTimePickerApp
                setScheduledNotificationDate={setScheduledNotificationDate}//send to DateTimePicker for user to pick schedule notification date.
            /> : null}
</View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        flexDirection:'row',
        height:80,
        marginLeft:10,
        marginRight:10,
        marginTop:100,
    },
    input: {
        height:48,
        borderRadius:5,
        overflow:'hidden',
        backgroundColor:'white',
        paddingLeft:16,
        flex:1,
        marginRight:5,
    },
    button: {
        height:47,
        borderRadius:5,
        backgroundColor:'#F29913',
        width:80,
        alignItems:'center',
        justifyContent:'center',
    },
    buttonText: {
        color:'white',
        fontSize:20
    },
    btnOn: {
        width: 100,
        height: 50,
        backgroundColor:'#F29913',
        borderRadius: 35,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight:4
    },
    btnOff: {
        width: 100,
        height: 50,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight:4
    },
    btnText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
})