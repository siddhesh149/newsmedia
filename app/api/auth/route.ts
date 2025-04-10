import { NextRequest, NextResponse } from 'next/server'

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    console.log('Auth request received')
    const { secret } = await request.json()
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminSecret) {
      console.error('Admin secret not configured in environment')
      return new NextResponse(
        JSON.stringify({ error: 'Admin secret not configured' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    // Trim both strings to handle any whitespace issues
    const cleanSecret = secret?.trim()
    const cleanAdminSecret = adminSecret.trim()

    console.log('Comparing secrets:', { 
      providedLength: cleanSecret?.length,
      expectedLength: cleanAdminSecret.length 
    })

    if (!cleanSecret || cleanSecret !== cleanAdminSecret) {
      console.error('Invalid admin secret provided')
      return new NextResponse(
        JSON.stringify({ error: 'Invalid admin secret' }),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      )
    }

    console.log('Authentication successful')
    return new NextResponse(
      JSON.stringify({ 
        success: true,
        token: cleanAdminSecret
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return new NextResponse(
      JSON.stringify({ error: 'Authentication failed' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
} 