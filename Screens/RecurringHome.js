import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { FAB, Portal, Provider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import MultiButton from './multiButton';
import moment from 'moment';

const RecurringHome = () => {
    const [tasks, setTasks] = useState([]);
    const [totalAccumulatedPoints, setTotalAccumulatedPoints] = useState([])
    const RecurringTaskRef = firebase.firestore().collection('recurringTasks');
    const accumulatedPointsRef = firebase.firestore().collection('accumulatedPoints');
    const [userInput, setUserInput] = useState('');
    const navigation = useNavigation();

    // https://stackoverflow.com/questions/39426083/update-react-component-every-second
    const [time, setTime] = useState(Date.now());

    useEffect(() => {
        const interval = setInterval(() => setTime(Date.now()), 3000);
        return () => {
          clearInterval(interval);
        };
      }, []);

    const getCurrentTime = () => {
        let date = Date.now();
        let currentDateString = moment(new Date(date)).format('MM/DD/YYYY')
        console.log(totalAccumulatedPoints)
        return (currentDateString)
    }

    // fetch or read the data from firestore
    useEffect(() => {
        let isMounted = true;               // note mutable flag
        if (isMounted) { //conditional check
            RecurringTaskRef.orderBy('timeOfCreation', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const tasks = []
                    querySnapshot.forEach((doc) => {
                        const {heading} = doc.data()
                        const {notificationTime} = doc.data()
                        const {storedDate} = doc.data()
                        const {isCompleted} = doc.data()
                        const {pointsAwarded} = doc.data()
                        tasks.push({
                            id: doc.id,
                            heading,
                            notificationTime,
                            storedDate,
                            isCompleted,
                            pointsAwarded,

                        })
                    })
                    setTasks(tasks)
                }
            )
        }
        return () => { isMounted = false }; // cleanup toggles value, if unmounted
    }, [])

    useEffect(() => {
        let isMounted = true;               // note mutable flag
        if (isMounted) { //conditional check
            accumulatedPointsRef.orderBy('totalPoints', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const totalAccumulatedPoints = []
                    querySnapshot.forEach((doc) => {
                        const {totalPoints} = doc.data()
                        totalAccumulatedPoints.push({
                            id: doc.id,
                            totalPoints,
                        })
                    })
                    setTotalAccumulatedPoints(totalAccumulatedPoints)
                }
            )
        }
        return () => { isMounted = false }; // cleanup toggles value, if unmounted
    }, [])
    
    // delete task from db
    const deleteTask = (tasks) => {
        var alarmIdentifier = '';
        //get alarmIdentifier in order to cancel scheduled notification when task is deleted.
        RecurringTaskRef
            .doc(tasks.id).get().then((snapshot) => {
                //console.log(snapshot.data())
                alarmIdentifier = snapshot.data().alarmIdentifier
                // console.log(alarmIdentifier+' alarm identifier to be deleted');
                // console.log(typeof(alarmIdentifier+' datatype'))
              })

            .then(() => {
                //delete the task
                RecurringTaskRef.doc(tasks.id).delete()
                // alert showing successful deletion
                // ** TO BE IMPLEMENTED BACK AFTER TESTING. alert('Task deleted successfully')

                //cancel scheduled notification.
                cancelScheduledNotification(alarmIdentifier);

            })
            .catch(error => {
                alert(error);
            })
    }

    //cancel scheduled notification function
    async function cancelScheduledNotification(identifier) {
        for(var i =0;i<identifier.length;i++) {
            console.log(identifier[i])
            await Notifications.cancelScheduledNotificationAsync(identifier[i]);
        }
    }

    const updateCompletion = (item) => {
        //get current state of isCompleted
        var oldState = item.isCompleted
        var itemPoints = item.pointsAwarded
        //set to completed
        RecurringTaskRef
            .doc(item.id)
            .update({
                isCompleted: !oldState
            })
            .catch((error) => {
            alert(error.message)
            })
            //increase total points accumulated
            accumulatedPointsRef
            .doc(totalAccumulatedPoints[0].id)
            .update({
                totalPoints: totalAccumulatedPoints[0].totalPoints + itemPoints
            })
    }

    const checkDate = (item, currentDate) => {
        //get current state of isCompleted
        console.log(item)
        
        //if it is another fresh day, reset isCompleted so that the containers will show again.
        console.log(item.storedDate + ' sd')
        console.log(currentDate + ' cd')

            if(item.storedDate != currentDate) {
            console.log('executing')
            RecurringTaskRef
            .doc(item.id)
            .update({
                storedDate: currentDate,
                isCompleted: false
            })
            .catch((error) => {
            alert(error.message)
            })
        }
    }
    return(
        <View style={{flex:1, marginTop:50}}>
            <FlatList
                data={tasks}
                numColumns={1}
                renderItem={({item}) => (
                    <View>
                        {/* check if it is a fresh day, whether the task should be refreshed and shown to the user again         */}
                        {checkDate(item, getCurrentTime())}             
                        {/* https://reactjs.org/docs/conditional-rendering.html */}
                        {/* https://stackoverflow.com/questions/30266831/hide-show-components-in-react-native */}
                        {/* if item has been marked as completed for the day, hide the container. */}
                        {item.isCompleted == true? 
                    
                            null
                        //else, display the container
                        :    
                        <Pressable
                        style={styles.container}
                        onPress={() => {updateCompletion(item)}}
                        onLongPress={() => navigation.navigate('DetailRecurring', {item})}//on longpress, go to edit page
                        >
                        <FontAwesome 
                            name='trash-o'
                            color='red'
                            onPress={() => deleteTask(item)}
                            style={styles.todoIcon}
                        />
                        <View style={styles.innerContainer}>
                            <Text style={styles.itemHeading}>
                                Repeats every: {item.notificationTime}
                                {'\n'}
                                {item.heading[0].toUpperCase() + item.heading.slice(1)}
                            </Text>
                        </View>
                    </Pressable>}
                    </View>
                )}
            />
            {/* FAB Plus Button */}
            <MultiButton/>
        </View>
        
    )
}

export default RecurringHome

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
    },
    hidden: {
        display: 'none',
    }
    
})