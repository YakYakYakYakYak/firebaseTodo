import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { FAB, Portal, Provider } from 'react-native-paper';
import * as Notifications from 'expo-notifications';
import MultiButton from './multiButton';

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const taskRef = firebase.firestore().collection('tasks');
    const [userInput, setUserInput] = useState('');
    const navigation = useNavigation();

    // //FAB multi-button button
    // const [state, setState] = React.useState({ open: false });
    // const onStateChange = ({ open }) => setState({ open });
    // const { open } = state;

    // fetch or read the data from firestore
    useEffect(() => {
        let isMounted = true;               // note mutable flag
        if (isMounted) { //conditional check
            taskRef.orderBy('timeOfCreation', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const tasks = []
                    querySnapshot.forEach((doc) => {
                        const {heading} = doc.data()
                        tasks.push({
                            id: doc.id,
                            heading,
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
        taskRef
            .doc(tasks.id).get().then((snapshot) => {
                //console.log(snapshot.data())
                alarmIdentifier = snapshot.data().alarmIdentifier
                console.log(alarmIdentifier+' alarm identifier to be deleted');
              })

            .then(() => {
                //delete the task
                taskRef.doc(tasks.id).delete()
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
        await Notifications.cancelScheduledNotificationAsync(identifier);
    }

    // // add a task
    // const addTask = () => {
    //     //check if there is a valid user input
    //     if(userInput && userInput.length > 0) {
    //         //get timestamp
    //         const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    //         const data = {
    //             heading: userInput,
    //             timeOfCreation: timestamp
    //         };
    //         taskRef
    //             .add(data)
    //             .then(() => {
    //                 setUserInput('');
    //                 // release the keyboard
    //                 Keyboard.dismiss();
    //                 //set alarm
    //                 Alarm.schedulePushNotification();
    //             })
    //             .catch((error) => {
    //                 alert(error);
    //             })
    //     }
    // }
    return(
        
        <View style={{flex:1, marginTop:50}}>
            {/* <View style={styles.formContainer}>
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
            </View> */}
            <FlatList
                data={tasks}
                numColumns={1}
                renderItem={({item}) => (
                    <View>
                        <Pressable
                            style={styles.container}
                            // navigate to update task page.
                            onPress={() => navigation.navigate('Detail', {item})}
                        >
                            <FontAwesome 
                                name='trash-o'
                                color='red'
                                onPress={() => deleteTask(item)}
                                style={styles.todoIcon}
                            />
                            <View style={styles.innerContainer}>
                                <Text style={styles.itemHeading}>
                                    {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                )}
            />
            {/* FAB Plus Button */}
            <MultiButton/>
            {/* <Provider>
                <Portal>
                    <FAB.Group
                    open={open}
                    icon={open ? 'close' : 'plus'}
                    actions={[
                        { icon: 'plus', onPress: () => console.log('Pressed add') },
                        {
                        icon: 'gift',
                        label: 'Rewards',
                        onPress: () => console.log('Pressed rewards'),
                        },
                        {
                        icon: 'reload',
                        label: 'Recurring Task',
                        onPress: () => navigation.navigate('DateTimePickerApp'),
                        },
                        {
                        icon: 'lead-pencil',
                        label: 'Ad-Hoc Task',
                        onPress: () => navigation.navigate('AddTask'),
                        },
                    ]}
                    onStateChange={onStateChange}
                    onPress={() => {
                        if (open) {
                        // do something if the speed dial is open
                        console.log('hello')
                        }
                    }}
                    />
                </Portal>
            </Provider> */}
        </View>
        
    )
}

export default Home

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