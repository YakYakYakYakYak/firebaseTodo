import {View, Text, TextInput, StyleSheet, Pressable} from 'react-native'
import React, { useState } from 'react'
import { firebase } from '../config'
import { useNavigation } from '@react-navigation/native'

const Detail = ({route}) => {
    const taskRef = firebase.firestore().collection('tasks');
    const [textHeading, onChangeHeadingText] = useState(route.params.item.name);
    const navigation = useNavigation();

    const updateTask = () => {
        if(textHeading && textHeading.length > 0) {
            taskRef
            .doc(route.params.item.id)
            .update({
                heading: textHeading,
            }).then (() => {
                navigation.navigate('HomePage')
            }).catch((error) => {
                alert(error.message)
            })
        }
    }
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textField}
                onChangeText={onChangeHeadingText}
                value={textHeading}
                placeholder='Update task'
            />
            <Pressable
            style={styles.buttonUpdate}
            onPress={() => {updateTask()}}
            >
                <Text>Update Task</Text>
            </Pressable>
        </View>
    )
}

export default Detail

const styles = StyleSheet.create({
    container: {
        marginTop:80,
        marginLeft:15,
        marginRight:15,
    },
    textField: {
        marginBottom:10,
        padding:10,
        fontSize:15,
        borderRadius:5,
        backgroundColor: 'white'
    },
    buttonUpdate: {
        marginTop:25,
        alignItems:'center',
        justifyContent:'center',
        paddingVertical:12,
        paddingHorizontal:32,
        borderRadius:4,
        elevation:10,
        backgroundColor:'#0de065',
    }
})