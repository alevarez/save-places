import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import {
  StatusBar,
  PermissionsAndroid,
  View,
  Text,
  TouchableOpacity,
  Linking,
  LogBox,
  ActivityIndicator
} from 'react-native';

import { AuthProvider } from './src/context/AuthContext';

import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Navigator } from './src/navigator/Navigator';

import Logotipo from './src/components/Logotipo'


const App = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);

  const [loading, setLoading] = useState(false)

  const [permisos, setPermisos] = useState(false)
  const [permisos2, setPermisos2] = useState(false)

  const [isFinish, setIsFinish] = useState(false)

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#F8F8F8'
    },
  };


  useEffect(() => {
    requestMicroPermission()
  }, [])


  useEffect(() => {
    requestGpsPermission()
  }, [isFinish])


  const requestMicroPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermisos(true)
        setIsFinish(true)
      } else {
        setPermisos(false)
        setIsFinish(true)
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const requestGpsPermission = async () => {
    try {
      const granted2 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted2 === PermissionsAndroid.RESULTS.GRANTED) {
        setPermisos2(true)
        setLoading(true)
      } else {
        setPermisos2(false)
        setLoading(true)
      }
    } catch (err) {
      console.warn(err);
    }
  }

  const handlePress = useCallback(async () => {
    await Linking.openSettings();
  }, []);


  if (!loading) {
    return (
      <View style={{flex: 1, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="small" color="#8D58E2" />
      </View>
    )
  }


  if (!permisos || !permisos2) {
    return (
      <>
        <StatusBar backgroundColor="#E7E7E7" barStyle="dark-content" />
        <View style={{flex: 1, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20}}>
          <Logotipo />
          <Text style={{fontFamily: 'Poppins-SemiBold', textAlign: 'center', marginTop: 20, fontSize: 18}}>Bienvenido</Text>
          <Text style={{fontFamily: 'Poppins-Medium', textAlign: 'center', marginTop: 10}}>La aplicación necesita el uso del microfono y del GPS para poder guardar tus lugares de interes</Text>
          <TouchableOpacity 
            onPress={handlePress} 
            activeOpacity={0.7}
            style={{
              marginTop: 20,
              height: 45,
              width: '100%',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#8D58E2',
            }}
          >
            <Text style={{fontFamily: 'Poppins-SemiBold', color: 'white'}}>Ir a permisos</Text>
          </TouchableOpacity>
        </View>
      </>
    )
  }

 
  return (
    <NavigationContainer theme={MyTheme}>
      <AuthProvider>
        <StatusBar backgroundColor="#E7E7E7" barStyle="dark-content" />
        <Navigator />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default App;
