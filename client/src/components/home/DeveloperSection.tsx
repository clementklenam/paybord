import { Container } from "@/components/ui/container";
import { motion } from "framer-motion";

export function DeveloperSection() {
  return (
    <section className="py-20 bg-gray-900 text-white" id="developers">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold font-['Space_Grotesk'] sm:text-4xl">
              <span className="block">Developer First</span>
              <span className="block mt-2 text-[#0FCEA6]">Easy to integrate with just a few lines of code</span>
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              Our well-documented API and SDKs for JavaScript, React, iOS, and Android make integration quick and painless. Get started in minutes, not days.
            </p>
            <div className="mt-8 flex">
              <a href="#" className="text-[#0FCEA6] hover:text-[#0ca585] font-medium flex items-center">
                Read our API docs
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </motion.div>
          <motion.div
            className="mt-12 lg:mt-0 lg:col-span-7"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-2xl">
              <div className="px-4 py-2 flex justify-between items-center bg-gray-900 border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-xs">index.js</div>
              </div>
              <div className="p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-gray-300">
                  <code>
                    <span className="text-blue-400">import</span>{" "}
                    <span className="text-green-400">OthoPay</span>{" "}
                    <span className="text-blue-400">from</span>{" "}
                    <span className="text-yellow-300">'@othopay/js'</span>;
                    {"\n\n"}
                    <span className="text-gray-500">
                      // Initialize the OthoPay instance with your API key
                    </span>
                    {"\n"}
                    <span className="text-blue-400">const</span>{" "}
                    <span className="text-green-400">othopay</span> ={" "}
                    <span className="text-blue-400">new</span>{" "}
                    <span className="text-green-400">OthoPay</span>(
                    <span className="text-yellow-300">'YOUR_API_KEY'</span>);
                    {"\n\n"}
                    <span className="text-gray-500">// Create a payment link</span>
                    {"\n"}
                    <span className="text-blue-400">const</span>{" "}
                    <span className="text-green-400">paymentLink</span> ={" "}
                    <span className="text-blue-400">await</span> othopay.createPayment(
                    {"{"}
                    {"\n"}
                    {"  "}amount: <span className="text-purple-400">1000</span>,{"\n"}
                    {"  "}currency: <span className="text-yellow-300">'NGN'</span>,{"\n"}
                    {"  "}customer: {"{"}
                    {"\n"}
                    {"    "}email: <span className="text-yellow-300">'customer@example.com'</span>,{"\n"}
                    {"    "}name: <span className="text-yellow-300">'John Doe'</span>
                    {"\n"}
                    {"  "}
                    {"}"},
                    {"\n"}
                    {"  "}description: <span className="text-yellow-300">'Payment for Premium Plan'</span>,{"\n"}
                    {"  "}redirect_url: <span className="text-yellow-300">'https://yourwebsite.com/success'</span>
                    {"\n"}
                    {"}"});
                    {"\n\n"}
                    <span className="text-gray-500">// Redirect to the checkout page</span>
                    {"\n"}
                    window.location.href = paymentLink.checkout_url;
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
