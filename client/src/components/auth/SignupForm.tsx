import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {useAuth} from "@/contexts/AuthContext";
import {useToast} from "@/components/ui/use-toast";
import {Link, useLocation} from "wouter";
import {useState} from "react";
import {SignupData} from "@/types/auth";

export function SignupForm() {
  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    username: ""
  });
  const { signup, error, clearError, loading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signup(formData);
      toast({
        title: "Account created",
        description: "Welcome to Paybord!",
      });
      setLocation("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive",
      });
      console.error("Signup error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium text-slate-700">First name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            required
            className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium text-slate-700">Last name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            required
            className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="username" className="text-sm font-medium text-slate-700">Username (optional)</Label>
        <Input
          id="username"
          name="username"
          type="text"
          placeholder="johndoe"
          value={formData.username}
          onChange={handleChange}
          className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={handleChange}
          required
          className="h-12 px-4 border-slate-300 focus:border-slate-500 focus:ring-slate-500 rounded-lg transition-colors"
        />
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors duration-200"
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            <span>Creating your account...</span>
          </div>
        ) : (
          "Create your Paybord account"
        )}
      </Button>

      <div className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href="/signin" className="text-slate-900 hover:text-slate-700 font-medium transition-colors">
          Sign in
        </Link>
      </div>
    </form>
  );
}
