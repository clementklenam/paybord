export function PaymentFlowAnimation() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        {/* Gradient definitions */}
        <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AFF" />
          <stop offset="100%" stopColor="#5921c9" />
        </linearGradient>
        
        <linearGradient id="purple-glow-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8F58FF" />
          <stop offset="100%" stopColor="#6C2BFB" />
        </linearGradient>
        
        <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0FCEA6" />
          <stop offset="100%" stopColor="#0D9B8A" />
        </linearGradient>
        
        <linearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="50%" stopColor="#9161FF" />
          <stop offset="100%" stopColor="#0FCEA6" />
        </linearGradient>
        
        <linearGradient id="path-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F3F4F6" />
          <stop offset="100%" stopColor="#E5E7EB" />
        </linearGradient>
        
        {/* Background gradient for the whole visualization */}
        <radialGradient id="bg-gradient" cx="400" cy="300" r="500" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F9FAFB" />
        </radialGradient>
        
        {/* Glow filters */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1" />
        </filter>
        
        {/* Path for payment journey */}
        <path id="payment-journey" 
          d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
        />
      </defs>
      
      {/* Background */}
      <rect width="800" height="600" fill="url(#bg-gradient)" />
      
      {/* Background grid pattern */}
      <g opacity="0.08">
        {Array.from({ length: 20 }).map((_, i) => (
          <line 
            key={`h-line-${i}`}
            x1="0" 
            y1={30 + i * 30} 
            x2="800" 
            y2={30 + i * 30} 
            stroke="#6C2BFB" 
            strokeWidth="1"
          />
        ))}
        
        {Array.from({ length: 27 }).map((_, i) => (
          <line 
            key={`v-line-${i}`}
            x1={30 + i * 30} 
            y1="0" 
            x2={30 + i * 30} 
            y2="600" 
            stroke="#6C2BFB" 
            strokeWidth="1"
          />
        ))}
      </g>
      
      {/* Main payment process background */}
      <path 
        d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300" 
        stroke="url(#path-gradient)" 
        strokeWidth="20" 
        strokeLinecap="round" 
        filter="url(#shadow)"
        fill="none"
      />
      
      {/* Curved path for the payment journey */}
      <path 
        d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300" 
        stroke="#E5E7EB" 
        strokeWidth="14" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Animated progress line */}
      <path 
        d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300" 
        stroke="url(#connector-gradient)" 
        strokeWidth="12" 
        strokeLinecap="round" 
        filter="url(#soft-glow)"
        fill="none"
        strokeDasharray="1500"
        strokeDashoffset="1500"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="1500"
          to="0"
          dur="10s"
          begin="0s"
          fill="freeze"
          repeatCount="indefinite"
        />
      </path>
      
      {/* Background sparkle effect */}
      <g className="sparkles" opacity="0.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={`sparkle-${i}`} transform={`translate(${Math.random() * 800}, ${Math.random() * 600})`}>
            <circle r="1.5" fill="#6C2BFB" opacity={0.1 + Math.random() * 0.3}>
              <animate 
                attributeName="opacity" 
                values={`${0.1 + Math.random() * 0.3};${0.3 + Math.random() * 0.5};${0.1 + Math.random() * 0.3}`} 
                dur={`${1 + Math.random() * 3}s`} 
                repeatCount="indefinite" 
              />
            </circle>
          </g>
        ))}
      </g>
      
      {/* Connection lines between stages with better styling */}
      <g className="connections">
        <path d="M130,300 L220,150" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M280,150 L370,150" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M430,150 L520,150" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M580,150 L670,300" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M670,300 L580,450" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M520,450 L430,450" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M370,450 L280,450" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
        <path d="M220,450 L130,300" stroke="#E0E0E0" strokeWidth="2" strokeDasharray="4,6" opacity="0.3" />
      </g>
      
      {/* Payment stages with improved design */}
      {/* 1. Initiation */}
      <g transform="translate(100, 300)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#purple-gradient)" />
        <circle r="30" fill="url(#purple-glow-gradient)" />
        
        {/* Icon/Label */}
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">Initiate</text>
        
        {/* Pulse effect */}
        <circle r="35" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="35" to="50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
        
        {/* Node activation animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0.8;0" 
              keyTimes="0;0.1;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;15;10" 
              keyTimes="0;0.1;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator - always on after activated */}
        <circle r="6" fill="#0FCEA6" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;1;1" 
            keyTimes="0;0.1;0.11;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 2. API Validation */}
      <g transform="translate(250, 150)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#purple-gradient)" />
        <circle r="30" fill="url(#purple-glow-gradient)" />
        
        {/* Icon/Label */}
        <text x="0" y="-5" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">API</text>
        <text x="0" y="10" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Validation</text>
        
        {/* Node activation animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0.8;0" 
              keyTimes="0;0.15;0.25;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;15;10" 
              keyTimes="0;0.15;0.25;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#0FCEA6" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;1;1" 
            keyTimes="0;0.15;0.25;0.26;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 3. OthoPay Processing */}
      <g transform="translate(400, 150)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="46" fill="white" opacity="0.15" />
        <circle r="42" fill="url(#purple-gradient)" />
        <circle r="40" fill="url(#purple-glow-gradient)" />
        
        {/* Icon/Label */}
        <text x="0" y="-8" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">OthoPay</text>
        <text x="0" y="12" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Processing</text>
        
        {/* Processing animation */}
        <g className="processing">
          <circle r="45" stroke="white" strokeWidth="3" strokeOpacity="0.5" fill="none">
            <animate 
              attributeName="stroke-opacity" 
              values="0;0;0.5;0.5;0" 
              keyTimes="0;0.3;0.4;0.5;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
          
          <circle r="55" stroke="white" strokeWidth="2" strokeOpacity="0" fill="none">
            <animate 
              attributeName="stroke-opacity" 
              values="0;0;0.3;0.3;0" 
              keyTimes="0;0.3;0.4;0.6;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="45;45;55;55;45" 
              keyTimes="0;0.3;0.4;0.6;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#0FCEA6" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;1;1" 
            keyTimes="0;0.3;0.4;0.5;0.5;0.51;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 4. Payment Gateway */}
      <g transform="translate(550, 150)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#teal-gradient)" />
        <circle r="30" fill="#0FCEA6" />
        
        {/* Icon/Label */}
        <text x="0" y="-5" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Payment</text>
        <text x="0" y="10" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Gateway</text>
        
        {/* Gateway activation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0.8;0" 
              keyTimes="0;0.45;0.5;0.6;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;10;15;10" 
              keyTimes="0;0.45;0.5;0.6;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#6C2BFB" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;0;1;1" 
            keyTimes="0;0.45;0.5;0.55;0.6;0.61;0.62;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 5. Settlement */}
      <g transform="translate(700, 300)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#teal-gradient)" />
        <circle r="30" fill="#0FCEA6" />
        
        {/* Icon/Label */}
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">Settlement</text>
        
        {/* Settlement animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0.8;0" 
              keyTimes="0;0.55;0.6;0.65;0.75;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;10;10;15;10" 
              keyTimes="0;0.55;0.6;0.65;0.75;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#6C2BFB" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;0;0;0;1;1" 
            keyTimes="0;0.55;0.6;0.65;0.7;0.75;0.76;0.77;0.78;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 6. Reconciliation */}
      <g transform="translate(550, 450)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#teal-gradient)" />
        <circle r="30" fill="#0FCEA6" />
        
        {/* Icon/Label */}
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">Reconciliation</text>
        
        {/* Reconciliation animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0;0.8;0" 
              keyTimes="0;0.65;0.7;0.75;0.8;0.85;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;10;10;10;15;10" 
              keyTimes="0;0.65;0.7;0.75;0.8;0.85;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#6C2BFB" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;0;0;0;0;0;1;1" 
            keyTimes="0;0.65;0.7;0.75;0.8;0.82;0.84;0.85;0.86;0.87;0.88;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 7. Confirmation */}
      <g transform="translate(400, 450)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#purple-gradient)" />
        <circle r="30" fill="url(#purple-glow-gradient)" />
        
        {/* Icon/Label */}
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">Confirmation</text>
        
        {/* Confirmation animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0;0;0.8;0" 
              keyTimes="0;0.7;0.75;0.8;0.85;0.9;0.95;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;10;10;10;10;15;10" 
              keyTimes="0;0.7;0.75;0.8;0.85;0.9;0.95;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator */}
        <circle r="6" fill="#0FCEA6" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;0;0;0;0;0;0;0;1;1" 
            keyTimes="0;0.7;0.75;0.8;0.85;0.9;0.91;0.92;0.93;0.94;0.95;0.96;0.97;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* 8. Notification */}
      <g transform="translate(250, 450)" filter="url(#soft-glow)">
        {/* Node highlight effect */}
        <circle r="36" fill="white" opacity="0.15" />
        <circle r="32" fill="url(#purple-gradient)" />
        <circle r="30" fill="url(#purple-glow-gradient)" />
        
        {/* Icon/Label */}
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle" alignmentBaseline="middle">Notification</text>
        
        {/* Notification animation */}
        <g>
          <circle r="10" fill="white" opacity="0">
            <animate 
              attributeName="opacity" 
              values="0;0;0;0;0;0;0;0.8;0.8;0" 
              keyTimes="0;0.75;0.8;0.85;0.9;0.92;0.94;0.96;0.98;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="r" 
              values="10;10;10;10;10;10;10;15;10;10" 
              keyTimes="0;0.75;0.8;0.85;0.9;0.92;0.94;0.96;0.98;1" 
              dur="10s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status indicator - changes color to green at completion */}
        <circle r="6" fill="#D1D5DB" opacity="0">
          <animate 
            attributeName="opacity" 
            values="0;0;0;0;0;0;0;0;0;0;0;0;0;0;1;1" 
            keyTimes="0;0.75;0.8;0.85;0.9;0.92;0.94;0.95;0.96;0.97;0.98;0.99;0.995;0.996;0.997;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
          <animate 
            attributeName="fill" 
            values="#D1D5DB;#D1D5DB;#0FCEA6" 
            keyTimes="0;0.99;1" 
            dur="10s" 
            repeatCount="indefinite" 
            fill="freeze"
          />
        </circle>
      </g>
      
      {/* Enhanced payment status display */}
      <g transform="translate(400, 300)" filter="url(#shadow)">
        <rect 
          x="-120" 
          y="-24" 
          width="240" 
          height="48" 
          rx="24" 
          fill="white" 
          stroke="#F3F4F6" 
          strokeWidth="1"
        />
        
        {/* Status icon - dot animation */}
        <g transform="translate(-95, 0)">
          <circle r="8" fill="#6C2BFB">
            <animate 
              attributeName="opacity" 
              values="0.6;1;0.6" 
              dur="1.5s" 
              repeatCount="indefinite" 
            />
          </circle>
        </g>
        
        {/* Status text */}
        <text id="status-text" x="10" y="5" fontFamily="Arial" fontSize="16" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Initiating Payment...</text>
        
        <animate 
          attributeName="opacity" 
          values="0;1;1;1;1;1;1;1;1;0" 
          keyTimes="0;0.1;0.25;0.4;0.55;0.7;0.85;0.95;0.98;1" 
          dur="10s" 
          repeatCount="indefinite" 
        />
      </g>
      
      {/* Animation to update the status text */}
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Validating Request..." 
        begin="1.5s; 11.5s; 21.5s; 31.5s; 41.5s; 51.5s" 
        dur="2.5s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="OthoPay Processing..." 
        begin="4s; 14s; 24s; 34s; 44s; 54s" 
        dur="1.5s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Connecting to Gateway..." 
        begin="5.5s; 15.5s; 25.5s; 35.5s; 45.5s; 55.5s" 
        dur="1s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Settling Transaction..." 
        begin="6.5s; 16.5s; 26.5s; 36.5s; 46.5s; 56.5s" 
        dur="1s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Reconciling Funds..." 
        begin="7.5s; 17.5s; 27.5s; 37.5s; 47.5s; 57.5s" 
        dur="1s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Confirming Payment..." 
        begin="8.5s; 18.5s; 28.5s; 38.5s; 48.5s; 58.5s" 
        dur="0.5s" 
      />
      
      <set 
        xlinkHref="#status-text" 
        attributeName="textContent" 
        to="Payment Successful! ✓" 
        begin="9s; 19s; 29s; 39s; 49s; 59s" 
        dur="1s" 
      />
      
      {/* Moving payment along the path - enhanced with trailing effect */}
      <g filter="url(#glow)">
        {/* Main payment dot */}
        <circle r="8" fill="white">
          <animateMotion
            path="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
            dur="10s"
            repeatCount="indefinite"
            rotate="auto"
          />
        </circle>
        
        {/* Trailing dots */}
        <circle r="6" fill="white" opacity="0.7">
          <animateMotion
            path="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
            dur="10s"
            repeatCount="indefinite"
            rotate="auto"
            begin="-0.2s"
          />
        </circle>
        
        <circle r="4" fill="white" opacity="0.5">
          <animateMotion
            path="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
            dur="10s"
            repeatCount="indefinite"
            rotate="auto"
            begin="-0.4s"
          />
        </circle>
        
        <circle r="2" fill="white" opacity="0.3">
          <animateMotion
            path="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
            dur="10s"
            repeatCount="indefinite"
            rotate="auto"
            begin="-0.6s"
          />
        </circle>
      </g>
      
      {/* Numbered indicators for step sequence */}
      <g className="step-indicators">
        <g transform="translate(85, 260)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">1</text>
        </g>
        
        <g transform="translate(235, 110)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">2</text>
        </g>
        
        <g transform="translate(385, 110)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">3</text>
        </g>
        
        <g transform="translate(535, 110)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">4</text>
        </g>
        
        <g transform="translate(715, 260)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">5</text>
        </g>
        
        <g transform="translate(565, 485)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">6</text>
        </g>
        
        <g transform="translate(415, 485)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">7</text>
        </g>
        
        <g transform="translate(265, 485)">
          <circle r="14" fill="white" />
          <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">8</text>
        </g>
      </g>
    </svg>
  );
}