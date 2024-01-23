import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAvgu4vqmEAY20w3qWQaufcBwugCwm98UM',
    authDomain: 'realtime-chat-5aedd.firebaseapp.com',
    projectId: 'realtime-chat-5aedd',
    storageBucket: 'realtime-chat-5aedd.appspot.com',
    messagingSenderId: '737058366268',
    appId: '1:737058366268:web:ecc997195199f083f13439',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
// const firestore = getFirestore(app);
// export { firestore };