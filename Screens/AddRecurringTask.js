import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { firebase } from '../config';
import React, { useState, useEffect } from 'react'
import * as Alarm from './Alarm.js';
import TimePickerApp from './TimePicker.js';
import SwitchSelector from 'react-native-switch-selector';
import moment from 'moment';

// add a task
export default function RecurringTask() {
    const RecurringTaskRef = firebase.firestore().collection('recurringTasks');
    const [userInput, setUserInput] = useState('');
    
    //to send to DateTimePicker for user to pick schedule notification date.
    const [scheduledNotificationDate, setScheduledNotificationDate] = useState('42');

    const [user, setUser] = useState(' ');
    const [timeStamps, setTimeStamps] = useState(' ');
    const [identifier, setIdentifier] = useState([]);
    const [hoursMins, setHoursMins] = useState(' ');
    const [pointsAwarded, setPointsAwarded] = useState(1); // points awarded per completion of this recurring task
    var daysArr = [];
    const [finalDaysArr, setFinalDaysArr] = useState([])
    const [notificationTimeInMins, setNotificationTimeInMins] = useState(0);

    //stored date
    let date = Date.now();
    const currentDateString = moment(new Date(date)).format('MM/DD/YYYY')
    //console.log(currentDateString)

    //switchselector options
    const options = [
        { label: '1pt', value: '1' },
        { label: '2pt', value: '2' },
        { label: '3pt', value: '3' }
    ];

    //Set alarm to true/false
    const [mondayIsEnabled, setMondayIsEnabled] = useState(false);
    const toggleMondaySwitch = () => setMondayIsEnabled(previousState => !previousState);

    const [tuesdayIsEnabled, setTuesdayIsEnabled] = useState(false);
    const toggleTuesdaySwitch = () => setTuesdayIsEnabled(previousState => !previousState);

    const [wednesdayIsEnabled, setWednesdayIsEnabled] = useState(false);
    const toggleWednesdaySwitch = () => setWednesdayIsEnabled(previousState => !previousState);

    const [thursdayIsEnabled, setThursdayIsEnabled] = useState(false);
    const toggleThursdaySwitch = () => setThursdayIsEnabled(previousState => !previousState);

    const [fridayIsEnabled, setFridayIsEnabled] = useState(false);
    const toggleFridaySwitch = () => setFridayIsEnabled(previousState => !previousState);

    const [saturdayIsEnabled, setSaturdayIsEnabled] = useState(false);
    const toggleSaturdaySwitch = () => setSaturdayIsEnabled(previousState => !previousState);

    const [sundayIsEnabled, setSundayIsEnabled] = useState(false);
    const toggleSundaySwitch = () => setSundayIsEnabled(previousState => !previousState);

    useEffect(() => {
        console.log(mondayIsEnabled)
      }, [mondayIsEnabled]);


    //when alarm identifier changes, send data to be stored on database.
    useEffect(() => {
        // if task has scheduled notification
        if(identifier.length != 0) {
            console.log(identifier)
            const data = {
                heading: user,
                timeOfCreation: timeStamps,
                alarmIdentifier: identifier,
                notificationTime: hoursMins,
                pointsAwarded: pointsAwarded,
                isCompleted: false,
                storedDate: currentDateString,
                daysToRepeat: finalDaysArr,
                notificationTimeInMins: notificationTimeInMins,
            };
            RecurringTaskRef
                .add(data)
                .then(() => {
                    //reset all inputs
                    setUserInput('');
                    setMondayIsEnabled(false);
                    setTuesdayIsEnabled(false);
                    setWednesdayIsEnabled(false);
                    setThursdayIsEnabled(false);
                    setFridayIsEnabled(false);
                    setSaturdayIsEnabled(false);
                    setSundayIsEnabled(false);
                    // release the keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                })
        }
      }, [identifier]);

      const checkDays = () => {
        //setting array
        //https://docs.expo.dev/versions/latest/sdk/notifications/#getnotificationchannelgroupsasync-promisenotificationchannelgroup
        //Note: Weekdays are specified with a number from 1 through 7, with 1 indicating Sunday.
        if(mondayIsEnabled) {
            daysArr.push(2);
        }
        if(tuesdayIsEnabled) {
            daysArr.push(3);
        }
        if(wednesdayIsEnabled) {
            daysArr.push(4);
        }
        if(thursdayIsEnabled) {
            daysArr.push(5);
        }
        if(fridayIsEnabled) {
            daysArr.push(6);
        }
        if(saturdayIsEnabled) {
            daysArr.push(7);
        }
        if(sundayIsEnabled) {
            daysArr.push(1);
        }
      }

      //timepicker
      useEffect(() => {
        console.log(scheduledNotificationDate+' time and mins scheduled')
      }, [scheduledNotificationDate]);

    // add a task
    const addRecurringTask = () => {
        //check if user has given the task a name
        if(userInput == '') {
            alert('Please enter a name for the task')
            return;
        }
        //check if user has given the task a time to repeat
        if(scheduledNotificationDate == '42') {
            alert('Please pick a time for the alarm to repeat')
            return;
        }
        //check if user has given the task a day to repeat
        if(daysArr.length === 0) {
            alert('Please pick the days you want the alarm to repeat')
            return;
        }
        var time = ''
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
            //logic to configure notificationTime to be stored and displayed to users.
            if(parseInt(arr[0]) < 10) {
                time += '0'
            }
            time += (arr[0] + ':')
            if(parseInt(arr[1]) < 10) {
                time += '0'
            }
            time += arr[1]
            if(parseInt(arr[0]) < 12) {
                time += 'AM';
            }
            else {
                time +='PM'
            }
            setHoursMins(time);
            //get notificationTimeInMins, for sorting in recurrHome.js, listing earliest notifications to latest notifications.
            let tempNotificationTimeInMins = 0
            tempNotificationTimeInMins = (parseInt(arr[0]) * 60) + parseInt(arr[1])
            setNotificationTimeInMins(tempNotificationTimeInMins)

            //set alarm
                Alarm.scheduleRecurringNotification(daysArr, parseInt(arr[0]), parseInt(arr[1]), userInput, {setIdentifier});
            setFinalDaysArr(daysArr)

        }
    }
    return (
<View style={{flex:1}}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new recurring task'
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
            </View>
            <Text style={styles.lineText}>Set Points awarded per completion of this recurring task</Text>
            <SwitchSelector
                initial={0}
                onPress={value => setPointsAwarded(value)}
                textColor={'#F29913'}
                selectedColor={'white'}
                buttonColor={'#F29913'}
                borderColor={'#F29913'}
                hasPadding
                options={[
                    { label: "1pt", value: 1 },
                    { label: "2pt", value: 2 },
                    { label: "3pt", value: 3 } 
                ]}
                testID="gender-switch-selector"
                accessibilityLabel="gender-switch-selector"
                style={{marginTop:10}}
            />
            <Text style={styles.lineText}>Select the days you want the task to repeat on.</Text>
                <View style={{flexDirection: 'row', alignItems: 'stretch', marginTop:10}}>
                    <TouchableOpacity 
                        style={mondayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {mondayIsEnabled} 
                        onPress={() => {
                        toggleMondaySwitch()
                        }}>
                        <Text style={styles.dayText}>Mo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={tuesdayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {tuesdayIsEnabled} 
                        onPress={() => {
                        toggleTuesdaySwitch()
                        }}>
                        <Text style={styles.dayText}>Tu</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={wednesdayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {wednesdayIsEnabled} 
                        onPress={() => {
                        toggleWednesdaySwitch()
                        }}>
                        <Text style={styles.dayText}>We</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={thursdayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {thursdayIsEnabled} 
                        onPress={() => {
                        toggleThursdaySwitch()
                        }}>
                        <Text style={styles.dayText}>Th</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={fridayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {fridayIsEnabled} 
                        onPress={() => {
                        toggleFridaySwitch()
                        }}>
                        <Text style={styles.dayText}>Fr</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={saturdayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {saturdayIsEnabled} 
                        onPress={() => {
                        toggleSaturdaySwitch()
                        }}>
                        <Text style={styles.dayText}>Sa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={sundayIsEnabled? styles.dayOn : styles.dayOff} 
                        value = {sundayIsEnabled} 
                        onPress={() => {
                        toggleSundaySwitch()
                        }}>
                        <Text style={styles.dayText}>Su</Text>
                    </TouchableOpacity>
                </View>
            <TimePickerApp
                setScheduledNotificationDate={setScheduledNotificationDate}//send to DateTimePicker for user to pick schedule notification date.
            />
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
    dayOn: {
        width: 50,
        height: 50,
        backgroundColor:'#F29913',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight:4
    },
    dayOff: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 4,
        marginRight:4
    },
    dayText: {
        fontWeight: 'bold',
        textAlign: 'center',
    },
    lineText: {
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 10
    }
})