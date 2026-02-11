import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

export const alt = 'BarrelBook — AI-Powered Bourbon Collection App'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), 'public', 'BarrelBook Logo Mark.png')
  )
  const logoSrc = `data:image/png;base64,${logoData.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a0f0a',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={150} height={150} alt="" />
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            color: '#D97843',
            marginTop: 24,
          }}
        >
          BarrelBook
        </div>
        <div
          style={{
            fontSize: 26,
            color: '#bbbbbb',
            marginTop: 12,
          }}
        >
          AI-Powered Bourbon Collection App
        </div>
      </div>
    ),
    { ...size }
  )
}
