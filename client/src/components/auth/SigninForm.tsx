import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useToast} from "@/components/ui/use-toast";
import {Link} from "wouter";
import {useAuth} from "../../contexts/AuthContext";
import {LoginData} from "@/types/auth";

export function SigninForm() {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: ""
  });
  const { toast } = useToast();
  const { signin, error, clearError, loading } = useAuth();
  // const [, setLocation] = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await signin(formData);

      toast({
        title: "Welcome back!",
        description: "Successfully signed in to your account.",
      });

      // Use setTimeout to ensure state updates are processed before navigation
      setTimeout(() => {
        // Redirect to dashboard
        window.location.href = '/dashboard';
      }, 100);
    } catch {
      toast({
        title: "Error",
        description: error || "Invalid email or password.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="grid gap-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{error}</span>
            <button 
              onClick={clearError} 
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
            <Input
              id="email"
              name="email"
              placeholder="Enter your email"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoCapitalize="none"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
            />
          </div>
          <Button 
            className="h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors duration-200" 
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              "Sign in to Paybord"
            )}
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-slate-500 font-medium">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <Button 
          variant="outline" 
          type="button" 
          disabled={loading}
          className="h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
              fill="#EA4335"
            />
            <path
              d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
              fill="#4285F4"
            />
            <path
              d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
              fill="#FBBC05"
            />
            <path
              d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.26540 14.29L1.27539 17.385C3.25539 21.31 7.31040 24.0001 12.0004 24.0001Z"
              fill="#34A853"
            />
          </svg>
          Google
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          disabled={loading}
          className="h-12 border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M16.6,14.2c-0.5,1.1-0.7,1.6-1.3,2.6c-0.9,1.4-2.1,3.1-3.7,3.1c-1.4,0-1.7-0.8-3.6-0.8c-1.8,0-2.2,0.8-3.6,0.8 c-1.6,0-2.8-1.7-3.7-3.1c-2.5-3.6-2.8-7.9-1.2-10.2c1.1-1.6,2.9-2.5,4.6-2.5c1.7,0,2.8,0.8,4.2,0.8c1.3,0,2.1-0.8,4.2-0.8 c1.5,0,3.1,0.8,4.2,2.2C13.9,7.6,14.5,13.5,16.6,14.2L16.6,14.2z M12,3.2c0.2-1.3,1.1-2.5,2.4-3.1c0.3,1.4-0.4,2.8-1.2,3.7 C12.4,4.6,11.5,5.1,10.2,5C10,3.7,10.9,2.3,12,3.2L12,3.2z"
              fill="currentColor"
            />
          </svg>
          Apple
        </Button>
      </div>
      
      <div className="text-center text-sm text-slate-600">
        Don't have an account?{" "}
        <Link href="/signup" className="text-slate-900 hover:text-slate-700 font-medium transition-colors">
          Sign up for free
        </Link>
      </div>
    </div>
  );
}