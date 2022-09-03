import React, {useRef} from "react"
import { View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

import MapView, { Marker } from "react-native-maps"

import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../navigator/Navigator"

import Icon from 'react-native-vector-icons/Ionicons';

interface Props extends StackScreenProps<RootStackParams, 'Location'> {} 

const LocationScreen = ({navigation, route: {params}}: Props) => {

    const {latitude, longitude} = params

    const mapViewRef = useRef<MapView>()


    const MAPSTYLES = [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ]

    const initialRegion = {
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421
    }
    
    
    const centerPosition = () => {
      mapViewRef.current?.animateCamera({
        center: {latitude, longitude}
      })
    }



    if (!initialRegion) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="small" color="#8D58E2" />
        </View>
      )
    }      

    return (
        <View style={styles.container}>
            <MapView
              ref={(el) => mapViewRef.current = el!}
              style={{flex: 1}}
              customMapStyle={MAPSTYLES} 
              initialRegion={initialRegion}
            >
              <Marker 
                coordinate={{
                  latitude: latitude,
                  longitude: longitude,
                }}
                image={require('../../assets/images/map-marker.png')}
                title="Location"
                description="Descripocion del marker"
              />
            </MapView>
            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()} style={styles.btnBack}>
                <Icon name="chevron-back-outline" size={22} color="#4B4453" />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} style={styles.btnRecord} onPress={centerPosition}>
                <Icon name="compass-outline" size={26} color="#F8F8F8" />
            </TouchableOpacity>
        </View>
    )
}

export default LocationScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnBack: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 42,
        height: 42,
        borderRadius: 23,
        backgroundColor: '#F8F8F8',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    btnRecord: {
        position: 'absolute',
        bottom: 30,
        right: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#8D58E2',
        elevation: 5
    }
})