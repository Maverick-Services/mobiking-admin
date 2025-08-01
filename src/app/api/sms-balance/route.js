// app/api/sms-balance/route.js

import { NextResponse } from 'next/server'
import axios from 'axios'

export async function GET() {
    try {
        const response = await axios.get('https://api.mylogin.co.in/api/v2/Balance', {
            params: {
                ApiKey: 'DmGRastE1TT0vCDJyjMJYMEi+peSX/vPuybBpFaCcZ8=',
                ClientId: 'a87c4262-3525-46c3-9abd-bc98d2427fbf',
            },
        })

        return NextResponse.json(response.data)
    } catch (error) {
        console.error('Error fetching SMS balance:', error)
        return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 })
    }
}
