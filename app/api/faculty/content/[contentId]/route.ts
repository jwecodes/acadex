// import { NextRequest, NextResponse } from 'next/server'
// import { prisma } from '@/lib/prisma'

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { contentId: string } }
// ) {
//   try {
//     const facultyId = request.headers.get('x-faculty-id')
//     const { contentId } = params

//     console.log('📥 DELETE /api/faculty/content/[contentId] called')
//     console.log('Faculty ID:', facultyId)
//     console.log('Content ID:', contentId)

//     if (!facultyId) {
//       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
//     }

//     // Get the content
//     const content = await prisma.teachingContent.findUnique({
//       where: { id: contentId }
//     })

//     if (!content) {
//       console.log('❌ Content not found:', contentId)
//       return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
//     }

//     // Verify the faculty owns this content
//     if (content.facultyId !== facultyId) {
//       console.log('❌ Faculty does not own this content')
//       return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
//     }

//     // Only allow deletion if PENDING
//     if (content.approvalStatus !== 'PENDING') {
//       console.log('❌ Can only delete PENDING content')
//       return NextResponse.json({ success: false, error: 'Can only delete pending content' }, { status: 400 })
//     }

//     // Delete the content
//     await prisma.teachingContent.delete({
//       where: { id: contentId }
//     })

//     console.log('✅ Content deleted successfully')

//     return NextResponse.json({ success: true, message: 'Content deleted successfully' })
//   } catch (error: any) {
//     console.error('❌ Error in DELETE /api/faculty/content/[contentId]:', error)
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 })
//   }
// }

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { contentId: string } }
) {
  try {
    const facultyId = request.headers.get('x-faculty-id')
    const { contentId } = params

    if (!facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const content = await prisma.teachingContent.findUnique({
      where: { id: contentId }
    })

    if (!content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 })
    }

    if (content.facultyId !== facultyId) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })
    }

    if (content.approvalStatus !== 'PENDING') {
      return NextResponse.json({ success: false, error: 'Can only delete pending content' }, { status: 400 })
    }

    await prisma.teachingContent.delete({
      where: { id: contentId }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
