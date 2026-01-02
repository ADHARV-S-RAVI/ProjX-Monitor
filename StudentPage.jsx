import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Upload, 
  Trophy, 
  BarChart3, 
  LogOut, 
  Clock, 
  UserPlus, 
  Trash2, 
  FileText, 
  Github, 
  Video, 
  Presentation, 
  CheckCircle,
  AlertCircle,
  History,
  BookOpen,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FileWarning,
  Sparkles,
  Calendar,
  MessageSquare,
  Send,
  X,
  Loader2,
  Bot
} from 'lucide-react';

// --- GEMINI API SETUP ---
const apiKey = ""; // API Key will be injected by the environment
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

const callGeminiAPI = async (prompt, systemInstruction = "") => {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        }),
      }
    );

    if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please try again later.";
  }
};

// --- DATABASE FROM EXCEL SHEETS ---
const STUDENT_DATABASE = [
  { srn: "24SUUBECS0047", name: "ADHARV S RAVI", section: "3CSE01" },
  { srn: "24SUUBECS0045", name: "ADARSH SHUKLA", section: "3CSE01" },
  { srn: "24SUUBECS0046", name: "ADARSH V", section: "3CSE01" },
  { srn: "24SUUBECS0048", name: "ADITHI SRIKANTH SHASTRY", section: "3CSE01" },
  { srn: "24SUUBECS0049", name: "ADITHYA KARANTH S", section: "3CSE01" },
  { srn: "24SUUBECS0051", name: "ADITHYA N C", section: "3CSE01" },
  { srn: "24SUUBECS0001", name: "A MOHITH SANTOSH", section: "3CSE01" },
  { srn: "24SUUBELCS001", name: "ABHISHEK N J", section: "Lateral" },
  { srn: "24SUUBELCS002", name: "ADARSH B H", section: "Lateral" },
  { srn: "24SUUBELCS003", name: "AKASH GOWDA S", section: "Lateral" }
];

// --- CONSTANTS ---
const DEADLINE = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000); 

const SUBJECTS = ["Web Technology", "IOT", "OOP", "AIML"];

const SUBJECT_DETAILS = {
  "Web Technology": {
    faculty: "Prof. Vijayalakshmi H R",
    topic: "MERN Stack E-Commerce Platform",
    guidelines: [
      "Must use React for Frontend and Node/Express for Backend.",
      "Database must be MongoDB.",
      "Responsive UI (Tailwind CSS recommended).",
      "Include Authentication (JWT)."
    ]
  },
  "IOT": {
    faculty: "Prof. D S Rakesh Gowda",
    topic: "Smart Home Automation System",
    guidelines: [
      "Must use Arduino or Raspberry Pi.",
      "Sensors data must be logged to a cloud dashboard.",
      "Includes hardware demonstration.",
      "Mobile app control is mandatory."
    ]
  },
  "OOP": {
    faculty: "Prof. Prabodh CP",
    topic: "Bank Management System",
    guidelines: [
      "Language: Java or C++.",
      "Must demonstrate Inheritance, Polymorphism, and Encapsulation.",
      "File handling for data persistence.",
      "Console or GUI based interface."
    ]
  },
  "AIML": {
    faculty: "Dr. Bhagya Nair",
    topic: "Stock Price Prediction Model",
    guidelines: [
      "Language: Python.",
      "Libraries: Pandas, Scikit-learn, TensorFlow.",
      "Dataset must be pre-processed and cleaned.",
      "Minimum model accuracy: 85%."
    ]
  }
};

const MOCK_RANKINGS = [
  { rank: 1, team: "Alpha Squad", project: "AI Tutor", time: "2h ago" },
  { rank: 2, team: "Code Ninjas", project: "FinTech App", time: "5h ago" },
  { rank: 3, team: "Pixel Perfect", project: "AR Map", time: "1d ago" },
  { rank: 4, team: "Data Dynamos", project: "MediCare", time: "1d ago" },
  { rank: 5, team: "Cyber Sentinels", project: "NetGuard", time: "2d ago" },
];

const INITIAL_MARKS = {
  presentation: 18,
  assignment: 9,
  ppt: 9,
  report: 17,
  total: 53,
  maxTotal: 60
};

// --- COMPONENTS ---

