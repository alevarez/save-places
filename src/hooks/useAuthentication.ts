import {useContext, useState} from 'react';

import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

import {EmailValidation} from '../utils/validations'
import { AuthContext } from '../context/AuthContext';

export const useAuthentication = () => {

    const user = auth()

    const {setUser} = useContext(AuthContext)


    const [isLoading, setIsLoading] = useState(false);

    const [mensaje, setMensaje] = useState('');
    const [tipo, setTipo] = useState('');

    const [showError, setShowError] = useState(false);



    const mostrarNotificacion = () => {
        setShowError(true);
        setTimeout(() => {
            setShowError(false);
        }, 1500);
    }


    const signUp = async (name: string, email: string, password: string) => {

        setIsLoading(true)


        if (name === '' || email === '' || password === '') {
            setMensaje('Debe llenar los campos');
            setTipo('error');
            mostrarNotificacion();
            setIsLoading(false)
            return;
        }

        if (!EmailValidation({email})) {
            setMensaje('Debe ingresar email valido');
            setTipo('error');
            setIsLoading(false)
            mostrarNotificacion();
            
            return
        }

        if (password.length < 6) {
            setMensaje('El password debe ser de al menos 6 caracteres');
            setTipo('error');
            mostrarNotificacion();
            setIsLoading(false)
            return;
        } 


        
        try {
            await user.createUserWithEmailAndPassword(email, password);   
            await user.currentUser?.updateProfile({
                   displayName: name
            }) 
            
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                setMensaje('Email ya existe');
                setTipo('error');
                mostrarNotificacion();
            } else if (error.code === 'auth/user-not-found') {
                setMensaje('Email o password incorrecto');
                setTipo('error');
                mostrarNotificacion();
            } else {
                setMensaje('No se pudo ingresar!');
                setTipo('error');
                mostrarNotificacion();
            }
        } finally {
            setIsLoading(false);
        }
    }

    const signIn = async (email: string, password: string) => {

        setIsLoading(true)


        if (email === '' || password === '') {
            setMensaje('Debe llenar los campos');
            setTipo('error');
            mostrarNotificacion();
            setIsLoading(false)
            return;
        }

        if (!EmailValidation({email})) {
            setMensaje('Debe ingresar email valido');
            setTipo('error');
            setIsLoading(false)
            mostrarNotificacion();
            
            return
        }

        if (password.length < 6) {
            setMensaje('El password debe ser de al menos 6 caracteres');
            setTipo('error');
            mostrarNotificacion();
            setIsLoading(false)
            return;
        } 


        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (error:any) {
            if (error.code === 'auth/user-not-found') {
                setMensaje('Email o password incorrecto');
                setTipo('error');
                mostrarNotificacion();
            } else {
                setMensaje('No se pudo ingresar!');
                setTipo('error');
                mostrarNotificacion();
            }
        } finally {
            setIsLoading(false);
        }
    }

    const signOut = () => {
        auth().signOut();
    }


    const changeName = async (name: string) => {
        setIsLoading(true)

        try {
            await user.currentUser?.updateProfile({
                   displayName: name
            }) 
            const newUser = user.currentUser
            setUser(newUser)

            setMensaje('Se Actualizó el nombre correctamente')
            setTipo('success')
            mostrarNotificacion()
        } catch (error: any) {
            setMensaje('No se pudo Actualizar el nombre');
            setTipo('error');
            mostrarNotificacion();
        } finally {
            setIsLoading(false);
        }
    }


    
    
    const changeEmail = async (email: string, password: string) => {
        setIsLoading(true)

        if (!EmailValidation({email})) {
            setMensaje('Debe ingresar email valido');
            setTipo('error');
            setIsLoading(false)
            mostrarNotificacion();
            
            return
        }

        try {

            const provider = firebase.auth.EmailAuthProvider;

            const emailOld = user.currentUser?.email
            const authCredential = provider.credential(emailOld!, password);
            
            await auth().currentUser?.reauthenticateWithCredential(authCredential)
            await user.currentUser?.updateEmail(email)

            const newUser = user.currentUser
            setUser(newUser)

            setMensaje('Se Actualizó el email correctamente')
            setTipo('success')
            mostrarNotificacion()


        } catch (error: any) {
            console.log(error)
            setMensaje('No se pudo Actualizar el email');
            setTipo('error');
            mostrarNotificacion();
        } finally {
            setIsLoading(false);
        }
    }

    return {signUp, signIn, signOut, changeName, changeEmail, isLoading, mensaje, tipo, showError}
}
