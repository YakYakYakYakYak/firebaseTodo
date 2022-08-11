import { Text, View, StyleSheet, Pressable, Modal } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import React, { useState, useEffect } from 'react'
import { firebase } from '../config';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CalendarApp() {

const [tasks, setTasks] = useState([]);
const taskRef = firebase.firestore().collection('tasks');

//modal
const [modalVisible, setModalVisible] = useState(false);
const [selectedDate, setSelectedDate] = useState('-');
const [filteredTasks, setFilteredTasks] = useState([]);

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
                  const {YYMMDD} = doc.data()
                  const {dotColor} = doc.data()
                  const {marked} = doc.data()
                  tasks.push({
                      id: doc.id,
                      heading,
                      notificationDate,
                      isCompleted,
                      alarmIdentifier,
                      YYMMDD,
                      dotColor,
                      marked,

                  })
              })
              setTasks(tasks)
          }
      )
  }
  return () => { isMounted = false }; // cleanup toggles value, if unmounted
}, [])

  //function to filter out tasks that do not match the users selected date.
  function filterTasks(selectedDate) {
    let tempFilteredTasks = [];
    for(var i = 0;i < tasks.length; i++) {
      if(tasks[i].YYMMDD == selectedDate) {
        tempFilteredTasks.push(tasks[i])
      }
      setFilteredTasks(tempFilteredTasks)
    }
  }

  //after user selects a date, filter the tasks to display only the tasks for the selected date.
  useEffect(() => {
    if(selectedDate != '-') {
      filterTasks(selectedDate)
    }
  }, [selectedDate])

  //then, set the modal to visible.
  useEffect(() => {
    if(filteredTasks.length > 0) {
      setModalVisible(true)
    }
  }, [filteredTasks])

  //Mapping key to tasks to create objects for displaying marked scheduled notifications dates in the calendar.
  let taskObjects = {};

  tasks.forEach((task) => {
    taskObjects[task.YYMMDD] = {
        dotColor: task.dotColor,
        marked: task.marked
    };
  });

//map filtered tasks to components for displaying in the modal view.
const TasksComp = (props) => {
  const tasksComp = props.filteredTasksArr.map(task =>
    <View style={styles.container} key={task.id}>
<Pressable onPress={() => console.log('hello')}>
  <View>
  <Text style={styles.texter}>{task.heading}</Text>
  </View>
</Pressable>
  
</View>
)  
  return(
  <View style={styles.centeredView}>
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
              <Icon style={{
                position: 'absolute',
                right: 5,
                top: 5,
          }} name="close-circle-outline" size={30} color="red"onPress={() => setModalVisible(!modalVisible)}/>
                <>{tasksComp}</>                  
                  
              </View>
            </View>
          </Modal>
    </View>
  )
}

  return (
      
      <View>
        <Calendar
          markingType={'period'}
          markedDates={taskObjects}
          onDayPress={day => {
            setSelectedDate(day.dateString)//after selectedDate is set, useEffect to filter tasks, then useEffect to set modal to visible.
          }}
        />
        <TasksComp filteredTasksArr={filteredTasks}/>
      </View>
    );
  } 

  const styles = StyleSheet.create({
    container: {
      marginRight: 30,
      marginLeft: 0,
      marginTop: 5,
      paddingHorizontal: 10,
      paddingVertical: 5,
      backgroundColor: '#F3F3F3',
      borderRadius: 13,
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
    trashIcon: {
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
    //modals
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    texter: {
      color: '#000',
      fontSize: 15,
      lineHeight: 21,
      includeFontPadding: false,
      overflow: 'hidden',
      flexShrink: 1,
      flexGrow: 0,
      alignSelf: 'flex-start'
  }
})