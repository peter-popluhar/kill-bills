import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDwUNnoGXS-ibjAc1XjUHe-P22DfobTh3A",
    authDomain: "killbills-528e.firebaseapp.com",
    databaseURL: "https://killbills-528e.firebaseio.com",
    projectId: "killbills-528e",
    storageBucket: "killbills-528e.appspot.com",
    messagingSenderId: "112394541996"
};

firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();

export default firebase;


