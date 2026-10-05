'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

type Message = {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  options?: { id: string; label: string; action: string }[];
  isForm?: boolean;
};

export default function SupportBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', orderId: '', urgency: 'Medium', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'bot',
          text: 'Welcome to DirectCrest Support. How can we help you source today? Please select a topic below.',
          options: [
            { id: 'opt_1', label: '🏢 About Us', action: 'about' },
            { id: 'opt_2', label: '⭐ Why Shop With Us?', action: 'why_shop' },
            { id: 'opt_3', label: '💰 Pricing & MOQ (Minimum Order Quantity)', action: 'pricing' },
            { id: 'opt_4', label: '📦 Delivery & Shipping Rates', action: 'delivery' },
            { id: 'opt_5', label: '⚠️ Urgent Contact & Expected Wait Times', action: 'contact' },
          ]
        }
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, showForm, formSubmitted]);

  const handleOptionClick = (option: { id: string; label: string; action: string }) => {
    // Add user's selection
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: option.label }]);
    
    // Add bot's response
    setTimeout(() => {
      let botResponse = '';
      let isForm = false;

      switch(option.action) {
        case 'about':
          botResponse = 'We are a B2B wholesale procurement platform. We connect global buyers directly with verified manufacturers, eliminating middlemen to give you true factory-direct margins for your business.';
          break;
        case 'why_shop':
          botResponse = 'We replace flat images with interactive 3D WebGL models so you can inspect products before buying in bulk. We also guarantee 0% middleman markup, strict quality assurance, and automated door-to-door logistics.';
          break;
        case 'pricing':
          botResponse = 'Our pricing operates on tiered volume discounts—the more units you buy, the lower your unit cost. Many of our factories offer flexible MOQs, allowing you to access wholesale pricing without needing to buy massive container loads upfront.';
          break;
        case 'delivery':
          botResponse = 'We handle end-to-end logistics. Shipping costs are calculated strictly by weight and your chosen method:\n\nAir Freight: ৳1500 per kg (Fastest transit time, ideal for lighter or urgent goods).\n\nSea Freight (Ship): ৳800 per kg (Most economical for heavy, bulky wholesale orders).\n\nYou can track your shipment\'s progress at any time using your Order ID on our Tracking page.';
          break;
        case 'contact':
          botResponse = 'If you have an urgent issue regarding an active order or a time-sensitive sourcing request, please email us directly at support@directcrest.com or use our Contact Form.\n\nNote on response times: Resolution depends entirely on the complexity of the factory inquiry or logistics delay. Please allow up to 24 hours for our sourcing agents to investigate and reply with an accurate update. We appreciate your patience while we work on it!';
          isForm = true;
          setShowForm(true);
          break;
      }

      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          sender: 'bot', 
          text: botResponse,
          options: !isForm ? [{ id: 'opt_back', label: '⬅️ Back to Menu', action: 'menu' }] : []
        }
      ]);
    }, 500);
  };

  const handleMenuClick = () => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'How else can we help you?',
        options: [
          { id: 'opt_1', label: '🏢 About Us', action: 'about' },
          { id: 'opt_2', label: '⭐ Why Shop With Us?', action: 'why_shop' },
          { id: 'opt_3', label: '💰 Pricing & MOQ (Minimum Order Quantity)', action: 'pricing' },
          { id: 'opt_4', label: '📦 Delivery & Shipping Rates', action: 'delivery' },
          { id: 'opt_5', label: '⚠️ Urgent Contact & Expected Wait Times', action: 'contact' },
        ]
      }
    ]);
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        setFormSubmitted(true);
        setShowForm(false);
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'bot',
            text: 'We have received your urgent request. A DirectCrest sourcing agent will review your message and reply via this email address within 24 hours. For immediate order status, please check your Account Dashboard.',
            options: [{ id: 'opt_back', label: '⬅️ Back to Menu', action: 'menu' }]
          }
        ]);
      } else {
        alert(data.error || 'Failed to send message');
      }
    } catch (err) {
      alert('Network error while sending message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-[140px] right-0 w-80 sm:w-96 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '600px', height: '80vh' }}
          >
            <div className="bg-red-600 p-4 flex justify-between items-center shadow-md z-10 flex-shrink-0">
              <h3 className="text-white font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> DirectCrest Support
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 custom-scrollbar space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  {msg.text && (
                    <div className={`p-3 rounded-2xl max-w-[85%] whitespace-pre-wrap ${
                      msg.sender === 'user' 
                        ? 'bg-red-600 text-white rounded-br-none' 
                        : 'bg-white/10 border border-white/5 text-gray-200 rounded-bl-none'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  )}
                  
                  {msg.options && (
                    <div className="flex flex-col gap-2 mt-3 w-full pl-2">
                      {msg.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => opt.action === 'menu' ? handleMenuClick() : handleOptionClick(opt)}
                          className="bg-black/30 hover:bg-black/50 border border-white/10 text-white text-sm py-2 px-4 rounded-xl text-left transition-colors flex justify-between items-center group"
                        >
                          {opt.label}
                          {opt.action !== 'menu' && <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {showForm && !formSubmitted && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mt-2">
                  <form onSubmit={submitForm} className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Name *</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Email Address *</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Order ID (Optional)</label>
                      <input type="text" value={formData.orderId} onChange={e => setFormData({...formData, orderId: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500" placeholder="ORD-XXXXXX" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Urgency Level *</label>
                      <select value={formData.urgency} onChange={e => setFormData({...formData, urgency: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500">
                        <option value="High (Active Order)">High (Active Order)</option>
                        <option value="Medium (Sourcing Request)">Medium (Sourcing Request)</option>
                        <option value="Low (General Feedback)">Low (General Feedback)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 block mb-1">Message *</label>
                      <textarea required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 h-24 custom-scrollbar" placeholder="How can we help?" />
                    </div>
                    <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg py-2 text-sm flex items-center justify-center gap-2 disabled:opacity-50">
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit & Send Email
                    </button>
                  </form>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="p-3 bg-black/40 border-t border-white/5 flex-shrink-0">
              <p className="text-xs text-center text-gray-500">Replies are automated. Use 'Urgent Email Support' for a human agent.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a 
        href="https://wa.me/1234567890" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:scale-110 transition-transform"
        aria-label="Open Support Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
