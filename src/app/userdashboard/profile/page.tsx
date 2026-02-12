"use client";

import React, { useState } from "react";
import { 
  Camera, Mail, MapPin, Link as LinkIcon, ShieldCheck, Edit3, X, 
  Plus, Briefcase, GraduationCap, Award, Calendar, Phone, Globe,
  Github, Linkedin, Twitter, ChevronRight, Star, TrendingUp
} from "lucide-react";

// Types
interface Profile {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  linkedin: string;
  github: string;
  website: string;
  bio: string;
  verified: boolean;
}

interface Stat {
  label: string;
  value: string;
  change: string;
  trend: "up" | "neutral";
}

interface Skill {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  years: number;
}

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa?: string;
}

interface Achievement {
  title: string;
  org: string;
  date: string;
}

const ProfilePage: React.FC = () => {
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [skillsOpen, setSkillsOpen] = useState<boolean>(false);
  const [experienceOpen, setExperienceOpen] = useState<boolean>(false);

  // Mock Data
  const profile: Profile = {
    name: "Alex Johnson",
    title: "Senior Software Engineer",
    email: "alex.johnson@techcorp.com",
    phone: "+994 50 123 4567",
    location: "Baku, Azerbaijan",
    avatar: "https://i.pravatar.cc/200?u=alex",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
    website: "alexjohnson.dev",
    bio: "Passionate software engineer with 5+ years of experience building scalable web applications. Specialized in React ecosystem and cloud architecture. Love mentoring junior developers and contributing to open-source projects.",
    verified: true
  };

  const stats: Stat[] = [
    { label: "Projects Completed", value: "47", change: "+3 this month", trend: "up" },
    { label: "Client Satisfaction", value: "98%", change: "Top 2%", trend: "up" },
    { label: "Code Reviews", value: "234", change: "+12 this week", trend: "up" },
    { label: "Contributions", value: "1.2k", change: "GitHub", trend: "neutral" }
  ];

  const skills: Skill[] = [
    { name: "React", level: "Expert", years: 5 },
    { name: "TypeScript", level: "Expert", years: 4 },
    { name: "Node.js", level: "Advanced", years: 5 },
    { name: "Next.js", level: "Advanced", years: 3 },
    { name: "GraphQL", level: "Advanced", years: 3 },
    { name: "AWS", level: "Intermediate", years: 2 },
    { name: "Docker", level: "Intermediate", years: 2 },
    { name: "PostgreSQL", level: "Advanced", years: 4 }
  ];

  const experience: Experience[] = [
    {
      company: "TechCorp Solutions",
      role: "Senior Software Engineer",
      period: "2021 - Present",
      location: "Baku, AZ",
      description: "Leading frontend development team, architecting scalable React applications"
    },
    {
      company: "StartupHub",
      role: "Full Stack Developer",
      period: "2019 - 2021",
      location: "Remote",
      description: "Built MVPs for multiple clients using React, Node.js, and MongoDB"
    },
    {
      company: "Digital Agency",
      role: "Junior Developer",
      period: "2018 - 2019",
      location: "Baku, AZ",
      description: "Developed responsive websites and learned modern web technologies"
    }
  ];

  const education: Education[] = [
    {
      institution: "Azerbaijan State Oil and Industry University",
      degree: "Bachelor of Computer Science",
      period: "2014 - 2018",
      gpa: "3.8/4.0"
    },
    {
      institution: "Udemy & Coursera",
      degree: "Various Professional Certifications",
      period: "2018 - Present",
      gpa: "Cloud Architecture, Advanced React"
    }
  ];

  const achievements: Achievement[] = [
    { title: "Top Contributor 2024", org: "React Open Source", date: "Jan 2024" },
    { title: "Hackathon Winner", org: "Baku Tech Fest", date: "Sep 2023" },
    { title: "AWS Certified", org: "Amazon Web Services", date: "Jun 2023" }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Profile</h1>
            <p className="text-slate-600 mt-2">Manage your professional information</p>
          </div>

          <button 
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
          >
            <Edit3 size={18} />
            Edit Profile
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT SIDEBAR */}
          <div className="space-y-6">

            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center">

              {/* Avatar */}
              <div className="relative mb-5">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 mx-auto">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <button className="absolute bottom-0 right-[calc(50%-48px)] bg-slate-900 text-white p-2.5 rounded-full hover:bg-slate-800 transition-colors shadow-lg">
                  <Camera size={16} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-slate-900">{profile.name}</h2>
              <p className="text-slate-600 font-medium text-sm mt-1">{profile.title}</p>

              <div className="border-t border-slate-200 my-5"></div>

              <div className="space-y-3 text-left text-sm">
                <ContactItem icon={<Mail size={16} />} text={profile.email} />
                <ContactItem icon={<Phone size={16} />} text={profile.phone} />
                <ContactItem icon={<MapPin size={16} />} text={profile.location} />
                <ContactItem icon={<Globe size={16} />} text={profile.website} link />
              </div>

              <div className="border-t border-slate-200 my-5"></div>

              {/* Social Links */}
              <div className="flex justify-center gap-3">
                <SocialButton icon={<Linkedin size={18} />} />
                <SocialButton icon={<Github size={18} />} />
                <SocialButton icon={<Twitter size={18} />} />
              </div>
            </div>

            {/* Verification Badge */}
            {profile.verified && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-xl flex gap-3 items-start">
                <div className="bg-emerald-500 text-white w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">Verified Professional</p>
                  <p className="text-xs text-slate-600 mt-0.5">Identity and credentials confirmed</p>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-slate-600" />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <QuickStat label="Profile Views" value="2.4k" period="this month" />
                <QuickStat label="Connections" value="487" period="growing" />
                <QuickStat label="Endorsements" value="89" period="for skills" />
              </div>
            </div>

          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, idx) => (
                <StatCard key={idx} {...stat} />
              ))}
            </div>

            {/* Bio */}
            <Section title="About Me" icon={<Briefcase size={18} />}>
              <p className="text-slate-700 leading-relaxed">{profile.bio}</p>
            </Section>

            {/* Skills */}
            <Section 
              title="Skills & Expertise" 
              icon={<Star size={18} />}
              action={() => setSkillsOpen(true)}
              actionLabel="Add Skill"
            >
              <div className="grid md:grid-cols-2 gap-3">
                {skills.map((skill, idx) => (
                  <SkillCard key={idx} {...skill} />
                ))}
              </div>
            </Section>

            {/* Experience */}
            <Section 
              title="Work Experience" 
              icon={<Briefcase size={18} />}
              action={() => setExperienceOpen(true)}
              actionLabel="Add Experience"
            >
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <ExperienceCard key={idx} {...exp} isLast={idx === experience.length - 1} />
                ))}
              </div>
            </Section>

            {/* Education */}
            <Section title="Education" icon={<GraduationCap size={18} />}>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <EducationCard key={idx} {...edu} isLast={idx === education.length - 1} />
                ))}
              </div>
            </Section>

            {/* Achievements */}
            <Section title="Achievements & Certifications" icon={<Award size={18} />}>
              <div className="grid md:grid-cols-2 gap-3">
                {achievements.map((achievement, idx) => (
                  <AchievementCard key={idx} {...achievement} />
                ))}
              </div>
            </Section>

          </div>
        </div>

        {/* MODALS */}

        {editOpen && (
          <Modal onClose={() => setEditOpen(false)} title="Edit Profile">
            <div className="space-y-4">
              <Input label="Full Name" defaultValue={profile.name} />
              <Input label="Title" defaultValue={profile.title} />
              <Input label="Email" defaultValue={profile.email} type="email" />
              <Input label="Phone" defaultValue={profile.phone} />
              <Input label="Location" defaultValue={profile.location} />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                <textarea 
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                  rows={4}
                  defaultValue={profile.bio}
                />
              </div>
            </div>
            <button className="btn-primary mt-6 w-full">Save Changes</button>
          </Modal>
        )}

        {skillsOpen && (
          <Modal onClose={() => setSkillsOpen(false)} title="Add New Skill">
            <div className="space-y-4">
              <Input label="Skill Name" placeholder="e.g., Python" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Proficiency Level</label>
                <select className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none">
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                  <option>Expert</option>
                </select>
              </div>
              <Input label="Years of Experience" placeholder="e.g., 3" type="number" />
            </div>
            <button className="btn-primary mt-6 w-full flex items-center justify-center gap-2">
              <Plus size={18} /> Add Skill
            </button>
          </Modal>
        )}

        {experienceOpen && (
          <Modal onClose={() => setExperienceOpen(false)} title="Add Work Experience">
            <div className="space-y-4">
              <Input label="Company Name" placeholder="e.g., Google" />
              <Input label="Role/Position" placeholder="e.g., Software Engineer" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Start Date" type="month" />
                <Input label="End Date" type="month" />
              </div>
              <Input label="Location" placeholder="e.g., San Francisco, CA" />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea 
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                  rows={3}
                  placeholder="Describe your role and achievements..."
                />
              </div>
            </div>
            <button className="btn-primary mt-6 w-full flex items-center justify-center gap-2">
              <Plus size={18} /> Add Experience
            </button>
          </Modal>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;

/* ================= COMPONENTS ================= */

interface ContactItemProps {
  icon: React.ReactNode;
  text: string;
  link?: boolean;
}

const ContactItem: React.FC<ContactItemProps> = ({ icon, text, link = false }) => (
  <div className={`flex items-center gap-3 text-slate-600 ${link ? 'text-slate-900 hover:text-slate-700 cursor-pointer' : ''}`}>
    <span className="text-slate-400">{icon}</span>
    <span className="text-sm">{text}</span>
  </div>
);

interface SocialButtonProps {
  icon: React.ReactNode;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon }) => (
  <button className="w-10 h-10 flex items-center justify-center border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-600">
    {icon}
  </button>
);

interface QuickStatProps {
  label: string;
  value: string;
  period: string;
}

const QuickStat: React.FC<QuickStatProps> = ({ label, value, period }) => (
  <div className="flex justify-between items-center">
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm text-slate-600 mt-0.5">{period}</p>
    </div>
    <p className="text-lg font-bold text-slate-900">{value}</p>
  </div>
);

const StatCard: React.FC<Stat> = ({ label, value, change, trend }) => (
  <div className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-md transition-shadow">
    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
    <p className={`text-xs mt-1.5 flex items-center gap-1 ${
      trend === 'up' ? 'text-emerald-600' : 'text-slate-500'
    }`}>
      {trend === 'up' && <ChevronRight size={12} className="rotate-[-90deg]" />}
      {change}
    </p>
  </div>
);

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  action?: () => void;
  actionLabel?: string;
}

