export function PaymentNetworkIllustration() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background gradient */}
      <defs>
        <radialGradient id="bg-gradient" cx="400" cy="300" r="400" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F9FAFB" />
          <stop offset="1" stopColor="#F3F4F6" />
        </radialGradient>
        
        {/* Connection line gradient */}
        <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6C2BFB" />
          <stop offset="100%" stopColor="#0FCEA6" />
        </linearGradient>
      </defs>
      
      <rect x="0" y="0" width="800" height="600" fill="url(#bg-gradient)" />
      
      {/* Central OthoPay Hub */}
      <circle cx="400" cy="300" r="70" fill="url(#line-gradient)" fillOpacity="0.1" />
      <circle cx="400" cy="300" r="50" fill="#6C2BFB" />
      <circle cx="400" cy="300" r="45" fill="#5921c9" />
      
      <text x="400" y="290" fontFamily="Arial" fontSize="18" fill="white" fontWeight="bold" textAnchor="middle">OthoPay</text>
      <text x="400" y="315" fontFamily="Arial" fontSize="14" fill="white" textAnchor="middle">Africa Hub</text>
      
      {/* Radiating pulse effect */}
      <circle cx="400" cy="300" r="55" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="55" to="90" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="55" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="55" to="90" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="55" stroke="white" strokeWidth="2" strokeOpacity="0.5" fill="none">
        <animate attributeName="r" from="55" to="90" dur="3s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.5" to="0" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Global Payment Nodes */}
      {/* North America */}
      <circle cx="150" cy="200" r="30" fill="#0FCEA6" />
      <text x="150" y="205" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Global</text>
      
      {/* Europe */}
      <circle cx="250" cy="150" r="30" fill="#0FCEA6" />
      <text x="250" y="155" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">SEPA</text>
      
      {/* Asia */}
      <circle cx="600" cy="180" r="30" fill="#0FCEA6" />
      <text x="600" y="185" fontFamily="Arial" fontSize="12" fill="white" fontWeight="bold" textAnchor="middle">Asia</text>
      
      {/* Connection Lines from Global to OthoPay */}
      <path 
        d="M175 215 Q280 250 385 300" 
        stroke="url(#line-gradient)" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="6 4"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M275 165 Q325 220 385 290" 
        stroke="url(#line-gradient)" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="6 4"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M575 195 Q490 235 415 290" 
        stroke="url(#line-gradient)" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="6 4"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
      </path>
      
      {/* Moving transaction dots */}
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
      
      {/* African Payment Method Nodes */}
      {/* Mobile Money */}
      <circle cx="300" cy="400" r="35" fill="#6C2BFB" fillOpacity="0.8" />
      <text x="300" y="395" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Mobile</text>
      <text x="300" y="410" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Money</text>
      
      {/* Card Payments */}
      <circle cx="500" cy="400" r="35" fill="#6C2BFB" fillOpacity="0.8" />
      <text x="500" y="405" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Cards</text>
      
      {/* Bank Transfers */}
      <circle cx="250" cy="300" r="35" fill="#6C2BFB" fillOpacity="0.8" />
      <text x="250" y="295" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Bank</text>
      <text x="250" y="310" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Transfers</text>
      
      {/* Crypto */}
      <circle cx="550" cy="300" r="35" fill="#6C2BFB" fillOpacity="0.8" />
      <text x="550" y="305" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">Crypto</text>
      
      {/* USSD */}
      <circle cx="400" cy="450" r="35" fill="#6C2BFB" fillOpacity="0.8" />
      <text x="400" y="455" fontFamily="Arial" fontSize="11" fill="white" fontWeight="bold" textAnchor="middle">USSD</text>
      
      {/* Connection Lines from OthoPay to African Payment Methods */}
      <path 
        d="M385 335 L315 385" 
        stroke="#6C2BFB" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M415 335 L485 385" 
        stroke="#6C2BFB" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M370 330 L270 310" 
        stroke="#6C2BFB" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M430 330 L530 310" 
        stroke="#6C2BFB" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M400 350 L400 425" 
        stroke="#6C2BFB" 
        strokeWidth="3" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      {/* Moving transaction dots for African payments */}
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
      
      {/* Country names floating around */}
      <g transform="translate(210, 360)" opacity="0.8">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Nigeria</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-5; 0,5; 0,-5" dur="6s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(350, 380)" opacity="0.8">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Kenya</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-5; 0,5; 0,-5" dur="6s" begin="1s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(580, 350)" opacity="0.8">
        <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">South Africa</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-5; 0,5; 0,-5" dur="6s" begin="2s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(300, 240)" opacity="0.8">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Ghana</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-5; 0,5; 0,-5" dur="6s" begin="3s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(500, 240)" opacity="0.8">
        <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Tanzania</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-5; 0,5; 0,-5" dur="6s" begin="4s" repeatCount="indefinite" />
      </g>
      
      {/* Decorative elements */}
      <g opacity="0.6">
        <circle cx="200" cy="150" r="4" fill="#6C2BFB" />
        <circle cx="600" cy="250" r="4" fill="#6C2BFB" />
        <circle cx="280" cy="450" r="4" fill="#6C2BFB" />
        <circle cx="520" cy="450" r="4" fill="#6C2BFB" />
        <circle cx="170" cy="320" r="4" fill="#6C2BFB" />
        <circle cx="630" cy="320" r="4" fill="#6C2BFB" />
      </g>
      
      {/* Mini pulses at network edges */}
      <circle cx="200" cy="150" r="8" stroke="#6C2BFB" strokeWidth="1" fill="none">
        <animate attributeName="r" from="4" to="10" dur="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="600" cy="250" r="8" stroke="#6C2BFB" strokeWidth="1" fill="none">
        <animate attributeName="r" from="4" to="10" dur="2s" begin="0.7s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" begin="0.7s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="280" cy="450" r="8" stroke="#6C2BFB" strokeWidth="1" fill="none">
        <animate attributeName="r" from="4" to="10" dur="2s" begin="1.4s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" begin="1.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}