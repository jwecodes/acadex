import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const enrollments = await prisma.studentEnrollment.findMany({
      include: {
        student: {
          select: {
            id: true,
            studentId: true,
            name: true,
            email: true
          }
        },
        course: {
          select: {
            id: true,
            courseCode: true,
            courseName: true,
            semester: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })

    return NextResponse.json({ success: true, enrollments })
  } catch (error) {
    console.error('Get enrollments error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { studentId, courseId } = await request.json()

    // Check if already enrolled
    const existing = await prisma.studentEnrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId }
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Student already enrolled in this course' },
        { status: 400 }
      )
    }

    const enrollment = await prisma.studentEnrollment.create({
      data: { studentId, courseId },
      include: {
        student: true,
        course: true
      }
    })

    return NextResponse.json({ success: true, enrollment })
  } catch (error: any) {
    console.error('Create enrollment error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
