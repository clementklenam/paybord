import {Container} from "@/components/ui/container";
import {SignupForm} from "@/components/auth/SignupForm";
import {motion} from "framer-motion";
import {CheckCircle, Zap, Globe, Shield} from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Geometric shapes */}
        {/* Large faint circle */}
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full bg-emerald-100 opacity-30" />
        {/* Diagonal line */}
        <div className="absolute top-1/4 left-1/2 w-[220px] h-[2px] bg-gradient-to-r from-emerald-200 to-slate-200 opacity-40 rotate-12" />
        {/* Dots grid */}
        <div className="absolute bottom-10 right-10 grid grid-cols-4 gap-2 opacity-20">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-emerald-300" />
          ))}
        </div>
        {/* Triangle */}
        <svg className="absolute bottom-1/4 left-10 w-24 h-24 opacity-10" viewBox="0 0 100 100">
          <polygon points="0,100 100,100 50,0" fill="#0FCEA6" />
        </svg>
        {/* Polygon */}
        <svg className="absolute top-1/2 right-10 w-20 h-20 opacity-10" viewBox="0 0 100 100">
          <polygon points="50,0 100,38 81,100 19,100 0,38" fill="#1e8449" />
        </svg>
      </div>

      <Container className="relative z-10">
        <div className="flex min-h-screen">
          {/* Left side - Form */}
          <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2">
            <motion.div
              className="w-full max-w-md"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <a href="/" className="inline-block">
                <div className="h-12 w-auto text-4xl font-bold text-slate-900 font-['Space_Grotesk']">
                  Paybord
                </div>
              </a>
              
              <div className="mt-8">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
                  Create your account
                </h2>
                <p className="text-lg text-slate-600 mb-8">
                  Join thousands of businesses accepting payments globally
                </p>

                <div className="bg-white/80 px-8 py-8 shadow-2xl shadow-slate-900/5 ring-1 ring-slate-200/50 rounded-2xl backdrop-blur-lg border border-slate-200/50">
                  <SignupForm />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right side - Content */}
          <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:relative items-center justify-center">
            <motion.div
              className="w-full max-w-md mx-auto my-auto flex flex-col gap-8 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200/50">
                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why join Paybord?</h3>
                <ul className="space-y-5">
                  <li className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-800">Easy Onboarding</div>
                      <div className="text-slate-600 text-sm">Get started in minutes with a seamless sign up process.</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Zap className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-800">Fast, Reliable Payments</div>
                      <div className="text-slate-600 text-sm">Experience instant, secure, and global transactions.</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Globe className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-800">Global Reach</div>
                      <div className="text-slate-600 text-sm">Accept payments from customers worldwide.</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-emerald-600 mt-1" />
                    <div>
                      <div className="font-semibold text-slate-800">Secure & Compliant</div>
                      <div className="text-slate-600 text-sm">Your data and payments are protected with enterprise-grade security.</div>
                    </div>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
}
