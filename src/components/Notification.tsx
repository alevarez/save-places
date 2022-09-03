import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
    texto: string,
    tipo: string
}

export const Notification = ({texto, tipo = 'error'}: Props) => {

    return (
        <View style={[styles.container, tipo === 'error' ? styles.bgError : styles.bgSuccess]}>
            <Text style={styles.textoNotificacion}>{texto}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bgError: {
        backgroundColor: '#6d707d',
    },
    bgSuccess: {
        backgroundColor: '#aebfb2',
    },
    textoNotificacion: {
        color: '#F8F8F8',
        fontFamily: 'Poppins-Regular'
    }
});