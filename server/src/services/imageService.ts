import { v4 as uuidv4 } from 'uuid'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export const saveImage = async (imageBuffer: Buffer, originalName: string): Promise<string> => {
  const uploadsDir = join(process.cwd(), 'uploads')
  
  try {
    await mkdir(uploadsDir, { recursive: true })
  } catch (error) {
  }
  
  const fileName = `${uuidv4()}-${originalName}`
  const filePath = join(uploadsDir, fileName)
  
  await writeFile(filePath, imageBuffer)
  
  return `/uploads/${fileName}`
}

import { analyzeFoodImage } from './aiService.js'

export const analyzeImageWithAI = async (imageBuffer: Buffer) => {
  return await analyzeFoodImage(imageBuffer)
}