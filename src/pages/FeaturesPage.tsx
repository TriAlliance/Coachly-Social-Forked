import React from 'react';
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
  BarChart2,
  Target,
  Route,
  Zap,
  Share2,
  Bell,
  Shield,
  Smartphone
} from 'lucide-react';

const features = [
  {
    category: 'Social Features',
    items: [
      {
        icon: Users,
        title: 'Community Connection',
        description: 'Connect with like-minded athletes, join groups, and build your fitness network.',
        color: 'bg-blue-500',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800'
      },
      {
        icon: MessageCircle,
        title: 'Real-time Messaging',
        description: 'Chat with training partners, coaches, and team members in real-time.',
        color: 'bg-indigo-500',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800'
      },
      {
        icon: Share2,
        title: 'Activity Sharing',
        description: 'Share your workouts, achievements, and progress with your community.',
        color: 'bg-purple-500',
        image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800'
      }
    ]
  },
  {
    category: 'Training & Events',
    items: [
      {
        icon: Calendar,
        title: 'Event Management',
        description: 'Discover and join local events, races, and training sessions.',
        color: 'bg-green-500',
        image: 'https://images.unsplash.com/photo-1532444458054-01a7dd3e9fca?auto=format&fit=crop&w=800'
      },
      {
        icon: Route,
        title: 'Route Planning',
        description: 'Plan and share training routes with interactive maps and elevation profiles.',
        color: 'bg-yellow-500',
        image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800'
      },
      {
        icon: Target,
        title: 'Goal Setting',
        description: 'Set and track personal fitness goals with detailed progress monitoring.',
        color: 'bg-red-500',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800'
      }
    ]
  },
  {
    category: 'Performance Tracking',
    items: [
      {
        icon: Activity,
        title: 'Activity Tracking',
        description: 'Track runs, rides, swims, and workouts with detailed metrics.',
        color: 'bg-cyan-500',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800'
      },
      {
        icon: BarChart2,
        title: 'Advanced Analytics',
        description: 'Visualize your progress with comprehensive performance analytics.',
        color: 'bg-teal-500',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800'
      },
      {
        icon: Heart,
        title: 'Health Metrics',
        description: 'Monitor heart rate, recovery, and other vital health indicators.',
        color: 'bg-pink-500',
        image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=800'
      }
    ]
  },
  {
    category: 'Additional Features',
    items: [
      {
        icon: Trophy,
        title: 'Achievements',
        description: 'Earn badges and rewards for reaching milestones and completing challenges.',
        color: 'bg-amber-500',
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800'
      },
      {
        icon: Bell,
        title: 'Smart Notifications',
        description: 'Stay updated with personalized alerts for activities, events, and achievements.',
        color: 'bg-orange-500',
        image: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&w=800'
      },
      {
        icon: Shield,
        title: 'Privacy Controls',
        description: 'Manage your data and privacy with granular control settings.',
        color: 'bg-slate-500',
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800'
      }
    ]
  }
];

export function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:16px_16px]" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Everything You Need to
              <span className="block text-blue-300">Achieve Your Goals</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-blue-100 mb-8"
            >
              Discover all the powerful features that make our platform the perfect companion for your fitness journey.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Features Sections */}
      {features.map((category, categoryIndex) => (
        <section key={category.category} className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16"
            >
              {category.category}
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {category.items.map((feature, index) => {
                const [ref, inView] = useInView({
                  threshold: 0.2,
                  triggerOnce: true
                });

                return (
                  <motion.div
                    key={feature.title}
                    ref={ref}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden group hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className={`absolute top-4 left-4 p-2 ${feature.color} rounded-xl text-white`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 mb-4">{feature.description}</p>
                      <Link
                        to="/signup"
                        className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium group/link"
                      >
                        Try it now
                        <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Experience All These Features?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community today and take your fitness journey to the next level.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Get Started Now
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}