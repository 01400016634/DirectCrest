import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'mock_name', 
  api_key: process.env.CLOUDINARY_API_KEY || 'mock_key', 
  api_secret: process.env.CLOUDINARY_API_SECRET || 'mock_secret'
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (process.env.CLOUDINARY_API_KEY === 'mock_key' || !process.env.CLOUDINARY_API_KEY) {
      // Mock upload for local development
      console.log('Mock Cloudinary upload for local dev');
      return NextResponse.json({ url: '/mock-3d-model.glb' });
    }

    return new Promise<NextResponse>((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'raw', folder: '3d_models' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            resolve(NextResponse.json({ error: 'Upload failed' }, { status: 500 }));
          } else {
            resolve(NextResponse.json({ url: result?.secure_url }));
          }
        }
      );

      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);
      readableStream.pipe(uploadStream);
    });

  } catch (error) {
    console.error('API Upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
