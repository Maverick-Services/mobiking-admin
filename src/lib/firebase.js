// lib/firebase.js
"use client"

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, isSupported } from "firebase/messaging";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC2cD8s816pK1xC_zSI4eGG_Yjro8X_Gm4",
  authDomain: "mobiking-25fc3.firebaseapp.com",
  projectId: "mobiking-25fc3",
  storageBucket: "mobiking-25fc3.firebasestorage.app",
  messagingSenderId: "397433355252",
  appId: "1:397433355252:web:cc8c08179b3ad2c10857a1",
  validKey: "AIzaSyC2cD8s816pK1xC_zSI4eGG_Yjro8X_Gm4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Only initialize messaging in browser environment
let messaging = null;
if (typeof window !== 'undefined') {
  // Check if messaging is supported before initializing
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging };

export const requestPermissionAndSaveToken = async () => {
  // Check if we're in browser environment and messaging is available
  if (typeof window === 'undefined' || !messaging) {
    console.log('Messaging not available in this environment');
    return;
  }

  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log('Notification permission denied');
      return;
    }

    // Check if VAPID key is available
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
    if (!vapidKey) {
      console.error('VAPID key not found in environment variables');
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: vapidKey,
    });

    if (token) {
      await addDoc(collection(db, "deviceTokens"), {
        token,
        platform: "web",
        createdAt: new Date(),
      });
      console.log("Token saved:", token);
      return token;
    }
  } catch (err) {
    console.error("Token error:", err);
  }
};

export const onMessageListener = () => {
  if (typeof window === 'undefined' || !messaging) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};





// // lib/firebase-client.js
// "use client"

// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyBEYUKlsycfCcvxJ7ZbHFV_J31x10IjaoU",
//   authDomain: "aaaa-769c6.firebaseapp.com",
//   projectId: "aaaa-769c6",
//   storageBucket: "aaaa-769c6.firebasestorage.app",
//   messagingSenderId: "959874165382",
//   appId: "1:959874165382:web:f1d4d7a46b1c7249aaff07",
//   validKey: "AIzaSyBEYUKlsycfCcvxJ7ZbHFV_J31x10IjaoU"
// };

// const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app);
// export const messaging = getMessaging(app);

// export const requestPermissionAndSaveToken = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") return;

//     const token = await getToken(messaging, {
//       vapidKey: process.env.FIREBASE_VAPID_KEY,
//     });

//     if (token) {
//       await addDoc(collection(db, "deviceTokens"), {
//         token,
//         platform: "web",
//         createdAt: new Date(),
//       });
//       console.log("Token saved:", token);
//     }
//   } catch (err) {
//     console.error("Token error:", err);
//   }
// };

// export const onMessageListener = () =>
//   new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
