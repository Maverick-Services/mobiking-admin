"use client"
import { useEffect } from 'react'
import { requestPermissionAndSaveToken, onMessageListener } from '@/lib/firebase'

export default function PushNotificationClient() {
  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('SW registered:', registration);
        }).catch((err) => {
          console.error('SW registration failed:', err);
        });
    }

    // Request permission and save token
    requestPermissionAndSaveToken()

    // Listen for foreground messages
    onMessageListener().then((payload) => {
      console.log("Foreground Push Received:", payload)
      // Optional: Show a toast or UI alert
    })
  }, [])

  return null
}
