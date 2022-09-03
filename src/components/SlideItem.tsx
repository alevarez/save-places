import React from "react"
import { View, StyleSheet, useWindowDimensions, Image, ImageSourcePropType, Text } from "react-native"

interface Props {
    id: string,
    title: string,
    description: string,
    image: ImageSourcePropType
} 

const SlideItem = ({id, title, description, image}: Props) => {
    
    const {width} = useWindowDimensions()
    
    return (
        <View style={[styles.container, {width}]}>
            <View style={styles.containerImage}>
                <Image source={image} style={[styles.image, {width: width / 3.5, resizeMode: 'contain'}]}  />
            </View>
            <View style={{flex: 0.5}}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    )
}

export default SlideItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerImage: {
        flex: 0.5,
        justifyContent: 'flex-end',
    },
    image: {
        marginBottom: 30
    },
    title: {
        color: '#8D58E2',
        fontFamily: 'Poppins-SemiBold',
        fontSize: 18,
        marginHorizontal: 20,
        textAlign: 'center',
    },
    description: {
        color: '#86828B',
        fontFamily: 'Poppins-Medium',
        marginHorizontal: 30,
        textAlign: 'center',
        marginTop: 20
    }
})

