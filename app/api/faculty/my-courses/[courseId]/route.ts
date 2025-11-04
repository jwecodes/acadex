// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { courseId: string } }
// ) {
//   try {
//     const facultyId = request.headers.get('x-faculty-id')

//     if (!facultyId) {
//       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
//     }

//     const { courseId } = params

//     const course = await prisma.course.findUnique({
//       where: { id: courseId },
//       include: { programme: true }
//     })

//     if (!course) {
//       return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
//     }

//     const assignment = await prisma.courseAllocation.findFirst({
//       where: { facultyId, courseId }
//     })

//     if (!assignment) {
//       return NextResponse.json({ success: false, error: 'Not assigned' }, { status: 403 })
//     }

//     const team = await prisma.courseAllocation.findMany({
//       where: { courseId },
//       include: { faculty: { select: { name: true, designation: true } } }
//     })

//     const contents = await prisma.teachingContent.findMany({
//       where: { courseId },
//       include: { faculty: { select: { name: true, designation: true } } }
//     })

//     return NextResponse.json({
//       success: true,
//       course,
//       team: team.map(t => ({
//         id: t.id,
//         name: t.faculty.name,
//         designation: t.faculty.designation,
//         role: t.role
//       })),
//       contents,
//       isCoordinator: assignment.role === 'COORDINATOR'
//     })
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const facultyId = request.headers.get('x-faculty-id')
    const { courseId } = params

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { programme: true }
    })

    if (!course) {
      return NextResponse.json({ success: false, error: 'Course not found' }, { status: 404 })
    }

    const assignment = await prisma.courseAllocation.findFirst({
      where: { facultyId, courseId }
    })

    if (!assignment) {
      return NextResponse.json({ success: false, error: 'Not assigned to this course' }, { status: 403 })
    }

    const team = await prisma.courseAllocation.findMany({
      where: { courseId },
      include: {
        faculty: { select: { name: true, designation: true } }
      }
    })

    const contents = await prisma.teachingContent.findMany({
      where: { courseId },
      include: {
        faculty: { select: { name: true, designation: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      course,
      team: team.map(t => ({
        id: t.id,
        name: t.faculty.name,
        designation: t.faculty.designation,
        role: t.role
      })),
      contents,
      isCoordinator: assignment.role === 'COORDINATOR'
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
