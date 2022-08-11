import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Switch } from 'react-native'
import { firebase } from '../config';
import React, { useState } from 'react'
import SwitchSelector from 'react-native-switch-selector';

// add a task
export default function AdHocTask() {
    const rewardRef = firebase.firestore().collection('rewards');
    const [userInput, setUserInput] = useState('');
    const [userInputPoints, setUserInputPoints] = useState('');

    const addReward = () => {
        //convert from stirng to int, to store on database as number for comparison in Reward.js
        let  intUserInputPoints= parseInt(userInputPoints)
        if(userInput == '') {
            alert('Please enter a name for the reward.')
            return;
        }
        if(userInputPoints == '') {
            alert('Please enter the points required for the reward.')
            return;
        }
        if(userInput && userInput.length > 0) {
            //get timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: userInput,
                timeOfCreation: timestamp,
                pointsRequired: intUserInputPoints,
            };
            rewardRef
                .add(data)
                .then(() => {
                    setUserInput('');
                    setUserInputPoints('');
                    // release the keyboard
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                })
        }
    }
    return (
<View style={{flex:1}}>
            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder='Add new Reward'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(heading) => setUserInput(heading)}
                    value={userInput}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                />
                <TouchableOpacity style={styles.button} onPress={addReward}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.formContainerNumber}>
                <TextInput
                    style={styles.input}
                    placeholder='Points'
                    placeholderTextColor='#aaaaaa'
                    onChangeText={(pointsRequired) => setUserInputPoints(pointsRequired.replace(/[^0-9]/g, ''))}
                    value={userInputPoints}
                    underlineColorAndroid='transparent'
                    autoCapitalize='none'
                    keyboardType='numeric'
                />
            </View>
            

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
    formContainerNumber: {
        flexDirection:'row',
        height:80,
        marginLeft:10,
        marginRight:300,
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