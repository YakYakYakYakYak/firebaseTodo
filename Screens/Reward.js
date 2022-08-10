import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Keyboard, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import { FontAwesome } from '@expo/vector-icons';
// import { FAB, Portal, Provider } from 'react-native-paper';
import MultiButton from './multiButton';

const Rewards = () => {
    const [tasks, setTasks] = useState([]);
    const rewardRef = firebase.firestore().collection('rewards');

    //accumulated points variables
    var [points, setPoints] = useState([]);
    const pointsRef = firebase.firestore().collection('accumulatedPoints');


    // fetch or read the data from firestore
    useEffect(() => {
        let isMounted = true;               // note mutable flag
        if (isMounted) { //conditional check
          rewardRef.orderBy('pointsRequired')
            .onSnapshot(
                querySnapshot => {
                    const tasks = []
                    querySnapshot.forEach((doc) => {
                        const {heading} = doc.data()
                        const {pointsRequired} = doc.data()
                        tasks.push({
                            id: doc.id,
                            heading,
                            pointsRequired
                        })
                    })
                    setTasks(tasks)
                }
            )
        //fetch total accumulated points
        pointsRef.orderBy('totalPoints')
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
        
        <View style={{flex:1}}>
            <View style={styles.centered}>
                <Text style={styles.title}>Reward Points:</Text>
                <Text style={styles.subtitle}>{points}</Text>
            </View>
            <View style={{flex:20}}>
            <FlatList
                style={{marginTop:10}}
                data={tasks}
                numColumns={1}
                renderItem={({item}) => (
                    <View>
                        {/* user accumulated points to redeem item, */}
                        {points >= item.pointsRequired? 
                                     <Pressable
                                     style={styles.rewardReached}
                                     // navigate to update task page.
                                     onPress={() => console.log('tap reward')}
                                     >
                                     <FontAwesome 
                                         name='trash-o'
                                         color='black'
                                         onPress={() => deleteTask(item)}
                                         style={styles.todoIcon}
                                     />
                                     
                                     <View style={styles.innerContainer}>
                                         <Text style={styles.itemHeading}>
                                             {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                             {item.pointsRequired}                               
                                         </Text>
                                     </View>
                                 </Pressable>
                                //  else render without green background
                                :   
                                <Pressable
                                style={styles.container}
                                // navigate to update task page.
                                onPress={() => console.log('tap reward')}
                                >
                                <FontAwesome 
                                    name='trash-o'
                                    color='black'
                                    onPress={() => deleteTask(item)}
                                    style={styles.todoIcon}
                                />
                                
                                <View style={styles.innerContainer}>
                                    <Text style={styles.itemHeading}>
                                        {item.heading[0].toUpperCase() + item.heading.slice(1)}
                                        {item.pointsRequired}                               
                                    </Text>
                                </View>
                            </Pressable>
                             }
                    </View>
                )}
            />
            </View>
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
    rewardReached: {
        backgroundColor:'#0de065',
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
    //reward points
    centered: {
        justifyContent: "center",
        alignItems: "center",
      },
      title: {
        fontSize: 18,
      },
      subtitle: {
        fontSize: 50,
        color: "#F29913",
      },
    
})