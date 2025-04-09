import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new NextResponse(JSON.stringify({ error: 'No file uploaded' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get file extension
    const originalName = file.name;
    const ext = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    try {
      await writeFile(join(uploadDir, fileName), buffer);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // Directory doesn't exist, create it
        const fs = require('fs');
        fs.mkdirSync(uploadDir, { recursive: true });
        // Try writing the file again
        await writeFile(join(uploadDir, fileName), buffer);
      } else {
        throw error;
      }
    }

    const url = `/uploads/${fileName}`;

    return new NextResponse(JSON.stringify({ url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to upload file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 