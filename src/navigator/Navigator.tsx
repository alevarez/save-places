import React, { useContext, useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import { AuthContext } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from '../screens/HomeScreen';
import LocationScreen from '../screens/LocationScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SlideScreen from '../screens/SlideScreen';
import { LatLng } from 'react-native-maps';
// import { OrderScreen } from '../screens/OrderScreen';


export type RootStackParams = {
  Login: undefined,
  Register: undefined,
  Home: undefined,
  Location: LatLng,
  Order: undefined,
  Profile: undefined,
  Slide: undefined
}

const Stack = createStackNavigator<RootStackParams>();

export const Navigator = () => {

  const {user, initializing} = useContext(AuthContext)

  const [showSlide, setShowSlide] = useState(true)


  useEffect(() => {
    getData()
  }, [user])


  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@slide')
      if(value !== null) {
        setShowSlide(false)
      }
    } catch(e) {
      console.log(e)
    }
  }


  if (initializing) {
    return (
      <View style={{flex: 1, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#8D58E2" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#F8F8F8'
        }
      }}
    >
      {!user 
        ? (
          <>
            {showSlide && (
              <Stack.Screen name="Slide" component={SlideScreen} />
            )}
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) 
        : (
          <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          </>
        )
      }
    </Stack.Navigator>
  );
}