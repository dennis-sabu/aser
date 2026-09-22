'use client';

import React from 'react';
import { ShieldCheck, Zap, Users, Search, ArrowRight, CheckCircle2, Car, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const FeaturesSection = () => {
  const features = [
    {
      title: 'Verified Student Network',
      desc: 'Every user is a verified student with a college email. Trust and safety are built in from day one.',
      icon: <ShieldCheck className="w-6 h-6" />,
      delay: '0.1s'
    },
    {
      title: 'Need → Match → Connect',
      desc: 'Post what you need and our system finds matching resources, rides, or skilled students instantly.',
      icon: <Zap className="w-6 h-6" />,
      delay: '0.2s'
    },
    {
      title: 'Real Reputation System',
      desc: 'Ratings built on completed transactions. See exactly who you\'re dealing with before you connect.',
      icon: <Users className="w-6 h-6" />,
      delay: '0.3s'
    },
    {
      title: 'Smart Campus Search',
      desc: 'Search ESP32, CAD help, or "ride to Kottayam" — results intelligently route to the right people.',
      icon: <Search className="w-6 h-6" />,
      delay: '0.4s'
    },
    {
      title: 'Campus Ride Sharing',
      desc: 'Find or create rides between campus and city. Split costs, reduce travel time, travel safely.',
      icon: <Car className="w-6 h-6" />,
      delay: '0.5s'
    },
    {
      title: 'Student Skill Exchange',
      desc: 'Need Flutter help? PCB design? Connect with classmates who have exactly the skill you need.',
      icon: <Lightbulb className="w-6 h-6" />,
      delay: '0.6s'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">
              Everything you need,<br />right on your campus.
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A unified ecosystem designed to eliminate the friction of student life.
              Share resources, find rides, and swap skills effortlessly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              style={{ opacity: 0, animationDelay: f.delay }}
              className="animate-fade-in-up"
            >
              <Card className="p-8 h-full hover:border-gray-300 transition-all group">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const HowItWorksSection = () => {
  const steps = [
    {
      step: '01',
      title: 'Post a Need',
      desc: 'Say "I need an ESP32" or "Need a ride to Ernakulam tomorrow." Takes 30 seconds.',
      icon: <Search className="w-6 h-6" />
    },
    {
      step: '02',
      title: 'Get Matched',
      desc: 'We find verified students nearby who have exactly what you\'re looking for.',
      icon: <Zap className="w-6 h-6" />
    },
    {
      step: '03',
      title: 'Connect & Share',
      desc: 'Coordinate via campus chat. Meet on campus to exchange, borrow, or ride together.',
      icon: <Users className="w-6 h-6" />
    },
    {
      step: '04',
      title: 'Review & Build Trust',
      desc: 'Mark complete and leave a review. Your campus reputation grows with every interaction.',
      icon: <CheckCircle2 className="w-6 h-6" />
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div style={{ opacity: 0, animationDelay: '0.1s' }} className="animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-4">How it works</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From a simple request to a completed exchange — streamlined in four steps.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {steps.map((s, i) => (
            <div
              key={s.step}
              style={{ opacity: 0, animationDelay: `${0.2 + i * 0.1}s` }}
              className="animate-fade-in-up relative"
            >
              <div className="text-6xl font-bold text-gray-200 absolute -top-8 -left-4 z-0">{s.step}</div>
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                  {s.icon}
                </div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Core flow pill */}
        <div
          style={{ opacity: 0, animationDelay: '0.7s' }}
          className="animate-fade-in-up mt-20 flex items-center justify-center gap-3 flex-wrap"
        >
          {['Need', 'Match', 'Connect', 'Share'].map((label, i, arr) => (
            <React.Fragment key={label}>
              <span className="bg-black text-white text-sm font-medium px-5 py-2 rounded-full">
                {label}
              </span>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-400" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