const Section: React.FC<SectionProps> = ({ title, icon, children, action, actionLabel }) => (
  <div className="bg-white rounded-2xl border border-slate-200 p-6">
    <div className="flex justify-between items-center mb-5">
      <h3 className="font-bold text-slate-900 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {action && (
        <button 
          onClick={action}
          className="text-sm font-medium text-slate-900 hover:text-slate-700 flex items-center gap-1"
        >
          {actionLabel}
          <Plus size={16} />
        </button>
      )}
    </div>
    {children}
  </div>
);

const SkillCard: React.FC<Skill> = ({ name, level, years }) => {
  const getWidth = () => {
    switch (level) {
      case 'Expert': return '100%';
      case 'Advanced': return '75%';
      case 'Intermediate': return '50%';
      default: return '25%';
    }
  };

  return (
    <div className="border border-slate-200 p-4 rounded-lg hover:border-slate-300 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-slate-900">{name}</h4>
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{years}y</span>
      </div>
      <p className="text-sm text-slate-600">{level}</p>
      <div className="mt-3 bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div 
          className="bg-slate-900 h-full rounded-full" 
          style={{ width: getWidth() }}
        />
      </div>
    </div>
  );
};

interface ExperienceCardProps extends Experience {
  isLast: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ company, role, period, location, description, isLast }) => (
  <div className={`flex gap-4 ${!isLast ? 'pb-4 border-b border-slate-200' : ''}`}>
    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
      <Briefcase size={20} className="text-slate-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{role}</h4>
      <p className="text-sm text-slate-600 mt-0.5">{company} • {location}</p>
      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
        <Calendar size={12} />
        {period}
      </p>
      <p className="text-sm text-slate-700 mt-2 leading-relaxed">{description}</p>
    </div>
  </div>
);

