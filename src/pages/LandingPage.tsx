import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Users, 
  Calendar, 
  Activity, 
  Map, 
  Heart, 
  MessageCircle,
  Trophy,
  ChevronRight,
  ArrowRight,
  LogIn,
  Target,
  BarChart2,
  Zap
} from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';

const features = [
  {
    icon: Users,
    title: 'Connect with Athletes',
    description: 'Join a vibrant community of like-minded fitness enthusiasts. Share experiences, motivate each other, and grow together.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=2000'
  },
  {
    icon: Calendar,
    title: 'Discover Events',
    description: 'Find local races, training sessions, and group activities. Never miss an opportunity to challenge yourself.',
    image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=2000'
  },
  {
    icon: Activity,
    title: 'Track Progress',
    description: 'Monitor your fitness journey with detailed analytics. Set goals, track achievements, and visualize your improvement.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2000'
  }
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '100K+', label: 'Activities Tracked' },
  { value: '5K+', label: 'Events Hosted' },
  { value: '200+', label: 'Communities' }
];

export function LandingPage() {
  const [heroRef, heroInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-2xl font-bold text-white">
              Fitness Social
            </Link>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleAuthClick('signin')}
                className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </button>
              <button
                onClick={() => handleAuthClick('signup')}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed z-0"
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2000)',
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Your Fitness Journey
              <span className="block text-blue-400">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Connect, compete, and achieve your fitness goals with a community that supports you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleAuthClick('signup')}
                className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center group"
              >
                Get Started
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/features"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">
              Everything you need to achieve your fitness goals, all in one place.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-all"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute top-4 left-4 p-2 bg-blue-500 rounded-xl text-white">
                    <feature.icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section 
        ref={statsRef}
        className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]" />
        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join our community today and take your fitness to the next level.
            </p>
            <button
              onClick={() => handleAuthClick('signup')}
              className="px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors inline-flex items-center"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode={authMode}
      />
    </div>
  );
}