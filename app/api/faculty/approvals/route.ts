// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function GET(request: NextRequest) {
//   try {
//     const facultyId = request.headers.get('x-faculty-id')

//     if (!facultyId) {
//       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
//     }

//     const coordinatedCourses = await prisma.courseAllocation.findMany({
//       where: { facultyId, role: 'COORDINATOR' },
//       select: { courseId: true }
//     })

//     if (coordinatedCourses.length === 0) {
//       return NextResponse.json({ success: true, contents: [] })
//     }

//     const courseIds = coordinatedCourses.map(c => c.courseId)

//     const contents = await prisma.teachingContent.findMany({
//       where: { courseId: { in: courseIds } },
//       include: {
//         faculty: { select: { name: true, designation: true } },
//         course: { select: { courseCode: true, courseName: true } }
//       },
//       orderBy: { createdAt: 'desc' }
//     })

//     return NextResponse.json({ success: true, contents })
//   } catch (error: any) {
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const facultyId = request.headers.get('x-faculty-id')

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const coordinatedCourses = await prisma.courseAllocation.findMany({
      where: {
        facultyId,
        role: 'COORDINATOR'
      },
      select: { courseId: true }
    })

    if (coordinatedCourses.length === 0) {
      return NextResponse.json({ success: true, contents: [] })
    }

    const courseIds = coordinatedCourses.map(c => c.courseId)

    const contents = await prisma.teachingContent.findMany({
      where: {
        courseId: { in: courseIds }
      },
      include: {
        faculty: {
          select: { name: true, designation: true }
        },
        course: {
          select: { courseCode: true, courseName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, contents })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
