import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function Alarm() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    null
  );
}

export async function schedulePushNotification(year, month, date, Hour, Minute, userInput, {setIdentifier}) {
const trigger = new Date(Date.now());
console.log(trigger+'before')
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/setMonth
trigger.setFullYear(year,month,date)
trigger.setHours(Hour)
trigger.setMinutes(Minute)
trigger.setSeconds(0)
console.log(trigger+'after')
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "Habits Notification! 📬",
      body: userInput,
    },
    trigger,
  })
    setIdentifier(identifier)
}

export async function scheduleRecurringNotification(dayArr, Hour, Minute, userInput, {setIdentifier}) {
  var finale = [];
  for(var i=0;i<dayArr.length;i++) {
    const newIdentifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Habits Notification! 📬",
        body: userInput,
      },
      trigger: {
        repeats: true,
        weekday: dayArr[i],
        hour: Hour,
        minute: Minute
      },
    })
    finale.push(newIdentifier)
  }
    //setIdentifier(identifier)
    setIdentifier(finale);
    //setIdentifier(identifier => [...identifier, newIdentifier]);
  }

export async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}
