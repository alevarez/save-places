import React, { useRef, useState } from "react"
import { View, StyleSheet, FlatList, Animated, TouchableOpacity, Text } from "react-native"

import AsyncStorage from '@react-native-async-storage/async-storage'

import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../navigator/Navigator"

import SlideItem from "../components/SlideItem"
import Paginator from "../components/Paginator"

interface Props extends StackScreenProps<RootStackParams, 'Slide'> {}

const SlideScreen = ({navigation}: Props) => {


    const SLIDE_DATA = [
        {id: '1', title: '¡ Hola te esperabamos !', description: 'Te damos la bienvenida a saveLocation, donde podrás guardar la ubicación de los sitios de tu interés para poder volver cuando quieras.', image: require('../../assets/images/logo.png')},
        {id: '2', title: '¿ Como funciona ?', description: 'Crea tu cuenta registrandote, luego en tus Places manten presionado el botón del micrófono y dí un nombre identificatorio del lugar que deseas guardar(ej, “Panadería”).', image: require('../../assets/images/mic.png')},
        {id: '3', title: '¿ Como funciona ?', description: 'Una vez sueltes el botón, automáticamente te aparecerá el lugar que acabas de guardar en tu lista de places, donde podrás, eliminar o editar el título que le diste.', image: require('../../assets/images/pause.png')},
        {id: '4', title: '¿ Como funciona ?', description: 'Ahora tu place ha quedado guardado al hacer tap en el te llevara al mapa donde aparecerá la ubicación donde este fue creado.', image: require('../../assets/images/marker-onboard.png')},
    ]

    const [currentIndex, setCurrentIndex] = useState(0)
    const scrollX = useRef(new Animated.Value(0)).current

    const slidesRef = useRef(null)


    const viewableItemsChanged = useRef(({viewableItems}: any) => {
        setCurrentIndex(viewableItems[0].index)
    }).current

    const viewConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current


    const storeData = async () => {
        try {
          await AsyncStorage.setItem('@slide', 'Ya mostrado')
        } catch (e) {
          // saving error
        }

        navigation.navigate('Login')
    }

    return (
        <View style={styles.container}>
            <View style={{flex: 1}}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    pagingEnabled
                    bounces={false} 
                    data={SLIDE_DATA}
                    renderItem={({item}) => <SlideItem {...item} />}
                    keyExtractor={(item) => item.id}
                    onScroll={Animated.event([{nativeEvent: {contentOffset: {x: scrollX}}}], {
                        useNativeDriver: false
                    })}
                    scrollEventThrottle={32}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>
            <Paginator data={SLIDE_DATA} scrollX={scrollX} />
            <View style={styles.btnContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={storeData}>
                    <Text style={styles.textBtn}>{currentIndex === 3 ? 'Iniciar' : 'Saltar'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SlideScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnContainer: {
        paddingHorizontal: 30,
        width: '100%',
        height: 60,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    textBtn: {
        color: '#8D58E2',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 16
    }
})
