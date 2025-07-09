import { Route, Switch } from "wouter";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import SigninPage from "@/pages/signin";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import BalancesPage from "@/pages/dashboard/balances";
import TransactionsPage from "@/pages/dashboard/transactions";
import CustomersPage from "@/pages/dashboard/customers";
import ProductsPage from "@/pages/dashboard/products-new";
import ProductTestPage from "@/pages/dashboard/product-test";
import StorefrontPage from "@/pages/dashboard/storefront";
import ReportsPage from "@/pages/dashboard/reports";
import PaymentLinksPage from "@/pages/dashboard/payment-links";
import SubscriptionsPage from "@/pages/dashboard/subscriptions";
import CustomerDetailPage from "@/pages/dashboard/customer/[id]";
import StorePreview from "@/pages/store";
import StorefrontPreview from "@/pages/storefront/[id]";
import KycPage from "@/pages/kyc";
import Home from "@/pages/Home";
import PaymentPage from "@/pages/payment/[id]";
import PaymentLinkViewPage from "@/pages/payment-link/[id]";
import TestTopCustomersPage from "@/pages/test-top-customers";
import { Redirect } from "wouter";

// Component to handle the redirect from /pl_:id to /payment/:id
function PaymentLinkRedirect({ params }: { params: { id: string } }) {
  return <Redirect to={`/payment/${params.id}`} />;
}

export function AppRouter() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/signin" component={SigninPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/store/:id" component={StorePreview} />
      <Route path="/storefront/:id" component={StorefrontPreview} />
      <Route path="/payment/:id" component={PaymentPage} />
      <Route path="/payment-link/:id" component={PaymentLinkViewPage} />
      <Route path="/pl_:id" component={PaymentLinkRedirect} />

      {/* Home Page */}
      <Route path="/home" component={Home} />

      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/balances">
        <ProtectedRoute>
          <BalancesPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/transactions">
        <ProtectedRoute>
          <TransactionsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/customers">
        <ProtectedRoute>
          <CustomersPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/products">
        <ProtectedRoute>
          <ProductsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/product-test">
        <ProtectedRoute>
          <ProductTestPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/storefront">
        <ProtectedRoute>
          <StorefrontPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/reports">
        <ProtectedRoute>
          <ReportsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/payment-links">
        <ProtectedRoute>
          <PaymentLinksPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/subscriptions">
        <ProtectedRoute>
          <SubscriptionsPage />
        </ProtectedRoute>
      </Route>

      <Route path="/dashboard/customer/:id">
        <ProtectedRoute>
          <CustomerDetailPage />
        </ProtectedRoute>
      </Route>

      <Route path="/kyc">
        <ProtectedRoute>
          <KycPage />
        </ProtectedRoute>
      </Route>

      <Route path="/test-top-customers">
        <ProtectedRoute>
          <TestTopCustomersPage />
        </ProtectedRoute>
      </Route>

      {/* Root route shows Home page without authentication */}
      <Route path="/" component={Home} />

      {/* 404 Page - Fallback */}
      <Route>
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-600 mb-8">The page you are looking for does not exist.</p>
          <a href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Go Home
          </a>
        </div>
      </Route>
    </Switch>
  );
}
