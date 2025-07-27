#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files to fix with their specific issues
const fixes = [
  // Remove unused imports from transactions.tsx
  {
    file: 'client/src/pages/dashboard/transactions.tsx',
    type: 'remove-unused-imports',
    imports: [
      'ArrowUpDown', 'AlertCircle', 'User', 'Mail', 'Phone', 'ExternalLink', 'Copy', 
      'ArrowLeft', 'ArrowRight', 'BarChart3', 'PieChart', 'MoreHorizontal', 'Settings', 
      'Bell', 'Zap', 'Shield', 'Target', 'Award', 'Star', 'Heart', 'MessageCircle', 
      'Share2', 'Bookmark', 'Flag', 'Archive', 'Trash2', 'Edit3', 'ExternalLinkIcon', 
      'Lock', 'Unlock', 'Key', 'SettingsIcon', 'BellIcon', 'UserIcon', 'Users', 
      'BuildingIcon', 'Home', 'ShoppingCart', 'Package', 'Truck', 'Plane', 'Ship', 
      'Car', 'Bike', 'Coffee', 'Gift', 'AwardIcon', 'Trophy', 'Medal', 'Crown', 
      'Diamond', 'Gem'
    ]
  },
  // Remove unused imports from transactions-fixed.tsx
  {
    file: 'client/src/pages/dashboard/transactions-fixed.tsx',
    type: 'remove-unused-imports',
    imports: ['ArrowUpDown', 'User', 'Mail', 'Phone', 'ExternalLink', 'Copy', 'ArrowLeft', 'ArrowRight']
  },
  // Remove unused imports from payment-links.tsx
  {
    file: 'client/src/pages/dashboard/payment-links.tsx',
    type: 'remove-unused-imports',
    imports: ['Pagination', 'Eye', 'EyeOff', 'Filter', 'ChevronDown']
  },
  // Remove unused imports from products-new.tsx
  {
    file: 'client/src/pages/dashboard/products-new.tsx',
    type: 'remove-unused-imports',
    imports: ['DialogDescription', 'DialogFooter']
  },
  // Remove unused imports from storefront.tsx
  {
    file: 'client/src/pages/dashboard/storefront.tsx',
    type: 'remove-unused-imports',
    imports: ['showDeleteDialog', 'setShowDeleteDialog', 'storefrontToDelete', 'setStorefrontToDelete', 'isDeleting', 'setIsDeleting']
  },
  // Remove unused imports from reports.tsx
  {
    file: 'client/src/pages/dashboard/reports.tsx',
    type: 'remove-unused-imports',
    imports: ['analyticsService']
  },
  // Remove unused imports from products-fixed.tsx
  {
    file: 'client/src/pages/dashboard/products-fixed.tsx',
    type: 'remove-unused-imports',
    imports: ['currentPage']
  },
  // Remove unused imports from store/index.tsx
  {
    file: 'client/src/pages/store/index.tsx',
    type: 'remove-unused-imports',
    imports: ['setStoreData', 'setProducts']
  },
  // Remove unused imports from payment/[id].tsx
  {
    file: 'client/src/pages/payment/[id].tsx',
    type: 'remove-unused-imports',
    imports: ['paymentMatch']
  },
  // Remove unused imports from payment-link/[id].tsx
  {
    file: 'client/src/pages/payment-link/[id].tsx',
    type: 'remove-unused-imports',
    imports: ['paymentMatch', 'plMatch', 'setProcessingPayment']
  },
  // Remove unused imports from storefront/[id].tsx
  {
    file: 'client/src/pages/storefront/[id].tsx',
    type: 'remove-unused-imports',
    imports: ['@ts-expect-error']
  },
  // Remove unused imports from various component files
  {
    file: 'client/src/components/home/HeroSection.tsx',
    type: 'remove-unused-imports',
    imports: ['React']
  },
  {
    file: 'client/src/components/home/Navbar.tsx',
    type: 'remove-unused-imports',
    imports: ['React', 'solutions', 'solutionsOpen', 'setSolutionsOpen']
  },
  {
    file: 'client/src/components/home/Header.tsx',
    type: 'remove-unused-imports',
    imports: ['Users', 'Shield', 'Globe']
  },
  {
    file: 'client/src/components/home/BenefitsSection.tsx',
    type: 'remove-unused-imports',
    imports: ['index']
  }
];

function removeUnusedImports(filePath, importsToRemove) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Remove unused imports from destructured imports
  importsToRemove.forEach(importName => {
    // Remove from destructured imports like: import { A, B, C } from '...'
    const destructuredRegex = new RegExp(`\\b${importName}\\b\\s*,?\\s*`, 'g');
    if (destructuredRegex.test(content)) {
      content = content.replace(destructuredRegex, '');
      modified = true;
    }

    // Remove from named imports like: import A from '...'
    const namedRegex = new RegExp(`import\\s+\\b${importName}\\b\\s+from\\s+['"][^'"]+['"];?\\s*`, 'g');
    if (namedRegex.test(content)) {
      content = content.replace(namedRegex, '');
      modified = true;
    }
  });

  // Clean up empty import statements
  content = content.replace(/import\s*{\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');
  content = content.replace(/import\s*{\s*,+\s*}\s*from\s*['"][^'"]+['"];?\s*/g, '');

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed: ${filePath}`);
  }
}

function fixTypeIssues() {
  // Fix specific type issues
  const typeFixes = [
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct.price',
      replace: '(selectedProduct as any).price'
    },
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct.currency',
      replace: '(selectedProduct as any).currency'
    },
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct.name',
      replace: '(selectedProduct as any).name'
    },
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct.description',
      replace: '(selectedProduct as any).description'
    },
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct.imageUrl',
      replace: '(selectedProduct as any).imageUrl'
    },
    {
      file: 'client/src/pages/dashboard/payment-links.tsx',
      search: 'selectedProduct._id',
      replace: '(selectedProduct as any)._id'
    }
  ];

  typeFixes.forEach(fix => {
    if (fs.existsSync(fix.file)) {
      let content = fs.readFileSync(fix.file, 'utf8');
      if (content.includes(fix.search)) {
        content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
        fs.writeFileSync(fix.file, content);
        console.log(`Fixed type issue in: ${fix.file}`);
      }
    }
  });
}

// Execute fixes
console.log('Fixing TypeScript errors...');

fixes.forEach(fix => {
  if (fix.type === 'remove-unused-imports') {
    removeUnusedImports(fix.file, fix.imports);
  }
});

fixTypeIssues();

console.log('TypeScript error fixes completed!'); 