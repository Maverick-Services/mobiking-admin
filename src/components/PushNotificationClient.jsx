// components/PushNotificationClient.jsx
"use client"
import { useEffect } from 'react'

export default function PushNotificationClient() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initializeFirebase = async () => {
      try {
        const { requestPermissionAndSaveToken, onMessageListener } = await import('@/lib/firebase');
        
        // Register service worker
        if ('serviceWorker' in navigator) {
          await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        }

        // Request permission and save token
        await requestPermissionAndSaveToken();

        // Listen for foreground messages
        const payload = await onMessageListener();
        if (payload) {
          console.log("Foreground Push Received:", payload);
        }
      } catch (error) {
        console.error('Firebase initialization error:', error);
      }
    };

    initializeFirebase();
  }, []);

  return null;
}