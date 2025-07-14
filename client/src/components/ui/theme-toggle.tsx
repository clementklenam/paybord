import {Moon, Sun} from 'lucide-react';
import {Button} from './button';
import {useTheme} from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <div className="relative w-5 h-5">
        <Sun 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'light' 
              ? 'rotate-0 scale-100 text-yellow-500' 
              : 'rotate-90 scale-0 text-gray-400'
          }`}
        />
        <Moon 
          className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
            theme === 'dark' 
              ? 'rotate-0 scale-100 text-blue-400' 
              : '-rotate-90 scale-0 text-gray-400'
          }`}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
} 