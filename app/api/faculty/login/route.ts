// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function POST(request: NextRequest) {
//   try {
//     console.log('Login API called')

//     const body = await request.json()
//     const { email } = body

//     console.log('Email from request:', email)

//     if (!email) {
//       console.log('Email is missing')
//       return NextResponse.json(
//         { success: false, error: 'Email is required' },
//         { status: 400 }
//       )
//     }

//     // Find faculty by email
//     console.log('Searching for faculty with email:', email)

//     const faculty = await prisma.faculty.findFirst({
//       where: {
//         email: email.toLowerCase() // ✅ Case-insensitive
//       },
//       select: {
//         id: true,
//         facultyId: true,
//         name: true,
//         designation: true,
//         email: true,
//         department: true,
//         contactNo: true
//       }
//     })

//     console.log('Faculty found:', faculty)

//     if (!faculty) {
//       console.log('Faculty not found for email:', email)
//       return NextResponse.json(
//         { success: false, error: 'Faculty not found. Please contact admin.' },
//         { status: 404 }
//       )
//     }

//     console.log('Returning faculty data successfully')

//     return NextResponse.json({
//       success: true,
//       faculty
//     })
//   } catch (error: any) {
//     console.error('Login API error:', error)
//     return NextResponse.json(
//       { success: false, error: error.message || 'Server error' },
//       { status: 500 }
//     )
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const faculty = await prisma.faculty.findFirst({
      where: {
        email: email.toLowerCase().trim()
      },
      select: {
        id: true,
        facultyId: true,
        name: true,
        designation: true,
        email: true,
        department: true,
        contactNo: true
      }
    })

    if (!faculty) {
      return NextResponse.json(
        { success: false, error: 'Faculty not found. Contact your administrator.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      faculty
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
