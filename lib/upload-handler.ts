import { mkdir, writeFile } from 'fs/promises'
import { join } from 'path'

export async function uploadImage(file: File) {
  try {
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      console.error('Error creating uploads directory:', error)
    }

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`
    const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`
    const filepath = join(uploadDir, filename)

    // Write file
    await writeFile(filepath, buffer)

    // Return the public URL
    return `/uploads/${filename}`
  } catch (error) {
    console.error('Error in uploadImage:', error)
    throw new Error('Failed to upload image')
  }
}