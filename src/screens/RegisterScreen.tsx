import React, { useState } from 'react'
import { ActivityIndicator, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigator/Navigator';

import {useAuthentication} from '../hooks/useAuthentication'

import Logotipo from '../components/Logotipo';

import { Notification } from '../components/Notification';

interface Props extends StackScreenProps<RootStackParams, 'Register'> {} 

const RegisterScreen = ({navigation}: Props) => {

    const {signUp, isLoading, mensaje, tipo, showError} = useAuthentication();


    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const onRegister = async () => {
        Keyboard.dismiss();
        signUp(name, email, password);
    }

    return (
        <View style={styles.contenido}>
            
            <ScrollView
                contentContainerStyle={{flex:1}}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.viewContainer}>
                    
                    <View style={styles.logotipo}>
                        <Logotipo />
                    </View>
                    <TextInput 
                        placeholder="Nombre"
                        placeholderTextColor="#7d7d82"
                        style={styles.direccionInput}
                        keyboardType="default"
                        autoCapitalize="words"
                        autoCorrect={false}
                        value={name}
                        onChangeText={(value) => setName(value)}
                    />
                    <TextInput 
                        placeholder="Email"
                        placeholderTextColor="#7d7d82"
                        style={styles.direccionInput}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={(value) => setEmail(value)}
                    />
                    <TextInput 
                        placeholder="Password"
                        placeholderTextColor="#7d7d82"
                        style={styles.direccionInput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(value) => setPassword(value)}
                    />
                    <TouchableOpacity activeOpacity={0.7} disabled={isLoading} onPress={onRegister} style={[styles.btnOrder, isLoading ? styles.btnOrderNot : styles.btnOrderYes]}>
                    {isLoading ? (<ActivityIndicator size="small" color="#F8F8F8" />) : (<Text style={styles.btnOrderText}>Registrarme</Text>)}
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.replace('Login')} style={styles.btnCancelar}>
                        <Text style={styles.btnCancelarText}>¿Ya tienes cuenta?</Text>
                        <Text style={styles.btnCancelarTextRegister}>Login</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            {showError && <Notification texto={mensaje} tipo={tipo} />}
        </View>
    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    contenido: {
        flex: 1,
        backgroundColor: '#F8F8F8'
    },
    viewContainer: {
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
        paddingTop: 50
    },
    direccionInput: {
        marginTop: 10,
        height: 45,
        backgroundColor: '#C9C9CC',
        borderRadius: 4,
        paddingHorizontal: 20,
        color: '#F8F8F8',
        fontFamily: 'Poppins-Regular'
    },
    btnOrderNot: {
        backgroundColor: '#cbb4f0',
    },
    btnOrderYes: {
        backgroundColor: '#8D58E2',
    },
    btnOrder: {
        marginTop: 20,
        height: 45,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnOrderText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'Poppins-Medium'
    },
    btnCancelar: {
        alignItems: 'center',
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnCancelarText: {
        color: '#4B4453',
        marginRight: 8,
        fontFamily: 'Poppins-Regular'
    },
    btnCancelarTextRegister: {
        color: '#8D58E2',
        fontFamily: 'Poppins-Regular'
    },
    markerBG: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: -10,
        left: 0,
        right: 0
    },
    markerBGImage: {
        transform: [{scale: 0.8,}]
    },
    logotipo: {
        bottom: 30,
        alignItems: 'center'
    }
});