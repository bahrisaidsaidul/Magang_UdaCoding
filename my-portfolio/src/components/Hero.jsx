export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-24 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-8 animate-slide-up">
          <div className="inline-block px-6 py-3 glass-card rounded-full">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 tracking-wider">
              FULLSTACK DEVELOPER
            </span>
          </div>
          
          <div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6 leading-tight">
              Hi, I'm <span className="text-blue-600 dark:text-blue-400">Rizky</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
              Crafting amazing web experiences with modern technologies. 
              Based in <span className="font-semibold text-blue-600 dark:text-blue-400">Jakarta</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#projects"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 flex items-center space-x-3"
            >
              <span>View My Work</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="/contact"
              className="px-8 py-4 glass-card rounded-2xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all backdrop-blur-sm flex items-center justify-center hover:scale-105"
            >
              Contact Me
            </a>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative">
          <div className="w-96 h-96 md:w-[500px] md:h-[500px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl backdrop-blur-xl border border-white/30 flex items-center justify-center mx-auto animate-pulse">
            <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center">
              <div className="w-48 h-48 bg-white/20 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}