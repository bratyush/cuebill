
import { Check, Star, ArrowRight, Shield, Zap, BarChart3 } from 'lucide-react';

export default function Home() {
  return (
    <div 
      className="min-h-screen bg-white" 
      style={{
        '--color-primary': '#7293a0',
        '--color-secondary': '#a0a4b8',
        '--color-light': '#d8ddef'
      } as React.CSSProperties}
    >
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Transform Your Business
            <br />
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              With Smart Automation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline operations, boost productivity, and scale faster with our intelligent SaaS platform. See results in minutes, not months.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Schedule Demo
            </button>
          </div>
        </div>
        
        {/* Product Demo Video */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <video
              className="w-full aspect-video object-cover"
              controls
              autoPlay
              loop
              muted
              poster="/landing/cues_revenue.png"
              preload="metadata"
            >
              <source src="/landing/cues_land.mov" type="video/quicktime" />
              <source src="/landing/cues_land.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Feature Demos Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features in Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how our platform transforms the way you work with real-time demos and interactive examples.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[var(--color-light)] p-2 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Revenue Analytics Dashboard</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Track your business performance with comprehensive analytics. Monitor revenue streams, table utilization, payment modes, and canteen operations in real-time.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Total revenue tracking (₹1,85,197+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Table & canteen revenue breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Payment mode analysis & insights</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <img 
                src="/landing/cues_revenue.png" 
                alt="Revenue Analytics Dashboard" 
                className="w-full aspect-video object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div className="bg-white p-6 rounded-xl shadow-lg order-2 md:order-1">
              <div className="aspect-video bg-gradient-to-br from-[var(--color-light)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Automation Demo</span>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[var(--color-light)] p-2 rounded-lg">
                  <Zap className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Smart Automation</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Automate repetitive tasks and workflows with our intelligent automation engine. Save hours every day and eliminate human error.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Workflow automation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Smart triggers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Integration hub</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[var(--color-light)] p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Enterprise Security</h3>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                Bank-level security with end-to-end encryption, compliance monitoring, and advanced threat protection to keep your data safe.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">SOC 2 Type II compliance</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">256-bit encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-gray-700">Multi-factor authentication</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="aspect-video bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-lg">Security Demo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of companies that have transformed their operations with our platform.
            </p>
          </div>

          {/* Company Logos */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center mb-16 opacity-60">
            <div className="text-2xl font-bold text-gray-400">COMPANY</div>
            <div className="text-2xl font-bold text-gray-400">STARTUP</div>
            <div className="text-2xl font-bold text-gray-400">TECH CO</div>
            <div className="text-2xl font-bold text-gray-400">CORP</div>
            <div className="text-2xl font-bold text-gray-400">BRAND</div>
            <div className="text-2xl font-bold text-gray-400">FIRM</div>
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "This platform has revolutionized how we handle our operations. We've seen a 300% increase in efficiency and our team couldn't be happier."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">JS</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Smith</p>
                  <p className="text-gray-600 text-sm">CEO, TechCorp</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "The automation features have saved us countless hours. What used to take days now happens in minutes. Absolutely game-changing."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-secondary)] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">MJ</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Johnson</p>
                  <p className="text-gray-600 text-sm">CTO, StartupXYZ</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">
                "Security and compliance were our biggest concerns. This platform exceeded all our expectations with enterprise-grade protection."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">RW</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Robert Wilson</p>
                  <p className="text-gray-600 text-sm">CISO, Enterprise Inc</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-8 mt-16 text-center">
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">10k+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-secondary)] mb-2">99.9%</div>
              <div className="text-gray-600">Uptime SLA</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-primary)] mb-2">500+</div>
              <div className="text-gray-600">Integrations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[var(--color-secondary)] mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of companies already using our platform. Start your free trial today or speak with our team to learn more.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Schedule Demo
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Sales Inquiries</h3>
              <p className="text-gray-300 mb-4">
                Ready to see how we can transform your business? Our sales team is here to help.
              </p>
              <div className="space-y-2 text-gray-400">
                <p>📧 sales@example.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>🕒 Mon-Fri, 9 AM - 6 PM EST</p>
              </div>
            </div>

            <div className="bg-gray-800 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-white mb-4">Technical Support</h3>
              <p className="text-gray-300 mb-4">
                Need help with implementation or have technical questions? Our experts are ready to assist.
              </p>
              <div className="space-y-2 text-gray-400">
                <p>📧 support@example.com</p>
                <p>📞 +1 (555) 123-4568</p>
                <p>🕒 24/7 Support Available</p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 CueBill. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </section>
    </div>
  );
}
