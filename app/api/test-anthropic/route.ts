import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function GET(request: NextRequest) {
  try {
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    
    if (!ANTHROPIC_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'Anthropic API key is not configured in environment variables'
      }, { status: 503 });
    }

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      apiKey: ANTHROPIC_API_KEY,
    });

    // Make a simple test call
    const response = await anthropic.messages.create({
      model: "claude-4-sonnet-20250514",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Say 'API key is working!' in exactly 4 words."
            }
          ]
        }
      ],
      max_tokens: 50,
      temperature: 0
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    return NextResponse.json({
      success: true,
      message: 'Anthropic API key is properly configured and working!',
      response: content.text,
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('Anthropic API test error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const isAuthError = errorMessage.includes('401') || errorMessage.includes('authentication');
    
    return NextResponse.json({
      success: false,
      message: isAuthError ? 
        'Invalid API key - please check your Anthropic API key in Vercel environment variables' : 
        'API test failed',
      error: errorMessage
    }, { status: isAuthError ? 401 : 500 });
  }
} 