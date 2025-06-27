"use client"
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBEYUKlsycfCcvxJ7ZbHFV_J31x10IjaoU",
  authDomain: "aaaa-769c6.firebaseapp.com",
  projectId: "aaaa-769c6",
  storageBucket: "aaaa-769c6.firebasestorage.app",
  messagingSenderId: "959874165382",
  appId: "1:959874165382:web:f1d4d7a46b1c7249aaff07", 
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo1.png", 
    data: payload.data || {},
  });
});
