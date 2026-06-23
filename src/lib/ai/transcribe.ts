import { execFile } from 'child_process'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { promisify } from 'util'

const execFileAsync = promisify(execFile)

export interface ReelContent {
  caption: string
  spokenText: string
  instagramHandle: string | null
  tmpDir: string
}

function getYtDlpPath(): string {
  return process.env.YT_DLP_PATH || 'yt-dlp'
}

function parseSubtitleFile(filePath: string): string {
  const raw = fs.readFileSync(filePath, 'utf8')
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false
      if (/^\d+$/.test(line)) return false
      if (/^\d{2}:\d{2}:\d{2}[.,]\d{3}\s+-->/.test(line)) return false
      if (line === 'WEBVTT' || line.startsWith('NOTE')) return false
      if (line.startsWith('Kind:') || line.startsWith('Language:')) return false
      return true
    })

  return Array.from(new Set(lines)).join(' ')
}

async function downloadAutoSubtitles(url: string, tmpDir: string): Promise<string> {
  const ytdlp = getYtDlpPath()
  const outputTemplate = path.join(tmpDir, 'subs')

  try {
    await execFileAsync(
      ytdlp,
      [
        '--write-auto-sub',
        '--write-sub',
        '--sub-langs',
        'hi,en,en-IN,en-US',
        '--convert-subs',
        'vtt',
        '--skip-download',
        '-o',
        outputTemplate,
        url,
      ],
      { timeout: 120_000 }
    )
  } catch {
    return ''
  }

  const files = fs.readdirSync(tmpDir).filter((f) => f.includes('.vtt') || f.includes('.srt'))
  if (!files.length) return ''

  const parsed = files.map((file) => parseSubtitleFile(path.join(tmpDir, file))).filter(Boolean)
  return parsed.join(' ').trim()
}

export async function fetchReelContent(url: string): Promise<ReelContent> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'bhumisure-'))
  const ytdlp = getYtDlpPath()

  const { stdout } = await execFileAsync(ytdlp, ['--dump-single-json', '--no-download', url], {
    timeout: 60_000,
    maxBuffer: 10 * 1024 * 1024,
  })

  const meta = JSON.parse(stdout)
  const caption = meta.description || meta.title || ''
  const uploader = meta.uploader || meta.channel || null
  const instagramHandle = uploader ? (uploader.startsWith('@') ? uploader : `@${uploader}`) : null

  const spokenText = await downloadAutoSubtitles(url, tmpDir)

  return {
    caption,
    spokenText,
    instagramHandle,
    tmpDir,
  }
}

/** @deprecated Use fetchReelContent — OpenRouter free tier has no Whisper API */
export async function fetchReelMetadata(url: string) {
  const content = await fetchReelContent(url)
  return {
    audioPath: '',
    caption: content.caption,
    instagramHandle: content.instagramHandle,
    tmpDir: content.tmpDir,
  }
}

export function buildTranscriptFromReel(content: ReelContent): string {
  return [content.caption, content.spokenText].filter(Boolean).join('\n\n').trim()
}

export function cleanupReelTemp(tmpDir: string) {
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  } catch {
    // Best-effort cleanup
  }
}