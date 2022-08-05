import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { FAB, Portal, Provider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import MultiButton from './multiButton';

const RecurringHome = () => {
    const [tasks, setTasks] = useState([]);
    const RecurringTaskRef = firebase.firestore().collection('recurringTasks');
    const [userInput, setUserInput] = useState('');
    const navigation = useNavigation();

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
                        tasks.push({
                            id: doc.id,
                            heading,
                            notificationTime,

                        })
                    })
                    setTasks(tasks)
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
    return(
        <View style={{flex:1, marginTop:50}}>
            <FlatList
                data={tasks}
                numColumns={1}
                renderItem={({item}) => (
                    <View>
                        <Pressable
                            style={styles.container}
                            // navigate to update task page.
                            onPress={() => console.log('tap')}
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
                        </Pressable>
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
    }
    
})