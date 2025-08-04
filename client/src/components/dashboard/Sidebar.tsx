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
import { safeRender } from "@/utils/safeRender";



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
            ? "bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20"
            : "text-gray-300 hover:bg-white/5 hover:text-white"
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
    <h3 className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</h3>
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
            
            // Sanitize the business profile to prevent React errors
            const sanitizedProfile = {
              _id: safeRender(profile._id),
              businessName: safeRender(profile.businessName),
              businessType: safeRender(profile.businessType),
              registrationNumber: safeRender(profile.registrationNumber),
              taxId: safeRender(profile.taxId),
              industry: safeRender(profile.industry),
              website: safeRender(profile.website),
              email: safeRender(profile.email),
              phone: safeRender(profile.phone),
              currency: safeRender(profile.currency)
            };
            
            if (sanitizedProfile.businessName) {
              setBusinessName(sanitizedProfile.businessName);
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
    <div className="h-full w-64 bg-[#2d5a5a] border-r border-white/10 flex flex-col shadow-sm">
      <div className="p-4 flex flex-col h-full">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Paybord</h2>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5 relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/5">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* User Profile Section */}
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user ? `${safeRender(user.firstName)} ${safeRender(user.lastName)}` : 'User'} />
                    <AvatarFallback className="bg-[#FFD700] text-black text-xs">
                      {user ? safeRender(user.firstName?.charAt(0)?.toUpperCase()) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user ? `${safeRender(user.firstName)} ${safeRender(user.lastName)}` : 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {safeRender(user?.email) || 'user@example.com'}
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
                <p className="text-sm font-medium text-white">
                  {user ? `${safeRender(user.firstName)} ${safeRender(user.lastName)}` : 'User'}
                </p>
                <p className="text-xs text-gray-400">
                  {safeRender(user?.email) || 'user@example.com'}
                </p>
              </div>
          </div>
        </div>

        {/* Business Selector */}
        <div className="flex items-center space-x-2 px-4 mb-6">
          <select className="text-sm font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer">
            <option className="bg-[#2d5a5a] text-white">{isLoading ? "Loading..." : safeRender(businessName) || "My Business"}</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
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



