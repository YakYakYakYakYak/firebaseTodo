import { View, Text, StyleSheet, TextInput, TouchableOpacity, Keyboard, Switch } from 'react-native'
import { firebase } from '../config';
import React, { useState } from 'react'

import SwitchSelector from 'react-native-switch-selector';

// add a task
export default function AdHocTask() {
    const rewardRef = firebase.firestore().collection('rewards');
    const [userInput, setUserInput] = useState('');
    const [pointsRequired, setPointsRequired] = useState(1);


    //switchselector options
    const options = [
        { label: '1pt', value: '1' },
        { label: '2pt', value: '2' },
        { label: '3pt', value: '3' }
    ];

    const addReward = () => {
        //check if there is a current todo
        if(userInput && userInput.length > 0) {
            //get timestamp
            const timestamp = firebase.firestore.FieldValue.serverTimestamp();
            const data = {
                heading: userInput,
                timeOfCreation: timestamp,
                pointsRequired: pointsRequired,
            };
            rewardRef
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
            <Text>Set Points required to achieve this reward</Text>
            <SwitchSelector
                initial={0}
                onPress={value => setPointsRequired(value)}
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
            />
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