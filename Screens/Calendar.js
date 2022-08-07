import { Text, View } from 'react-native';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import React, { useState, useEffect } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Card } from 'react-native-paper';
import { firebase } from '../config';
// var arr=[]
// var obj={}
// obj = {
//   name:'jeremy'
// }
// arr.push(obj);    

// console.log(arr)
// console.log(obj)

timeToString = (time) => {
  const date = new Date(time);
  // console.log(date.toISOString().split('T')[0])
  return date.toISOString().split('T')[0];
}

export default function CalendarApp() {
  
const [tasks, setTasks] = useState([]);
const taskRef = firebase.firestore().collection('tasks');

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
                  tasks.push({
                      id: doc.id,
                      heading,
                      notificationDate,
                      isCompleted,
                      alarmIdentifier,
                      YYMMDD,

                  })
              })
              setTasks(tasks)
          }
      )
  }
  return () => { isMounted = false }; // cleanup toggles value, if unmounted
}, [])
  

  
  const [items, setItems] = useState({});



  const loadItems = (day) => {
    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];
          
          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime
            });
          }
        }
      }
      
      const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
    }, 2000);
  }

  const renderItem = (item) => {

    return (
    <TouchableOpacity>
      <Card>
        <Card.Content>
          <View>
            <Text>
              {item.name}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>)
  }

    return (
      <View style={{flex: 1}}>
<Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2022/08/07'}
        renderItem={renderItem}
        />
      </View>
    );
  } 