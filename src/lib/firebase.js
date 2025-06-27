// lib/firebase-client.js
"use client"

import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEYUKlsycfCcvxJ7ZbHFV_J31x10IjaoU",
  authDomain: "aaaa-769c6.firebaseapp.com",
  projectId: "aaaa-769c6",
  storageBucket: "aaaa-769c6.firebasestorage.app",
  messagingSenderId: "959874165382",
  appId: "1:959874165382:web:f1d4d7a46b1c7249aaff07",
  validKey: "AIzaSyBEYUKlsycfCcvxJ7ZbHFV_J31x10IjaoU"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const messaging = getMessaging(app);

export const requestPermissionAndSaveToken = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: process.env.FIREBASE_VAPID_KEY,
    });

    if (token) {
      await addDoc(collection(db, "deviceTokens"), {
        token,
        platform: "web",
        createdAt: new Date(),
      });
      console.log("Token saved:", token);
    }
  } catch (err) {
    console.error("Token error:", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
