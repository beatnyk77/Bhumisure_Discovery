import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Transcribes an audio file using OpenAI Whisper.
 * @param audioPath Path to the local mp3/m4a file
 */
export async function transcribeAudio(audioPath: string): Promise<string> {
  const response = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    language: 'hi', // Good for Hinglish content commonly found in Indore reels
  })

  return response.text
}

/**
 * Placeholder for downloading audio from a reel URL.
 * In production, this would use a service or a library like yt-dlp.
 */
export async function downloadReelAudio(url: string): Promise<string> {
  console.log(`[Audio] Downloading audio from ${url}...`)
  // Stub: Return a path to a dummy file or throw error for now
  // In a real setup, we'd spawn a child process or call an API
  throw new Error('Audio download not yet implemented. Please provide transcript manually for now.')
}
