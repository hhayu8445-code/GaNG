import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const category = formData.get('category') as string
    const framework = formData.get('framework') as string
    const coinPrice = parseInt(formData.get('coinPrice') as string) || 0
    const tags = JSON.parse(formData.get('tags') as string || '[]')

    if (!file || !title || !description || !category || !framework) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create asset in database (file stored externally)
    const asset = await prisma.asset.create({
      data: {
        title,
        description,
        category,
        framework,
        coinPrice,
        downloadLink: `https://example.com/download/${file.name}`,
        thumbnail: `/placeholder.jpg`,
        tags,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        authorId: session.user.id!,
        version: '1.0.0',
        status: 'active'
      },
      include: {
        author: {
          select: {
            username: true,
            avatar: true,
            membership: true
          }
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      asset,
      message: 'Asset uploaded successfully' 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed', details: String(error) }, { status: 500 })
  }
}