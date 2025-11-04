import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { faculty } = body

    if (!Array.isArray(faculty) || faculty.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid faculty data' },
        { status: 400 }
      )
    }

    let successCount = 0
    let allocationCount = 0
    const errors: any[] = []

    const facultyMap = new Map()
    const allocationData: any[] = []

    for (const row of faculty) {
      // ✅ FIX: Convert Faculty ID to string explicitly
      const facultyId = String(row['Faculty ID']).trim()
      const courseCode = String(row['Course Code'] || '').trim()
      const programmeCode = String(row['Programme Code'] || '').trim()
      const section = row['Section'] ? String(row['Section']).trim() : null

      if (!facultyMap.has(facultyId)) {
        facultyMap.set(facultyId, {
          'Faculty ID': facultyId,
          'Name': String(row['Name'] || '').trim(),
          'Email': String(row['Email'] || '').trim(),
          'Contact No': row['Contact No'] ? String(row['Contact No']).trim() : null,
          'Designation': String(row['Designation'] || '').trim(),
          'Department': row['Department'] ? String(row['Department']).trim() : null
        })
      }

      if (courseCode && programmeCode) {
        allocationData.push({
          facultyId,
          courseCode,
          programmeCode,
          section
        })
      }
    }

    // Create Faculty Records
    for (const [facultyId, facultyInfo] of facultyMap) {
      try {
        const {
          'Faculty ID': fId,
          'Name': name,
          'Email': email,
          'Contact No': contactNo,
          'Designation': designation,
          'Department': department
        } = facultyInfo

        if (!fId || !name || !email || !designation) {
          errors.push({
            row: fId || 'Unknown',
            error: 'Missing required fields'
          })
          continue
        }

        const existingFaculty = await prisma.faculty.findFirst({
          where: {
            OR: [{ facultyId: fId }, { email }]
          }
        })

        if (existingFaculty) {
          errors.push({
            row: fId,
            error: 'Faculty already exists'
          })
          continue
        }

        let user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              role: 'FACULTY'
            }
          })
        }

        await prisma.faculty.create({
          data: {
            userId: user.id,
            facultyId: fId, // ✅ Now it's a string
            name,
            designation,
            email,
            contactNo: contactNo || null,
            department: department || null
          }
        })

        successCount++
      } catch (error: any) {
        errors.push({
          row: facultyId,
          error: error.message
        })
      }
    }

    // Create Course Allocations
    for (const allocation of allocationData) {
      try {
        const { facultyId, courseCode, programmeCode, section } = allocation

        const course = await prisma.course.findFirst({
          where: {
            courseCode,
            programme: {
              programmeCode,
              section: section
            }
          }
        })

        if (!course) {
          errors.push({
            row: `${facultyId} - ${courseCode}`,
            error: `Course not found`
          })
          continue
        }

        const createdFaculty = await prisma.faculty.findUnique({
          where: { facultyId } // ✅ Now searching with string
        })

        if (!createdFaculty) {
          continue
        }

        const existingAllocation = await prisma.courseAllocation.findFirst({
          where: {
            facultyId: createdFaculty.id,
            courseId: course.id
          }
        })

        if (!existingAllocation) {
          await prisma.courseAllocation.create({
            data: {
              facultyId: createdFaculty.id,
              courseId: course.id,
              role: 'CONTRIBUTOR'
            }
          })
          allocationCount++
        }
      } catch (error: any) {
        // silent fail for allocations
      }
    }

    return NextResponse.json({
      success: true,
      count: successCount,
      allocations: allocationCount,
      message: `Created ${successCount} faculty`
    })
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
