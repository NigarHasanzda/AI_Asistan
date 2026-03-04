import React from 'react';
import { 
  MessageSquare, Database, FileText, LayoutDashboard, 
  Plus, Settings, Search, MoreVertical, Paperclip, 
  Image as ImageIcon, Send, ChevronRight, Zap, Map
} from 'lucide-react';

const MentorChat = () => {
  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col p-6">


        <button className="w-full bg-[#007BFF] hover:bg-blue-600 text-white rounded-xl py-3 px-4 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-blue-100 transition-all mb-10">
          <Plus size={20} /> Start New Conversation
        </button>

        <div className="flex-1">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recent Conversations</h3>
          <nav className="space-y-2">
            {[
              { icon: MessageSquare, label: "Python Roadmap", active: true },
              { icon: Database, label: "SQL Review", active: false },
              { icon: FileText, label: "CV Preparation", active: false },
            ].map((item, i) => (
              <a key={i} href="#" className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? 'bg-white shadow-sm border border-slate-100 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
                <item.icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

      </aside>

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="h-15 border-b border-slate-50 px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
               <Database size={18} />
             </div>
             <h2 className="font-bold text-slate-800">Python Roadmap Session</h2>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} className="cursor-pointer" />
            <MoreVertical size={20} className="cursor-pointer" />
          </div>
        </header>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-7">
          {/* AI Message */}
          <div className="flex gap-4 max-w-4xl">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <Zap size={18} fill="currentColor" />
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-5 text-[15px] leading-relaxed text-slate-700">
                Great progress so far! Since you've mastered basic loops, let's look at list comprehensions. They are a "Pythonic" way to create lists and are essential for clean code.
              </div>
              <div className="bg-[#0F172A] rounded-2xl p-6 font-mono text-[13px] text-slate-300 shadow-xl overflow-hidden">
                <p className="text-slate-500 mb-2"># Traditional approach</p>
                <p>squares = []</p>
                <p>for x in range(10):</p>
                <p className="ml-4">squares.append(x**2)</p>
                <p className="text-slate-500 mt-4 mb-2"># List comprehension</p>
                <p><span className="text-emerald-400">squares</span> = [x**2 for x in range(10)]</p>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">AI Mentor • 10:24 AM</p>
            </div>
          </div>

          {/* User Message */}
          <div className="flex flex-col items-end gap-2">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-[15px] text-slate-700 max-w-xl shadow-sm italic">
              That looks much cleaner. Can we see how this applies to my goal of becoming a Backend Developer?
            </div>
            <div className="flex items-center gap-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Alex • 10:25 AM</p>
               <img className="w-5 h-5 rounded-full" src="https://ui-avatars.com/api/?name=Alex&background=FFEDD5" alt="" />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0">
          <div className="flex gap-2 mb-4">
            {["Explain my Skill Gap", "Next learning step?", "Review my code"].map((btn) => (
              <button key={btn} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                {btn}
              </button>
            ))}
          </div>
          <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center gap-3 shadow-inner">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><Paperclip size={20} /></button>
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><ImageIcon size={20} /></button>
            <input 
              type="text" 
              placeholder="Message AI Mentor..." 
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-slate-400"
            />
            <button className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">
              <Send size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* RIGHT INFO PANEL */}
      <aside className="w-80 bg-[#F1F5F9] border-l border-slate-100 flex flex-col p-6">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Session Info</h3>
           <LayoutDashboard size={18} className="text-slate-400" />
        </div>

        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 mb-6">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Current Career Goal</p>
          <h4 className="font-bold text-slate-800 text-lg mb-6 leading-tight">Junior Backend Developer</h4>
          
          <div className="relative w-28 h-28 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-50" />
              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={300} strokeDashoffset={105} className="text-blue-500 rounded-full" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-800">65%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Ready</span>
            </div>
          </div>

          <div className="space-y-4">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Milestones</h5>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-500"><div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white"><Zap size={10} fill="currentColor"/></div> Python Basics</div>
              <div className="flex items-center gap-2 text-xs font-bold text-blue-500"><div className="w-4 h-4 border-2 border-blue-500 rounded-full" /> FastAPI & Auth</div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300"><div className="w-4 h-4 border-2 border-slate-200 rounded-full" /> AWS Deployment</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
           <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Mentor Tip</p>
           <p className="text-xs text-blue-700 leading-relaxed font-medium">
             Try implementing the code block from the chat into your project folder. I can review the whole file!
           </p>
        </div>
      </aside>

    </div>
  );
};

export default MentorChat;