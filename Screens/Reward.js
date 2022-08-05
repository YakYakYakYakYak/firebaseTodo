import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { FAB, Portal, Provider } from 'react-native-paper';
import MultiButton from './multiButton';

const Rewards = () => {
    const [tasks, setTasks] = useState([]);
    const rewardRef = firebase.firestore().collection('rewards');
    const [userInput, setUserInput] = useState('');
    const navigation = useNavigation();

    //accumulated points variables
    var [points, setPoints] = useState([]);
    const pointsRef = firebase.firestore().collection('accumulatedPoints');


    // fetch or read the data from firestore
    useEffect(() => {
        let isMounted = true;               // note mutable flag
        if (isMounted) { //conditional check
          rewardRef.orderBy('timeOfCreation', 'desc')
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
        //fetch total accumulated points
        pointsRef.orderBy('totalPoints', 'desc')
        .onSnapshot(
            querySnapshot => {
                var points = 0
                querySnapshot.forEach((doc) => {
                    const {totalPoints} = doc.data()
                    points = totalPoints
                })
                setPoints(points)
                }
            )
        }
        return () => { isMounted = false }; // cleanup toggles value, if unmounted
    }, [])

    // delete task from db
    const deleteTask = (tasks) => {
        rewardRef
            //delete the task
            rewardRef.doc(tasks.id).delete()
            // alert showing successful deletion
            // ** TO BE IMPLEMENTED BACK AFTER TESTING. alert('Task deleted successfully')
            .catch(error => {
                alert(error);
            })
    }
    return(
        
        <View style={{flex:1, marginTop:50}}>
            <View>
                <Text>
                    {points}
                </Text>
            </View>
            <FlatList
                data={tasks}
                numColumns={1}
                renderItem={({item}) => (
                    <View>
                        <Pressable
                            style={styles.container}
                            // navigate to update task page.
                            onPress={() => console.log('tap reward')}
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
        </View>
        
    )
}

export default Rewards

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



//old
// import { Text, View } from 'react-native';

// export default function Rewards() {
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <Text>Work in progress!</Text>
//       </View>
//     );
//   }