import React, {useContext, useState} from "react"
import { Text, View, TouchableOpacity, TextInput, ScrollView, StyleSheet, ActivityIndicator } from "react-native"

import { StackScreenProps } from "@react-navigation/stack"
import { RootStackParams } from "../navigator/Navigator"

import { AuthContext } from "../context/AuthContext"
import {useAuthentication} from '../hooks/useAuthentication'

import { Notification } from "../components/Notification"

import Icon from 'react-native-vector-icons/Ionicons';

interface Props extends StackScreenProps<RootStackParams, 'Profile'> {} 

const ProfileScreen = ({navigation}:Props) => {


    const {user} = useContext(AuthContext)
    const {signOut, changeName, changeEmail, isLoading, mensaje, tipo, showError} = useAuthentication()

    const [editName, setEditName] = useState(false)
    const [editEmail, setEditEmail] = useState(false)

    const [name, setName] = useState<string | null>(user ? user?.displayName : '')
    const [email, setEmail] = useState<string | null>(user ? user?.email : '')
    const [password, setPassword] = useState<string>('')


    const [showpass, setShowpass] = useState<boolean>(false)


    const editarEmail = () => {
        setEditEmail(prevName => !prevName)

        setShowpass(false)
        setPassword('')
    }


    const updateUser = () => {
        if (name === user?.displayName) {
            if (email === user?.email) {
                setEditName(false)
                setEditEmail(false)
                return
            }
        }

        if (name !== null && name !== '' && name !== user?.displayName) {
            changeName(name)
            setEditName(false)
        }

        if (email === user?.email) {
            setEditName(false)
            setEditEmail(false)
            return
        }

        if (email !== null && email !== '' && password !== '') {
            changeEmail(email, password)
            setEditEmail(false)
        }

    }



    if (!user) {
        return (
            <View style={{flex: 1, backgroundColor: '#F8F8F8', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size="small" color="#8D58E2" />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mi Perfil</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.goBack()}>
                    <Icon name="close-outline" size={32} color="#4B4453" />
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.formulario}>
                <View  style={styles.containerField}>
                    <Text>Nombre</Text>
                    <View>
                        <TextInput 
                            underlineColorAndroid='#E3E3E3'
                            style={[styles.editInput, editName ? styles.editInputColor : styles.editInputColorNone]}
                            keyboardType="default"
                            autoCapitalize="words"
                            autoCorrect={false}
                            editable={editName}
                            value={name ? name : ''}
                            onChangeText={(value) => setName(value)}
                        />
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setEditName(prevName => !prevName)} style={styles.btnEditar}>
                            <Icon name="create-outline" size={22} color="#4B4453" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.containerField}>
                    <Text>Email</Text>
                    <View>
                        <TextInput
                            underlineColorAndroid='#E3E3E3'
                            style={[styles.editInput, editEmail ? styles.editInputColor : styles.editInputColorNone]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={editEmail}
                            value={email ? email : ''}
                            onChangeText={(value) => setEmail(value)}
                        />
                        <TouchableOpacity activeOpacity={0.7} onPress={editarEmail} style={styles.btnEditar}>
                            <Icon name="create-outline" size={22} color="#4B4453" />
                        </TouchableOpacity>
                    </View>
                </View>
                {editEmail && (
                    <View style={styles.containerField}>
                        <Text style={styles.passwordIngrese}>Ingrese password para editar su email</Text>
                        <View>
                            <TextInput
                                secureTextEntry={!showpass}
                                placeholder="********"
                                placeholderTextColor="#86828B"
                                underlineColorAndroid='#E3E3E3'
                                style={[styles.editInput, editEmail ? styles.editInputColor : styles.editInputColorNone]}
                                keyboardType="default"
                                autoCorrect={false}
                                value={password}
                                onChangeText={(value) => setPassword(value)}
                            />
                        </View>
                        <TouchableOpacity activeOpacity={0.7} onPress={() => setShowpass(prevName => !prevName)} style={styles.btnEditar}>
                            <Icon name={showpass ? "eye-outline" : "eye-off-outline"} size={22} color="#4B4453" />
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity activeOpacity={0.7} onPress={updateUser} disabled={isLoading} style={[styles.btnOrder, isLoading ? styles.btnOrderNot : styles.btnOrderYes]}>
                    {isLoading ? (<ActivityIndicator size="small" color="#F8F8F8" />) : (<Text style={styles.btnOrderText}>Actualizar</Text>)}
                </TouchableOpacity>
            </ScrollView>
            <View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => signOut()} style={styles.btnCancelar}>
                    <Text style={styles.btnCancelarTextRegister}>Logout</Text>
                </TouchableOpacity>
            </View>
            {showError && <Notification texto={mensaje} tipo={tipo} />}
        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: 20,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontFamily: "Poppins-Bold",
        fontSize: 18,
        color: '#4B4453'
    },
    formulario: {
        flex: 1,
        marginHorizontal: 20
    },
    btnCancelar: {
        alignItems: 'center',
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btnCancelarTextRegister: {
        color: '#8D58E2',
        fontFamily: 'Poppins-Medium'
    },
    editInput: {
        fontFamily: 'Poppins-SemiBold'
    },
    editInputColor: {
        color: '#4B4453',
    },
    editInputColorNone: {
        color: '#a09da3',
    },
    btnEditar: {
        position: 'absolute',
        bottom: 15,
        right: 0
    },
    containerField: {
        marginBottom: 10
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
    passwordIngrese: {
        color: '#4B4453',
    }
})