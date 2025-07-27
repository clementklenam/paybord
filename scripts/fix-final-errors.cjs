#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Fix socket.io import issue properly
function fixSocketImport() {
  const filePath = 'client/src/hooks/useSocket.ts';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      "import { io } from 'socket.io-client';",
      "import io from 'socket.io-client';"
    );
    fs.writeFileSync(filePath, content);
    console.log('Fixed socket.io import');
  }
}

// Fix VariantProps imports that didn't work
function fixVariantPropsImports() {
  const files = [
    'client/src/components/ui/alert.tsx',
    'client/src/components/ui/label.tsx',
    'client/src/components/ui/sheet.tsx',
    'client/src/components/ui/toast.tsx',
    'client/src/components/ui/toggle-group.tsx',
    'client/src/components/ui/toggle.tsx'
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('VariantProps') && !content.includes('class-variance-authority')) {
        // Add the import at the top
        const importMatch = content.match(/import \* as React from 'react';/);
        if (importMatch) {
          content = content.replace(
            "import * as React from 'react';",
            "import * as React from 'react';\nimport { type VariantProps } from 'class-variance-authority';"
          );
          fs.writeFileSync(filePath, content);
          console.log(`Fixed VariantProps in ${filePath}`);
        }
      }
    }
  });
}

// Fix DialogProps import
function fixDialogPropsImport() {
  const filePath = 'client/src/components/ui/command.tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('DialogProps') && !content.includes('@radix-ui/react-dialog')) {
      content = content.replace(
        "import * as React from 'react';",
        "import * as React from 'react';\nimport { type DialogProps } from '@radix-ui/react-dialog';"
      );
      fs.writeFileSync(filePath, content);
      console.log('Fixed DialogProps import');
    }
  }
}

// Fix Button loading prop issue
function fixButtonLoadingProp() {
  const filePath = 'client/src/components/products/ProductCreateForm.tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(
      'loading={loading}',
      'disabled={loading}'
    );
    fs.writeFileSync(filePath, content);
    console.log('Fixed Button loading prop');
  }
}

// Fix payment link business property issues
function fixPaymentLinkBusinessProps() {
  const filePath = 'client/src/pages/payment-link/[id].tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace remaining business property references
    content = content.replace(/paymentLink\.business\?\._id/g, 'paymentLink?.businessId');
    content = content.replace(/"Business" \|\| "Business"/g, '"Business"');
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed payment link business property issues');
  }
}

// Fix route parameter issues
function fixRouteParameterIssues() {
  const files = [
    'client/src/pages/payment-link/[id].tsx',
    'client/src/pages/payment/[id].tsx'
  ];

  files.forEach(filePath => {
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix route parameter access
      content = content.replace(
        /const linkId = \(paymentParams as any\)\?\.id \|\| \(plParams as any\)\?\.id \|\| location\[0\]\.substring\(4\);/g,
        'const linkId = (paymentParams as any)?.id || (plParams as any)?.id || location[0]?.substring(4) || "";'
      );
      
      content = content.replace(
        /const linkId = \(paymentParams as any\)\?\.id \|\| location\[0\]\.substring\(4\);/g,
        'const linkId = (paymentParams as any)?.id || location[0]?.substring(4) || "";'
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`Fixed route params in ${filePath}`);
    }
  });
}

// Fix formatDate undefined issues
function fixFormatDateIssues() {
  const filePath = 'client/src/pages/dashboard/transactions-fixed.tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix formatDate calls with undefined values
    content = content.replace(
      /formatDate\(transaction\.date\)/g,
      'formatDate(transaction.date || "")'
    );
    
    content = content.replace(
      /formatDate\(selectedTransaction\.date\)/g,
      'formatDate(selectedTransaction.date || "")'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed formatDate undefined issues');
  }
}

// Fix slider onValueChange type issue
function fixSliderOnValueChange() {
  const filePath = 'client/src/pages/dashboard/transactions-fixed.tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the slider onValueChange type issue
    content = content.replace(
      /onValueChange=\{setAmountRange\}/g,
      'onValueChange={(value) => setAmountRange([value[0], value[1]])}'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed slider onValueChange type issue');
  }
}

// Fix fetchBusinesses onClick issue
function fixFetchBusinessesOnClick() {
  const filePath = 'client/src/pages/dashboard/storefront.tsx';
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the onClick handler
    content = content.replace(
      /onClick=\{fetchBusinesses\}/g,
      'onClick={() => fetchBusinesses()}'
    );
    
    fs.writeFileSync(filePath, content);
    console.log('Fixed fetchBusinesses onClick issue');
  }
}

// Execute all fixes
console.log('Fixing final TypeScript errors...');

fixSocketImport();
fixVariantPropsImports();
fixDialogPropsImport();
fixButtonLoadingProp();
fixPaymentLinkBusinessProps();
fixRouteParameterIssues();
fixFormatDateIssues();
fixSliderOnValueChange();
fixFetchBusinessesOnClick();

console.log('Final TypeScript error fixes completed!'); 