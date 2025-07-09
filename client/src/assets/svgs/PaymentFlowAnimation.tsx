
  return (
    <svg
      viewBox="0 0 1200 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="green-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e8449" />
          <stop offset="100%" stopColor="#196f3d" />
        </linearGradient>

        <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f1c40f" />
          <stop offset="100%" stopColor="#f39c12" />
        </linearGradient>

        <linearGradient id="flow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#1e8449" />
          <stop offset="100%" stopColor="#f1c40f" />
        </linearGradient>

        {/* Background */}
        <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8f9fe" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>

        {/* Glow filters */}
        <filter id="glow-sm" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="glow-md" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="glow-lg" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Shadow */}
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
        </filter>

        {/* Clip paths */}
        <clipPath id="circle-mask">
          <circle cx="600" cy="350" r="300" />
        </clipPath>
      </defs>

      {/* Background */}
      {/* <rect width="1200" height="700" fill="white" /> */}

      {/* Background pattern with soft gradient */}
      {/* <rect width="1200" height="700" fill="url(#bg-gradient)" /> */}

      {/* Subtle grid pattern */}
      {/* <g opacity="0.04">
        {Array.from({ length: 15 }).map((_, i) => (
          <line 
            key={`h-line-${i}`}
            x1="0" 
            y1={50 + i * 45} 
            x2="1200" 
            y2={50 + i * 45} 
            stroke="#1e8449" 
            strokeWidth="1"
          />
        ))}
        
        {Array.from({ length: 27 }).map((_, i) => (
          <line 
            key={`v-line-${i}`}
            x1={50 + i * 45} 
            y1="0" 
            x2={50 + i * 45} 
            y2="700" 
            stroke="#1e8449" 
            strokeWidth="1"
          />
        ))}
      </g> */}

      {/* Orbital visualization */}
      <g transform="translate(600, 350)">
        {/* Main central circle */}
        <circle r="55" fill="#1e8449" opacity="0.05" />
        <circle r="50" fill="#1e8449" opacity="0.1" />
        <circle r="45" fill="white" stroke="#1e8449" strokeWidth="2" filter="url(#glow-sm)" />

        {/* PayAfric logo in center */}
        <text x="0" y="5" fontFamily="'Inter', sans-serif" fontSize="13" fontWeight="700" fill="#1e8449" textAnchor="middle">PAYAFRIC</text>

        {/* Orbital tracks */}
        <circle r="130" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
        <circle r="220" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />
        <circle r="310" fill="none" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="3 3" />

        {/* Inner orbit elements - Authentication & Security */}
        <g>
          {/* Node 1 - Authentication */}
          <g transform="rotate(0)">
            <circle cx="120" cy="0" r="25" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="120" cy="0" r="20" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="18;20;18" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(120, 0)">
              <rect x="-10" y="-10" width="20" height="20" rx="2" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <path d="M-4,0 L0,4 L4,0" stroke="#1e8449" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="120" y="-35" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Authentication</text>

            {/* Connection to center */}
            <line x1="45" y1="0" x2="95" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="70" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L50,0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 2 - Security */}
          <g transform="rotate(90)">
            <circle cx="120" cy="0" r="25" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="120" cy="0" r="20" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="18;20;18" begin="0.5s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(120, 0)">
              <path d="M0,-8 L-8,0 L0,8 L8,0 Z" stroke="#1e8449" strokeWidth="1.5" fill="none" />
              <circle cx="0" cy="0" r="3" fill="#1e8449" />
            </g>
            <text x="120" y="-35" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Security</text>

            {/* Connection to center */}
            <line x1="45" y1="0" x2="95" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.3s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="70" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L50,0" begin="0.3s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.3s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.3s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 3 - Fraud Detection */}
          <g transform="rotate(180)">
            <circle cx="120" cy="0" r="25" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="120" cy="0" r="20" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="18;20;18" begin="1s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(120, 0)">
              <circle cx="0" cy="0" r="8" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <path d="M-4,-4 L4,4 M-4,4 L4,-4" stroke="#1e8449" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <text x="120" y="-35" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Fraud Detection</text>

            {/* Connection to center */}
            <line x1="45" y1="0" x2="95" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.6s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="70" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L50,0" begin="0.6s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.6s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.6s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 4 - Validation */}
          <g transform="rotate(270)">
            <circle cx="120" cy="0" r="25" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="120" cy="0" r="20" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="18;20;18" begin="1.5s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(120, 0)">
              <path d="M-6,-2 L-2,2 L6,-6" stroke="#1e8449" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x="120" y="-35" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Validation</text>

            {/* Connection to center */}
            <line x1="45" y1="0" x2="95" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.9s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="70" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L50,0" begin="0.9s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.9s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.9s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* Middle orbit elements - Processing */}
        <g>
          {/* Node 1 - Routing */}
          <g transform="rotate(45)">
            <circle cx="200" cy="0" r="30" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="200" cy="0" r="25" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="22;25;22" begin="0.3s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(200, 0)">
              <path d="M-8,0 L8,0 M0,-8 L0,8" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M-5,-5 L-8,-8 M5,-5 L8,-8 M-5,5 L-8,8 M5,5 L8,8" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <text x="200" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Intelligent Routing</text>

            {/* Connection to center */}
            <line x1="55" y1="0" x2="170" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.1s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="110" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L115,0" begin="0.1s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.1s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.1s" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 2 - Processing */}
          <g transform="rotate(135)">
            <circle cx="200" cy="0" r="30" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="200" cy="0" r="25" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="22;25;22" begin="0.8s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(200, 0)">
              <circle cx="0" cy="0" r="4" fill="#f1c40f" />
              <circle cx="0" cy="0" r="10" fill="none" stroke="#f1c40f" strokeWidth="1.5" strokeDasharray="2 2">
                <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="6s" repeatCount="indefinite" />
              </circle>
            </g>
            <text x="200" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Processing</text>

            {/* Connection to center */}
            <line x1="55" y1="0" x2="170" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.6s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="110" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L115,0" begin="0.6s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.6s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.6s" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 3 - Optimization */}
          <g transform="rotate(225)">
            <circle cx="200" cy="0" r="30" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="200" cy="0" r="25" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="22;25;22" begin="1.3s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(200, 0)">
              <rect x="-7" y="-7" width="14" height="14" rx="2" fill="none" stroke="#f1c40f" strokeWidth="1.5" />
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <text x="200" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Optimization</text>

            {/* Connection to center */}
            <line x1="55" y1="0" x2="170" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="1.1s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="110" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L115,0" begin="1.1s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="1.1s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="1.1s" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Node 4 - Gateway */}
          <g transform="rotate(315)">
            <circle cx="200" cy="0" r="30" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="200" cy="0" r="25" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="22;25;22" begin="1.8s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(200, 0)">
              <rect x="-8" y="-5" width="16" height="10" rx="1" fill="none" stroke="#f1c40f" strokeWidth="1.5" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#f1c40f" strokeWidth="1" />
            </g>
            <text x="200" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Gateway</text>

            {/* Connection to center */}
            <line x1="55" y1="0" x2="170" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="1.6s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="110" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L115,0" begin="1.6s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="1.6s" dur="3s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="1.6s" dur="3s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>

        {/* Outer orbit elements - Markets & Payment Methods */}
        <g>
          {/* Payment Method 1 - Cards */}
          <g transform="rotate(0)">
            <circle cx="310" cy="0" r="35" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="310" cy="0" r="30" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="0.2s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(310, 0)">
              <rect x="-12" y="-8" width="24" height="16" rx="2" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <line x1="-8" y1="-2" x2="8" y2="-2" stroke="#1e8449" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="-8" y1="2" x2="0" y2="2" stroke="#1e8449" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <text x="310" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Cards</text>

            {/* Connection to processing layer */}
            <line x1="230" y1="0" x2="275" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.2s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="250" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L45,0" begin="0.2s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.2s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.2s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Payment Method 2 - Mobile */}
          <g transform="rotate(45)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="0.5s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <rect x="-7" y="-12" width="14" height="24" rx="2" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <circle cx="0" cy="8" r="2" fill="#1e8449" />
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Mobile Money</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.5s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="0.5s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.5s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.5s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Payment Method 3 - Crypto */}
          <g transform="rotate(90)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="0.8s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <circle cx="0" cy="0" r="10" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <text x="0" y="3" fontFamily="'Inter', sans-serif" fontSize="10" fontWeight="700" fill="#1e8449" textAnchor="middle">₿</text>
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Crypto</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="0.8s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="0.8s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="0.8s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="0.8s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Region 1 - Nigeria */}
          <g transform="rotate(135)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="1.1s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <text x="0" y="5" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="700" fill="#f1c40f" textAnchor="middle">NG</text>
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Nigeria</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="1.1s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="1.1s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="1.1s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="1.1s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Region 2 - South Africa */}
          <g transform="rotate(180)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="1.4s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <text x="0" y="5" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="700" fill="#f1c40f" textAnchor="middle">ZA</text>
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">South Africa</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="1.4s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="1.4s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="1.4s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="1.4s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Region 3 - Kenya */}
          <g transform="rotate(225)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="1.7s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <text x="0" y="5" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="700" fill="#f1c40f" textAnchor="middle">KE</text>
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Kenya</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="1.7s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="1.7s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="1.7s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="1.7s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Payment Method 4 - Bank */}
          <g transform="rotate(270)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#1e8449" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#green-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="2s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <rect x="-10" y="-6" width="20" height="12" rx="1" fill="none" stroke="#1e8449" strokeWidth="1.5" />
              <rect x="-10" y="-10" width="20" height="4" rx="1" fill="none" stroke="#1e8449" strokeWidth="1.5" />
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Bank</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="2s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="2s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="2s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="2s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>

          {/* Region 4 - Ghana */}
          <g transform="rotate(315)">
            <circle cx="280" cy="0" r="35" fill="white" stroke="#f1c40f" strokeWidth="1.5" filter="url(#shadow)" />
            <circle cx="280" cy="0" r="30" fill="white" stroke="url(#gold-gradient)" strokeWidth="2" filter="url(#glow-sm)">
              <animate attributeName="r" values="28;30;28" begin="2.3s" dur="3s" repeatCount="indefinite" />
            </circle>
            <g transform="translate(280, 0)">
              <text x="0" y="5" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="700" fill="#f1c40f" textAnchor="middle">GH</text>
            </g>
            <text x="280" y="-45" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="600" fill="#4B5563" textAnchor="middle">Ghana</text>

            {/* Connection to processing layer */}
            <line x1="210" y1="0" x2="245" y2="0" stroke="url(#flow-gradient)" strokeWidth="1.5" opacity="0.5" strokeDasharray="5 3">
              <animate attributeName="opacity" values="0.3;0.8;0.3" begin="2.3s" dur="4s" repeatCount="indefinite" />
            </line>

            {/* Moving pulse */}
            <circle cx="225" cy="0" r="3" fill="url(#flow-gradient)" opacity="0.7">
              <animateMotion path="M0,0 L35,0" begin="2.3s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0;0.7;0" begin="2.3s" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="1;3;1" begin="2.3s" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>

      {/* Label overlay - moved to the top center */}
      <g transform="translate(600,0.5)">
        <rect x="-140" y="-30" width="280" height="60" rx="8" fill="white" fillOpacity="0.95" filter="url(#shadow)" />
        <text x="0" y="-5" fontFamily="'Inter', sans-serif" fontSize="14" fontWeight="600" fill="#111827" textAnchor="middle">PayAfric Payment Network</text>
        <text x="0" y="15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="400" fill="#6B7280" textAnchor="middle">Connected to 17 payment methods across 12 regions</text>
      </g>

      {/* Stats overlay - repositioned to avoid overlapping */}
      <g transform="translate(180, 170)">
        <rect x="-120" y="-40" width="240" height="80" rx="8" fill="white" fillOpacity="0.95" filter="url(#shadow)" />
        <text x="-100" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Monthly Transactions</text>
        <text x="-100" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">1.4M+</text>
        <text x="20" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Success Rate</text>
        <text x="20" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">99.3%</text>
      </g>

      <g transform="translate(1020, 170)">
        <rect x="-120" y="-40" width="240" height="80" rx="8" fill="white" fillOpacity="0.95" filter="url(#shadow)" />
        <text x="-100" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Processing Time</text>
        <text x="-100" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">1.24s</text>
        <text x="20" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Active Gateways</text>
        <text x="20" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">12/12</text>
      </g>

      <g transform="translate(180, 530)">
        <rect x="-120" y="-40" width="240" height="80" rx="8" fill="white" fillOpacity="0.95" filter="url(#shadow)" />
        <text x="-100" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Card Payments</text>
        <text x="-100" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">68%</text>
        <text x="20" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Mobile Payments</text>
        <text x="20" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">22%</text>
      </g>

      <g transform="translate(1020, 530)">
        <rect x="-120" y="-40" width="240" height="80" rx="8" fill="white" fillOpacity="0.95" filter="url(#shadow)" />
        <text x="-100" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Bank Transfers</text>
        <text x="-100" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">9%</text>
        <text x="20" y="-15" fontFamily="'Inter', sans-serif" fontSize="12" fontWeight="500" fill="#6B7280">Other Methods</text>
        <text x="20" y="10" fontFamily="'Inter', sans-serif" fontSize="18" fontWeight="700" fill="#111827">1%</text>
      </g>

      {/* Floating particles */}
      <g>
        {Array.from({ length: 30 }).map((_, i) => (
          <circle
            key={`particle-${i}`}
            cx={300 + (Math.random() * 600)}
            cy={200 + (Math.random() * 300)}
            r={1 + (Math.random() * 2)}
            fill="url(#flow-gradient)"
            opacity={0.3 + (Math.random() * 0.4)}
          >
            <animate
              attributeName="opacity"
              values={`${0.3 + Math.random() * 0.4};${0.5 + Math.random() * 0.5};${0.3 + Math.random() * 0.4}`}
              dur={`${2 + Math.random() * 4}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="r"
              values={`${1 + Math.random() * 2};${1.5 + Math.random() * 2.5};${1 + Math.random() * 2}`}
              dur={`${2 + Math.random() * 4}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}