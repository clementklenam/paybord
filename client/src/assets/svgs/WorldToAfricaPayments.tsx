export function WorldToAfricaPayments() {
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
      </defs>
      <rect x="0" y="0" width="800" height="600" fill="url(#bg-gradient)" />
      
      {/* Simplified World Map - Continents */}
      <g className="world-map" opacity="0.6">
        {/* North America */}
        <path d="M150 120 L180 110 L220 130 L240 160 L230 200 L190 230 L160 240 L120 220 L130 170 L150 120" 
          fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          
        {/* South America */}
        <path d="M220 250 L240 280 L230 320 L210 350 L180 340 L170 310 L190 270 L220 250" 
          fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          
        {/* Europe */}
        <path d="M380 120 L420 110 L450 130 L440 160 L410 170 L380 150 L380 120" 
          fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          
        {/* Asia */}
        <path d="M460 120 L520 100 L580 110 L600 150 L590 200 L550 230 L510 220 L480 180 L470 150 L460 120" 
          fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
          
        {/* Australia */}
        <path d="M650 320 L680 330 L690 360 L670 380 L640 370 L630 340 L650 320" 
          fill="#E5E7EB" stroke="#D1D5DB" strokeWidth="1" />
      </g>
      
      {/* Africa Map Highlighted */}
      <path 
        d="M365 195L390 170L425 185L460 170L485 185L500 215L485 245L470 260L465 290L440 320L435 350L405 380L390 405L405 435L390 465L360 480L330 465L300 480L275 460L250 435L235 405L250 375L275 350L285 320L270 290L275 260L290 235L310 215L335 200L365 195Z" 
        fill="#6C2BFB" 
        fillOpacity="0.15" 
        stroke="#6C2BFB" 
        strokeWidth="3"
      />
      
      {/* Payment Hub Central Circle in Africa */}
      <circle cx="380" cy="300" r="40" fill="#6C2BFB" />
      <circle cx="380" cy="300" r="35" fill="#5921c9" />
      <text x="380" y="305" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Paymesa</text>
      
      {/* Animated pulse rings around Paymesa hub */}
      <circle cx="380" cy="300" r="45" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none">
        <animate attributeName="r" from="45" to="80" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="380" cy="300" r="45" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none">
        <animate attributeName="r" from="45" to="80" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.3" to="0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      
      {/* Major global payment hubs */}
      {/* North America Hub */}
      <circle cx="180" cy="180" r="15" fill="#0FCEA6" />
      <text x="180" y="185" fontFamily="Arial" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">NYC</text>
      
      {/* Europe Hub */}
      <circle cx="410" cy="140" r="15" fill="#0FCEA6" />
      <text x="410" y="145" fontFamily="Arial" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">LON</text>
      
      {/* Asia Hub */}
      <circle cx="550" cy="170" r="15" fill="#0FCEA6" />
      <text x="550" y="175" fontFamily="Arial" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">SIN</text>
      
      {/* Australia Hub */}
      <circle cx="660" cy="350" r="15" fill="#0FCEA6" />
      <text x="660" y="355" fontFamily="Arial" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">SYD</text>
      
      {/* South America Hub */}
      <circle cx="210" cy="300" r="15" fill="#0FCEA6" />
      <text x="210" y="305" fontFamily="Arial" fontSize="10" fill="white" fontWeight="bold" textAnchor="middle">SAO</text>
      
      {/* Connection paths from global hubs to Paymesa */}
      <path 
        d="M190 190 Q285 245 370 295" 
        stroke="#0FCEA6" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M415 155 Q398 228 380 285" 
        stroke="#0FCEA6" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M535 175 Q458 238 395 295" 
        stroke="#0FCEA6" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M645 345 Q513 323 395 305" 
        stroke="#0FCEA6" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M225 295 Q303 298 365 300" 
        stroke="#0FCEA6" 
        strokeWidth="2" 
        fill="none"
        strokeDasharray="5 3"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="16" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      {/* Moving transaction dots along the paths */}
      <circle r="4" fill="#0FCEA6">
        <animateMotion 
          path="M190 190 Q285 245 370 295" 
          dur="3s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="4" fill="#0FCEA6">
        <animateMotion 
          path="M415 155 Q398 228 380 285" 
          dur="2.5s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="4" fill="#0FCEA6">
        <animateMotion 
          path="M535 175 Q458 238 395 295" 
          dur="3.2s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="4" fill="#0FCEA6">
        <animateMotion 
          path="M645 345 Q513 323 395 305" 
          dur="3.8s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="4" fill="#0FCEA6">
        <animateMotion 
          path="M225 295 Q303 298 365 300" 
          dur="2.2s" 
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Payment receivers/hubs within Africa */}
      <circle cx="330" cy="230" r="8" fill="#6C2BFB" fillOpacity="0.7" />
      <circle cx="450" cy="280" r="8" fill="#6C2BFB" fillOpacity="0.7" />
      <circle cx="380" cy="370" r="8" fill="#6C2BFB" fillOpacity="0.7" />
      <circle cx="290" cy="350" r="8" fill="#6C2BFB" fillOpacity="0.7" />
      <circle cx="390" cy="420" r="8" fill="#6C2BFB" fillOpacity="0.7" />
      
      {/* Distribution paths from Paymesa to African payment points */}
      <path 
        d="M380 300 L330 230" 
        stroke="#6C2BFB" 
        strokeWidth="2" 
        strokeDasharray="4 2"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M380 300 L450 280" 
        stroke="#6C2BFB" 
        strokeWidth="2" 
        strokeDasharray="4 2"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M380 300 L380 370" 
        stroke="#6C2BFB" 
        strokeWidth="2" 
        strokeDasharray="4 2"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M380 300 L290 350" 
        stroke="#6C2BFB" 
        strokeWidth="2" 
        strokeDasharray="4 2"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      <path 
        d="M380 300 L390 420" 
        stroke="#6C2BFB" 
        strokeWidth="2" 
        strokeDasharray="4 2"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="12" dur="1.5s" repeatCount="indefinite" />
      </path>
      
      {/* Moving African transaction dots */}
      <circle r="3" fill="#6C2BFB">
        <animateMotion 
          path="M380 300 L330 230" 
          dur="1.5s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="3" fill="#6C2BFB">
        <animateMotion 
          path="M380 300 L450 280" 
          dur="1.2s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="3" fill="#6C2BFB">
        <animateMotion 
          path="M380 300 L380 370" 
          dur="1.3s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="3" fill="#6C2BFB">
        <animateMotion 
          path="M380 300 L290 350" 
          dur="1.7s" 
          repeatCount="indefinite"
        />
      </circle>
      
      <circle r="3" fill="#6C2BFB">
        <animateMotion 
          path="M380 300 L390 420" 
          dur="1.9s" 
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Payment method floating labels */}
      <g transform="translate(310, 210)">
        <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Mobile Money</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-3; 0,3; 0,-3" dur="4s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(470, 280)">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Cards</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-3; 0,3; 0,-3" dur="4s" begin="0.5s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(380, 395)">
        <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Bank Transfer</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-3; 0,3; 0,-3" dur="4s" begin="1s" repeatCount="indefinite" />
      </g>
      
      <g transform="translate(265, 350)">
        <rect x="-30" y="-15" width="60" height="30" rx="15" fill="white" stroke="#6C2BFB" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#6C2BFB" textAnchor="middle">Crypto</text>
        <animateTransform attributeName="transform" type="translate" additive="sum" 
          values="0,-3; 0,3; 0,-3" dur="4s" begin="1.5s" repeatCount="indefinite" />
      </g>
      
      {/* Global payment labels */}
      <g transform="translate(180, 150)">
        <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#0FCEA6" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#0FCEA6" textAnchor="middle">Global Payments</text>
      </g>
      
      <g transform="translate(410, 110)">
        <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#0FCEA6" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#0FCEA6" textAnchor="middle">SEPA Transfers</text>
      </g>
      
      <g transform="translate(550, 140)">
        <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#0FCEA6" strokeWidth="1.5" />
        <text x="0" y="5" fontFamily="Arial" fontSize="10" fill="#0FCEA6" textAnchor="middle">Asia Pay</text>
      </g>
      
      {/* Decorative elements */}
      <circle cx="200" cy="100" r="5" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="600" cy="120" r="5" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="500" cy="400" r="5" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="150" cy="350" r="5" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="700" cy="280" r="5" fill="#6C2BFB" fillOpacity="0.2" />
    </svg>
  );
}