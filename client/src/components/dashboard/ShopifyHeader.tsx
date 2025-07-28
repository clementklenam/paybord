import React from 'react';

interface ShopifyHeaderProps {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}

export function ShopifyHeader({ title, subtitle, actions }: ShopifyHeaderProps) {
  return (
    <div className="bg-[#2d5a5a] border-b border-gray-200 px-6 py-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-white/80 mt-1">{subtitle}</p>
        </div>
        {actions && (
          <div className="flex items-center">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
} 