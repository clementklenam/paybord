import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StorefrontTheme } from '@/types/theme';
import { getThemePresetsByCategory, getPopularThemes } from '../../data/themePresets';
import { Check, Star, Palette, Layout, Home, Zap, GitCompare } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: StorefrontTheme | null;
  onThemeSelect: (theme: StorefrontTheme) => void;
}

const categories = [
  { id: 'popular', name: 'Popular', icon: Star },
  { id: 'fashion', name: 'Fashion & Beauty', icon: Palette },
  { id: 'electronics', name: 'Electronics', icon: Zap },
  { id: 'restaurant', name: 'Restaurant', icon: Layout },
  { id: 'sports', name: 'Sports', icon: Zap },
  { id: 'home', name: 'Home & Lifestyle', icon: Home },
  { id: 'general', name: 'General', icon: Palette },
];

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState('popular');
  const [showAllThemes, setShowAllThemes] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareThemes, setCompareThemes] = useState<StorefrontTheme[]>([]);

  const getThemesForCategory = (categoryId: string) => {
    if (categoryId === 'popular') {
      return getPopularThemes();
    }
    return getThemePresetsByCategory(categoryId);
  };



  const toggleCompareTheme = (theme: StorefrontTheme) => {
    if (compareThemes.find(t => t.id === theme.id)) {
      setCompareThemes(compareThemes.filter(t => t.id !== theme.id));
    } else if (compareThemes.length < 3) {
      setCompareThemes([...compareThemes, theme]);
    }
  };

  const isInCompare = (theme: StorefrontTheme) => {
    return compareThemes.find(t => t.id === theme.id) !== undefined;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Choose Your Theme</h3>
        <p className="text-sm text-gray-600">
          Select a theme that matches your brand and business type. Each theme comes with pre-configured colors, layouts, and styling.
        </p>
      </div>

      {/* Compare Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button 
            variant={compareMode ? "default" : "outline"}
            size="sm"
            onClick={() => setCompareMode(!compareMode)}
          >
            <GitCompare className="h-4 w-4 mr-2" />
            Compare Themes
          </Button>
          {compareMode && (
            <span className="text-sm text-gray-600">
              Select up to 3 themes to compare
            </span>
          )}
        </div>
        
        {compareMode && compareThemes.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setCompareThemes([])}
          >
            Clear ({compareThemes.length})
          </Button>
        )}
      </div>

      {/* Theme Comparison */}
      {compareMode && compareThemes.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium mb-3">Theme Comparison</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {compareThemes.map((theme) => (
              <div key={theme.id} className="bg-white rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm">{theme.name}</h5>
                  <Button
                    size="sm"
                    variant={selectedTheme?.id === theme.id ? "default" : "outline"}
                    onClick={() => onThemeSelect(theme)}
                  >
                    {selectedTheme?.id === theme.id ? "Selected" : "Select"}
                  </Button>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium">Layout:</span> {theme.layout.type} ({theme.layout.columns} cols)
                  </div>
                  <div>
                    <span className="font-medium">Colors:</span>
                    <div className="flex gap-1 mt-1">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.primary }}
                      />
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.colors.accent }}
                      />
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Features:</span> {theme.features.slice(0, 2).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Theme Selection */}
      {!showAllThemes && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">Quick Selection</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllThemes(true)}
            >
              View All Themes
            </Button>
          </div>
          
          {/* Popular Themes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getPopularThemes().map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isSelected={selectedTheme?.id === theme.id}
                onSelect={() => onThemeSelect(theme)}
                compareMode={compareMode}
                isInCompare={isInCompare(theme)}
                onToggleCompare={() => toggleCompareTheme(theme)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Themes by Category */}
      {showAllThemes && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium">All Themes</h4>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAllThemes(false)}
            >
              Quick Selection
            </Button>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-7">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger key={category.id} value={category.id} className="flex flex-col items-center gap-1 py-3">
                    <Icon className="h-4 w-4" />
                    <span className="text-xs">{category.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getThemesForCategory(category.id).map((theme) => (
                    <ThemeCard
                      key={theme.id}
                      theme={theme}
                      isSelected={selectedTheme?.id === theme.id}
                      onSelect={() => onThemeSelect(theme)}
                      compareMode={compareMode}
                      isInCompare={isInCompare(theme)}
                      onToggleCompare={() => toggleCompareTheme(theme)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Selected Theme Preview */}
      {selectedTheme && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-3">Selected Theme: {selectedTheme.name}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-sm font-medium mb-2">Features:</h5>
              <div className="flex flex-wrap gap-1">
                {selectedTheme.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium mb-2">Layout:</h5>
              <div className="text-sm text-gray-600">
                <p>Type: {selectedTheme.layout.type}</p>
                <p>Columns: {selectedTheme.layout.columns}</p>
                <p>Spacing: {selectedTheme.layout.spacing}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface ThemeCardProps {
  theme: StorefrontTheme;
  isSelected: boolean;
  onSelect: () => void;
  compareMode?: boolean;
  isInCompare?: boolean;
  onToggleCompare?: () => void;
}

function ThemeCard({ theme, isSelected, onSelect, compareMode, isInCompare, onToggleCompare }: ThemeCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
          : isInCompare
          ? 'ring-2 ring-green-500 border-green-500 bg-green-50'
          : 'hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <CardContent className="p-0">
        {/* Preview Image */}
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={theme.preview}
            alt={theme.name}
            className="w-full h-full object-cover"
          />
          {isSelected && (
            <div className="absolute top-2 right-2">
              <div className="bg-blue-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            </div>
          )}
          {isInCompare && (
            <div className="absolute top-2 right-2">
              <div className="bg-green-500 text-white rounded-full p-1">
                <Check className="h-4 w-4" />
              </div>
            </div>
          )}
          {theme.isPopular && (
            <div className="absolute top-2 left-2">
              <Badge className="bg-yellow-500 text-white text-xs">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            </div>
          )}
          {compareMode && (
            <div className="absolute top-2 left-2">
              <input
                type="checkbox"
                checked={isInCompare}
                onChange={(e) => {
                  e.stopPropagation();
                  onToggleCompare?.();
                }}
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
              />
            </div>
          )}
        </div>

        {/* Theme Info */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-sm">{theme.name}</h4>
              <p className="text-xs text-gray-600 mt-1">{theme.description}</p>
            </div>
          </div>

          {/* Color Palette Preview */}
          <div className="flex gap-1 mb-3">
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: theme.colors.primary }}
              title="Primary"
            />
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: theme.colors.secondary }}
              title="Secondary"
            />
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: theme.colors.accent }}
              title="Accent"
            />
            <div 
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: theme.colors.background }}
              title="Background"
            />
          </div>

          {/* Layout Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="capitalize">{theme.layout.type}</span>
            <span>{theme.layout.columns} cols</span>
          </div>

          {/* Features Preview */}
          <div className="flex flex-wrap gap-1">
            {theme.features.slice(0, 2).map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
            {theme.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{theme.features.length - 2} more
              </Badge>
            )}
          </div>

          {/* Selection Status */}
          {isSelected && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center text-blue-600 text-xs">
                <Check className="h-3 w-3 mr-1" />
                Selected
              </div>
            </div>
          )}
          {isInCompare && !isSelected && (
            <div className="mt-3 pt-2 border-t border-gray-200">
              <div className="flex items-center text-green-600 text-xs">
                <Check className="h-3 w-3 mr-1" />
                In Compare
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 