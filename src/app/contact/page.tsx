'use client';

import React, { useState } from 'react';
import { Mail, Phone, Instagram, Send, CheckCircle2, HelpCircle, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ContactPage() {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Question',
    message: '',
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill all required form fields', 'error');
      return;
    }

    setIsSubmitted(true);
    showToast('Message sent to Second Story Client Support!', 'success');
    setFormData({ name: '', email: '', subject: 'General Question', message: '' });
  };

  const faqs = [
    {
      q: 'How does Second Story authenticate vintage items?',
      a: 'Every piece is physically verified by our archival curation team. We inspect fabric weave, wash tags, stitch styles (single-stitch vs. modern double-stitch), brand hallmarks, zipper hardware (Talon, Lampo, YKK USA), and copyright timestamps.',
    },
    {
      q: 'Why is there only 1 of each item in stock?',
      a: 'Because authentic vintage pieces were produced decades ago. Each garment has its own individual wash, fade, and sizing characteristics. When an item is sold, it is gone from our archive.',
    },
    {
      q: 'How do you ensure correct sizing on vintage fits?',
      a: 'We provide exact flat-lay measurements (chest pit-to-pit, total length, shoulders, waist, inseam) in inches and centimeters on every single product page. We strongly recommend measuring your favourite fitting garment flat and comparing numbers.',
    },
    {
      q: 'What are your delivery timelines across India?',
      a: 'Orders are packed within 24 hours and dispatched via express air couriers (BlueDart / Delhivery Express). Typical transit time is 2-4 business days for metro areas (Mumbai, Delhi-NCR, Bengaluru, Pune, Hyderabad, Kolkata) and 4-6 business days for the rest of India.',
    },
    {
      q: 'Can I sell or consign my rare vintage grails to Second Story?',
      a: 'Yes! We actively buy and consign select 80s/90s vintage tees, archive workwear (Carhartt, Dickies), Levi’s made in USA selvedge, and luxury streetwear. Contact us at studio@secondstory.in with clear photos and tags.',
    },
  ];

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
            CLIENT CONCIERGE & SUPPORT
          </span>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-charcoal">
            GET IN TOUCH
          </h1>
          <p className="text-xs sm:text-sm text-charcoal/70 font-sans mt-2">
            Have questions about measurements, consignment, orders, or a specific archive piece? We’re here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-charcoal/10">
          {/* Left Column: Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-soft-white border border-charcoal/15 p-6 sm:p-10 shadow-sm space-y-6">
            <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-base">
              Send a Direct Message
            </h2>

            {isSubmitted ? (
              <div className="p-6 bg-olive/15 border border-olive/30 text-center space-y-2 font-mono text-xs text-charcoal">
                <CheckCircle2 className="w-8 h-8 text-olive mx-auto" />
                <h3 className="font-bold text-sm uppercase">Message Received</h3>
                <p className="text-charcoal/70">
                  Our archival support team will respond to your email within 12 business hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-3 px-4 py-2 bg-charcoal text-cream text-[11px] uppercase font-bold"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maya Roy"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="maya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
                  />
                </div>

                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Topic / Inquiry *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Garment Measurements">Sizing & Measurements Help</option>
                    <option value="Order Tracking">Existing Order Tracking</option>
                    <option value="Consignment & Selling">Sell / Consign Rare Vintage</option>
                    <option value="Press & Collabs">Press & Collaborations</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we assist you with your archive fit?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans text-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message to Support</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details & Studio Info (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 font-mono text-xs">
            <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-4">
              <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm">
                Direct Channels
              </h3>
              <div className="space-y-3 text-charcoal/80">
                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-vintage-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block">Email Support</span>
                    <strong className="text-charcoal">care@secondstory.in</strong>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-vintage-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block">Phone & WhatsApp</span>
                    <strong className="text-charcoal">+91 (022) 8492-9012</strong>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Instagram className="w-4 h-4 text-vintage-brown mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase text-charcoal/50 block">Instagram</span>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal hover:underline font-bold"
                    >
                      @secondstory.archive
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-3">
              <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm">
                Archival Studio & Curation HQ
              </h3>
              <p className="text-charcoal/70 leading-relaxed font-sans text-xs">
                Second Story Studios <br />
                Unit 14B, Indiranagar Creative Hub <br />
                100ft Road, Bengaluru, Karnataka - 560038
              </p>
              <p className="text-[11px] text-charcoal/50 pt-1">
                Studio visits by private appointment only for archive grails.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="pt-16 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
              COMMON QUESTIONS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tighter text-charcoal">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="divide-y divide-charcoal/10 border border-charcoal/15 bg-soft-white">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="p-5 sm:p-6 transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left group"
                  >
                    <span className="font-display font-bold text-sm sm:text-base uppercase tracking-tight text-charcoal group-hover:text-vintage-brown transition-colors pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-charcoal/60 transition-transform duration-300 flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-charcoal' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-charcoal/5 text-xs sm:text-sm text-charcoal/70 font-sans leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
