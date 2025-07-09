export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

export interface ThemeLayout {
  type: 'grid' | 'list' | 'masonry' | 'carousel' | 'hero';
  columns: number;
  spacing: 'tight' | 'normal' | 'loose';
  showCategories: boolean;
  showFilters: boolean;
  showSearch: boolean;
  showBanner: boolean;
  showHero: boolean;
  showSidebar: boolean;
}

export interface ThemeTypography {
  headingFont: string;
  bodyFont: string;
  fontSize: 'small' | 'medium' | 'large';
  fontWeight: 'light' | 'normal' | 'bold';
}

export interface ThemeSpacing {
  container: 'narrow' | 'normal' | 'wide';
  section: 'tight' | 'normal' | 'loose';
  component: 'compact' | 'normal' | 'spacious';
}

export interface StorefrontTheme {
  id: string;
  name: string;
  category: 'fashion' | 'electronics' | 'restaurant' | 'beauty' | 'sports' | 'home' | 'general';
  description: string;
  preview: string;
  colors: ThemeColors;
  layout: ThemeLayout;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  features: string[];
  isPopular?: boolean;
}

export interface ThemePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  colors: Partial<ThemeColors>;
  layout: Partial<ThemeLayout>;
  typography: Partial<ThemeTypography>;
  spacing: Partial<ThemeSpacing>;
} 