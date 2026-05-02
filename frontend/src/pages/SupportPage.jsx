import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  MessageCircle, 
  HelpCircle, 
  FileText,
  ChevronDown,
  ChevronUp,
  Send,
  Command
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupportPage = () => {
  const { isDark } = useStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [formStatus, setFormStatus] = useState('idle'); // idle, loading, success

  const faqs = [
    {
      question: "How does the AI architect work?",
      answer: "Our platform uses Gemini 2.0 to parse your startup idea, identify the necessary domains, and construct a full-stack architectural blueprint including database schemas, API routes, and a component tree."
    },
    {
      question: "Can I export my blueprint?",
      answer: "Yes! Once a blueprint is generated and viewed in the dashboard, you can use the export options to download it as a PDF or JSON file for your development team."
    },
    {
      question: "Where are my past ideas saved?",
      answer: "All your generated blueprints are automatically saved to your local browser storage. You can access them at any time from the 'Chats' section in the sidebar."
    },
    {
      question: "Do I need my own API key?",
      answer: "By default, no. We provide an internal quota. However, if you are a power user, you can provide your own Gemini or OpenAI API key in the Settings page to bypass rate limits."
    }
  ];

  return (
    <div className={`min-h-full p-8 transition-colors ${isDark ? 'bg-[#000000] text-white' : 'bg-[#F9FAFB] text-gray-900'}`}>
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header Title */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-500 mb-2">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Search our FAQ or send a message directly to our engineering team.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* FAQ Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="text-indigo-500" size={24} />
              <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200'
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
                  >
                    <span className="font-semibold text-sm">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={`px-5 pb-5 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="text-indigo-500" size={24} />
              <h2 className="text-2xl font-bold tracking-tight">Contact Support</h2>
            </div>

            <form 
              onSubmit={async (e) => { 
                e.preventDefault(); 
                setFormStatus('loading');
                
                const formData = new FormData(e.target);
                const payload = {
                  firstName: formData.get('firstName'),
                  lastName: formData.get('lastName'),
                  email: formData.get('email'),
                  subject: formData.get('subject'),
                  message: formData.get('message')
                };

                try {
                  const res = await fetch('/api/support', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  
                  if (!res.ok) throw new Error('Failed to send message');
                  
                  setFormStatus('success');
                  e.target.reset();
                } catch (error) {
                  console.error('Support form error:', error);
                  alert('There was a problem sending your message. Please try again.');
                  setFormStatus('idle');
                }
              }}
              className={`p-6 rounded-2xl border space-y-4 ${
                isDark ? 'bg-[#0A0A0A] border-[#222222]' : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              {formStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
                  <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-2">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h3 className="text-xl font-bold">Message Sent!</h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
                  <button 
                    onClick={() => setFormStatus('idle')}
                    className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>First Name</label>
                      <input name="firstName" type="text" placeholder="Jane" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Last Name</label>
                      <input name="lastName" type="text" placeholder="Doe" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} />
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                    <input name="email" type="email" placeholder="jane.doe@example.com" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Subject</label>
                    <select name="subject" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}>
                      <option>Bug Report</option>
                      <option>Feature Request</option>
                      <option>Billing Question</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message</label>
                    <textarea name="message" rows="4" placeholder="How can we help you?" className={`w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors resize-none ${isDark ? 'bg-[#111111] border-[#333333] text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`} required></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={formStatus === 'loading'}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/20 mt-6 ${
                      formStatus === 'loading' ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'
                    } text-white`}
                  >
                    {formStatus === 'loading' ? (
                      <Command size={18} className="animate-spin-slow" />
                    ) : (
                      <Send size={18} />
                    )}
                    {formStatus === 'loading' ? 'Sending...' : 'Send Message'}
                  </button>
                </>
              )}
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};

export default SupportPage;
