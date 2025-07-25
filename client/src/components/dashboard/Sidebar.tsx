import {Link} from "wouter";
import {
  HomeIcon,
  WalletIcon,
  ArrowsRightLeftIcon,
  UsersIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  LinkIcon,
  CreditCardIcon,
  DocumentTextIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  CodeBracketIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";
import {Bell, User, Settings, HelpCircle, LogOut} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {ThemeToggle} from "@/components/ui/theme-toggle";

import {useState, useEffect, useRef} from "react";
import BusinessService from "@/services/business.service";
import {useAuth} from "@/contexts/AuthContext";
import {useLocation} from "wouter";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const SidebarItem = ({ icon, label, href, isActive }: SidebarItemProps) => {
  const { signout } = useAuth();
  const [, setLocation] = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (href === "#") {
      e.preventDefault();
      signout();
      setLocation("/signin");
    }
  };

  return (
    <Link href={href}>
      <a 
        className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
        }`}
        onClick={handleClick}
      >
        <div className="w-5 h-5">{icon}</div>
        <span>{label}</span>
      </a>
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <div className="mb-6">
    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
    <div className="space-y-1">{children}</div>
  </div>
);

export function Sidebar() {
  const currentPath = window.location.pathname;
  const [businessName, setBusinessName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showScrollIndicator, setShowScrollIndicator] = useState<boolean>(false);
  const { user, signout } = useAuth();
  const [, setLocation] = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Use a ref to track if we've already fetched the profile to avoid unnecessary API calls
  const profileFetchedRef = useRef(false);
  
  const handleLogout = () => {
    signout();
    setLocation("/signin");
  };

  // Check if scrolling is needed
  const checkScrollNeeded = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      setShowScrollIndicator(scrollHeight > clientHeight);
    }
  };

  useEffect(() => {
    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, []);

  useEffect(() => {
    // Skip fetching if we've already done it
    if (profileFetchedRef.current) {
      return;
    }
    
    // Check if we have a temporary business name from a recent registration
    const tempBusinessName = localStorage.getItem('tempBusinessName');
    if (tempBusinessName) {
      console.log('Using temporary business name from localStorage:', tempBusinessName);
      setBusinessName(tempBusinessName);
      setIsLoading(false);
      
      // We'll still try to fetch the profile in the background
      // but we already have a name to display
      profileFetchedRef.current = true;
    }
    
    const fetchBusinessProfile = async () => {
      try {
        const businessService = new BusinessService();
        
        // First check if business exists using the cached method
        const hasRegistered = await businessService.hasRegisteredBusiness();
        console.log('Has registered business:', hasRegistered);
        
        if (hasRegistered) {
          try {
            // Only fetch the profile if business exists
            const profile = await businessService.getBusinessProfile();
            console.log('Fetched business profile:', profile);
            
            if (profile && profile.businessName) {
              setBusinessName(profile.businessName);
              // Mark that we've fetched the profile
              profileFetchedRef.current = true;
              
              // Clear the temporary business name as we now have the real one
              localStorage.removeItem('tempBusinessName');
            }
          } catch (profileError) {
            // If we get a 404, it might mean the business was just registered
            // and the database hasn't been updated yet
            console.log('Error fetching profile, might be a timing issue:', profileError);
            
            // If we have a temporary name, keep using it
            if (tempBusinessName) {
              setBusinessName(tempBusinessName);
            } else {
              // Try again after a short delay
              setTimeout(() => {
                if (!profileFetchedRef.current) {
                  fetchBusinessProfile();
                }
              }, 2000);
            }
          }
        } else if (!tempBusinessName) {
          // Only set to "My Business" if we don't have a temp name
          setBusinessName("My Business");
        }
      } catch (error) {
        console.error("Error in business profile check:", error);
        if (!tempBusinessName) {
          setBusinessName("My Business");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinessProfile();
  }, []);

  return (
    <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Paybord</h2>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user ? `${user.firstName} ${user.lastName}` : 'User'} />
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      {user ? user.firstName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || 'user@example.com'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
                          <div className="flex-1 ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {user ? `${user.firstName} ${user.lastName}` : 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
          </div>
        </div>

        {/* Business Selector */}
        <div className="flex items-center space-x-2 px-4 mb-6">
          <select className="text-sm font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer">
            <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">{isLoading ? "Loading..." : businessName || "My Business"}</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
        </div>

        {/* Navigation Sections */}
        <div 
          className={`flex-1 overflow-y-auto sidebar-scrollbar scroll-indicator ${showScrollIndicator ? 'has-content' : ''}`} 
          ref={scrollContainerRef}
        >
          <SidebarSection title="Main">
            <SidebarItem
              icon={<HomeIcon />}
              label="Home"
              href="/dashboard"
              isActive={currentPath === "/dashboard"}
            />
            <SidebarItem
              icon={<WalletIcon />}
              label="Balances"
              href="/dashboard/balances"
              isActive={currentPath === "/dashboard/balances"}
            />
            <SidebarItem
              icon={<ArrowsRightLeftIcon />}
              label="Transactions"
              href="/dashboard/transactions"
              isActive={currentPath === "/dashboard/transactions"}
            />
            <SidebarItem
              icon={<UsersIcon />}
              label="Customers"
              href="/dashboard/customers"
              isActive={currentPath === "/dashboard/customers"}
            />
            <SidebarItem
              icon={<ShoppingBagIcon />}
              label="Product catalog"
              href="/dashboard/products"
              isActive={currentPath === "/dashboard/products"}
            />
            <SidebarItem
              icon={<BuildingStorefrontIcon />}
              label="Storefront"
              href="/dashboard/storefront"
              isActive={currentPath === "/dashboard/storefront"}
            />
          </SidebarSection>

          <SidebarSection title="Shortcuts">
            <SidebarItem
              icon={<ChartBarIcon />}
              label="Reports"
              href="/dashboard/reports"
              isActive={currentPath === "/dashboard/reports"}
            />
            <SidebarItem
              icon={<LinkIcon />}
              label="Payment links"
              href="/dashboard/payment-links"
              isActive={currentPath === "/dashboard/payment-links"}
            />
            <SidebarItem
              icon={<CreditCardIcon />}
              label="Subscriptions"
              href="/dashboard/subscriptions"
              isActive={currentPath === "/dashboard/subscriptions"}
            />
            <SidebarItem
              icon={<DocumentTextIcon />}
              label="Invoices"
              href="/dashboard/invoices"
              isActive={currentPath === "/dashboard/invoices"}
            />
            <SidebarItem
              icon={<BanknotesIcon />}
              label="Connect"
              href="/dashboard/connect"
              isActive={currentPath === "/dashboard/connect"}
            />
          </SidebarSection>

          <SidebarSection title="Product">
            <SidebarItem
              icon={<CreditCardIcon />}
              label="Payments"
              href="/dashboard/payments"
              isActive={currentPath === "/dashboard/payments"}
            />
            <SidebarItem
              icon={<DocumentTextIcon />}
              label="Documents"
              href="/dashboard/documents"
              isActive={currentPath === "/dashboard/documents"}
            />
            <SidebarItem
              icon={<CodeBracketIcon />}
              label="API"
              href="/dashboard/api"
              isActive={currentPath === "/dashboard/api"}
            />
          </SidebarSection>

          <SidebarSection title="Settings">
            <SidebarItem
              icon={<Cog6ToothIcon />}
              label="Account"
              href="/dashboard/account"
              isActive={currentPath === "/dashboard/account"}
            />
            <SidebarItem
              icon={<Cog6ToothIcon />}
              label="Log out"
              href="#"
              isActive={false}
            />
          </SidebarSection>
        </div>
      </div>
    </div>
  );
}



