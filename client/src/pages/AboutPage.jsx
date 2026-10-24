import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Cpu, Headphones, Award, CheckCircle2, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center space-x-2 bg-amber-50 border border-amber-200 px-3.5 py-1 rounded-full text-xs font-bold text-amber-800">
          <Sparkles size={14} className="text-[#FCA311]" />
          <span>About TechNova</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
          Technology. <span className="text-[#FCA311]">Simplified.</span>
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Founded with a clear conviction: buying high-performance electronics shouldn't require navigating confusing specs, questionable sellers, or painful warranty claims.
        </p>
      </section>

      {/* Metrics Banner */}
      <section className="bg-[#14213D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#FCA311]">50,000+</p>
            <p className="text-xs text-slate-300">Gamers & Creators Powered</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-white">100%</p>
            <p className="text-xs text-slate-300">Direct Brand Warranty</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-[#FCA311]">99.4%</p>
            <p className="text-xs text-slate-300">48-Hour On-Time Dispatch</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black text-white">4.9 / 5.0</p>
            <p className="text-xs text-slate-300">Average Customer Rating</p>
          </div>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FCA311]">
              Our Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Built for Those Who Demand Peak Computing Power
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Whether you are compiling multi-gigabyte codebases, rendering 8K visual effects, or competing in esports tournament finals, your hardware defines your limits.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              At TechNova, every single laptop, custom PC, and ray-tracing GPU in our catalog is rigorously verified. We test cooling dynamics, thermal throttling thresholds, and driver compatibility so that you can simply plug in and execute your best work.
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Zero counterfeit stock — sourced strictly from licensed distributors</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>Rigid anti-vibration & ESD-safe protective packaging</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-700 font-semibold">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>In-house technical support team of certified hardware specialists</span>
              </div>
            </div>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80"
              alt="TechNova Engineering Lab"
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Why Shop with TechNova?
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Our unwavering commitments to the Indian tech community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center">
              <Cpu size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Benchmarked Specs</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              We list genuine, real-world benchmarks and detailed thermal performance stats instead of inflated marketing jargon.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Hassle-Free Warranty</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              All items carry original OEM warranties. In the rare event of a defect, our concierge team handles pickup and manufacturer escalation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center">
              <Headphones size={24} />
            </div>
            <h3 className="text-base font-bold text-gray-900">Engineer Support</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Have questions about PCIe lane bandwidth or RAM timing compatibility? Chat directly with knowledgeable systems engineers.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-100 rounded-3xl p-8 sm:p-12 space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">
            Ready to Upgrade Your Computing Setup?
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Explore our curated catalog of ultra-light creator laptops, mechanical keyboards, and 4K displays.
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 bg-[#14213D] hover:bg-[#233862] text-white px-7 py-3 rounded-xl font-bold text-xs transition-all shadow-subtle"
            >
              <span>Explore Products</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
