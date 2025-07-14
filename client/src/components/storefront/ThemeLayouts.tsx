import {Product} from '@/services/storefront.service';
import {StorefrontTheme} from '@/types/theme';
import {Card, CardContent} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {ShoppingCart} from 'lucide-react';

interface ProductGridProps {
  products: Product[];
  theme: StorefrontTheme;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

const ProductGrid = ({
  products, theme, onProductClick, onAddToCart
}: ProductGridProps) => {
  const layout = theme.layout;
  
  // Determine grid columns based on theme
  const getGridCols = () => {
    switch (layout.columns) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-1 md:grid-cols-2';
      case 3: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
      case 4: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      default: return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    }
  };

  // Determine spacing based on theme
  const getSpacing = () => {
    switch (layout.spacing) {
      case 'tight': return 'gap-3';
      case 'loose': return 'gap-8';
      default: return 'gap-6';
    }
  };

  // Render different layout types
  switch (layout.type) {
    case 'grid':
      return (
        <div className={`grid ${getGridCols()} ${getSpacing()}`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              theme={theme}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      );

    case 'masonry':
      return (
        <div className={`columns-1 md:columns-2 lg:columns-3 xl:columns-4 ${getSpacing()}`}>
          {products.map((product) => (
            <div key={product.id} className="break-inside-avoid mb-6">
              <ProductCard
                product={product}
                theme={theme}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      );

    case 'list':
      return (
        <div className="space-y-4">
          {products.map((product) => (
            <ProductListCard
              key={product.id}
              product={product}
              theme={theme}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      );

    case 'carousel':
      return (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-80">
              <ProductCard
                product={product}
                theme={theme}
                onProductClick={onProductClick}
                onAddToCart={onAddToCart}
              />
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className={`grid ${getGridCols()} ${getSpacing()}`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              theme={theme}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      );
  }
}

export default ProductGrid;

interface ProductCardProps {
  product: Product;
  theme: StorefrontTheme;
  onProductClick?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

function ProductCard({ product, theme, onProductClick, onAddToCart }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={() => onProductClick?.(product)}
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 
            className="font-medium mb-2 line-clamp-2"
            style={{ color: theme.colors.text }}
          >
            {product.name}
          </h3>
          
          <p 
            className="text-sm mb-3 line-clamp-2"
            style={{ color: theme.colors.textSecondary }}
          >
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span 
              className="font-bold text-lg"
              style={{ color: theme.colors.primary }}
            >
              {formatCurrency(product.price)}
            </span>
            
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart?.(product);
              }}
              style={{ 
                backgroundColor: theme.colors.primary,
                color: '#ffffff'
              }}
              className="hover:opacity-90"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductListCard({ product, theme, onProductClick, onAddToCart }: ProductCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg"
      onClick={() => onProductClick?.(product)}
      style={{ 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <CardContent className="p-6">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-lg mb-2"
              style={{ color: theme.colors.text }}
            >
              {product.name}
            </h3>
            
            <p 
              className="text-sm mb-4 line-clamp-3"
              style={{ color: theme.colors.textSecondary }}
            >
              {product.description}
            </p>

            <div className="flex items-center justify-between">
              <span 
                className="font-bold text-xl"
                style={{ color: theme.colors.primary }}
              >
                {formatCurrency(product.price)}
              </span>
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToCart?.(product);
                }}
                style={{ 
                  backgroundColor: theme.colors.primary,
                  color: '#ffffff'
                }}
                className="hover:opacity-90"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 