import firebaseSaga from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import ReduxSagaFirebase from "redux-saga-firebase";

export const firebaseConfig = {
  apiKey: "AIzaSyCeSYtfl0_ZPbgMVwbCXdZHGxTjbUTe1Xs",
  authDomain: "prototypdigital-todoapp.firebaseapp.com",
  databaseURL: "https://prototypdigital-todoapp.firebaseio.com",
  projectId: "prototypdigital-todoapp",
  storageBucket: "prototypdigital-todoapp.appspot.com",
  messagingSenderId: "497548440231",
  appId: "1:497548440231:web:19b14dfcf504b21f8b2182",
  measurementId: "G-8V32LC1CMQ"
};

const firebaseInit = firebaseSaga.initializeApp(firebaseConfig);
firebaseInit.firestore().enablePersistence({ synchronizeTabs: true });

export { firebaseInit }

export const reduxSagaFirebase = new ReduxSagaFirebase(firebaseInit);

export default firebaseSaga;
