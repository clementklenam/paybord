import { StorefrontTheme } from '@/types/theme';

// Example themes
export const themePresets: StorefrontTheme[] = [
  {
    id: 'general-professional',
    name: 'Professional',
    category: 'general',
    description: 'A clean, professional theme for all business types.',
    preview: '/images/themes/professional.png',
    colors: {
          primary: '#FFD700',
    secondary: '#FFC700',
    accent: '#FFD700',
    background: '#FFFFFF',
    surface: '#F6F6F6',
    text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
    },
    layout: {
      type: 'grid',
      columns: 3,
      spacing: 'normal',
      showCategories: true,
      showFilters: true,
      showSearch: true,
      showBanner: true,
      showHero: true,
      showSidebar: false,
    },
    typography: {
      headingFont: 'Inter, sans-serif',
      bodyFont: 'Inter, sans-serif',
      fontSize: 'medium',
      fontWeight: 'normal',
    },
    spacing: {
      container: 'normal',
      section: 'normal',
      component: 'normal',
    },
    features: ['Responsive', 'Quick Setup', 'Modern Design'],
    isPopular: true,
  },
  {
    id: 'fashion-elegant',
    name: 'Elegant Fashion',
    category: 'fashion',
    description: 'A stylish theme for fashion and beauty stores.',
    preview: '/images/themes/fashion.png',
    colors: {
      primary: '#FFD700',
      secondary: '#FFC700',
      accent: '#FFD700',
      background: '#F5FAFF',
      surface: '#F6F6F6',
      text: '#333333',
      textSecondary: '#666666',
      border: '#e0e0e0',
      success: '#27ae60',
      warning: '#f39c12',
      error: '#e74c3c',
    },
    layout: {
      type: 'grid',
      columns: 4,
      spacing: 'loose',
      showCategories: true,
      showFilters: true,
      showSearch: true,
      showBanner: true,
      showHero: true,
      showSidebar: true,
    },
    typography: {
      headingFont: 'Playfair Display, serif',
      bodyFont: 'Playfair Display, serif',
      fontSize: 'medium',
      fontWeight: 'normal',
    },
    spacing: {
      container: 'wide',
      section: 'loose',
      component: 'spacious',
    },
    features: ['Gallery', 'Category Filters', 'Instagram Feed'],
    isPopular: false,
  },
];

export function getThemePresetsByCategory(categoryId: string): StorefrontTheme[] {
  return themePresets.filter(theme => theme.category === categoryId);
}

export function getPopularThemes(): StorefrontTheme[] {
  return themePresets.filter(theme => theme.isPopular);
}

export function getThemeById(id: string): StorefrontTheme | undefined {
  return themePresets.find(theme => theme.id === id);
} 