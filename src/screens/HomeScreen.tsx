import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import Voice from '@react-native-voice/voice';
import Geolocation from 'react-native-geolocation-service';

import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParams} from '../navigator/Navigator';

import {format} from 'date-fns';
import {es} from 'date-fns/locale';

import {
  useLocation,
  editLocation,
  deleteLocation,
  addLocation,
} from '../hooks/useLocations';
import {AuthContext} from '../context/AuthContext';

import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

interface Props extends StackScreenProps<RootStackParams, 'Home'> {}

const HomeScreen = ({navigation}: Props) => {
  const {user} = useContext(AuthContext);

  const {locations, loadLocation} = useLocation();

  const [title, setTitle] = useState('');
  const [idLocation, setidLocation] = useState('');

  const [grabando, setGrabando] = useState(false);
  const [changeDirection, setChangeDirection] = useState(false);

  useEffect(() => {
    Voice.onSpeechStart = onSpeechStartHandler;
    Voice.onSpeechEnd = onSpeechEndHandler;
    Voice.onSpeechResults = onSpeechResultsHandler;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStartHandler = (e: any) => {
    
    console.log(e)

  };

  const onSpeechEndHandler = (e: any) => {
    console.log(e);
  };

  const onSpeechResultsHandler = (e: any) => {
    let text = e.value[0];

    Geolocation.getCurrentPosition(
      info => {
        if (info) {
          console.log('INFOF')
          const coords = {
            latitud: info.coords.latitude,
            longitud: info.coords.longitude,
          };

          const newLocation = {
            userId: user?.uid,
            latlng: coords,
            title: text,
            timestamp: new Date(),
            // timestamp: firestore.Timestamp.fromDate(new Date())
          };

          addLocation(newLocation)
          
        }
      },
      err => console.log('ESTE ES EL ERROR', err),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

  };

  const editDirection = (id: string, title: string) => {
    setTitle(title);
    setidLocation(id);
    setChangeDirection(true);
  };

  const changeLocation = () => {
    if (title === '') {
      setChangeDirection(true);
      return;
    }

    const titleClean = title.trim();

    editLocation(idLocation, titleClean);

    setChangeDirection(false);
  };

  const recordTitle = async () => {
    setGrabando(true);
    try {
      await Voice.start('es-ES');
    } catch (error) {
      console.log('GRABAR TITLE', error);
    }
  };

  const stopRecording = async () => {
    try {
      await Voice.stop();
      console.log('despues de grabar')
    } catch (error) {
      console.log(error);
    }

    setGrabando(false);

    // setRecord('')
  };

  return (
    <>
      {changeDirection && (
        <View style={styles.modalAddress}>
          <View style={[styles.modalContainer]}>
            <TextInput
              placeholderTextColor="#4B4453"
              style={styles.direccionInput}
              value={title}
              onChangeText={value => setTitle(value)}
            />
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={changeLocation}
              style={styles.btnOrder}>
              <Text style={styles.btnOrderText}>Actualizar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setChangeDirection(false)}
              style={styles.btnCancelar}>
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mis Places</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Profile')}>
            <Icon name="settings-outline" size={25} color="#4B4453" />
          </TouchableOpacity>
        </View>
        {locations ? (
          <FlatList
            style={styles.lista}
            showsVerticalScrollIndicator={false}
            data={locations}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={styles.cardContainer}>
                <TouchableOpacity
                  style={styles.cardMapLink}
                  activeOpacity={0.7}
                  onPress={() =>
                    navigation.navigate('Location', {
                      latitude: item.latlng.latitud,
                      longitude: item.latlng.longitud,
                    })
                  }>
                  <Text style={styles.titleCard} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                  <Text style={styles.dateCard}>
                    {format(item.timestamp.toDate(), 'LLLL d, yyyy', {
                      locale: es,
                    })}
                  </Text>
                </TouchableOpacity>
                <View style={styles.containerActions}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => editDirection(item.id, item.title)}
                    style={styles.iconSeparator}>
                    <Icon name="create-outline" size={22} color="#4B4453" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => deleteLocation(item.id)}>
                    <Icon name="trash-outline" size={22} color="#4B4453" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ItemSeparatorComponent={() => (
              <View style={styles.separador}></View>
            )}
          />
        ) 
        // : loadLocation ? (
        //   <View
        //     style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //     <Text style={styles.noPlaces}>Aún no tienes places</Text>
        //   </View>
        // ) 
        : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color="#8D58E2" />
          </View>
        )}
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.btnRecord}
          onPressOut={stopRecording}
          onLongPress={recordTitle}>
          {grabando ? (
            <Icon name="pause-outline" size={26} color="#F8F8F8" />
          ) : (
            <Icon name="mic-outline" size={26} color="#F8F8F8" />
          )}
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 20,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#4B4453',
  },
  lista: {
    marginHorizontal: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  cardMapLink: {
    flex: 1,
  },
  titleCard: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#4B4453',
  },
  dateCard: {
    marginTop: -6,
    color: '#86828B',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  containerActions: {
    flexDirection: 'row',
  },
  iconSeparator: {
    marginHorizontal: 10,
  },
  separador: {
    width: width,
    height: 1,
    backgroundColor: '#E3E3E3',
  },
  btnRecord: {
    position: 'absolute',
    bottom: 30,
    left: width / 2 - 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#8D58E2',
  },
  modalAddress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 999,
  },
  modalContainer: {
    top: height / 2 - 100,
    marginHorizontal: 20,
    padding: 10,
    borderRadius: 4,
    backgroundColor: '#F8F8F8',
  },
  direccionInput: {
    marginTop: 10,
    height: 45,
    backgroundColor: '#C9C9CC',
    borderRadius: 4,
    paddingHorizontal: 20,
    color: '#4B4453',
    fontFamily: 'Poppins-SemiBold',
  },
  btnOrder: {
    marginTop: 10,
    backgroundColor: '#8D58E2',
    height: 45,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitulo: {
    textAlign: 'center',
    color: '#5A5B62',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    marginTop: 8,
  },
  btnCancelar: {
    alignItems: 'center',
    marginTop: 15,
  },
  btnCancelarText: {
    color: '#8D58E2',
    fontWeight: '500',
    fontFamily: 'Poppins-Medium',
  },
  btnOrderText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  noPlaces: {
    color: '#4B4453',
    fontFamily: 'Poppins-SemiBold',
  }
});

export default HomeScreen;
