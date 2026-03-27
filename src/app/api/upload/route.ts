/**
 * API Route: POST /api/upload
 * Handle podcast upload
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createUpload, updateUploadStatus } from '@/lib/db';
import { processUploadWithAI } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const contentType = formData.get('type') as 'audio' | 'video';

    if (!file || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // In production: Upload to Firebase Storage or Cloudinary
    // For demo: Create a mock URL
    const mediaUrl = `https://mock-storage.example.com/${Date.now()}_${file.name}`;

    // Create upload record
    const upload = await createUpload({
      userId: session.user.id as string,
      title,
      description,
      mediaUrl,
      type: contentType === 'audio' ? 'AUDIO' : 'VIDEO',
      duration: 3600 // Mock duration
    });

    // Update status to processing
    await updateUploadStatus(upload.id, 'PROCESSING');

    // Process with AI (async)
    processUploadWithAI(mediaUrl, upload.id, title)
      .then(aiOutput => {
        // Save AI output to database
        console.log('[API] AI processing complete for upload:', upload.id);
      })
      .catch(err => {
        console.error('[API] AI processing failed:', err);
        updateUploadStatus(upload.id, 'FAILED');
      });

    return NextResponse.json({
      success: true,
      data: {
        id: upload.id,
        status: upload.status,
        message: 'Upload received, processing started'
      }
    });
  } catch (error) {
    console.error('[API] Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload' },
      { status: 500 }
    );
  }
}

/**
 * API Route: GET /api/upload
 * List user uploads
 */

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '0');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get uploads from database
    const uploads = await (async () => {
      // Mock data for demo
      return [
        {
          id: 'up_1',
          title: 'AI Trends 2024',
          description: 'Discussion about latest AI trends',
          status: 'completed',
          views: 1250,
          date: new Date().toLocaleDateString()
        },
        {
          id: 'up_2',
          title: 'Web3 Future',
          description: 'Exploring the future of blockchain',
          status: 'completed',
          views: 890,
          date: new Date(Date.now() - 864000000).toLocaleDateString()
        }
      ];
    })();

    return NextResponse.json({
      success: true,
      data: {
        uploads,
        total: uploads.length,
        page,
        pageSize: limit
      }
    });
  } catch (error) {
    console.error('[API] Get uploads error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch uploads' },
      { status: 500 }
    );
  }
}
