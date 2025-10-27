import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const facultyId = formData.get('facultyId') as string
    const courseId = formData.get('courseId') as string
    const contentType = formData.get('contentType') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const lectureNumber = formData.get('lectureNumber') as string

    if (!file || !facultyId || !courseId || !contentType || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate unique file name
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const filePath = `${courseId}/${contentType}/${fileName}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(buffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('teaching-materials')
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Supabase upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file to storage' },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('teaching-materials')
      .getPublicUrl(filePath)

    // Save metadata to database
    await prisma.teachingContent.create({
      data: {
        courseId,
        facultyId,
        contentType: contentType as any,
        title,
        description: description || null,
        lectureNumber: lectureNumber ? parseInt(lectureNumber) : null,
        filePath: publicUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        approvalStatus: 'PENDING'
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Content uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'An error occurred during upload' },
      { status: 500 }
    )
  }
}
