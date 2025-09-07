import { Check, Star, ArrowRight, Shield, Zap, BarChart3, Mail, Phone, Calculator, Users, Clock, TrendingUp, DollarSign, Smartphone } from 'lucide-react';

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

      <HeroSection />

      <ProblemsSection />

      <SolutionSection />

      {/* <FeaturesSection /> */}

      <TestimonialSection />

      {/* <ROICalculatorSection /> */}

      <ComparisonSection />

      <ContactSection />

    </div>
  );
}

function HeroSection() {
  return (
    <>
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Stop Losing Money.
            <br />
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
              Start Growing Your Club.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CueBill eliminates revenue leakage with automated table billing and seamless canteen integration. Transform your club operations today.
          </p>
          
          {/* Stats Banner */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-4xl mx-auto">
            <div className="bg-[var(--color-light)] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">15%</div>
              <div className="text-sm text-gray-600">Revenue Recovery</div>
            </div>
            <div className="bg-[var(--color-light)] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">40%</div>
              <div className="text-sm text-gray-600">Staff Efficiency</div>
            </div>
            <div className="bg-[var(--color-light)] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">0%</div>
              <div className="text-sm text-gray-600">Calculation Errors</div>
            </div>
            <div className="bg-[var(--color-light)] p-4 rounded-lg">
              <div className="text-2xl font-bold text-[var(--color-primary)] mb-1">24/7</div>
              <div className="text-sm text-gray-600">Business Insights</div>
            </div>
          </div> */}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-2">
              See Live Demo
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200">
              Get Started Free
            </button>
          </div>
        </div>
        
        {/* Product Demo Video */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <video
              className="w-full aspect-video object-cover"
              controls
              loop
              muted
              autoPlay
              poster="/landing/cues_revenue.png"
              preload="metadata"
            >
              <source src="/landing/cues_land.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {/* Fallback image if video doesn't load */}
            <img 
              src="/landing/cues_revenue.png" 
              alt="Product Demo Preview" 
              className="w-full aspect-video object-cover absolute inset-0 -z-10"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  )
}

function ProblemsSection() {
  return (
    <>
      {/* Problems Section */}
      <section className="py-20 px-6 bg-red-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Are You Losing Money Every Day?
          </h2>
          
          {/* First row - 3 cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Manual Time Tracking</h3>
              <p className="text-gray-600">Causes 10-15% revenue loss through human error and missed minutes</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Forgotten Orders</h3>
              <p className="text-gray-600">Food orders and billing mistakes reduce your profit margins</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Unpaid Balances</h3>
              <p className="text-gray-600">Members leave with outstanding amounts, hurting cash flow</p>
            </div>
          </div>
          
          {/* Second row - 2 cards centered */}
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">No Business Insights</h3>
              <p className="text-gray-600">Can't identify your most profitable tables or peak hours</p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Manual Billing</h3>
              <p className="text-gray-600">Staff spend hours on calculations instead of serving customers</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function SolutionSection() {
  return (
    <>
      {/* Solution Section */}
      <section className="py-20 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            One System. Complete Control.
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Real-time Table Management</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Automatic time tracking from check-in to check-out
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Dynamic hourly/minute pricing
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Instant bill generation with zero errors
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Canteen Integration</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Orders linked directly to table sessions
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Popular item tracking for menu optimization
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Seamless payment processing
                </li>
              </ul>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Member & Revenue Management</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Digital member profiles with credit tracking
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Comprehensive analytics dashboard
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  Excel reports for accounting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FeaturesSection() {
  return (
    <>
      {/* Features Showcase Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Perfect for Gaming Clubs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete solution for pool halls, snooker clubs, gaming centers, and entertainment venues.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎱</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Pool & Snooker</h3>
              <p className="text-gray-600">Multiple table themes and flexible hourly rates</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Gaming Stations</h3>
              <p className="text-gray-600">Real-time occupancy and queue management</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Tournament Mode</h3>
              <p className="text-gray-600">Organize competitions with automatic scoring</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Peak Analytics</h3>
              <p className="text-gray-600">Identify busy hours and optimize pricing</p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-8">For All Club Types</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary)]" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">Multi-Payment Support</h4>
                <p className="text-gray-600">Cash, UPI, Mixed payments</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Users className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary)]" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">Member Credit System</h4>
                <p className="text-gray-600">Digital profiles and balance tracking</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary)]" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">Real-time Revenue</h4>
                <p className="text-gray-600">Live tracking and instant insights</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <Shield className="w-12 h-12 mx-auto mb-4 text-[var(--color-primary)]" />
                <h4 className="text-lg font-bold text-gray-900 mb-2">Cloud-based</h4>
                <p className="text-gray-600">Access anywhere, anytime</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function TestimonialSection() {
  return (
    <>
      {/* Testimonial Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {/* Join 500+  */}
              Club Owners Who Transformed Their Business
            </h2>
          </div>

          {/* Main Testimonial */}
          <div className="bg-[var(--color-light)] p-12 rounded-xl mb-12 max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Business Photo */}
              <div className="order-2 md:order-1">
                <img 
                  src="/landing/cues_photo_cropped.png" 
                  alt="GameZone Club Interior" 
                  className="w-full object-cover rounded-xl shadow-lg"
                  loading="lazy"
                />
              </div>
              
              {/* Testimonial Content */}
              <div className="order-1 md:order-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-2xl text-gray-700 mb-6 italic">
                  "CueBill helped us recover ₹5,000+ in lost revenue within the first month. The automatic billing alone pays for itself."
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3">
                  <div className="w-12 h-12 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">SK</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Santa Kumar</p>
                    <p className="text-gray-600">Owner, Cues N' Cushions, Vellore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Stats */}
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-green-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-green-600 mb-2">18%</div>
              <div className="text-gray-700 font-semibold mb-2">Average Revenue Increase</div>
              <div className="text-gray-600">In first quarter</div>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-blue-600 mb-2">45min</div>
              <div className="text-gray-700 font-semibold mb-2">Time Saved Daily</div>
              <div className="text-gray-600">On billing tasks</div>
            </div>
            <div className="bg-purple-50 p-8 rounded-xl">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-700 font-semibold mb-2">Billing Accuracy</div>
              <div className="text-gray-600">Zero calculation errors</div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ROICalculatorSection() {
  return (
    <>
      {/* ROI Calculator Section */}
      <section className="py-20 px-6 bg-blue-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Calculate Your Potential Savings
            </h2>
            <p className="text-xl text-gray-600">
              See how much revenue you could recover with CueBill
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Tables</label>
                <input type="number" placeholder="5" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Average Hourly Rate (₹)</label>
                <input type="number" placeholder="200" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Operating Hours</label>
                <input type="number" placeholder="12" className="w-full p-3 border border-gray-300 rounded-lg" />
              </div>
            </div>

            <div className="text-center p-8 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">₹18,000</div>
              <div className="text-lg text-gray-700 mb-1">Potential monthly recovery</div>
              <div className="text-sm text-gray-600">Based on 15% revenue recovery</div>
              
              <div className="mt-6 text-center">
                <div className="text-xl font-bold text-[var(--color-primary)] mb-1">ROI Timeline: 2 weeks</div>
                <div className="text-gray-600">System pays for itself</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ComparisonSection() {
  return (
    <>
      {/* Comparison Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Manual System vs CueBill
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature</h3>
                <div className="space-y-4">
                  <div className="text-gray-700">Revenue Accuracy</div>
                  <div className="text-gray-700">Billing Time</div>
                  <div className="text-gray-700">Food Order Errors</div>
                  <div className="text-gray-700">Business Insights</div>
                  <div className="text-gray-700">Staff Training</div>
                </div>
              </div>
              
              <div className="p-6 bg-red-50">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Manual System</h3>
                <div className="space-y-4">
                  <div className="text-red-700">85-90%</div>
                  <div className="text-red-700">15+ minutes</div>
                  <div className="text-red-700">10-15%</div>
                  <div className="text-red-700">None</div>
                  <div className="text-red-700">Extensive</div>
                </div>
              </div>
              
              <div className="p-6 bg-green-50">
                <h3 className="text-lg font-semibold text-green-800 mb-4">CueBill</h3>
                <div className="space-y-4">
                  <div className="text-green-700 font-semibold">100%</div>
                  <div className="text-green-700 font-semibold">2 minutes</div>
                  <div className="text-green-700 font-semibold">0%</div>
                  <div className="text-green-700 font-semibold">Complete</div>
                  <div className="text-green-700 font-semibold">Minimal</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Modern Technology. Simple Implementation.</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Cloud-based - No hardware investment</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Mobile responsive</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">Real-time syncing</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                <span className="text-gray-700">99.9% uptime guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function ContactSection() {
  return (
    <>
          {/* Final CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join club owners who recovered their lost revenue with CueBill. Start your free trial today.
          </p>
          
          <div className="bg-[var(--color-light)] p-6 rounded-xl mb-8 max-w-2xl mx-auto">
            <p className="text-lg text-gray-700 font-semibold">
              30-day free trial • No setup fees • Cancel anytime
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white px-10 py-5 rounded-lg font-semibold text-xl transition-colors duration-200 flex items-center gap-2">
              Start Free Trial
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white px-10 py-5 rounded-lg font-semibold text-xl transition-colors duration-200">
              Schedule Demo
            </button>
          </div>

          <div className="flex justify-center">
            <div className="bg-gray-800 p-8 rounded-xl max-w-md">
              <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
              <p className="text-gray-300 mb-4">
                Ready to see how we can transform your business? Our team is here to help.
              </p>
              <div className="space-y-2 text-gray-400">
                <a href="mailto:cue.bill.25@gmail.com" className="flex items-center justify-center gap-2 hover:text-gray-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  cue.bill.25@gmail.com
                </a>
                <a href="tel:+919870437084" className="flex items-center justify-center gap-2 hover:text-gray-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  +91 98704 37084
                </a>
                {/* <p>🕒 Mon-Fri, 9 AM - 6 PM EST</p> */}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2024 CueBill. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </section>
    </>
  )
}
