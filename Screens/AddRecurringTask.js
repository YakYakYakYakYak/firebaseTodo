import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Switch } from 'react-native'
import { firebase } from '../config';
import React, { useState, useEffect } from 'react'
import * as Alarm from './Alarm.js';
import TimePickerApp from './TimePicker.js';

// add a task
export default function RecurringTask() {
    const RecurringTaskRef = firebase.firestore().collection('recurringTasks');
    const [userInput, setUserInput] = useState('');
    
    //to send to DateTimePicker for user to pick schedule notification date.
    const [scheduledNotificationDate, setScheduledNotificationDate] = useState('42');

    const [user, setUser] = useState(' ');
    const [timeStamps, setTimeStamps] = useState(' ');
    const [identifier, setIdentifier] = useState([]);
    var daysArr = [];

    //Set alarm to true/false
    const [mondayIsEnabled, setMondayIsEnabled] = useState(false);
    const toggleMondaySwitch = () => setMondayIsEnabled(previousState => !previousState);

    const [tuesdayIsEnabled, setTuesdayIsEnabled] = useState(false);
    const toggleTuesdaySwitch = () => setTuesdayIsEnabled(previousState => !previousState);

    //when alarm identifier changes, send data to be stored on database.
    useEffect(() => {
        // if task has scheduled notification
        if(identifier.length != 0) {
            console.log(identifier)
            const data = {
                heading: user,
                timeOfCreation: timeStamps,
                alarmIdentifier: identifier
            };
            RecurringTaskRef
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
        //setIdentifier([]);
      }, [identifier]);

    //   useEffect(() => {
    //     // if task has scheduled notification
    //     console.log(mondayIsEnabled+' monday')
    //   }, [mondayIsEnabled]);

    //   useEffect(() => {
    //     // if task has scheduled notification
    //     console.log(tuesdayIsEnabled+' tuesday')
    //   }, [tuesdayIsEnabled]);

      const checkDays = () => {
        //setting array
        if(mondayIsEnabled) {
            daysArr.push(2);
        }
        if(tuesdayIsEnabled) {
            daysArr.push(2);
        }
      }

      //timepicker
      useEffect(() => {
        console.log(scheduledNotificationDate+' time and mins scheduled')
      }, [scheduledNotificationDate]);

    // add a task
    const addRecurringTask = () => {
        //check if there is a valid user input
        // console.log(scheduledNotificationDate)
        // console.log(daysArr+' daysArr Before')
        if(userInput && userInput.length > 0) {
            //get timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            console.log(identifier+' before')

            setUser(userInput);
            setTimeStamps(timestamp);

            let arr = scheduledNotificationDate.split('/')//split scheduledNotificationDate to input to schedulePushNotification to set alarm
            // console.log(arr)
            //set alarm
                Alarm.scheduleRecurringNotification(daysArr, parseInt(arr[0]), parseInt(arr[1]), {setIdentifier});           
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
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={() => {
                        checkDays();
                        addRecurringTask();
                    }}
                >
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
                <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={mondayIsEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleMondaySwitch}
                value={mondayIsEnabled}
                />
                <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={tuesdayIsEnabled ? "#f5dd4b" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleTuesdaySwitch}
                value={tuesdayIsEnabled}
                />
            </View>
            <TimePickerApp
                setScheduledNotificationDate={setScheduledNotificationDate}//send to DateTimePicker for user to pick schedule notification date.
            />
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
        backgroundColor:'#788eec',
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