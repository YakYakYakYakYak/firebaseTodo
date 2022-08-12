import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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
                        const {daysToRepeat} = doc.data()
                        tasks.push({
                            id: doc.id,
                            heading,
                            notificationTime,
                            storedDate,
                            isCompleted,
                            pointsAwarded,
                            daysToRepeat

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
    const renderDays = (daysToRepeat, notificationTime) => {
        let mon = false;
        let tue = false;
        let wed = false;
        let thur = false;
        let fri = false;
        let sat = false;
        let sun = false;

        for(let i = 0;i < daysToRepeat.length;i++) {
            if(daysToRepeat[i] == 2) {
                mon = true;
            }
            if(daysToRepeat[i] == 3) {
                tue = true;
            }
            if(daysToRepeat[i] == 4) {
                wed = true;
            }
            if(daysToRepeat[i] == 5) {
                thur = true;
            }
            if(daysToRepeat[i] == 6) {
                fri = true;
            }
            if(daysToRepeat[i] == 7) {
                sat = true;
            }
            if(daysToRepeat[i] == 1) {
                sun = true;
            }
        }
        return(
    <View style={{flexDirection: 'row', alignItems: 'stretch', }}>
        <Text style={{fontWeight: 'bold'}}>Repeats: </Text>
        <View style={mon? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>M</Text>
        </View>
        <View style={tue? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>Tu</Text>
        </View>
        <View style={wed? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>W</Text>
        </View>
        <View style={thur? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>Th</Text>
        </View>
        <View style={fri? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>F</Text>
        </View>
        <View style={sat? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>Sa</Text>
        </View>
        <View style={sun? styles.dayOn : styles.dayOff}>
            <Text style={styles.dayText}>Su</Text>
        </View>
        <Text style={{fontWeight: 'bold'}}> at: {notificationTime}</Text>
    </View>
        
        )
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
                            color='black'
                            onPress={() => deleteTask(item)}
                            style={styles.trashIcon}
                        />
                        <View style={styles.innerContainer}>
                            {/* renders days orange if reoccuring, if not render them greyed out if not recurring on that day. */}
                            {renderDays(item.daysToRepeat, item.notificationTime)}
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{fontWeight: 'bold'}}>Points: </Text>
                                <Text style={{fontWeight: 'bold', color: '#F29913'}}>{item.pointsAwarded}</Text>
                            </View>
                            <Text style={styles.itemHeading}>  
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
        flexDirection:'column',
        marginLeft:45,
    },
    itemHeading: {
        flexWrap: 'wrap',
        fontWeight:'bold',
        fontSize:18,
        marginRight:22,
    },
    trashIcon: {
        marginTop: 5,
        fontSize: 20,
        marginLeft:14,
    },
    dayOn: {
        width: 20,
        height: 20,
        backgroundColor:'#F29913',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 1
    },
    dayOff: {
        width: 20,
        height: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        borderStyle: 'solid',
        justifyContent: 'center',
        marginLeft: 1
    },
    dayText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    
})