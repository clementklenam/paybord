export function PaymentFlowAnimation() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="purple-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="100%" stopColor="#5921c9" />
        </linearGradient>
        
        <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0FCEA6" />
          <stop offset="100%" stopColor="#0D9B8A" />
        </linearGradient>
        
        <linearGradient id="connector-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="100%" stopColor="#0FCEA6" />
        </linearGradient>
        
        {/* Glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        {/* Path for payment journey */}
        <path id="payment-journey" 
          d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
        />
        
        {/* Markers */}
        <marker id="arrowhead" markerWidth="10" markerHeight="7" 
          refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#6C2BFB" />
        </marker>
      </defs>
      
      {/* Curved path for the payment journey */}
      <path 
        d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300" 
        stroke="#E5E7EB" 
        strokeWidth="8" 
        strokeLinecap="round" 
        fill="none"
      />
      
      {/* Animated progress line */}
      <path 
        d="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300" 
        stroke="url(#connector-gradient)" 
        strokeWidth="8" 
        strokeLinecap="round" 
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
      
      {/* Payment stages */}
      {/* 1. Initiation */}
      <g transform="translate(100, 300)">
        <circle r="30" fill="url(#purple-gradient)" />
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">Initiate</text>
        
        <circle r="35" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="35" to="50" dur="3s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
        </circle>
        
        {/* Animation of payment start */}
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
      </g>
      
      {/* 2. API Validation */}
      <g transform="translate(250, 150)">
        <circle r="30" fill="url(#purple-gradient)" />
        <text x="0" y="-5" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">API</text>
        <text x="0" y="10" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Validation</text>
        
        {/* Stage animation */}
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
      </g>
      
      {/* 3. OthoPay Processing */}
      <g transform="translate(400, 150)">
        <circle r="40" fill="url(#purple-gradient)" />
        <text x="0" y="-10" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">OthoPay</text>
        <text x="0" y="10" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Processing</text>
        
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
      </g>
      
      {/* 4. Payment Gateway */}
      <g transform="translate(550, 150)">
        <circle r="30" fill="url(#teal-gradient)" />
        <text x="0" y="-5" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Payment</text>
        <text x="0" y="10" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Gateway</text>
        
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
      </g>
      
      {/* 5. Settlement */}
      <g transform="translate(700, 300)">
        <circle r="30" fill="url(#teal-gradient)" />
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">Settlement</text>
        
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
      </g>
      
      {/* 6. Reconciliation */}
      <g transform="translate(550, 450)">
        <circle r="30" fill="url(#teal-gradient)" />
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">Reconciliation</text>
        
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
      </g>
      
      {/* 7. Confirmation */}
      <g transform="translate(400, 450)">
        <circle r="30" fill="url(#purple-gradient)" />
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">Confirmation</text>
        
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
      </g>
      
      {/* 8. Notification */}
      <g transform="translate(250, 450)">
        <circle r="30" fill="url(#purple-gradient)" />
        <text x="0" y="0" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle" alignmentBaseline="middle">Notification</text>
        
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
      </g>
      
      {/* Moving payment along the path */}
      <circle r="8" fill="white" filter="url(#glow)">
        <animateMotion
          path="M100,300 C150,300 150,150 250,150 S350,150 400,150 S500,150 550,150 S650,150 700,300 S650,450 550,450 S450,450 400,450 S300,450 250,450 S150,450 100,300"
          dur="10s"
          repeatCount="indefinite"
          rotate="auto"
        />
      </circle>
      
      {/* Payment status text */}
      <g transform="translate(400, 300)">
        <rect x="-100" y="-20" width="200" height="40" rx="20" fill="white" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
        <text id="status-text" x="0" y="5" fontFamily="Arial" fontSize="14" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Initiating Payment...</text>
        
        <animate 
          attributeName="opacity" 
          values="0;1;1;1;1;1;1;1;1;0" 
          keyTimes="0;0.1;0.25;0.4;0.55;0.7;0.85;0.95;0.98;1" 
          dur="10s" 
          repeatCount="indefinite" 
        />
        
        <set attributeName="display" to="none" begin="10s" end="0s" />
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
        to="Payment Successful!" 
        begin="9s; 19s; 29s; 39s; 49s; 59s" 
        dur="1s" 
      />
      
      {/* Connection lines between stages for visual effect */}
      <path d="M130,300 L220,150" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M280,150 L370,150" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M430,150 L520,150" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M580,150 L670,300" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M670,300 L580,450" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M520,450 L430,450" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M370,450 L280,450" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
      <path d="M220,450 L130,300" stroke="#E0E0E0" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
    </svg>
  );
}