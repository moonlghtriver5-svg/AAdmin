import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#2563eb',
          borderRadius: '6px',
        }}
      >
        {/* Concentric circles */}
        <div
          style={{
            position: 'relative',
            width: '8px',
            height: '8px',
            display: 'flex',
          }}
        >
          {/* Center dot */}
          <div
            style={{
              position: 'absolute',
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%',
              left: '0',
              top: '0',
            }}
          />
          {/* Middle circle */}
          <div
            style={{
              position: 'absolute',
              width: '16px',
              height: '16px',
              border: '2px solid white',
              borderRadius: '50%',
              left: '-4px',
              top: '-4px',
              opacity: 0.6,
            }}
          />
          {/* Outer circle */}
          <div
            style={{
              position: 'absolute',
              width: '22px',
              height: '22px',
              border: '2px solid white',
              borderRadius: '50%',
              left: '-7px',
              top: '-7px',
              opacity: 0.3,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