const Navigation = ({ activeTab, setActiveTab, userName }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'team', label: 'Team Formation', icon: Users },
    { id: 'submissions', label: 'Submissions', icon: Upload },
    { id: 'marks', label: 'Marks', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: BarChart3 },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-lg">X</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-indigo-600 transition-colors">ProjX Monitor</span>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`${
                  activeTab === item.id
                    ? 'border-indigo-500 text-indigo-600 bg-indigo-50/50'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50'
                } inline-flex items-center px-3 pt-1 border-b-2 text-sm font-medium h-full transition-all duration-200`}
              >
                <item.icon className={`w-4 h-4 mr-2 ${activeTab === item.id ? 'animate-bounce' : ''}`} style={{ animationDuration: '2s' }} />
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200 cursor-pointer hover:bg-indigo-200 transition-colors shadow-sm">
               {userName.charAt(0)}
             </div>
            <button className="p-2 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// --- GEMINI AI ASSISTANT COMPONENT ---
const AIAssistant = ({ selectedSubject, topic, guidelines, isOpen, setIsOpen, initialPrompt }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: `Hi! I'm your ProjX Mentor for ${selectedSubject}. How can I help you with "${topic}" today?` }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle initial prompt from external buttons (like "Generate Roadmap")
  useEffect(() => {
    if (isOpen && initialPrompt) {
        handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  const handleSend = async (text = input) => {
    if (!text.trim()) return;

    const newMessages = [...messages, { role: 'user', text }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    const systemContext = `
      You are an expert academic mentor for a Computer Science student project.
      Current Subject: ${selectedSubject}
      Project Topic: ${topic}
      Mandatory Guidelines: ${guidelines.join(". ")}
      
      Your goal is to help the student structure their project, suggest technologies, fix code concepts, or draft documentation.
      Keep answers concise, encouraging, and technically accurate. Use formatting like bullet points for clarity.
    `;

    const aiResponse = await callGeminiAPI(text, systemContext);

    setMessages([...newMessages, { role: 'assistant', text: aiResponse }]);
    setIsLoading(false);
  };

  // Quick Action Prompts
  const suggestions = [
    { label: "Generate Roadmap", prompt: "Create a 4-week project roadmap for my topic." },
    { label: "Draft Abstract", prompt: "Write a professional project abstract for my topic." },
    { label: "Tech Stack", prompt: "What are the best libraries/tools to use for this project?" }
  ];

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 z-50 flex items-center justify-center group"
    >
      <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:animate-ping"></div>
      <Sparkles className="w-6 h-6 animate-pulse" />
      <span className="absolute -top-10 right-0 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Ask AI Mentor
      </span>
    </button>
  );

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 rounded-t-2xl flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-bold text-sm">ProjX AI Mentor</h3>
            <p className="text-[10px] opacity-80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online • {selectedSubject}
            </p>
          </div>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span className="text-xs text-gray-500">Thinking...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-none">
          {suggestions.map((s) => (
            <button 
              key={s.label}
              onClick={() => handleSend(s.prompt)}
              className="flex-shrink-0 bg-indigo-50 text-indigo-700 text-xs px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 transition-colors whitespace-nowrap"
            >
              ✨ {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex items-center gap-2"
        >
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for help..."
            className="flex-1 bg-gray-100 text-gray-900 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit" 
            disabled={isLoading || !input.trim()}
            className="bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};


const WelcomeBanner = ({ userName }) => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-2xl p-8 mb-6 text-white relative overflow-hidden shadow-2xl hover:scale-[1.01] transition-transform duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mt-10 -mr-10 animate-pulse"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-indigo-300 mb-2 font-medium">
          <Sparkles className="w-4 h-4" />
          <span>{greeting}, Student</span>
        </div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Welcome back, {userName}</h1>
        <p className="text-gray-300 max-w-xl">
          You are on track with your submissions. Check your team's progress and upcoming deadlines below.
        </p>
      </div>
    </div>
  );
};

const UserProfile = ({ currentUser }) => {
  // Mock Data for Profile - simulating past history
  const pastTeams = [
    { id: 1, semester: "2nd Sem", subject: "Data Structures", team: "StructBuilders", role: "Member", status: "Completed" },
    { id: 2, semester: "1st Sem", subject: "Design Thinking", team: "Innovators", role: "Lead", status: "Completed" },
    { id: 3, semester: "1st Sem", subject: "Python Programming", team: "PyCoders", role: "Member", status: "Completed" },
  ];

  const activityHistory = [
    { id: 1, action: "Logged in", time: "Just now", icon: UserPlus },
    { id: 2, action: "Submitted Abstract", time: "Yesterday, 4:00 PM", icon: FileText },
    { id: 3, action: "Joined Team 'Alpha Squad'", time: "2 days ago", icon: Users },
    { id: 4, action: "Updated Profile", time: "1 week ago", icon: Briefcase },
  ];

  const lastSubmission = {
    title: "Eco-Friendly Smart Bin",
    subject: "Design Thinking",
    date: "May 15, 2024",
    grade: "A+",
    feedback: "Excellent prototype and documentation."
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-700 border-4 border-white shadow-md">
          {currentUser.name.charAt(0)}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-bold text-gray-900">{currentUser.name}</h2>
          <div className="flex flex-col md:flex-row gap-4 mt-2 text-sm text-gray-500 justify-center md:justify-start">
            <span className="flex items-center gap-1"><Briefcase className="w-4 h-4"/> SRN: {currentUser.srn}</span>
            <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4"/> Section: {currentUser.section}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> Sem: 3rd</span>
          </div>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors">Edit Profile</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Last Project Submission */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <FileText className="w-5 h-5 text-indigo-600" /> Last Project Submission
           </h3>
           <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                   <h4 className="font-bold text-indigo-900">{lastSubmission.title}</h4>
                   <p className="text-sm text-indigo-600">{lastSubmission.subject}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">{lastSubmission.grade}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Submitted on: {lastSubmission.date}</p>
              <div className="text-sm text-gray-700 bg-white/60 p-3 rounded-lg border border-indigo-50 italic">
                 "{lastSubmission.feedback}"
              </div>
           </div>
        </div>

        {/* My History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <History className="w-5 h-5 text-orange-500" /> Recent Activity
           </h3>
           <div className="space-y-4">
              {activityHistory.map((item) => (
                <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                   <div className="p-2 bg-gray-50 rounded-full text-gray-500">
                      <item.icon className="w-4 h-4" />
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{item.action}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Past Team Formation */}
        <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
           <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
             <Users className="w-5 h-5 text-blue-600" /> Past Team Formations
           </h3>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm">
               <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                 <tr>
                   <th className="px-4 py-3">Semester</th>
                   <th className="px-4 py-3">Subject</th>
                   <th className="px-4 py-3">Team Name</th>
                   <th className="px-4 py-3">Role</th>
                   <th className="px-4 py-3">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {pastTeams.map((team) => (
                   <tr key={team.id} className="hover:bg-gray-50">
                     <td className="px-4 py-3 font-medium text-gray-900">{team.semester}</td>
                     <td className="px-4 py-3 text-gray-600">{team.subject}</td>
                     <td className="px-4 py-3 text-indigo-600 font-medium">{team.team}</td>
                     <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded-full border ${team.role === 'Lead' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-gray-50 text-gray-700 border-gray-100'}`}>
                          {team.role}
                        </span>
                     </td>
                     <td className="px-4 py-3 text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> {team.status}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

const DueTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const difference = DEADLINE - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-100 mb-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
             <Clock className="w-8 h-8 text-indigo-600" />
          </div>
          <div>
             <h2 className="text-xl font-bold text-gray-900">Final Submission Deadline</h2>
             <p className="text-gray-500 text-sm">Time remaining to upload all deliverables</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center">
              <div className="bg-gray-900 text-white rounded-lg w-16 h-16 flex items-center justify-center text-2xl font-bold font-mono shadow-md group-hover:bg-indigo-600 transition-colors duration-300">
                {value}
              </div>
              <span className="text-xs uppercase font-semibold text-gray-500 mt-2 tracking-wide">{unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TeamFormation = ({ currentUser, selectedSubject, setSelectedSubject, onOpenAI }) => {
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([
    { id: 1, name: currentUser.name, identifier: currentUser.srn, isLead: true }
  ]);
  const [newSrn, setNewSrn] = useState("");
  const [addError, setAddError] = useState("");
  const [projectType, setProjectType] = useState("Group");

  const addMember = () => {
    setAddError("");
    if (!newSrn) return;
    if (projectType === "Individual") {
        setAddError("Individual projects cannot have multiple members.");
        return;
    }
    if (members.length >= 4) {
        setAddError("Max team size (4) reached.");
        return;
    }
    const student = STUDENT_DATABASE.find(s => s.srn.toUpperCase() === newSrn.toUpperCase());
    if (student) {
        if (members.some(m => m.identifier === student.srn)) {
            setAddError("Student already in team.");
            return;
        }
        setMembers([...members, { id: Date.now(), name: student.name, identifier: student.srn, isLead: false }]);
        setNewSrn("");
    } else {
        setAddError("SRN not found in university database.");
    }
  };

  const removeMember = (id) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const subjectInfo = SUBJECT_DETAILS[selectedSubject];

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Project Setup Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
             <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                <BookOpen className="w-5 h-5 text-indigo-600" /> Subject & Project Type
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Subject</label>
                    <div className="relative">
                      <select 
                          value={selectedSubject} 
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="w-full rounded-lg border-gray-300 border p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm outline-none appearance-none cursor-pointer"
                      >
                          {SUBJECTS.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                      </select>
                      <Briefcase className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none"/>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Mode</label>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button 
                            onClick={() => setProjectType("Individual")}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                                projectType === "Individual" 
                                ? "bg-white text-indigo-600 shadow-sm transform scale-105" 
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Individual
                        </button>
                        <button 
                            onClick={() => setProjectType("Group")}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                                projectType === "Group" 
                                ? "bg-white text-indigo-600 shadow-sm transform scale-105" 
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            Group
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Dynamic Teacher & Guidelines Card */}
        {subjectInfo && (
           <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-indigo-600" /> Course Guidelines & Allocation
                </h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Course Faculty</p>
                      <p className="text-lg font-bold text-indigo-900">{subjectInfo.faculty}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Allotted Topic</p>
                      <p className="text-lg font-bold text-indigo-700">{subjectInfo.topic}</p>
                  </div>
                </div>

                <div className="bg-white/60 rounded-lg p-4 border border-blue-100 mb-4">
                  <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                      <FileWarning className="w-4 h-4 text-orange-500"/> Mandatory Guidelines
                  </p>
                  <ul className="space-y-2">
                      {subjectInfo.guidelines.map((guide, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0"></span>
                            {guide}
                        </li>
                      ))}
                  </ul>
                </div>
                
                {/* AI Feature Integration */}
                <button 
                  onClick={() => onOpenAI("Create a detailed weekly project roadmap for my topic: " + subjectInfo.topic)}
                  className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold group"
                >
                  <Sparkles className="w-5 h-5 group-hover:animate-spin" />
                  Generate AI Project Roadmap
                </button>
              </div>
           </div>
        )}

        {/* Team Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Team Composition
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Team Name</label>
            <input 
              type="text" 
              value={teamName}
              placeholder={projectType === "Individual" ? `${currentUser.name}'s Project` : "Enter Creative Team Name"}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          <div className="space-y-4">
             <div className="flex justify-between items-center">
                 <label className="block text-sm font-semibold text-gray-700">Add Team Members</label>
                 {projectType === "Individual" && (
                     <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 animate-pulse">Individual Mode Active</span>
                 )}
             </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Search by SRN (e.g., 24SUUBECS0045)"
                value={newSrn}
                disabled={projectType === "Individual"}
                onChange={(e) => setNewSrn(e.target.value)}
                className="flex-1 rounded-lg border-gray-300 border p-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
              />
              <button 
                onClick={addMember}
                disabled={projectType === "Individual"}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm shadow-sm active:transform active:scale-95"
              >
                <UserPlus className="w-4 h-4" /> Add Member
              </button>
            </div>
            {addError && <p className="text-sm text-red-500 flex items-center gap-1 animate-bounce"><AlertCircle className="w-3 h-3" /> {addError}</p>}
          </div>

          <div className="mt-6 space-y-3">
             <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Roster ({members.length}/4)</h4>
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:border-indigo-300 hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${member.isLead ? 'bg-indigo-600 text-white' : 'bg-white border-2 border-indigo-100 text-indigo-600'}`}>
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center gap-2 text-sm">
                        {member.name}
                        {member.isLead && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200 font-bold">LEAD</span>}
                    </p>
                    <p className="text-xs text-gray-500">{member.identifier}</p>
                  </div>
                </div>
                {!member.isLead && (
                    <button 
                    onClick={() => removeMember(member.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                    >
                    <Trash2 className="w-4 h-4" />
                    </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar - Quick Guidelines */}
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 shadow-sm sticky top-24">
          <h4 className="text-blue-900 font-bold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" /> Quick Tips
          </h4>
          <ul className="text-sm text-blue-800 space-y-3 opacity-90">
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/> Select your subject first to see specific topic allocations.</li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/> Ensure all team members belong to Section 3CSE01.</li>
            <li className="flex gap-2"><CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5"/> SRNs are validated against the university database.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProjectSubmission = ({ selectedSubject }) => {
  const [history, setHistory] = useState([
    { id: 1, action: "Assignment Uploaded", timestamp: "Oct 10, 2:30 PM", status: "Verified" },
    { id: 2, action: "Report Draft 1", timestamp: "Nov 02, 10:15 AM", status: "Pending" }
  ]);

  const submissionTypes = [
    { label: "Final Report", icon: FileText, desc: "PDF Format only" },
    { label: "PPT Presentation", icon: Presentation, desc: "Max 15 slides" },
    { label: "Demo Video", icon: Video, desc: "MP4, Max 5 mins" },
    { label: "GitHub Repo", icon: Github, desc: "Public link" },
  ];

  const handleSimulateUpload = (type) => {
    const newEntry = {
      id: Date.now(),
      action: `${type} Updated`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
      status: "Submitted"
    };
    setHistory([newEntry, ...history]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="lg:col-span-2 space-y-6">
         <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 rounded-xl text-white flex items-center justify-between shadow-lg">
            <div>
               <p className="text-xs font-bold text-indigo-100 uppercase tracking-wider mb-1">Current Workspace</p>
               <h3 className="text-2xl font-bold flex items-center gap-2">{selectedSubject} <span className="text-xs bg-white/20 px-2 py-1 rounded">Active</span></h3>
            </div>
            <div className="h-12 w-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Upload className="w-6 h-6 text-white"/>
            </div>
         </div>

        <div className="grid md:grid-cols-2 gap-4">
          {submissionTypes.map((item) => (
            <div key={item.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group transform hover:-translate-y-1 duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white rounded-lg text-indigo-600 transition-colors duration-300">
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">Required</span>
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">{item.label}</h3>
              <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
              <button 
                onClick={() => handleSimulateUpload(item.label)}
                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 group-hover:border-indigo-500 group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-all flex items-center justify-center gap-2 text-sm font-bold"
              >
                <Upload className="w-4 h-4" /> Click to Upload
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit sticky top-24">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-600" /> Recent Activity
        </h3>
        <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
          {history.map((item) => (
            <div key={item.id} className="ml-6 relative group">
              <div className="absolute -left-[31px] bg-white border-2 border-indigo-100 rounded-full p-1 group-hover:border-indigo-500 transition-colors">
                <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full group-hover:scale-125 transition-transform"></div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">{item.action}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.timestamp}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                  item.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MarksTracking = () => {
  const cards = [
    { title: "Presentation", score: INITIAL_MARKS.presentation, total: 20, icon: Presentation, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Assignment", score: INITIAL_MARKS.assignment, total: 10, icon: FileText, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "PPT Design", score: INITIAL_MARKS.ppt, total: 10, icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Final Report", score: INITIAL_MARKS.report, total: 20, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="bg-indigo-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mt-10 -mr-10 group-hover:opacity-10 transition-opacity duration-700"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Total Score</h2>
          <p className="text-indigo-200 font-medium">Excellent performance! You are in the top 10%.</p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center justify-center relative z-10">
          <div className="relative w-32 h-32 hover:scale-110 transition-transform duration-300">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-indigo-800"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-white drop-shadow-md"
                strokeDasharray={`${(INITIAL_MARKS.total / INITIAL_MARKS.maxTotal) * 100}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="text-3xl font-bold">{INITIAL_MARKS.total}</span>
              <span className="text-xs block opacity-70 font-medium">/ {INITIAL_MARKS.maxTotal}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.title} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 rounded-full ${card.bg} ${card.color} mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
              <card.icon className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-600 mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900">{card.score} <span className="text-sm text-gray-400 font-normal">/ {card.total}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Leaderboard = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
    <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <Trophy className="w-5 h-5 text-yellow-500" /> Live Rankings
      </h3>
      <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span> Live
      </span>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4">Rank</th>
            <th className="px-6 py-4">Team Name</th>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4 text-right">Submission</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {MOCK_RANKINGS.map((team, idx) => (
            <tr key={team.rank} className="hover:bg-gray-50 transition-colors group cursor-default">
              <td className="px-6 py-4">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold shadow-sm transition-transform group-hover:scale-110 ${
                  team.rank === 1 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                  team.rank === 2 ? 'bg-gray-200 text-gray-700 border border-gray-300' :
                  team.rank === 3 ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'text-gray-500 bg-gray-50'
                }`}>
                  {team.rank}
                </span>
              </td>
              <td className="px-6 py-4 font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{team.team}</td>
              <td className="px-6 py-4 text-gray-500">{team.project}</td>
              <td className="px-6 py-4 text-right text-gray-400 font-mono text-xs">{team.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- Main App Component ---

const StudentPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedSubject, setSelectedSubject] = useState("Web Technology");
  
  // AI State
  const [isAIRequestOpen, setIsAIRequestOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState("");
  
  // Set Default User to Adharv (Index 0 in our mock DB subset)
  const [currentUser, setCurrentUser] = useState(STUDENT_DATABASE[0]);

  const handleOpenAI = (prompt = "") => {
    setAiInitialPrompt(prompt);
    setIsAIRequestOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'team':
        return <TeamFormation currentUser={currentUser} selectedSubject={selectedSubject} setSelectedSubject={setSelectedSubject} onOpenAI={handleOpenAI} />;
      case 'submissions':
        return <ProjectSubmission selectedSubject={selectedSubject} />;
      case 'marks':
        return <MarksTracking />;
      case 'profile':
        return <UserProfile currentUser={currentUser} />;
      case 'dashboard':
      default:
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <WelcomeBanner userName={currentUser.name} />
            <DueTimer />
            <div className="grid lg:grid-cols-2 gap-6">
               <div className="flex flex-col gap-6">
                   <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 flex justify-between items-center">
                        Submission Status
                        <span className="text-xs font-medium bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
                           {selectedSubject}
                        </span>
                      </h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center pb-4 border-b border-gray-100 group">
                            <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Phase 1: Abstract</span>
                            <span className="text-green-600 font-bold text-sm flex items-center gap-1 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-4 h-4"/> Done</span>
                          </div>
                          <div className="flex justify-between items-center pb-4 border-b border-gray-100 group">
                            <span className="text-gray-600 font-medium group-hover:text-gray-900 transition-colors">Phase 2: Design Doc</span>
                            <span className="text-green-600 font-bold text-sm flex items-center gap-1 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-4 h-4"/> Done</span>
                          </div>
                          <div className="flex justify-between items-center group">
                            <span className="text-gray-900 font-bold">Phase 3: Final Report</span>
                            <span className="text-orange-600 font-bold text-sm flex items-center gap-1 bg-orange-50 px-2 py-1 rounded animate-pulse"><Clock className="w-4 h-4"/> Pending</span>
                          </div>
                      </div>
                   </div>
               </div>
               <Leaderboard />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-900 selection:bg-indigo-100 selection:text-indigo-900 pb-12">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} userName={currentUser.name} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Only show breadcrumb style header on sub-pages */}
        {activeTab !== 'dashboard' && (
           <div className="mb-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <h1 className="text-3xl font-bold text-gray-900 capitalize tracking-tight flex items-center gap-2">
              {activeTab.replace('-', ' ')}
            </h1>
            <p className="text-base text-gray-500 mt-1">
               {activeTab === 'team' ? 'Configure your project parameters and assemble your team.' : 
                activeTab === 'profile' ? 'View your personal academic history and status.' :
                `Manage your ${activeTab} details.`}
            </p>
          </div>
        )}

        {renderContent()}
      </main>

      {/* Global AI Assistant - Persistent across all tabs */}
      <AIAssistant 
        selectedSubject={selectedSubject}
        topic={SUBJECT_DETAILS[selectedSubject].topic}
        guidelines={SUBJECT_DETAILS[selectedSubject].guidelines}
        isOpen={isAIRequestOpen}
        setIsOpen={setIsAIRequestOpen}
        initialPrompt={aiInitialPrompt}
      />
    </div>
  );
};

export default StudentPage;