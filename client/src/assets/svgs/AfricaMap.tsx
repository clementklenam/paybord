
  return (
    <svg 
      viewBox="0 0 800 600" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <path 
        d="M400 100C324.249 100 254.997 132.143 203.431 183.709C151.865 235.275 119.722 304.527 119.722 380.278C119.722 456.029 151.865 525.281 203.431 576.847C254.997 628.413 324.249 660.556 400 660.556C475.751 660.556 545.003 628.413 596.569 576.847C648.135 525.281 680.278 456.029 680.278 380.278C680.278 304.527 648.135 235.275 596.569 183.709C545.003 132.143 475.751 100 400 100Z" 
        fill="#F3F4F6"
      />
      <path 
        d="M365 195L390 170L425 185L460 170L485 185L500 215L485 245L470 260L465 290L440 320L435 350L405 380L390 405L405 435L390 465L360 480L330 465L300 480L275 460L250 435L235 405L250 375L275 350L285 320L270 290L275 260L290 235L310 215L335 200L365 195Z" 
        fill="#1e8449" 
        fillOpacity="0.15" 
        stroke="#1e8449" 
        strokeWidth="4"
      />
      <circle cx="330" cy="230" r="10" fill="#0FCEA6" />
      <circle cx="450" cy="280" r="10" fill="#0FCEA6" />
      <circle cx="380" cy="350" r="10" fill="#0FCEA6" />
      <circle cx="290" cy="400" r="10" fill="#0FCEA6" />
      <circle cx="380" cy="450" r="10" fill="#0FCEA6" />
      
      {/* Connection lines */}
      <line x1="330" y1="230" x2="450" y2="280" stroke="#1e8449" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="450" y1="280" x2="380" y2="350" stroke="#1e8449" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="380" y1="350" x2="290" y2="400" stroke="#1e8449" strokeWidth="2" strokeDasharray="5 5" />
      <line x1="290" y1="400" x2="380" y2="450" stroke="#1e8449" strokeWidth="2" strokeDasharray="5 5" />

      {/* API Nodes */}
      <g transform="translate(290,180)">
        <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#1e8449" strokeWidth="2" />
        <text x="0" y="5" fontFamily="Arial" fontSize="12" fill="#1e8449" textAnchor="middle">API</text>
      </g>
      
      <g transform="translate(480,250)">
        <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#1e8449" strokeWidth="2" />
        <text x="0" y="5" fontFamily="Arial" fontSize="12" fill="#1e8449" textAnchor="middle">Mobile Money</text>
      </g>
      
      <g transform="translate(420,380)">
        <rect x="-35" y="-15" width="70" height="30" rx="15" fill="white" stroke="#1e8449" strokeWidth="2" />
        <text x="0" y="5" fontFamily="Arial" fontSize="12" fill="#1e8449" textAnchor="middle">Cards</text>
      </g>
      
      <g transform="translate(250,380)">
        <rect x="-45" y="-15" width="90" height="30" rx="15" fill="white" stroke="#1e8449" strokeWidth="2" />
        <text x="0" y="5" fontFamily="Arial" fontSize="12" fill="#1e8449" textAnchor="middle">Bank Transfer</text>
      </g>
      
      <g transform="translate(340,480)">
        <rect x="-40" y="-15" width="80" height="30" rx="15" fill="white" stroke="#1e8449" strokeWidth="2" />
        <text x="0" y="5" fontFamily="Arial" fontSize="12" fill="#1e8449" textAnchor="middle">PayAfric</text>
      </g>
    </svg>
  );
}
