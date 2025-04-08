export function DynamicAfricaIllustration() {
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background elements */}
      <circle cx="400" cy="300" r="250" fill="#F3F4F6" />
      <circle cx="400" cy="300" r="200" fill="#F9FAFB" />
      
      {/* Africa continent stylized */}
      <path 
        d="M365 195L390 170L425 185L460 170L485 185L500 215L485 245L470 260L465 290L440 320L435 350L405 380L390 405L405 435L390 465L360 480L330 465L300 480L275 460L250 435L235 405L250 375L275 350L285 320L270 290L275 260L290 235L310 215L335 200L365 195Z" 
        fill="#6C2BFB" 
        fillOpacity="0.1" 
        stroke="#6C2BFB" 
        strokeWidth="3"
      />
      
      {/* Dynamic payment flow animation */}
      <g className="payment-flow">
        {/* Payment hubs - major cities */}
        <circle cx="330" cy="230" r="12" fill="#0FCEA6" />
        <circle cx="450" cy="280" r="12" fill="#0FCEA6" />
        <circle cx="380" cy="350" r="12" fill="#0FCEA6" />
        <circle cx="290" cy="400" r="12" fill="#0FCEA6" />
        <circle cx="380" cy="450" r="12" fill="#0FCEA6" />
        
        {/* Animated pulse rings around payment hubs */}
        <circle cx="330" cy="230" r="20" stroke="#0FCEA6" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="12" to="25" dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="450" cy="280" r="20" stroke="#0FCEA6" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="12" to="25" dur="2s" begin="0.4s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" begin="0.4s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="380" cy="350" r="20" stroke="#0FCEA6" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="12" to="25" dur="2s" begin="0.8s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" begin="0.8s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="290" cy="400" r="20" stroke="#0FCEA6" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="12" to="25" dur="2s" begin="1.2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" begin="1.2s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="380" cy="450" r="20" stroke="#0FCEA6" strokeWidth="2" strokeOpacity="0.5" fill="none">
          <animate attributeName="r" from="12" to="25" dur="2s" begin="1.6s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" begin="1.6s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Animated transaction flows */}
      <g className="transaction-flows">
        {/* Connection lines */}
        <path d="M330 230L450 280" stroke="#6C2BFB" strokeWidth="2" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M450 280L380 350" stroke="#6C2BFB" strokeWidth="2" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M380 350L290 400" stroke="#6C2BFB" strokeWidth="2" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </path>
        <path d="M290 400L380 450" stroke="#6C2BFB" strokeWidth="2" strokeDasharray="5 5">
          <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1.5s" repeatCount="indefinite" />
        </path>
        
        {/* Moving transaction dots */}
        <circle cx="330" cy="230" r="6" fill="#6C2BFB">
          <animateMotion path="M0 0 L120 50 L-70 70 L-90 50 L90 50" dur="5s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="450" cy="280" r="6" fill="#6C2BFB" opacity="0.8">
          <animateMotion path="M0 0 L-70 70 L-90 50 L90 50 L120 50" dur="5s" begin="1s" repeatCount="indefinite" />
        </circle>
        
        <circle cx="380" cy="350" r="6" fill="#6C2BFB" opacity="0.6">
          <animateMotion path="M0 0 L-90 50 L90 50 L120 50 L-70 70" dur="5s" begin="2s" repeatCount="indefinite" />
        </circle>
      </g>
      
      {/* Payment method floating labels */}
      <g className="payment-methods">
        <g transform="translate(300, 210)">
          <rect x="-50" y="-20" width="100" height="40" rx="20" fill="white" stroke="#6C2BFB" strokeWidth="2" />
          <text x="0" y="7" fontFamily="Arial" fontSize="12" fill="#6C2BFB" textAnchor="middle">Mobile Money</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-3; 0,3; 0,-3" dur="4s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(475, 280)">
          <rect x="-40" y="-20" width="80" height="40" rx="20" fill="white" stroke="#6C2BFB" strokeWidth="2" />
          <text x="0" y="7" fontFamily="Arial" fontSize="12" fill="#6C2BFB" textAnchor="middle">Cards</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-3; 0,3; 0,-3" dur="4s" begin="0.5s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(380, 390)">
          <rect x="-55" y="-20" width="110" height="40" rx="20" fill="white" stroke="#6C2BFB" strokeWidth="2" />
          <text x="0" y="7" fontFamily="Arial" fontSize="12" fill="#6C2BFB" textAnchor="middle">Bank Transfers</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-3; 0,3; 0,-3" dur="4s" begin="1s" repeatCount="indefinite" />
        </g>
        
        <g transform="translate(260, 420)">
          <rect x="-40" y="-20" width="80" height="40" rx="20" fill="white" stroke="#6C2BFB" strokeWidth="2" />
          <text x="0" y="7" fontFamily="Arial" fontSize="12" fill="#6C2BFB" textAnchor="middle">Crypto</text>
          <animateTransform attributeName="transform" type="translate" additive="sum" 
            values="0,-3; 0,3; 0,-3" dur="4s" begin="1.5s" repeatCount="indefinite" />
        </g>
      </g>
      
      {/* Central API hub */}
      <g transform="translate(400, 300)">
        <circle cx="0" cy="0" r="40" fill="#6C2BFB" />
        <circle cx="0" cy="0" r="35" fill="#5921c9" />
        <text x="0" y="5" fontFamily="Arial" fontSize="14" fill="white" fontWeight="bold" textAnchor="middle">Paymesa</text>
        <text x="0" y="25" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">Unified API</text>
      </g>
      
      {/* Radiating waves from central hub */}
      <circle cx="400" cy="300" r="50" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none">
        <animate attributeName="r" from="50" to="100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="50" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none">
        <animate attributeName="r" from="50" to="100" dur="3s" begin="1s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.3" to="0" dur="3s" begin="1s" repeatCount="indefinite" />
      </circle>
      
      <circle cx="400" cy="300" r="50" stroke="white" strokeWidth="2" strokeOpacity="0.3" fill="none">
        <animate attributeName="r" from="50" to="100" dur="3s" begin="2s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" from="0.3" to="0" dur="3s" begin="2s" repeatCount="indefinite" />
      </circle>
      
      {/* Decorative background elements */}
      <path d="M200 150 L220 130 L240 150" stroke="#0FCEA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M600 250 L620 230 L640 250" stroke="#0FCEA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M500 450 L520 430 L540 450" stroke="#0FCEA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      <circle cx="220" cy="200" r="8" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="580" cy="300" r="8" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="250" cy="450" r="8" fill="#6C2BFB" fillOpacity="0.2" />
      <circle cx="550" cy="200" r="8" fill="#6C2BFB" fillOpacity="0.2" />
    </svg>
  );
}