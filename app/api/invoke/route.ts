import { NextResponse } from 'next/server';
import { runAgent } from '../../../langgraph';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, chat_history } = body;

    if (!input) {
      return NextResponse.json({ 
        error: 'Input is required',
        messages: [
          { content: 'Input is required', type: 'error' }
        ]
      }, { status: 400 });
    }

    // Add a timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out')), 30000);
    });

    const resultPromise = runAgent(input, chat_history);
    
    // Race between the agent and the timeout
    const result = await Promise.race([resultPromise, timeoutPromise])
      .catch(error => {
        console.error('Error or timeout invoking agent:', error);
        return {
          messages: [
            { content: input, type: 'human' },
            { 
              content: 'Sorry, I took too long to respond. Please try a simpler question or try again later.', 
              type: 'ai' 
            }
          ]
        };
      });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error invoking agent:', error);
    return NextResponse.json({ 
      error: 'Failed to invoke agent', 
      details: error.message,
      messages: [
        { 
          content: 'Sorry, something went wrong. Please try again.', 
          type: 'ai' 
        }
      ]
    }, { status: 500 });
  }
}
