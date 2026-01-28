export default function AmbientWaves() {
  return (
    <svg
      className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
      viewBox="0 0 1200 700"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="ambientRainbowSnake"
          x1="0"
          y1="0"
          x2="1200"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--color-wizard-orange-dark)" />
          <stop offset="10%" stopColor="var(--color-wizard-orange-light)" />
          <stop offset="22%" stopColor="var(--color-wizard-gold)" />
          <stop offset="34%" stopColor="var(--color-wizard-gold-light)" />
          <stop offset="50%" stopColor="var(--color-wizard-blue)" />
          <stop offset="62%" stopColor="var(--color-wizard-blue-light)" />
          <stop offset="74%" stopColor="var(--color-wizard-purple)" />
          <stop offset="86%" stopColor="var(--color-wizard-blue-medium)" />
          <stop offset="100%" stopColor="var(--color-wizard-orange)" />
        </linearGradient>
        <style>{`
          .bg {
            fill: #ffffff;
          }

          /* light gray strokes */
          .wave {
            fill: none;
            stroke: rgba(0, 0, 0, 0.10);
            stroke-width: 2;
            vector-effect: non-scaling-stroke;
          }

          /* each line gently "breathes" (amplitude changes) */
          .breath {
            transform-origin: 50% 50%;
            animation: breathe 9s ease-in-out infinite;
          }

          /* subtle drift left-right so it doesn't feel static */
          .drift {
            animation: drift 14s ease-in-out infinite;
          }

          /* stagger for organic feel */
          .d1 { animation-delay: -2s; }
          .d2 { animation-delay: -4s; }
          .d3 { animation-delay: -6s; }
          .d4 { animation-delay: -8s; }

          .top-snake {
            fill: none;
            stroke: url(#ambientRainbowSnake);
            stroke-linecap: round;
            vector-effect: non-scaling-stroke;
            stroke-dasharray: 14 86;
            animation: ambient-snake-dash 3.8s linear infinite;
          }

          .top-snake--glow {
            stroke-width: 7;
            opacity: 0.14;
          }

          .top-snake--core {
            stroke-width: 2.5;
            opacity: 0.95;
          }

          @keyframes ambient-snake-dash {
            to {
              stroke-dashoffset: -100;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .top-snake {
              animation: none;
            }
          }

          @keyframes breathe {
            0%   { transform: scaleY(0.92); opacity: 0.65; }
            45%  { transform: scaleY(1.06); opacity: 0.90; }
            100% { transform: scaleY(0.92); opacity: 0.65; }
          }

          @keyframes drift {
            0%   { transform: translateX(0px); }
            50%  { transform: translateX(-26px); }
            100% { transform: translateX(0px); }
          }
        `}</style>
      </defs>

      <rect className="bg" width="1200" height="700" />

      {/* 
        "Sinus-like" paths: smooth repeating S-curves across the width.
        We draw several lines at different Y positions + slightly different wavelengths.
      */}
      <g className="drift">
        <g className="breath d1">
          <path
            className="wave"
            d="M-50 190
               C  50 150, 150 230, 250 190
               S 450 230, 550 190
               S 750 230, 850 190
               S1050 230, 1150 190
               S1300 230, 1400 190"
          />
          <path
            className="top-snake top-snake--glow"
            pathLength="100"
            d="M-50 190
               C  50 150, 150 230, 250 190
               S 450 230, 550 190
               S 750 230, 850 190
               S1050 230, 1150 190
               S1300 230, 1400 190"
          />
          <path
            className="top-snake top-snake--core"
            pathLength="100"
            d="M-50 190
               C  50 150, 150 230, 250 190
               S 450 230, 550 190
               S 750 230, 850 190
               S1050 230, 1150 190
               S1300 230, 1400 190"
          />
        </g>

        <g className="breath d2">
          <path
            className="wave"
            d="M-50 280
               C  70 240, 190 320, 310 280
               S 550 320, 670 280
               S 910 320, 1030 280
               S1270 320, 1390 280"
          />
        </g>

        <g className="breath d3">
          <path
            className="wave"
            d="M-50 380
               C  40 350, 130 410, 220 380
               S 400 410, 490 380
               S 670 410, 760 380
               S 940 410, 1030 380
               S1210 410, 1300 380
               S1480 410, 1570 380"
          />
        </g>

        <g className="breath d4">
          <path
            className="wave"
            d="M-50 500
               C  90 470, 230 530, 370 500
               S 650 530, 790 500
               S1070 530, 1210 500
               S1490 530, 1630 500"
          />
        </g>
      </g>
    </svg>
  )
}
