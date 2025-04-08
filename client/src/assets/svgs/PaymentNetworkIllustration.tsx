export function PaymentNetworkIllustration() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        {/* Connection line gradients */}
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="100%" stopColor="#0FCEA6" />
        </linearGradient>
        
        <linearGradient id="hub-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7933FF" />
          <stop offset="100%" stopColor="#5921c9" />
        </linearGradient>
        
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        
        <radialGradient id="center-glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#6C2BFB" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#6C2BFB" stopOpacity="0" />
        </radialGradient>
      </defs>
      
      {/* Background radial gradient for subtle effect */}
      <circle cx="400" cy="300" r="200" fill="url(#center-glow)" opacity="0.4" />
      
      {/* Grid lines for network effect */}
      <g className="grid-lines" opacity="0.1">
        {Array.from({ length: 6 }).map((_, i) => (
          <line 
            key={`horizontal-${i}`}
            x1="200" 
            y1={180 + i * 50} 
            x2="600" 
            y2={180 + i * 50} 
            stroke="#6C2BFB" 
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}
        
        {Array.from({ length: 9 }).map((_, i) => (
          <line 
            key={`vertical-${i}`}
            x1={200 + i * 50} 
            y1="180" 
            x2={200 + i * 50} 
            y2="430" 
            stroke="#6C2BFB" 
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}
      </g>
      
      {/* Central OthoPay Hub */}
      <g filter="url(#glow)">
        <circle cx="400" cy="300" r="70" fill="url(#line-gradient)" fillOpacity="0.15" />
        <circle cx="400" cy="300" r="55" fill="url(#hub-gradient)" />
      </g>
      
      <text x="400" y="290" fontFamily="Arial" fontSize="20" fill="white" fontWeight="bold" textAnchor="middle">OthoPay</text>
      <text x="400" y="315" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">Africa Hub</text>
      
      {/* Radiating pulse effect */}
      <circle cx="400" cy="300" r="60" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="60" to="100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="60" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="60" to="100" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="60" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="60" to="100" dur="3s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Global Payment Nodes with glow effect */}
      <g filter="url(#glow)">
        {/* North America */}
        <circle cx="150" cy="200" r="35" fill="#0FCEA6" />
        <text x="150" y="195" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Global</text>
        <text x="150" y="215" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">Payments</text>
      </g>
      
      <g filter="url(#glow)">
        {/* Europe */}
        <circle cx="250" cy="150" r="35" fill="#0FCEA6" />
        <text x="250" y="155" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">SEPA</text>
      </g>
      
      <g filter="url(#glow)">
        {/* Asia */}
        <circle cx="600" cy="180" r="35" fill="#0FCEA6" />
        <text x="600" y="175" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Asia</text>
        <text x="600" y="195" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">Pay</text>
      </g>
      
      {/* Connection Lines from Global to OthoPay with glowing gradient effect */}
      <g className="incoming-connections">
        <path 
          d="M175 215 Q280 250 385 300" 
          stroke="url(#line-gradient)" 
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 4"
          opacity="0.8"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M275 165 Q325 220 385 290" 
          stroke="url(#line-gradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 4"
          opacity="0.8"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M575 195 Q490 235 415 290" 
          stroke="url(#line-gradient)" 
          strokeWidth="3" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="6 4"
          opacity="0.8"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Moving transaction dots with glow effect */}
      <g filter="url(#glow)">
        <circle r="5" fill="#0FCEA6">
          <animateMotion 
            path="M175 215 Q280 250 385 300" 
            dur="3s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="5" fill="#0FCEA6">
          <animateMotion 
            path="M275 165 Q325 220 385 290" 
            dur="2.5s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="5" fill="#0FCEA6">
          <animateMotion 
            path="M575 195 Q490 235 415 290" 
            dur="3.5s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* African Payment Method Nodes with improved styling */}
      <g className="payment-methods" filter="url(#glow)">
        {/* Mobile Money */}
        <circle cx="300" cy="400" r="40" fill="#6C2BFB" fillOpacity="0.9" />
        <text x="300" y="395" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Mobile</text>
        <text x="300" y="415" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Money</text>
        
        {/* Card Payments */}
        <circle cx="500" cy="400" r="40" fill="#6C2BFB" fillOpacity="0.9" />
        <text x="500" y="405" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Cards</text>
        
        {/* Bank Transfers */}
        <circle cx="250" cy="300" r="40" fill="#6C2BFB" fillOpacity="0.9" />
        <text x="250" y="295" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Bank</text>
        <text x="250" y="315" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Transfers</text>
        
        {/* Crypto */}
        <circle cx="550" cy="300" r="40" fill="#6C2BFB" fillOpacity="0.9" />
        <text x="550" y="305" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Crypto</text>
        
        {/* USSD */}
        <circle cx="400" cy="450" r="40" fill="#6C2BFB" fillOpacity="0.9" />
        <text x="400" y="455" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">USSD</text>
      </g>
      
      {/* Connection Lines from OthoPay to African Payment Methods */}
      <g className="outgoing-connections">
        <path 
          d="M385 335 L315 385" 
          stroke="#6C2BFB" 
          strokeWidth="4" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 3"
          opacity="0.9"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M415 335 L485 385" 
          stroke="#6C2BFB" 
          strokeWidth="4" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 3"
          opacity="0.9"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M370 330 L270 310" 
          stroke="#6C2BFB" 
          strokeWidth="4" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 3"
          opacity="0.9"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M430 330 L530 310" 
          stroke="#6C2BFB" 
          strokeWidth="4" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 3"
          opacity="0.9"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </path>
        
        <path 
          d="M400 350 L400 425" 
          stroke="#6C2BFB" 
          strokeWidth="4" 
          strokeLinecap="round"
          fill="none"
          strokeDasharray="5 3"
          opacity="0.9"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>
      
      {/* Moving transaction dots for African payments with glow */}
      <g filter="url(#glow)">
        <circle r="4" fill="white">
          <animateMotion 
            path="M385 335 L315 385" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="4" fill="white">
          <animateMotion 
            path="M415 335 L485 385" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="4" fill="white">
          <animateMotion 
            path="M370 330 L270 310" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="4" fill="white">
          <animateMotion 
            path="M430 330 L530 310" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
        
        <circle r="4" fill="white">
          <animateMotion 
            path="M400 350 L400 425" 
            dur="1.5s" 
            repeatCount="indefinite"
          />
        </circle>
      </g>
      
      {/* Country names floating around with improved styling */}
      <g className="country-labels">
        <g transform="translate(210, 360)">
          <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <text x="0" y="5" fontFamily="Arial" fontSize="11" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Nigeria</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-5; 0,5; 0,-5" dur="6s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(350, 380)">
          <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <text x="0" y="5" fontFamily="Arial" fontSize="11" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Kenya</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-5; 0,5; 0,-5" dur="6s" begin="1s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(580, 350)">
          <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <text x="0" y="5" fontFamily="Arial" fontSize="11" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">South Africa</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-5; 0,5; 0,-5" dur="6s" begin="2s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(300, 240)">
          <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <text x="0" y="5" fontFamily="Arial" fontSize="11" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Ghana</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-5; 0,5; 0,-5" dur="6s" begin="3s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(500, 240)">
          <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.1))" />
          <text x="0" y="5" fontFamily="Arial" fontSize="11" fill="#6C2BFB" fontWeight="bold" textAnchor="middle">Tanzania</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-5; 0,5; 0,-5" dur="6s" begin="4s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Enhanced decorative elements with sparkle effect */}
      <g className="sparkles">
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`sparkle-${i}`} transform={`translate(${150 + i * 70}, ${140 + (i % 3) * 80})`}>
            <circle r="2" fill="#6C2BFB">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
            </circle>
            <circle r="4" stroke="#6C2BFB" strokeWidth="1" fill="none">
              <animate attributeName="r" from="3" to="6" dur={`${1 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.6" to="0" dur={`${1 + (i % 3) * 0.5}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
        
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={`sparkle-bottom-${i}`} transform={`translate(${180 + i * 60}, ${400 + (i % 3) * 50})`}>
            <circle r="2" fill="#6C2BFB">
              <animate attributeName="opacity" values="0.2;0.8;0.2" dur={`${1.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
            </circle>
            <circle r="4" stroke="#6C2BFB" strokeWidth="1" fill="none">
              <animate attributeName="r" from="3" to="6" dur={`${1.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
              <animate attributeName="stroke-opacity" from="0.6" to="0" dur={`${1.2 + (i % 3) * 0.3}s`} repeatCount="indefinite" />
            </circle>
          </g>
        ))}
      </g>
    </svg>
  );
}