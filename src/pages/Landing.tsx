import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Landing() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-indigo-600" />,
      title: "Interactive Calendar",
      description: "Easily manage and view your children's schedules with our intuitive calendar interface."
    },
    {
      icon: <Clock className="h-6 w-6 text-indigo-600" />,
      title: "Activity Tracking",
      description: "Keep track of classes, appointments, and extracurricular activities in one place."
    },
    {
      icon: <DollarSign className="h-6 w-6 text-indigo-600" />,
      title: "Fee Management",
      description: "Monitor and track activity fees and payments for better financial planning."
    },
    {
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      title: "Multiple Children",
      description: "Manage schedules for all your children with color-coded calendars and personalized views."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden py-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Simplify your children's</span>
              <span className="block text-indigo-600">schedule management</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl"
            >
              Keep track of your children's activities, classes, and appointments all in one place. Never miss an important event again.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8"
            >
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-200 hover:scale-105"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              variants={itemVariants}
              className="text-base text-indigo-600 font-semibold tracking-wide uppercase"
            >
              Features
            </motion.h2>
            <motion.p
              variants={itemVariants}
              className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
            >
              Everything you need to manage your children's schedules
            </motion.p>
          </div>

          <div className="mt-20">
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  className="relative bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    {feature.icon}
                    <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="mt-4 text-base text-gray-500">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-indigo-50"
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl"
          >
            <span className="block">Ready to get started?</span>
            <span className="block text-indigo-600">Create your account today.</span>
          </motion.h2>
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-8 flex lg:mt-0 lg:flex-shrink-0"
          >
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}