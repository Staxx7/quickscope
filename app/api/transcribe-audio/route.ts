import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      )
    }

    // Check file size (OpenAI Whisper has a 25MB limit)
    const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 25MB limit' },
        { status: 400 }
      )
    }

    // Check file type
    const allowedTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/m4a', 'video/mp4']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload MP3, MP4, WAV, or M4A files.' },
        { status: 400 }
      )
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Create form data for OpenAI Whisper API
    const whisperFormData = new FormData()
    whisperFormData.append('file', file)
    whisperFormData.append('model', 'whisper-1')
    whisperFormData.append('response_format', 'json')
    whisperFormData.append('language', 'en') // Assuming English, can be made configurable

    // Call OpenAI Whisper API
    const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`
      },
      body: whisperFormData
    })

    if (!whisperResponse.ok) {
      const errorData = await whisperResponse.json()
      console.error('Whisper API error:', errorData)
      return NextResponse.json(
        { error: 'Transcription failed', details: errorData },
        { status: whisperResponse.status }
      )
    }

    const transcriptionData = await whisperResponse.json()

    // Estimate duration from file size (rough approximation)
    const estimatedDurationMinutes = Math.round(file.size / (1024 * 1024 * 0.5)) // Rough estimate
    const duration = `${Math.floor(estimatedDurationMinutes)}:${(estimatedDurationMinutes % 1 * 60).toFixed(0).padStart(2, '0')}`

    return NextResponse.json({
      success: true,
      text: transcriptionData.text,
      duration: duration,
      confidence: 0.95, // Whisper typically has high confidence
      language: transcriptionData.language || 'en'
    })

  } catch (error) {
    console.error('Error in audio transcription:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}