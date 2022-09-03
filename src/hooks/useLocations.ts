import {useContext, useEffect, useState} from 'react';

import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {AuthContext} from '../context/AuthContext';

export const useLocation = () => {
  const {user} = useContext(AuthContext);

  const userID = user?.uid;

  const [locations, setLocations] = useState<
    FirebaseFirestoreTypes.DocumentData[]
  >([]);

  const [loadLocation, setLoadLocation] = useState<boolean>(true)

  useEffect(() => {
    const subscriber = firestore()
      .collection('locations')
      .where('userId', '==', userID)
      .onSnapshot(documentSnapshot => {
        // console.log('User data: ', documentSnapshot.docs);
        let datos: FirebaseFirestoreTypes.DocumentData[] = [];

        documentSnapshot.docs.map(loc => {
          const id = loc.id;
          const data = {...loc.data(), id};

          datos.push(data);
        });

        setLocations(datos);
      });

      setLoadLocation(false)

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [userID]);

  return {locations, loadLocation};
};

export const addLocation = async (location: object) => {
  console.log(location);

  const locationRef = firestore().collection('locations');

  locationRef.add(location);
};

export const editLocation = async (id: string, title: string) => {
  const locationRef = firestore().collection('locations').doc(id);

  locationRef.update({
    title: title,
  });
};

export const deleteLocation = async (id: string) => {
  const locationRef = firestore().collection('locations').doc(id);

  locationRef.delete();
};