interface EducationCardProps extends Education {
  isLast: boolean;
}

const EducationCard: React.FC<EducationCardProps> = ({ institution, degree, period, gpa, isLast }) => (
  <div className={`flex gap-4 ${!isLast ? 'pb-4 border-b border-slate-200' : ''}`}>
    <div className="flex-shrink-0 w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
      <GraduationCap size={20} className="text-slate-600" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900">{degree}</h4>
      <p className="text-sm text-slate-600 mt-0.5">{institution}</p>
      <div className="flex items-center gap-3 mt-1">
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Calendar size={12} />
          {period}
        </p>
        {gpa && <p className="text-xs text-slate-500">GPA: {gpa}</p>}
      </div>
    </div>
  </div>
);

const AchievementCard: React.FC<Achievement> = ({ title, org, date }) => (
  <div className="border border-slate-200 p-4 rounded-lg hover:border-slate-300 transition-colors flex gap-3">
    <div className="flex-shrink-0 w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
      <Award size={18} />
    </div>
    <div>
      <h4 className="font-semibold text-slate-900 text-sm">{title}</h4>
      <p className="text-xs text-slate-600 mt-0.5">{org}</p>
      <p className="text-xs text-slate-500 mt-1">{date}</p>
    </div>
  </div>
);

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-xl text-slate-900">{title}</h2>
        <button 
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
      {children}
    </div>
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
    <input 
      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
      {...props}
    />
  </div>
);