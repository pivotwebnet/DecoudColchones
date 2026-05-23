import React from 'react';

// Cropped viewBox to show only the cloud silhouette (not the empty space above/below)
const VIEWBOX = '0 40 512 420';

// Path from public/clouds.svg (SVG Repo)
const CLOUD_PATH =
  'M344.381,143.771C254.765,56.017,102.37,103.776,79.825,227.7c-31.849,4.598-59.138,25.445-72.018,55.076' +
  'c-0.016,0.035-0.032,0.07-0.047,0.107c-26.687,61.602,18.784,130.232,85.51,130.232h282.267' +
  'c75.246,0,136.463-61.216,136.463-136.462C512,189.241,430.314,123.682,344.381,143.771z' +
  ' M375.537,381.12H93.271c-69.246,0-84.534-98.263-18.714-119.456c14.753-4.65,43.01-7.348,74.38,21.892' +
  'c6.464,6.024,16.586,5.667,22.61-0.794c6.024-6.464,5.668-16.586-0.794-22.61' +
  'c-17.93-16.712-38.071-27.33-58.484-31.453c22.034-99.077,147.374-131.851,215.247-56.305' +
  'c4.189,4.661,10.714,6.451,16.693,4.57c67.272-21.117,135.795,29.374,135.795,99.69' +
  'C480.005,334.256,433.141,381.12,375.537,381.12z';

const CLOUDS = [
  { id: 1, w: 190, top: '4%',  dur: 95,  delay:   0, opacity: 0.80, dir: 'lr' },
  { id: 2, w: 130, top: '22%', dur: 135, delay: -42, opacity: 0.75, dir: 'lr' },
  { id: 3, w: 150, top: '58%', dur: 112, delay: -65, opacity: 0.72, dir: 'lr' },
  { id: 4, w: 210, top: '12%', dur: 120, delay: -28, opacity: 0.80, dir: 'rl' },
  { id: 5, w: 110, top: '72%', dur: 150, delay: -85, opacity: 0.70, dir: 'rl' },
  { id: 6, w: 170, top: '40%', dur: 130, delay: -55, opacity: 0.76, dir: 'rl' },
  { id: 7, w: 140, top: '82%', dur: 100, delay: -18, opacity: 0.74, dir: 'lr' },
  { id: 8, w: 95,  top: '48%', dur: 160, delay: -95, opacity: 0.68, dir: 'rl' },
];

function CloudSvg({ width }) {
  const height = Math.round(width * (420 / 512));
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={VIEWBOX}
      width={width}
      height={height}
      fill="#1B365D"
    >
      <path d={CLOUD_PATH} />
    </svg>
  );
}

export default function CloudBackground() {
  return (
    <>
      <style>{`
        @keyframes driftLR {
          from { transform: translateX(-450px); }
          to   { transform: translateX(calc(100vw + 450px)); }
        }
        @keyframes driftRL {
          from { transform: translateX(calc(100vw + 450px)); }
          to   { transform: translateX(-450px); }
        }
      `}</style>

      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: -1,
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        {CLOUDS.map(c => (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              top: c.top,
              left: 0,
              opacity: c.opacity,
              animation: `${c.dir === 'lr' ? 'driftLR' : 'driftRL'} ${c.dur}s linear infinite`,
              animationDelay: `${c.delay}s`,
              filter: 'drop-shadow(0 4px 8px rgba(27,54,93,0.15))',
            }}
          >
            <CloudSvg width={c.w} />
          </div>
        ))}
      </div>
    </>
  );
}
