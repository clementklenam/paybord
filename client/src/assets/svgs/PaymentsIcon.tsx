
  return (
    <svg 
      viewBox="0 0 200 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-h-full"
      {...props}
    >
      {/* Background */}
      <rect x="10" y="30" width="180" height="100" rx="10" fill="#F3F4F6" />
      
      {/* Mobile Money */}
      <g transform="translate(40, 50)">
        <rect width="50" height="80" rx="8" fill="white" stroke="#E5E7EB" />
        <rect x="10" y="10" width="30" height="30" rx="15" fill="#1e8449" fillOpacity="0.2" />
        <path d="M25 20V30M20 25H30" stroke="#1e8449" strokeWidth="2" strokeLinecap="round" />
        <rect x="10" y="50" width="30" height="5" rx="2" fill="#1e8449" fillOpacity="0.6" />
        <rect x="10" y="60" width="20" height="5" rx="2" fill="#1e8449" fillOpacity="0.4" />
      </g>
      
      {/* Card */}
      <g transform="translate(110, 50)">
        <rect width="70" height="45" rx="5" fill="#0FCEA6" />
        <rect x="10" y="10" width="50" height="5" rx="2" fill="white" fillOpacity="0.6" />
        <rect x="10" y="30" width="20" height="5" rx="2" fill="white" fillOpacity="0.9" />
      </g>
      
      {/* Bank */}
      <g transform="translate(110, 105)">
        <rect width="70" height="25" rx="3" fill="white" stroke="#E5E7EB" />
        <rect x="10" y="10" width="50" height="5" rx="2" fill="#1e8449" fillOpacity="0.3" />
      </g>
      
      {/* Arrow indicators */}
      <path d="M80 70L100 70" stroke="#1e8449" strokeWidth="2" strokeLinecap="round" />
      <path d="M95 65L100 70L95 75" stroke="#1e8449" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Animation indicators */}
      <circle cx="155" cy="30" r="3" fill="#1e8449" />
      <circle cx="165" cy="30" r="3" fill="#1e8449" fillOpacity="0.6" />
      <circle cx="175" cy="30" r="3" fill="#1e8449" fillOpacity="0.3" />
    </svg>
  );
}
