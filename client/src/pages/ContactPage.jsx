import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import api from '../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How fast is express delivery?',
      a: 'Orders placed before 2 PM IST are dispatched on the same business day. Delivery across major metro cities takes 24 to 48 hours, while tier-2 and tier-3 regions receive orders in 3 to 4 business days.',
    },
    {
      q: 'How does the warranty claim process work?',
      a: 'All hardware comes backed by official manufacturer warranties (1 to 5 years depending on the SKU). You can reach out directly to the manufacturer authorized service center or contact our support team for warranty registration and doorstep collection assistance.',
    },
    {
      q: 'Can I pay via Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is supported for all products up to ₹50,000 across 19,000+ Indian postal codes. You can pay using cash, card, or dynamic UPI QR at the time of delivery.',
    },
    {
      q: 'What is TechNova’s return and replacement policy?',
      a: 'We provide a 7-day hassle-free replacement guarantee for any item received with transit damage, hardware defects, or missing accessories.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#FCA311]">
          We Are Here to Help
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
          Get in Touch with TechNova
        </h1>
        <p className="text-sm text-gray-500">
          Have questions regarding compatibility, order status, or custom PC builds? Speak with our hardware experts.
        </p>
      </div>

      {/* Grid: Contact Info & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Contact Info (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-6">
            <h2 className="text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
              Customer Support Channels
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Email Support</p>
                  <p className="text-gray-500">support@technova.com</p>
                  <p className="text-gray-400 mt-0.5">Average response under 4 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center flex-shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Toll-Free Helpline</p>
                  <p className="text-gray-500">+91 (800) 425-NOVA</p>
                  <p className="text-gray-400 mt-0.5">Monday to Saturday: 9:00 AM – 8:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Corporate Headquarters</p>
                  <p className="text-gray-500 leading-relaxed">
                    TechNova Technologies Pvt. Ltd.<br />
                    Tower B, 4th Floor, Cyber City Phase 2<br />
                    Bengaluru, Karnataka 560001, India
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#14213D] flex items-center justify-center flex-shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Warehouse & Dispatch Hours</p>
                  <p className="text-gray-500">Monday – Sunday (24/7 Automated Dispatch)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Contact Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-subtle space-y-4">
          <h2 className="text-lg font-bold text-gray-900">
            Send an Engineering or Sales Message
          </h2>
          <p className="text-xs text-gray-500">
            Fill in the details below and a TechNova engineer will respond directly.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Rahul Sharma"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Contact Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="e.g. Inquiring about RTX 4070 build compatibility"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Your Message *
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Please describe your hardware question or support inquiry in detail..."
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-[#14213D]"
              />
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center space-x-2 text-xs">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center space-x-2 text-xs">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-[#14213D] hover:bg-[#233862] text-white py-3 px-6 rounded-xl font-bold text-xs transition-all shadow-subtle flex items-center space-x-2 disabled:opacity-50"
            >
              <Send size={14} />
              <span>{submitting ? 'Sending Message...' : 'Submit Message'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <section className="bg-slate-50/70 p-8 rounded-3xl border border-gray-100 space-y-6">
        <div className="text-center max-w-lg mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Quick answers regarding shipping, warranties, and payments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-subtle space-y-1.5">
              <h3 className="font-bold text-xs text-gray-900 flex items-start gap-1.5">
                <HelpCircle size={14} className="text-[#FCA311] mt-0.5 flex-shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed pl-5">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
