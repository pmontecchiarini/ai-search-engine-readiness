import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
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
          backgroundColor: '#f8fafc',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 48,
            fontWeight: 800,
            marginBottom: 32,
          }}
        >
          AI
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#0f172a' }}>GEO Readiness Auditor</div>
        <div
          style={{
            fontSize: 28,
            color: '#64748b',
            marginTop: 20,
            maxWidth: 900,
            textAlign: 'center',
          }}
        >
          See how ready your website is for AI search engines
        </div>
      </div>
    ),
    { ...size }
  );
}
