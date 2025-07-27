import {SignupForm} from "@/components/auth/SignupForm";
import {motion} from "framer-motion";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      


      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Muted Teal Background */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:relative items-center justify-center">
          {/* Background gradient matching hero */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a5a] via-[#3a6b6b] to-[#2d5a5a] opacity-20"></div>
          
          {/* Text Content */}
          <div className="relative z-10 w-full max-w-lg mx-auto my-auto flex flex-col gap-8 justify-center px-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              {/* Main Headline */}
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Start accepting payments
                <br />
                <span className="text-[#FFD700]">in minutes.</span>
              </h2>
              
              {/* Description */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Join thousands of businesses that trust Paybord for their payment processing needs. 
                <br />
                <span className="text-[#FFD700] font-semibold">No setup fees. No hidden costs.</span>
              </p>
              
              {/* Feature Highlights */}
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">5-minute setup process</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Accept all payment methods</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Instant payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">24/7 customer support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Signup Form */}
        <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:flex-none lg:w-1/2">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <a href="/" className="inline-block mb-6">
                <div className="h-12 w-auto text-4xl font-bold text-white font-['Space_Grotesk']">
                  Paybord
                </div>
              </a>
              
              <div className="text-right mb-4">
                <span className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <a href="/signin" className="text-[#FFD700] hover:text-[#FFC700] font-medium transition-colors">
                    Log in
                  </a>
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Sign up today for up to 90 days no fees
              </h2>
            </div>

            {/* Form Container */}
            <div className="bg-white/5 backdrop-blur-sm px-8 py-8 shadow-2xl border border-white/10 rounded-2xl">
              <SignupForm />
            </div>
            
            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-xs text-gray-400">
                Paybord Ltd is authorised by the Financial Conduct Authority under the Payment Services Regulations 2017.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
