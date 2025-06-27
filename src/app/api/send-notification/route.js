import { messaging } from '@/lib/firebase-admin'
import admin from 'firebase-admin'

const db = admin.firestore()

export async function POST(req) {
  try {
    const { title, message, image, redirect } = await req.json()

    if (!title || !message) {
      return Response.json({ error: 'Missing title or message' }, { status: 400 })
    }

    // 1. Get all tokens from Firestore
    const tokensSnapshot = await db.collection('deviceTokens').get()
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token).filter(Boolean)

    if (tokens.length === 0) {
      return Response.json({ error: 'No tokens found' }, { status: 404 })
    }

    // 2. Prepare the message
    const payload = {
      notification: {
        title,
        body: message,
        ...(image && { image })
      },
      data: {
        ...(redirect && { redirect }) 
      },
      tokens,
    }

    // 3. Send notification
    const response = await messaging.sendMulticast(payload)

    return Response.json({ success: true, sent: response.successCount, failed: response.failureCount })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
