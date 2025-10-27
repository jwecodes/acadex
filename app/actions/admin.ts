'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============================================
// PROGRAMME ACTIONS
// ============================================

export async function createProgramme(data: {
  session: string
  programmeCode: string
  programmeName: string
  duration: number
  currentSemester: number
  section?: string
  noOfStudents: number
}) {
  try {
    // Clean up the data before inserting
    const cleanData = {
      session: data.session,
      programmeCode: data.programmeCode,
      programmeName: data.programmeName,
      duration: data.duration,
      currentSemester: data.currentSemester,
      section: data.section || null,
      noOfStudents: data.noOfStudents
    }
    
    const result = await prisma.programme.create({ data: cleanData })
    console.log('Programme created:', result)
    revalidatePath('/admin/programmes')
    return { success: true }
  } catch (error: any) {
    console.error('Create programme error:', error)
    
    // Check for unique constraint violation
    if (error.code === 'P2002') {
      const section = data.section ? ` Section ${data.section}` : ''
      return { 
        success: false, 
        error: `Programme "${data.programmeCode}"${section} already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to create programme' }
  }
}

export async function getProgrammes() {
  try {
    return await prisma.programme.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Get programmes error:', error)
    return []
  }
}

export async function updateProgramme(id: string, data: any) {
  try {
    // Clean up the data before updating
    const cleanData = {
      session: data.session,
      programmeCode: data.programmeCode,
      programmeName: data.programmeName,
      duration: data.duration,
      currentSemester: data.currentSemester,
      section: data.section || null,
      noOfStudents: data.noOfStudents
    }
    
    await prisma.programme.update({ where: { id }, data: cleanData })
    revalidatePath('/admin/programmes')
    return { success: true }
  } catch (error: any) {
    console.error('Update programme error:', error)
    
    if (error.code === 'P2002') {
      const section = data.section ? ` Section ${data.section}` : ''
      return { 
        success: false, 
        error: `Programme "${data.programmeCode}"${section} already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to update programme' }
  }
}

export async function deleteProgramme(id: string) {
  try {
    await prisma.programme.delete({ where: { id } })
    revalidatePath('/admin/programmes')
    return { success: true }
  } catch (error: any) {
    console.error('Delete programme error:', error)
    return { success: false, error: error.message || 'Failed to delete programme' }
  }
}

// ============================================
// COURSE ACTIONS
// ============================================

export async function createCourse(data: {
  session: string
  programmeId: string
  semester: number
  courseCode: string
  courseName: string
  l: number
  t: number
  p: number
  s: number
  credits: number
  totalHours: number
  courseType: 'THEORY' | 'PRACTICAL' | 'LAB'
  roomNo?: string
  attendance: boolean
  category: 'MANDATORY' | 'ELECTIVE'
}) {
  try {
    const cleanData = {
      ...data,
      roomNo: data.roomNo || null
    }
    
    await prisma.course.create({ data: cleanData })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error: any) {
    console.error('Create course error:', error)
    
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: `Course "${data.courseCode}" already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to create course' }
  }
}

export async function getCourses() {
  try {
    return await prisma.course.findMany({
      include: { programme: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Get courses error:', error)
    return []
  }
}

export async function updateCourse(id: string, data: any) {
  try {
    const cleanData = {
      ...data,
      roomNo: data.roomNo || null
    }
    
    await prisma.course.update({ where: { id }, data: cleanData })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error: any) {
    console.error('Update course error:', error)
    
    if (error.code === 'P2002') {
      return { 
        success: false, 
        error: `Course "${data.courseCode}" already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to update course' }
  }
}

export async function deleteCourse(id: string) {
  try {
    await prisma.course.delete({ where: { id } })
    revalidatePath('/admin/courses')
    return { success: true }
  } catch (error: any) {
    console.error('Delete course error:', error)
    return { success: false, error: error.message || 'Failed to delete course' }
  }
}

// ============================================
// FACULTY ACTIONS
// ============================================

export async function createFaculty(data: {
  facultyId: string
  name: string
  designation: string
  email: string
  contactNo: string
  department?: string
  session: string
}) {
  try {
    // For now, create a basic user entry (we'll integrate auth later)
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: 'FACULTY'
      }
    })

    await prisma.faculty.create({
      data: {
        userId: user.id,
        facultyId: data.facultyId,
        name: data.name,
        designation: data.designation,
        email: data.email,
        contactNo: data.contactNo,
        department: data.department || null,
        session: data.session
      }
    })
    
    revalidatePath('/admin/faculty')
    return { success: true }
  } catch (error: any) {
    console.error('Create faculty error:', error)
    
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        return { success: false, error: `Email "${data.email}" already exists.` }
      }
      return { 
        success: false, 
        error: `Faculty ID "${data.facultyId}" already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to create faculty' }
  }
}

export async function getFaculty() {
  try {
    return await prisma.faculty.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Get faculty error:', error)
    return []
  }
}

export async function updateFaculty(id: string, data: any) {
  try {
    const cleanData = {
      facultyId: data.facultyId,
      name: data.name,
      designation: data.designation,
      email: data.email,
      contactNo: data.contactNo,
      department: data.department || null,
      session: data.session
    }
    
    await prisma.faculty.update({ where: { id }, data: cleanData })
    revalidatePath('/admin/faculty')
    return { success: true }
  } catch (error: any) {
    console.error('Update faculty error:', error)
    
    if (error.code === 'P2002') {
      if (error.meta?.target?.includes('email')) {
        return { success: false, error: `Email "${data.email}" already exists.` }
      }
      return { 
        success: false, 
        error: `Faculty ID "${data.facultyId}" already exists in session "${data.session}".` 
      }
    }
    
    return { success: false, error: error.message || 'Failed to update faculty' }
  }
}

export async function deleteFaculty(id: string) {
  try {
    const faculty = await prisma.faculty.findUnique({ where: { id } })
    if (faculty) {
      await prisma.user.delete({ where: { id: faculty.userId } })
    }
    revalidatePath('/admin/faculty')
    return { success: true }
  } catch (error: any) {
    console.error('Delete faculty error:', error)
    return { success: false, error: error.message || 'Failed to delete faculty' }
  }
}

// ============================================
// COURSE ALLOCATION ACTIONS
// ============================================

export async function allocateFaculty(courseId: string, facultyId: string, role: 'COORDINATOR' | 'CONTRIBUTOR') {
  try {
    await prisma.courseAllocation.create({
      data: { courseId, facultyId, role }
    })
    revalidatePath('/admin/course-coordination')
    revalidatePath('/admin/faculty')
    return { success: true }
  } catch (error: any) {
    console.error('Allocate faculty error:', error)
    
    if (error.code === 'P2002') {
      return { success: false, error: 'This faculty is already allocated to this course.' }
    }
    
    return { success: false, error: error.message || 'Failed to allocate faculty' }
  }
}

export async function getCourseAllocations(courseId: string) {
  try {
    return await prisma.courseAllocation.findMany({
      where: { courseId },
      include: { faculty: true }
    })
  } catch (error) {
    console.error('Get course allocations error:', error)
    return []
  }
}

export async function setCoordinator(courseId: string, allocationId: string) {
  try {
    // Set all to contributors first
    await prisma.courseAllocation.updateMany({
      where: { courseId },
      data: { role: 'CONTRIBUTOR' }
    })
    
    // Set selected as coordinator
    await prisma.courseAllocation.update({
      where: { id: allocationId },
      data: { role: 'COORDINATOR' }
    })
    
    revalidatePath('/admin/course-coordination')
    return { success: true }
  } catch (error: any) {
    console.error('Set coordinator error:', error)
    return { success: false, error: error.message || 'Failed to set coordinator' }
  }
}

export async function removeAllocation(id: string) {
  try {
    await prisma.courseAllocation.delete({ where: { id } })
    revalidatePath('/admin/course-coordination')
    revalidatePath('/admin/faculty')
    return { success: true }
  } catch (error: any) {
    console.error('Remove allocation error:', error)
    return { success: false, error: error.message || 'Failed to remove allocation' }
  }
}

// ============================================
// CONTENT REVIEW ACTIONS
// ============================================

export async function getPendingContent() {
  try {
    return await prisma.teachingContent.findMany({
      where: { approvalStatus: 'PENDING' },
      include: {
        course: { include: { programme: true } },
        faculty: true
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Get pending content error:', error)
    return []
  }
}

export async function approveContent(id: string, notes?: string) {
  try {
    await prisma.teachingContent.update({
      where: { id },
      data: {
        approvalStatus: 'APPROVED',
        coordinatorNotes: notes || null,
        updatedAt: new Date()
      }
    })
    revalidatePath('/admin/content-review')
    return { success: true }
  } catch (error: any) {
    console.error('Approve content error:', error)
    return { success: false, error: error.message || 'Failed to approve content' }
  }
}

export async function requestChanges(id: string, notes: string) {
  try {
    await prisma.teachingContent.update({
      where: { id },
      data: {
        approvalStatus: 'CHANGES_REQUIRED',
        coordinatorNotes: notes,
        updatedAt: new Date()
      }
    })
    revalidatePath('/admin/content-review')
    return { success: true }
  } catch (error: any) {
    console.error('Request changes error:', error)
    return { success: false, error: error.message || 'Failed to request changes' }
  }
}

export async function getTeachingContentByFaculty(facultyId: string, courseId?: string) {
  try {
    const where = courseId 
      ? { facultyId, courseId }
      : { facultyId }
    
    return await prisma.teachingContent.findMany({
      where,
      include: {
        course: {
          include: {
            programme: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Get teaching content error:', error)
    return []
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  try {
    const [totalProgrammes, totalCourses, totalFaculty, pendingApprovals] = await Promise.all([
      prisma.programme.count(),
      prisma.course.count(),
      prisma.faculty.count(),
      prisma.teachingContent.count({ where: { approvalStatus: 'PENDING' } })
    ])

    return {
      totalProgrammes,
      totalCourses,
      totalFaculty,
      pendingApprovals
    }
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    return {
      totalProgrammes: 0,
      totalCourses: 0,
      totalFaculty: 0,
      pendingApprovals: 0
    }
  }
}

// ============================================
// BULK UPLOAD ACTIONS
// ============================================

export async function bulkUploadProgrammes(data: any[]) {
  try {
    const programmes = data.map(row => ({
      session: row.session || row.Session || '',
      programmeCode: row.programmeCode || row['Programme Code'] || '',
      programmeName: row.programmeName || row['Programme Name'] || '',
      duration: parseInt(row.duration || row.Duration || 4),
      currentSemester: parseInt(row.currentSemester || row['Current Semester'] || 1),
      section: row.section || row.Section || null,
      noOfStudents: parseInt(row.noOfStudents || row['No of Students'] || 0)
    }))

    // Validate that we have required fields
    const validProgrammes = programmes.filter(p => 
      p.session && p.programmeCode && p.programmeName
    )

    if (validProgrammes.length === 0) {
      return { success: false, error: 'No valid programme data found. Please check your Excel file.' }
    }

    const result = await prisma.programme.createMany({
      data: validProgrammes,
      skipDuplicates: true
    })

    revalidatePath('/admin/programmes')
    return { success: true, count: result.count }
  } catch (error: any) {
    console.error('Bulk upload programmes error:', error)
    return { success: false, error: error.message || 'Failed to upload programmes. Check your data format.' }
  }
}

export async function bulkUploadCourses(data: any[]) {
  try {
    const courses = await Promise.all(
      data.map(async (row) => {
        const session = row.session || row.Session || ''
        const programmeCode = row.programmeCode || row['Programme Code'] || ''
        
        // Find programme by session and code (any section)
        const programme = await prisma.programme.findFirst({
          where: { 
            session,
            programmeCode
          }
        })

        if (!programme) {
          throw new Error(`Programme "${programmeCode}" not found in session "${session}"`)
        }

        return {
          session,
          programmeId: programme.id,
          semester: parseInt(row.semester || row.Semester || 1),
          courseCode: row.courseCode || row['Course Code'] || '',
          courseName: row.courseName || row['Course Name'] || '',
          l: parseInt(row.l || row.L || 0),
          t: parseInt(row.t || row.T || 0),
          p: parseInt(row.p || row.P || 0),
          s: parseInt(row.s || row.S || 0),
          credits: parseInt(row.credits || row.Credits || 0),
          totalHours: parseInt(row.totalHours || row['Total Hours'] || 0),
          courseType: (row.courseType || row['Course Type'] || 'THEORY') as any,
          roomNo: row.roomNo || row['Room No'] || null,
          attendance: row.attendance === 'Yes' || row.Attendance === 'Yes',
          category: (row.category || row.Category || 'MANDATORY') as any
        }
      })
    )

    await prisma.course.createMany({
      data: courses,
      skipDuplicates: true
    })

    revalidatePath('/admin/courses')
    return { success: true, count: courses.length }
  } catch (error: any) {
    console.error('Bulk upload courses error:', error)
    return { success: false, error: error.message || 'Failed to upload courses. Check your data format.' }
  }
}

export async function bulkUploadFaculty(data: any[]) {
  try {
    const facultyData = await Promise.all(
      data.map(async (row) => {
        const email = row.email || row.Email || ''
        
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          // Create user first
          user = await prisma.user.create({
            data: {
              email,
              name: row.name || row.Name || '',
              role: 'FACULTY'
            }
          })
        }

        return {
          userId: user.id,
          facultyId: row.facultyId || row['Faculty ID'] || '',
          name: row.name || row.Name || '',
          designation: row.designation || row.Designation || '',
          email,
          contactNo: row.contactNo || row['Contact No'] || '',
          department: row.department || row.Department || null,
          session: row.session || row.Session || ''
        }
      })
    )

    await prisma.faculty.createMany({
      data: facultyData,
      skipDuplicates: true
    })

    revalidatePath('/admin/faculty')
    return { success: true, count: facultyData.length }
  } catch (error: any) {
    console.error('Bulk upload faculty error:', error)
    return { success: false, error: error.message || 'Failed to upload faculty. Check your data format.' }
  }
}
