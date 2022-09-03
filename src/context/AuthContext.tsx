import React, { createContext, useEffect, useState } from "react";

import auth ,{ FirebaseAuthTypes } from '@react-native-firebase/auth';

type AuthProps = {
  user: FirebaseAuthTypes.User | null,
  initializing: boolean,
  setUser: (user: any) => void
}

export const AuthContext = createContext<AuthProps>({
    user: null,
    initializing: true,
    setUser: () => {}
});



//   if (initializing) return null;

export const AuthProvider = ({children}: any) => {

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  function onAuthStateChanged(user:any ) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);


    return (
      <AuthContext.Provider value={{user, initializing, setUser}}>
        {children}
      </AuthContext.Provider>
    )
}