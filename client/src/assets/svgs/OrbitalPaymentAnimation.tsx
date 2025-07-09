import React from 'react';


  const orbitRadius = 140;
  const paymentMethods = [
    { id: 1, name: 'Mobile Money', angle: 0 },
    { id: 2, name: 'Bank Transfer', angle: 72 },
    { id: 3, name: 'USSD', angle: 144 },
    { id: 4, name: 'Cards', angle: 216 },
    { id: 5, name: 'Crypto', angle: 288 },
  ];

  // Calculate positions for each payment method
  const getPosition = (angle: number) => {
    const radian = (angle - 90) * (Math.PI / 180);
    return {
      x: 200 + orbitRadius * Math.cos(radian),
      y: 200 + orbitRadius * Math.sin(radian),
    };
  };

  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="orbital-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="100%" stopColor="#0FCEA6" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15"/>
        </filter>
      </defs>

      {/* Orbital paths - Static */}
      <g className="orbital-paths">
        {/* Main orbit */}
        <circle
          cx="200"
          cy="200"
          r={orbitRadius}
          stroke="url(#orbital-gradient)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
          opacity="0.4"
        />
        
        {/* Decorative orbits */}
        <circle
          cx="200"
          cy="200"
          r={orbitRadius - 15}
          stroke="url(#orbital-gradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
        <circle
          cx="200"
          cy="200"
          r={orbitRadius + 15}
          stroke="url(#orbital-gradient)"
          strokeWidth="0.5"
          fill="none"
          opacity="0.2"
        />
      </g>

      {/* Center logo */}
      <g filter="url(#shadow)" className="center-logo">
        <circle
          cx="200"
          cy="200"
          r="60"
          fill="white"
          className="animate-pulse-slow"
        />
        <circle
          cx="200"
          cy="200"
          r="58"
          stroke="url(#orbital-gradient)"
          strokeWidth="2"
          fill="none"
          opacity="0.5"
        />
        <text
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6C2BFB"
          fontSize="24"
          fontFamily="Space Grotesk"
          fontWeight="500"
        >
          PayAfric
        </text>
        
        {/* Processing rings - Static */}
        {[0, 1, 2].map((ring) => (
          <circle
            key={`ring-${ring}`}
            cx="200"
            cy="200"
            r={45 + ring * 8}
            stroke="url(#orbital-gradient)"
            strokeWidth="1"
            strokeDasharray="3 6"
            fill="none"
            opacity={0.3 - ring * 0.1}
          />
        ))}
      </g>

      {/* Static payment methods */}
      <g className="payment-methods">
        {paymentMethods.map((method) => {
          const pos = getPosition(method.angle);
          return (
            <g
              key={method.id}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="payment-method"
              filter="url(#shadow)"
            >
              {/* Payment node background */}
              <circle
                r="32"
                fill="white"
                stroke="url(#orbital-gradient)"
                strokeWidth="2"
                className="animate-pulse-slow"
              />
              
              {/* Payment method icon */}
              {method.name === 'Mobile Money' && (
                <g transform="translate(-12, -12)">
                  <rect width="24" height="24" rx="12" fill="#6C2BFB" opacity="0.1"/>
                  <path
                    d="M6 8h12M6 12h12M6 16h12"
                    stroke="#6C2BFB"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}
              {method.name === 'Bank Transfer' && (
                <g transform="translate(-12, -12)">
                  <rect width="24" height="24" rx="12" fill="#6C2BFB" opacity="0.1"/>
                  <path
                    d="M12 4l8 6H4l8-6zM5 12h14v6H5z"
                    stroke="#6C2BFB"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>
              )}
              {method.name === 'USSD' && (
                <g transform="translate(-12, -12)">
                  <rect width="24" height="24" rx="12" fill="#6C2BFB" opacity="0.1"/>
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fill="#6C2BFB"
                    fontSize="12"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    *123#
                  </text>
                </g>
              )}
              {method.name === 'Cards' && (
                <g transform="translate(-12, -12)">
                  <rect width="24" height="24" rx="12" fill="#6C2BFB" opacity="0.1"/>
                  <rect
                    x="4"
                    y="7"
                    width="16"
                    height="10"
                    rx="2"
                    stroke="#1e8449"
                    strokeWidth="2"
                    fill="none"
                  />
                  <line x1="4" y1="11" x2="20" y2="11" stroke="#1e8449" strokeWidth="2"/>
                </g>
              )}
              {method.name === 'Crypto' && (
                <g transform="translate(-12, -12)">
                  <rect width="24" height="24" rx="12" fill="#1e8449" opacity="0.1"/>
                  <text
                    x="12"
                    y="16"
                    textAnchor="middle"
                    fill="#6C2BFB"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    ₿
                  </text>
                </g>
              )}

              {/* Label */}
              <text
                y="45"
                textAnchor="middle"
                fill="#6C2BFB"
                fontSize="14"
                fontWeight="500"
              >
                {method.name}
              </text>
            </g>
          );
        })}
      </g>

      {/* Connection lines - Static */}
      <g className="connections" opacity="0.2">
        {paymentMethods.map((method) => {
          const pos = getPosition(method.angle);
          return (
            <line
              key={`connection-${method.id}`}
              x1="200"
              y1="200"
              x2={pos.x}
              y2={pos.y}
              stroke="url(#orbital-gradient)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}
      </g>
    </svg>
  );
}
