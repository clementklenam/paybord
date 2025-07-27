import {SigninForm} from "@/components/auth/SigninForm";
import {motion} from "framer-motion";

export default function SigninPage() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      


      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Muted Teal Background with Text */}
        <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:relative items-center justify-center">
          {/* Background gradient matching hero */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d5a5a] via-[#3a6b6b] to-[#2d5a5a] opacity-20"></div>
          
          {/* Content */}
          <div className="relative z-10 w-full max-w-lg mx-auto my-auto flex flex-col gap-8 justify-center px-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              {/* Main Headline */}
              <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
                Instant payments.
                <br />
                <span className="text-[#FFD700]">Without card fees.</span>
              </h2>
              
              {/* Description */}
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                For payments you need authorised immediately, choose Instant Bank Pay. 
                <br />
                <span className="text-[#FFD700] font-semibold">No annoying admin.</span>
              </p>
              
              {/* Feature Highlights */}
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Instant payment processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Zero card processing fees</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Direct bank transfers</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full"></div>
                  <span className="text-white">Real-time authorization</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right side - Signin Form */}
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
                  Don't have an account?{" "}
                  <a href="/signup" className="text-[#FFD700] hover:text-[#FFC700] font-medium transition-colors">
                    Sign up
                  </a>
                </span>
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Welcome back
              </h2>
              <p className="text-gray-300">
                Sign in to your Paybord account
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/5 backdrop-blur-sm px-8 py-8 shadow-2xl border border-white/10 rounded-2xl">
              <SigninForm />
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
