import { useState } from "react";
import { ChatbotPreview } from "./components/ChatbotPreview";
import { ChatInterface } from "./components/ChatInterface";
import { FeatureCard } from "./components/FeatureCard";
import { Button } from "./components/ui/button";
import { 
  Plane, 
  Hotel, 
  Shield, 
  Calendar, 
  MapPin, 
  Utensils, 
  Cloud,
  Compass
} from "lucide-react";
import logo from "figma:asset/e5106dc76e4a5b520e307d80648f962a463ac75e.png";

type AppView = "home" | "chat";

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("home");

  if (currentView === "chat") {
    return <ChatInterface onBack={() => setCurrentView("home")} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EAF9FF] via-white to-[#EAF9FF]/30">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-[#00ADEF]/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Smart Travel Assistant" 
                className="w-10 h-10"
              />
              <span className="text-[#004C8C] font-bold text-lg">Smart Travel Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors text-sm">
                About
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block">
                <span className="bg-[#EAF9FF] text-[#004C8C] px-4 py-2 rounded-full text-sm font-medium">
                  AI-Powered Travel Planning
                </span>
              </div>
              <h1 className="text-5xl text-[#004C8C]">
                One conversation, <br />
                <span className="bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] bg-clip-text text-transparent">
                  optimized travel
                </span>
              </h1>
              <p className="text-gray-600 text-lg">
                Transform the way you plan trips with our intelligent assistant. 
                Get personalized recommendations for flights, hotels, activities, 
                and dining—all through natural conversation.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-[#00ADEF] to-[#6BD9FF] hover:from-[#004C8C] hover:to-[#00ADEF] text-white font-medium"
                onClick={() => setCurrentView("chat")}
              >
                Start Planning
              </Button>
              <Button size="lg" variant="outline" className="border-[#00ADEF] text-[#004C8C] hover:bg-[#EAF9FF]">
                Try Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-[#00ADEF] text-2xl font-bold">10K+</div>
                <div className="text-gray-600 text-sm">Trips Planned</div>
              </div>
              <div>
                <div className="text-[#00ADEF] text-2xl font-bold">95%</div>
                <div className="text-gray-600 text-sm">Satisfaction</div>
              </div>
              <div>
                <div className="text-[#00ADEF] text-2xl font-bold">24/7</div>
                <div className="text-gray-600 text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Right Column - Chatbot Preview */}
          <div className="relative">
            {/* Decorative Gradient Orbs */}
            <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#00ADEF]/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-[#6BD9FF]/20 rounded-full blur-3xl" />
            <div className="relative">
              <ChatbotPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-3">Everything you need</h2>
          <p className="text-gray-600">
            Comprehensive travel planning tools in one intelligent assistant
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          <FeatureCard
            icon={Plane}
            title="Flights"
            description="Find the best flight options based on your preferences and budget"
          />
          <FeatureCard
            icon={Hotel}
            title="Accommodations"
            description="Discover stays perfectly matched to your travel style and budget"
          />
          <FeatureCard
            icon={Cloud}
            title="Weather"
            description="Real-time forecasts and climate insights for your destination"
          />
          <FeatureCard
            icon={Compass}
            title="Activity"
            description="Personalized recommendations for tours, attractions, and experiences"
          />
          <FeatureCard
            icon={Shield}
            title="Safety"
            description="Travel with confidence with real-time safety updates and alerts"
          />
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#EAF9FF]">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Smart Trip Planning */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#004C8C] mb-2">Smart Trip Planning</h3>
                <p className="text-gray-600 text-sm">
                  Our AI analyzes millions of data points to create the perfect itinerary
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Plane className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Flight Optimization</h4>
                    <p className="text-gray-600 text-sm">
                      Compare prices, routes, and times to find your ideal flight
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Hotel className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Accommodation Matching</h4>
                    <p className="text-gray-600 text-sm">
                      From boutique hotels to budget stays, find your perfect match
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Cloud className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Weather Intelligence</h4>
                    <p className="text-gray-600 text-sm">
                      Plan around the weather with accurate forecasts and insights
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Personalized Insights */}
            <div className="space-y-6">
              <div>
                <h3 className="text-[#004C8C] mb-2">Personalized Insights</h3>
                <p className="text-gray-600 text-sm">
                  Get recommendations tailored to your unique preferences and interests
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Activity Suggestions</h4>
                    <p className="text-gray-600 text-sm">
                      Discover attractions, tours, and experiences you'll love
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Utensils className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Dining Recommendations</h4>
                    <p className="text-gray-600 text-sm">
                      From local favorites to fine dining, satisfy every craving
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#EAF9FF] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-[#00ADEF]" />
                  </div>
                  <div>
                    <h4 className="text-[#004C8C] mb-1">Smart Scheduling</h4>
                    <p className="text-gray-600 text-sm">
                      Optimize your time with intelligent itinerary planning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-r from-[#004C8C] to-[#00ADEF] rounded-3xl p-12 text-center text-white relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-white mb-4">Ready to plan your next adventure?</h2>
            <p className="text-blue-100 mb-8">
              Join thousands of travelers who've discovered a better way to plan trips
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#004C8C] hover:bg-[#EAF9FF] font-medium">
                Get Started Free
              </Button>
              <Button size="lg" className="bg-white text-[#004C8C] hover:bg-[#EAF9FF] font-medium">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img 
                  src={logo} 
                  alt="Smart Travel Assistant" 
                  className="w-8 h-8"
                />
                <span className="text-[#004C8C] font-bold">Smart Travel</span>
              </div>
              <p className="text-gray-600 text-sm">
                AI-powered travel planning made simple
              </p>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Terms</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 Smart Travel Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
