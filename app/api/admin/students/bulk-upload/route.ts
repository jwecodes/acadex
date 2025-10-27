import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { students } = await request.json()

    if (!students || !Array.isArray(students)) {
      return NextResponse.json(
        { success: false, error: 'Invalid data format' },
        { status: 400 }
      )
    }

    let successCount = 0
    const errors: string[] = []

    for (const row of students) {
      try {
        const studentId = row['Student ID'] || row.studentId || ''
        const name = row['Name'] || row.name || ''
        const email = row['Email'] || row.email || ''
        const contactNo = row['Contact No'] || row.contactNo || null
        const programmeCode = row['Programme Code'] || row.programmeCode || ''
        const currentSemester = parseInt(row['Current Semester'] || row.currentSemester || '1')
        const section = row['Section'] || row.section || null

        if (!studentId || !name || !email || !programmeCode) {
          errors.push(`Missing required fields for: ${name || email || studentId}`)
          continue
        }

        // Find programme
        const programme = await prisma.programme.findFirst({
          where: { programmeCode }
        })

        if (!programme) {
          errors.push(`Programme not found: ${programmeCode}`)
          continue
        }

        // Check if user/student already exists
        const existingStudent = await prisma.student.findFirst({
          where: {
            OR: [
              { email },
              { studentId }
            ]
          }
        })

        if (existingStudent) {
          errors.push(`Student already exists: ${email} or ${studentId}`)
          continue
        }

        // Create user
        const user = await prisma.user.create({
          data: {
            email,
            name,
            role: 'STUDENT'
          }
        })

        // Create student
        await prisma.student.create({
          data: {
            userId: user.id,
            studentId,
            name,
            email,
            contactNo,
            programmeId: programme.id,
            currentSemester,
            section
          }
        })

        successCount++
      } catch (error: any) {
        errors.push(`Error processing ${row.name || row.email}: ${error.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      count: successCount,
      errors: errors.length > 0 ? errors : undefined,
      message: `Successfully uploaded ${successCount} students${errors.length > 0 ? `, ${errors.length} failed` : ''}`
    })
  } catch (error: any) {
    console.error('Bulk upload error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Bulk upload failed' },
      { status: 500 }
    )
  }
}
