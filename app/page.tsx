export default function Home() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Header */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:px-12">
        <div className="flex items-center space-x-3">
          {/* STAXX Logo Icon */}
          <div className="w-8 h-8 flex flex-col justify-center space-y-0.5">
            <div className="h-1.5 bg-white rounded-sm"></div>
            <div className="h-1.5 bg-white rounded-sm w-3/4"></div>
            <div className="h-1.5 bg-white rounded-sm w-1/2"></div>
          </div>
          <span className="text-white font-medium text-xl tracking-wide">Quickscope by STAXX</span>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="max-w-5xl mx-auto">
          {/* Product Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-12">
            <span className="text-white text-sm font-medium tracking-wide">Introducing Quickscope</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            Financial Intelligence
            <span className="block text-gray-300">
              Redefined
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto font-medium">
            Transform your financial data into actionable insights. 
            Connect and optimize your business performance in real-time.
          </p>

          {/* CTA Button */}
          <div className="mb-20">
            <a 
              href="/connect" 
              className="inline-block px-12 py-6 bg-white text-black rounded-lg font-semibold text-xl transition-all duration-300 hover:bg-gray-100 hover:scale-105 hover:shadow-2xl hover:shadow-white/10"
            >
              Connect to QuickBooks
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-3">99.9%</div>
              <div className="text-gray-400 font-medium">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-3">&lt;50ms</div>
              <div className="text-gray-400 font-medium">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-3">24/7</div>
              <div className="text-gray-400 font-medium">Expert Support</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
