"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, MapPin, Send, Phone, Github, Linkedin, Twitter } from "lucide-react";

const ContactPage = () => {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulyasiya üçün 2 saniyəlik gecikmə
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Message sent successfully!");
      setFormState({ name: "", email: "", message: "" });
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Dekorativ Arka Plan Elementləri */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-violet-100/50 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* SOL TƏRƏF: MƏLUMAT VƏ SOSİAL MEDİA */}
          <div className="space-y-12">
            <div>
              <h2 className="text-5xl font-black text-slate-900 leading-tight mb-6">
                Let's build the <br />
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">next big thing</span> together.
              </h2>
              <p className="text-slate-500 text-lg max-w-md leading-relaxed">
                Have questions about our AI interview process or enterprise solutions? Our team is here to help you 24/7.
              </p>
            </div>

            {/* Əlaqə Kartları */}
            <div className="space-y-6">
              {[
                { icon: <Mail className="w-6 h-6" />, label: "Email us at", value: "support@kordai.com", color: "bg-blue-50 text-blue-600" },
                { icon: <MessageSquare className="w-6 h-6" />, label: "Live Chat", value: "Available 09:00 - 18:00", color: "bg-green-50 text-green-600" },
                { icon: <MapPin className="w-6 h-6" />, label: "Headquarters", value: "Baku, Azerbaijan (Technopark)", color: "bg-orange-50 text-orange-600" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-5 group cursor-pointer p-4 rounded-2xl transition-all hover:bg-slate-50">
                  <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-slate-900 font-bold text-lg">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SAĞ TƏRƏF: CONTACT FORM */}
          <div className="relative">
            <div className="bg-white border border-slate-100 p-8 md:p-10 rounded-[2.5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] relative z-10 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 ml-1">Full Name</label>
                    <input
                      required
                      type="text"
                      placeholder="John Doe"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 font-medium"
                      value={formState.name}
                      onChange={(e) => setFormState({...formState, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-slate-700 ml-1">Email Address</label>
                    <input
                      required
                      type="email"
                      placeholder="john@example.com"
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 font-medium"
                      value={formState.email}
                      onChange={(e) => setFormState({...formState, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-black text-slate-700 ml-1">How can we help?</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Tell us about your project or inquiry..."
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-slate-900 font-medium resize-none"
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                  />
                </div>

                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-200 active:scale-95 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Send Message <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
            
            {/* Arxa tərəfdəki dekorativ kvadrat */}
            <div className="absolute -bottom-4 -right-4 w-full h-full bg-indigo-50 rounded-[2.5rem] -z-0" />
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactPage;