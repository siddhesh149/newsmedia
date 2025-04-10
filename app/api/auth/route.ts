import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret) {
      return new NextResponse(
        JSON.stringify({ error: 'Admin secret not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Trim both strings to handle any whitespace issues
    if (secret?.trim() !== adminSecret.trim()) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid admin secret' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    return new NextResponse(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Authentication failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
} 