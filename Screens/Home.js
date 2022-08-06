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
    
    const [check,setCheck] = useState(true);
    const CheckWork =()=>{
    check ? setCheck(false) : setCheck(true)
    }
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
                        const {notificationDate} = doc.data()
                        const {isCompleted} = doc.data()
                        const {alarmIdentifier} = doc.data()
                        tasks.push({
                            id: doc.id,
                            heading,
                            notificationDate,
                            isCompleted,
                            alarmIdentifier,

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

    const updateCompletion = (item) => {
        var oldState = '';
        //get current state of isCompleted
        taskRef
            .doc(item.id).get().then((snapshot) => {
                //console.log(snapshot.data())
                oldState = snapshot.data().isCompleted//so that we can do isCompleted = !oldState to alternate between whether is true/false completed.
              }).then (() => {
                taskRef
                    .doc(item.id)
                    .update({
                        isCompleted: !oldState
                    })
            }).catch((error) => {
                alert(error.message)
            })
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
                            onPress={() => {updateCompletion(item)}}
                            onLongPress={() => navigation.navigate('Detail', {item})}//on longpress, go to edit page//on longpress, go to edit page
                        >
                            <FontAwesome 
                                name='trash-o'
                                color='black'
                                onPress={() => deleteTask(item)}
                                style={styles.todoIcon}
                            />
                            <View style={styles.innerContainer}>
                                {/* if there is alarm */}
                                {item.alarmIdentifier != "NULL"? 
                                    <Text style={check ?styles.itemText:styles.TextDone}>
                                        Alarm set: {item.notificationDate}
                    
                                    </Text>
                                    // else dont show alarm text
                                :   null }
                                    {/* if item is marked as completed, crossout item */}
                                    {item.isCompleted == true?
                                        <Text style={styles.TextDone}>
                                            {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                        </Text>
                                        // else render item normally
                                :
                                        <Text style={styles.itemText}>
                                            {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                        </Text>
                                    }
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

export default Home

// export const Task = (props) => {
//     const [check,setCheck] = useState(true);
//     const CheckWork =()=>{
//         check ? setCheck(false) : setCheck(true)
//     }

//     return(
//         <Pressable onPress={CheckWork}>
//         <View style={styles.innerContainer}>
//             {props.alarmIdentifier != "NULL"? 
//                 <><Text>
//                     Alarm: {props.notificationDate}
//                 </Text>
//                 <Text style={check ?styles.itemText:styles.TextDone}>   
//                     {props.heading[0].toUpperCase() + props.heading.slice(1)}
//                 </Text></>
//             :   <Text style={check ?styles.itemText:styles.TextDone}>
//                     {props.heading[0].toUpperCase() + props.heading.slice(1)}
//                 </Text> }
//         </View>
//         </Pressable>
//     )
// }
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
        // alignItems:'center',
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
    itemText: {
        fontWeight:'bold',
        fontSize:16,
        marginLeft:10,
        // maxWidth: '75%'
    },
    TextDone:{
    fontWeight:'bold',
    fontSize:16,
    marginLeft:10,
    textDecorationLine:'line-through',
    //maxWidth: '75%'
    },  
})