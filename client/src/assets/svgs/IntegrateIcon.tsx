export function IntegrateIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      viewBox="0 0 200 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-h-full"
      {...props}
    >
      <rect x="20" y="20" width="160" height="120" rx="8" fill="#F3F4F6" />
      <rect x="30" y="30" width="140" height="100" rx="4" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      
      {/* Code window */}
      <rect x="40" y="40" width="120" height="80" rx="4" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
      
      {/* Code lines */}
      <rect x="50" y="50" width="80" height="4" rx="2" fill="#1e8449" fillOpacity="0.7" />
      <rect x="50" y="60" width="100" height="4" rx="2" fill="#1e8449" fillOpacity="0.5" />
      <rect x="50" y="70" width="90" height="4" rx="2" fill="#1e8449" fillOpacity="0.3" />
      <rect x="50" y="80" width="70" height="4" rx="2" fill="#1e8449" fillOpacity="0.6" />
      <rect x="50" y="90" width="60" height="4" rx="2" fill="#1e8449" fillOpacity="0.4" />
      <rect x="50" y="100" width="85" height="4" rx="2" fill="#1e8449" fillOpacity="0.5" />
      
      {/* Integration Icons */}
      <circle cx="160" cy="50" r="8" fill="#f1c40f" />
      <circle cx="160" cy="75" r="8" fill="#1e8449" />
      <circle cx="160" cy="100" r="8" fill="#1e8449" fillOpacity="0.7" />
      
      {/* Connection lines */}
      <path d="M130 50L150 50" stroke="#f1c40f" strokeWidth="2" />
      <path d="M130 75L150 75" stroke="#1e8449" strokeWidth="2" />
      <path d="M130 100L150 100" stroke="#1e8449" strokeWidth="2" strokeOpacity="0.7" />
    </svg>
  );
}
