import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Switch } from 'react-native'
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

    //when alarm identifier changes, send data to be stored on database.
    useEffect(() => {
        // if task has scheduled notification
        if(identifier != ' ' && isEnabled) {
            console.log(identifier+'test')
            const data = {
                heading: user,
                timeOfCreation: timeStamps,
                alarmIdentifier: identifier,
                notificationDate: scheduledDate,
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
                alarmIdentifier: identifier
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
        var tempScheduledDate = ''
        //check if there is a valid user input
        console.log(alarmInitiated+' starting of addtask')
        if(userInput && userInput.length > 0) {
            //get timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            console.log(identifier+'before')
            // //set alarm
            // let arr = scheduledNotificationDate.split('/')//split scheduledNotificationDate to input to schedulePushNotification to set alarm
            // console.log(arr)
            // Alarm.schedulePushNotification(arr[0], arr[1], arr[2], arr[3], arr[4], userInput, {setIdentifier}); //year, month, date, hour, mins, fn to grab alarm identifier key
            // console.log(scheduledNotificationDate+' scheduledNotificationDate test')

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
            tempScheduledDate += (arr[2]+'/'+arr[1]+'/'+arr[0]+'/')
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
                <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
                />
            </View>
            {isEnabled == true ? <DateTimePickerApp
                setScheduledNotificationDate={setScheduledNotificationDate}//send to DateTimePicker for user to pick schedule notification date.
            /> : null}
            {/* <DateTimePickerApp
                setScheduledNotificationDate={setScheduledNotificationDate}//send to DateTimePicker for user to pick schedule notification date.
            /> */}
</View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor:'#e5e5e5',
        padding:15,
        borderRadius:15,
        margin:5,
        marginHorizontal:10,
        flexDirection:'row',
        alignItems:'center'
    },
    innerContainer: {
        alignItems:'center',
        flexDirection:'column',
        marginLeft:45,
    },
    itemHeading: {
        fontWeight:'bold',
        fontSize:18,
        marginRight:22,
    },
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
    todoIcon: {
        marginTop: 5,
        fontSize: 20,
        marginLeft:14,
    }
    
})