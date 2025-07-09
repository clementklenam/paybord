export function PayoutsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 200 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-h-full"
      {...props}
    >
      {/* Background */}
      <rect x="10" y="20" width="180" height="120" rx="10" fill="#F3F4F6" />
      
      {/* Africa map simplified */}
      <path 
        d="M80 40C70 45 70 55 65 65C60 75 50 85 55 95C60 105 70 105 80 110C90 115 95 125 105 125C115 125 125 115 130 105C135 95 140 85 135 75C130 65 120 65 115 55C110 45 90 35 80 40Z" 
        fill="#1e8449" 
        fillOpacity="0.1"
        stroke="#1e8449"
        strokeWidth="2"
      />
      
      {/* Money flow */}
      <g transform="translate(40, 85)">
        <rect width="40" height="25" rx="5" fill="white" stroke="#E5E7EB" />
        <rect x="5" y="5" width="30" height="5" rx="2" fill="#1e8449" fillOpacity="0.5" />
        <rect x="5" y="15" width="20" height="5" rx="2" fill="#1e8449" fillOpacity="0.3" />
      </g>
      
      <path d="M85 95H105" stroke="#0FCEA6" strokeWidth="2" strokeDasharray="4 2" />
      <path d="M100 90L105 95L100 100" stroke="#0FCEA6" strokeWidth="2" />
      
      <g transform="translate(110, 85)">
        <rect width="40" height="25" rx="5" fill="white" stroke="#E5E7EB" />
        <rect x="5" y="5" width="30" height="5" rx="2" fill="#0FCEA6" fillOpacity="0.5" />
        <rect x="5" y="15" width="20" height="5" rx="2" fill="#0FCEA6" fillOpacity="0.3" />
      </g>
      
      {/* Settlement indicators */}
      <g transform="translate(70, 130)">
        <rect width="60" height="20" rx="10" fill="#1e8449" />
        <text x="30" y="14" fontFamily="Arial" fontSize="10" fill="white" textAnchor="middle">Fast Settlement</text>
      </g>
      
      {/* Location markers */}
      <circle cx="65" cy="70" r="5" fill="#0FCEA6" />
      <circle cx="115" cy="55" r="5" fill="#0FCEA6" />
      <circle cx="130" cy="95" r="5" fill="#0FCEA6" />
      
      {/* Connection lines */}
      <path d="M65 70L115 55" stroke="#1e8449" strokeWidth="1" strokeDasharray="3 2" />
      <path d="M115 55L130 95" stroke="#1e8449" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  );
}
