import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Filter, 
  Download, 
  Calendar, 
  Clock, 
  Search, 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Plus,
  Save,
  Menu,
  X,
  ChevronDown,
  Edit3,
  Send,
  UserPlus,
  Eye,
  ArrowLeft,
  Sparkles,
  Loader2
} from 'lucide-react';

// --- Mock Data & Parsed CSV Data ---

const SUBJECTS = [
  { id: 'sub1', name: 'Web Technology' },
  { id: 'sub2', name: 'Internet of Things (IoT)' },
  { id: 'sub3', name: 'Object Oriented Programming (OOP)' },
];

const CLASSES = [
  { id: 'c1', name: '3CSE01', advisor: 'Vivek Sharma', students: 60 },
  { id: 'c2', name: '3CSE02', advisor: 'Jane Doe', students: 58 },
  { id: 'c3', name: '3AIML01', advisor: 'Alan Turing', students: 62 },
];

// Comprehensive Student List
const STUDENTS_3CSE01 = [
  { srn: '24SUUBECS0001', name: 'A MOHITH SANTOSH' },
  { srn: '24SUUBECS0002', name: 'A P PRAJWAL GOWDA' },
  { srn: '24SUUBECS0003', name: 'A ROHIT KUMAR' },
  { srn: '24SUUBECS0006', name: 'AAJAY SURYAA' },
  { srn: '24SUUBECS0007', name: 'AASHISH RANJAN' },
  { srn: '24SUUBECS0008', name: 'AASATIK TARAKESHWAR SINGH' },
  { srn: '24SUUBECS0045', name: 'ADARSH SHUKLA' },
  { srn: '24SUUBECS0046', name: 'ADARSH V' },
  { srn: '24SUUBECS0047', name: 'ADHARV S RAVI' },
  { srn: '24SUUBECS0048', name: 'ADITHI SRIKANTH SHASTRY' },
  { srn: '24SUUBECS0049', name: 'ADITHYA KARANTH S' },
  { srn: '24SUUBECS0050', name: 'ADITHYA M' },
  { srn: '24SUUBECS0051', name: 'ADITHYA N C' },
  { srn: '24SUUBECS0052', name: 'ADITHYA N S' },
  { srn: '24SUUBECS0053', name: 'ADITHYARAVI' },
  { srn: '24SUUBECS1272', name: 'N SHASHANK GOWDA' },
  { srn: '24SUUBECS1274', name: 'N VISHAL' },
  { srn: '24SUUBECS1970', name: 'SHIV SHANKAR A' },
  { srn: '24SUUBECS2383', name: 'VARUN SURYA M' },
  { srn: '24SUUBELCS001', name: 'ABHISHEK N J' },
  { srn: '24SUUBELCS002', name: 'ADARSH B H' },
  { srn: '24SUUBELCS003', name: 'AKASH GOWDA S' },
  { srn: '24SUUBELCS004', name: 'AKASH H' },
  { srn: '24SUUBELCS005', name: 'AMRUTHA C N' },
  { srn: '24SUUBELCS006', name: 'ARPITHA' },
  { srn: '24SUUBELCS007', name: 'BALARAM B' },
  { srn: '24SUUBELCS008', name: 'BHAGYASHREE L' },
  { srn: '24SUUBELCS009', name: 'BHAVAN T' },
  { srn: '24SUUBELCS010', name: 'BHAVYA BADAMALLANAVAR' },
  { srn: '24SUUBELCS074', name: 'SANTOSHA' },
  { srn: '24SUUBELCS075', name: 'SHADRACH S' },
  { srn: '24SUUBELCS076', name: 'SHANKARA KRISHNA CHAVAN' },
  { srn: '24SUUBELCS077', name: 'SAMARTH KUMAR P V' },
  { srn: '24SUUBELCS078', name: 'SHARATH N' },
  { srn: '24SUUBELCS079', name: 'SHASHIDHAR D R' },
  { srn: '24SUUBELCS080', name: 'SHASHIDHAR R N' },
  { srn: '24SUUBELCS081', name: 'SHASHWATH B L' },
  { srn: '24SUUBELCS082', name: 'SHRIHARI D G' },
  { srn: '24SUUBELCS083', name: 'SRINIVAS V' }
];

const INITIAL_TEAMS = [
  {
    id: 101,
    name: 'Team Alpha',
    projectTitle: 'IoT Home Automation',
    submissionDate: '2023-11-10T14:30:00',
    members: [
      { name: 'A MOHITH SANTOSH', srn: '24SUUBECS0001', email: 'mohith@uni.edu' },
      { name: 'A P PRAJWAL GOWDA', srn: '24SUUBECS0002', email: 'prajwal@uni.edu' }
    ],
    marks: { presentation: 18, assignment: 9, ppt: 8, report: 15, project: 40 },
    status: { presentation: true, assignment: true, ppt: true, report: true, project: true },
    projectStatus: 'Completed'
  },
  {
    id: 102,
    name: 'Team Beta',
    projectTitle: 'E-Commerce React App',
    submissionDate: '2023-11-15T09:00:00',
    members: [
      { name: 'ABHISHEK N J', srn: '24SUUBELCS001', email: 'abhishek@uni.edu' },
      { name: 'ADARSH B H', srn: '24SUUBELCS002', email: 'adarsh@uni.edu' }
    ],
    marks: { presentation: 15, assignment: 8, ppt: 0, report: 0, project: 0 },
    status: { presentation: true, assignment: true, ppt: false, report: false, project: false },
    projectStatus: 'Pending Report'
  },
];

const INITIAL_REQUESTS = [
  { 
    id: 1, 
    teamName: 'Team Gamma', 
    title: 'Blockchain Voting System', 
    subject: 'Web Technology', 
    class: '3CSE01', 
    membersCount: 2, 
    members: [
      { name: 'AKASH GOWDA S', srn: '24SUUBELCS003' }, 
      { name: 'AKASH H', srn: '24SUUBELCS004' }
    ] 
  },
];

// --- Gemini Helper ---
const callGemini = async (prompt) => {
  // NOTE: For this demo to work in your environment, you must add an API Key here.
  const apiKey = ""; 
  
  if (!apiKey) {
      alert("Please add a Gemini API Key in the code (const apiKey = '...') to use AI features!");
      return "API Key Missing in Code.";
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    
    if (!response.ok) throw new Error('Gemini API Error');
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate content.";
  } catch (error) {
    console.error("Gemini Error", error);
    return "Error connecting to AI service.";
  }
};

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors ${
      active 
        ? 'bg-indigo-50 text-indigo-700 font-medium' 
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`}
  >
    <div className="flex items-center gap-3">
      <Icon size={20} />
      <span>{label}</span>
    </div>
    {badge && (
      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function TeacherDashboard() {
  // --- State ---
  const [activeView, setActiveView] = useState('dashboard'); 
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [viewMode, setViewMode] = useState('teams'); 
  
  // Data State
  const [teams, setTeams] = useState(INITIAL_TEAMS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [publishedProjects, setPublishedProjects] = useState([]);
  
  // UI State
  const [selectedTeam, setSelectedTeam] = useState(null); 
  const [showMarksConfig, setShowMarksConfig] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [deadline, setDeadline] = useState(new Date('2023-11-20'));
  
  // AI State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [generatedFeedback, setGeneratedFeedback] = useState('');

  // Publish Project Form State
  const [newProject, setNewProject] = useState({ title: '', type: 'Team', deadline: '', description: '', targetClass: '3CSE01' });

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [studentSearch, setStudentSearch] = useState('');

  // Marks Configuration Defaults
  const [marksConfig, setMarksConfig] = useState({
    presentation: 20,
    assignment: 10,
    ppt: 10,
    report: 20,
    project: 40
  });

  // --- Logic & Helpers ---

  // AI: Generate Project Description
  const handleAiGenerateDescription = async () => {
    if (!newProject.title) {
      alert("Please enter a project title first.");
      return;
    }
    setIsAiLoading(true);
    const prompt = `You are a professor. Create a concise, professional project description (max 60 words) and 3 key technical requirements for a university course project on "${selectedSubject?.name || 'Computer Science'}" titled "${newProject.title}".`;
    const text = await callGemini(prompt);
    setNewProject(prev => ({ ...prev, description: text }));
    setIsAiLoading(false);
  };

  // AI: Generate Team Feedback
  const handleAiGenerateFeedback = async () => {
    if (!selectedTeam) return;
    setIsAiLoading(true);
    const total = calculateTotal(selectedTeam.marks);
    const max = calculateTotal(marksConfig);
    const prompt = `You are a strict but fair university professor. Generate a concise, constructive feedback summary (max 2 sentences) for a student team named "${selectedTeam.name}" working on "${selectedTeam.projectTitle}". 
    Their scores: Presentation: ${selectedTeam.marks.presentation}/${marksConfig.presentation}, Assignment: ${selectedTeam.marks.assignment}/${marksConfig.assignment}, Total: ${total}/${max}.
    If scores are low (<60%), suggest specific improvements. If high (>85%), congratulate them specifically on their strong points.`;
    
    const text = await callGemini(prompt);
    setGeneratedFeedback(text);
    setIsAiLoading(false);
  };

  const getStudentTeamInfo = (srn) => {
    const team = teams.find(t => t.members.some(m => m.srn === srn));
    return team ? { name: team.name, id: team.id } : null;
  };

  const handleMarkChange = (teamId, field, value) => {
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), marksConfig[field]); 
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          marks: { ...team.marks, [field]: numValue },
          status: { ...team.status, [field]: true } 
        };
      }
      return team;
    }));
  };

  const handleCheckToggle = (teamId, field) => {
    setTeams(prev => prev.map(team => {
      if (team.id === teamId) {
        const newStatus = !team.status[field];
        return {
          ...team,
          status: { ...team.status, [field]: newStatus },
        };
      }
      return team;
    }));
  };

  const handleRequestAction = (id, action) => {
    const request = requests.find(r => r.id === id);
    setRequests(prev => prev.filter(req => req.id !== id));
    
    if (action === 'approve' && request) {
        const duplicateMembers = request.members.filter(m => getStudentTeamInfo(m.srn));
        
        if (duplicateMembers.length > 0) {
            alert(`Cannot approve. ${duplicateMembers.map(m => m.name).join(', ')} are already in a team.`);
            return; 
        }

        const newTeam = {
            id: Date.now(),
            name: request.teamName,
            projectTitle: request.title,
            submissionDate: null,
            members: request.members.map(m => ({ ...m, email: `${m.srn.toLowerCase()}@uni.edu` })), 
            marks: { presentation: 0, assignment: 0, ppt: 0, report: 0, project: 0 },
            status: { presentation: false, assignment: false, ppt: false, report: false, project: false },
            projectStatus: 'Pending Presentation'
        };
        setTeams(prev => [...prev, newTeam]);
    }
  };

  const handlePublishProject = () => {
      if (!newProject.title || !newProject.deadline) return;
      setPublishedProjects([...publishedProjects, { ...newProject, id: Date.now() }]);
      setDeadline(new Date(newProject.deadline)); 
      setShowPublishModal(false);
      setNewProject({ title: '', type: 'Team', deadline: '', description: '', targetClass: '3CSE01' });
  };

  const calculateTotal = (marks) => {
    return Object.values(marks).reduce((a, b) => a + b, 0);
  };

  const getDeadlineStatus = (submissionDate) => {
    if (!submissionDate) return { label: 'Not Submitted', color: 'text-slate-400 bg-slate-100' };
    const submit = new Date(submissionDate);
    const dead = new Date(deadline);
    
    if (submit.toDateString() === dead.toDateString()) return { label: 'On Time', color: 'text-amber-600 bg-amber-50' };
    if (submit < dead) return { label: 'Early', color: 'text-emerald-600 bg-emerald-50' };
    return { label: 'Late Submission', color: 'text-rose-600 bg-rose-50' };
  };

  const daysRemaining = useMemo(() => {
    const now = new Date();
    const diffTime = deadline - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays;
  }, [deadline]);

  // --- Filtering Logic ---
  const filteredTeams = useMemo(() => {
    let result = [...teams];
    if (filterStatus !== 'All') {
      if (filterStatus === 'Completed') result = result.filter(t => t.projectStatus === 'Completed');
      else if (filterStatus === 'Pending') result = result.filter(t => t.projectStatus.includes('Pending'));
      else if (filterStatus === 'Late') {
         result = result.filter(t => {
             const s = getDeadlineStatus(t.submissionDate);
             return s.label === 'Late Submission';
         });
      }
    }

    if (sortBy === 'marksHigh') {
      result.sort((a, b) => calculateTotal(b.marks) - calculateTotal(a.marks));
    } else if (sortBy === 'submissionEarly') {
      result.sort((a, b) => new Date(a.submissionDate || '2099-01-01') - new Date(b.submissionDate || '2099-01-01'));
    }

    return result;
  }, [teams, filterStatus, sortBy, deadline]);

  const filteredStudents = useMemo(() => {
      return STUDENTS_3CSE01.filter(s => 
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) || 
        s.srn.toLowerCase().includes(studentSearch.toLowerCase())
      );
  }, [studentSearch]);


  // --- Render Functions ---

  const renderSelectionScreen = () => (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-100 p-4 rounded-full mb-6 text-indigo-600">
        <BookOpen size={48} />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Select Subject & Class</h2>
      <p className="text-slate-500 mb-8 max-w-md">Please select the academic subject and the specific section you wish to manage marks for.</p>
      
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
        <div className="space-y-3 text-left">
          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
          <div className="space-y-2">
            {SUBJECTS.map(sub => (
              <button 
                key={sub.id}
                onClick={() => setSelectedSubject(sub)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${selectedSubject?.id === sub.id ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
              >
                <span className={`font-medium ${selectedSubject?.id === sub.id ? 'text-indigo-700' : 'text-slate-700'}`}>{sub.name}</span>
                {selectedSubject?.id === sub.id && <CheckCircle2 className="text-indigo-600" size={20}/>}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 text-left">
          <label className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Class Section</label>
          <div className="space-y-2">
            {CLASSES.map(cls => (
              <button 
                key={cls.id}
                disabled={!selectedSubject}
                onClick={() => setSelectedClass(cls)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${selectedClass?.id === cls.id ? 'border-violet-500 bg-violet-50 shadow-md ring-1 ring-violet-500' : 'border-slate-200 bg-white hover:border-violet-300'} ${!selectedSubject ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className={`font-medium ${selectedClass?.id === cls.id ? 'text-violet-700' : 'text-slate-700'}`}>{cls.name}</span>
                {selectedClass?.id === cls.id && <CheckCircle2 className="text-violet-600" size={20}/>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTeamsTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
              <th className="p-4 w-48 sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Team / Details</th>
              <th className="p-4 text-center w-32">Present. ({marksConfig.presentation})</th>
              <th className="p-4 text-center w-32">Assign. ({marksConfig.assignment})</th>
              <th className="p-4 text-center w-32">PPT ({marksConfig.ppt})</th>
              <th className="p-4 text-center w-32">Report ({marksConfig.report})</th>
              <th className="p-4 text-center w-32">Project ({marksConfig.project})</th>
              <th className="p-4 text-center w-24">Total</th>
              <th className="p-4 text-center w-32">Deadline Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTeams.map(team => {
               const deadlineInfo = getDeadlineStatus(team.submissionDate);
               const totalScore = calculateTotal(team.marks);
               const maxScore = calculateTotal(marksConfig);
               
               return (
                <tr key={team.id} className="hover:bg-slate-50/80 group transition-colors">
                  {/* Team Info Column */}
                  <td className="p-4 sticky left-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-800">{team.name}</span>
                      <span className="text-xs text-slate-500 truncate max-w-[160px]">{team.projectTitle}</span>
                      <button 
                        onClick={() => { setSelectedTeam(team); setGeneratedFeedback(''); }}
                        className="text-indigo-600 text-xs font-medium mt-1 hover:underline flex items-center gap-1 w-fit"
                      >
                        View Details <Users size={10} />
                      </button>
                    </div>
                  </td>

                  {/* Dynamic Marks Columns */}
                  {['presentation', 'assignment', 'ppt', 'report', 'project'].map((field) => (
                    <td key={field} className="p-4 text-center">
                       <div className="flex flex-col items-center gap-2">
                         <input 
                           type="checkbox"
                           checked={team.status[field]}
                           onChange={() => handleCheckToggle(team.id, field)}
                           className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                         />
                         <div className="relative w-16">
                           <input 
                             type="number" 
                             value={team.marks[field]}
                             onChange={(e) => handleMarkChange(team.id, field, e.target.value)}
                             className={`w-full text-center text-sm p-1 rounded border outline-none focus:ring-2 focus:ring-indigo-200 transition-all ${team.marks[field] > 0 ? 'border-indigo-300 bg-indigo-50 font-semibold text-indigo-700' : 'border-slate-200 bg-white text-slate-400'}`}
                           />
                         </div>
                       </div>
                    </td>
                  ))}

                  {/* Total */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center">
                      <span className={`text-base font-bold ${totalScore > (maxScore * 0.7) ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {totalScore}
                      </span>
                      <span className="text-xs text-slate-400">/{maxScore}</span>
                    </div>
                  </td>

                  {/* Deadline Badge */}
                  <td className="p-4">
                    <div className="flex flex-col items-center gap-1">
                       <span className={`px-2 py-1 rounded-md text-xs font-bold border ${deadlineInfo.color} border-transparent`}>
                         {deadlineInfo.label}
                       </span>
                       <span className="text-[10px] text-slate-400 font-mono">
                         {team.submissionDate ? new Date(team.submissionDate).toLocaleDateString() : '--/--'}
                       </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filteredTeams.length === 0 && (
        <div className="p-12 text-center text-slate-400">
          <Search size={48} className="mx-auto mb-3 opacity-20" />
          <p>No teams found matching current filters.</p>
        </div>
      )}
    </div>
  );

  const renderStudentsList = () => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-700">Class Roster: 3CSE01</h3>
          <div className="relative">
             <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
             <input 
                type="text" 
                placeholder="Find student..." 
                className="pl-8 pr-3 py-1 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 w-64"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
             />
          </div>
      </div>
      <div className="overflow-y-auto flex-1">
        <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 sticky top-0 z-10">
            <tr>
                <th className="p-3 bg-slate-50">SRN</th>
                <th className="p-3 bg-slate-50">Student Name</th>
                <th className="p-3 bg-slate-50">Team Status</th>
                <th className="p-3 bg-slate-50 text-right">Action</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
            {filteredStudents.map((student) => {
                const teamInfo = getStudentTeamInfo(student.srn);
                const isUnassigned = !teamInfo;

                return (
                  <tr key={student.srn} className={`hover:bg-slate-50 ${isUnassigned ? 'bg-red-50/30' : ''}`}>
                  <td className="p-3 font-mono text-slate-600 text-xs">{student.srn}</td>
                  <td className="p-3 font-medium text-slate-800">{student.name}</td>
                  <td className="p-3">
                      {isUnassigned ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              <AlertCircle size={12} className="mr-1" /> Not Assigned
                          </span>
                      ) : (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                              <Users size={12} className="mr-1" /> {teamInfo.name}
                          </span>
                      )}
                  </td>
                  <td className="p-3 text-right">
                      <button className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-200">
                          <MoreHorizontal size={16} />
                      </button>
                  </td>
                  </tr>
                );
            })}
            </tbody>
        </table>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 gap-4">
        <div>
          {/* Breadcrumb Navigation - Clickable to go back */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <button 
                onClick={() => { setSelectedClass(null); setSelectedSubject(null); }}
                className="font-medium text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
            >
                {selectedSubject.name}
            </button>
            <ChevronRight size={14} />
            <button 
                onClick={() => setSelectedClass(null)}
                className="font-medium text-violet-600 hover:underline hover:text-violet-800 transition-colors"
            >
                {selectedClass.name}
            </button>
            <button 
                onClick={() => { setSelectedClass(null); setSelectedSubject(null); }}
                className="ml-2 text-xs bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 px-2 py-0.5 rounded border border-slate-200 transition-colors flex items-center gap-1"
                title="Switch Subject or Class"
            >
                <Edit3 size={10} /> Change
            </button>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Project Evaluation Board</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Send size={18} /> Publish New Project
          </button>
          <div className="bg-slate-100 p-1 rounded-lg flex">
            <button 
              onClick={() => setViewMode('teams')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'teams' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              View by Teams
            </button>
            <button 
              onClick={() => setViewMode('students')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${viewMode === 'students' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              View by Students
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Main Content: Table Area */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Filters & Actions Bar (Only show for Teams View) */}
          {viewMode === 'teams' && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="relative group">
                  <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm">
                    <Filter size={16} />
                    <span>{filterStatus === 'All' ? 'All Status' : filterStatus}</span>
                    <ChevronDown size={14} />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-10 p-1">
                    {['All', 'Completed', 'Pending', 'Late'].map(s => (
                      <button key={s} onClick={() => setFilterStatus(s)} className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 text-slate-700 rounded-md">{s}</button>
                    ))}
                  </div>
                </div>

                <select 
                  className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="default">Default Sort</option>
                  <option value="marksHigh">Highest Marks</option>
                  <option value="submissionEarly">Earliest Submission</option>
                </select>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                    onClick={() => setShowMarksConfig(true)}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                    <Settings size={16} />
                    Configure Marks
                </button>
                <button className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50">
                    <Download size={16} />
                    <span>Report</span>
                </button>
              </div>
            </div>
          )}

          {/* Dynamic View Switching */}
          {viewMode === 'teams' ? renderTeamsTable() : renderStudentsList()}

        </div>

        {/* Sidebar Widgets */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* Deadline Card */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
               <Clock className="text-rose-500" size={20} />
               <h3>Project Deadline</h3>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 text-center">
               <span className={`text-3xl font-black ${daysRemaining < 3 ? 'text-rose-600' : 'text-slate-700'}`}>
                 {daysRemaining > 0 ? daysRemaining : 0}
               </span>
               <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">Days Remaining</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-500 uppercase">Target Date</label>
              <div className="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg">
                <Calendar size={16} className="text-slate-400" />
                <input 
                  type="date" 
                  className="w-full outline-none text-sm text-slate-700 font-medium cursor-pointer"
                  value={deadline.toISOString().split('T')[0]}
                  onChange={(e) => setDeadline(new Date(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Published Projects */}
          {publishedProjects.length > 0 && (
            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 text-slate-800 font-bold mb-4">
                 <FileText className="text-indigo-500" size={20} />
                 <h3>Published Projects</h3>
              </div>
              <div className="space-y-3">
                 {publishedProjects.map(p => (
                   <div key={p.id} className="bg-slate-50 p-3 rounded border border-slate-100">
                      <div className="font-semibold text-sm text-slate-800">{p.title}</div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                         <span>{p.type}</span>
                         <span>Due: {new Date(p.deadline).toLocaleDateString()}</span>
                      </div>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-xl shadow-lg text-white">
            <h3 className="font-bold text-indigo-100 mb-4 border-b border-white/10 pb-2">Class Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-200">Total Students</span>
                <span className="font-bold text-xl">{STUDENTS_3CSE01.length}</span>
              </div>
               <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-200">Teams Formed</span>
                <span className="font-bold text-xl">{teams.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-indigo-200">Submitted</span>
                <span className="font-bold text-xl">{teams.filter(t => t.submissionDate).length}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modals */}
      {/* 1. Team Details & AI Feedback */}
      <Modal 
        isOpen={!!selectedTeam} 
        onClose={() => { setSelectedTeam(null); setGeneratedFeedback(''); }}
        title={selectedTeam ? `${selectedTeam.name} Details` : ''}
        maxWidth="max-w-2xl"
      >
         {selectedTeam && (
           <div className="space-y-6">
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Project Title</span>
                  <span className="text-slate-800 font-medium">{selectedTeam.projectTitle}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg">
                  <span className="text-xs text-slate-500 uppercase font-bold block mb-1">Class & Section</span>
                  <span className="text-slate-800 font-medium">{selectedSubject.name} - {selectedClass.name}</span>
                </div>
             </div>

             <div>
               <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                 <Users size={16} /> Team Members
               </h4>
               <div className="border rounded-lg overflow-hidden">
                 <table className="w-full text-sm text-left">
                   <thead className="bg-slate-100 text-slate-600 font-semibold">
                     <tr>
                       <th className="p-3">Name</th>
                       <th className="p-3">SRN</th>
                       <th className="p-3">Email</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y">
                     {selectedTeam.members.map((m, i) => (
                       <tr key={i} className="bg-white">
                         <td className="p-3 font-medium text-slate-800">{m.name}</td>
                         <td className="p-3 text-slate-600 font-mono">{m.srn}</td>
                         <td className="p-3 text-slate-500">{m.email || 'N/A'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
             
             <div className="pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-indigo-600 flex items-center gap-2">
                    <Sparkles size={16} /> AI Performance Analysis
                  </h4>
                  <button 
                    onClick={handleAiGenerateFeedback}
                    disabled={isAiLoading}
                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate AI Feedback
                  </button>
                </div>
                
                {generatedFeedback ? (
                  <div className="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-lg border border-indigo-100 text-sm text-slate-700 leading-relaxed shadow-sm animate-in fade-in zoom-in duration-300">
                    <span className="font-bold text-indigo-800 block mb-1">Feedback Generated:</span>
                    "{generatedFeedback}"
                  </div>
                ) : (
                  <div className="p-4 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 text-center bg-slate-50/50">
                     Click generate to analyze student performance based on current marks.
                  </div>
                )}
             </div>

             <div className="flex justify-end pt-2">
               <button onClick={() => setSelectedTeam(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">Close</button>
             </div>
           </div>
         )}
      </Modal>

      {/* 2. Marks Config */}
      <Modal
        isOpen={showMarksConfig}
        onClose={() => setShowMarksConfig(false)}
        title="Configure Scoring Rubric"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-500 bg-amber-50 text-amber-700 p-3 rounded border border-amber-100 flex items-start gap-2">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            Changing these values sets the maximum possible score for each category. Existing marks exceeding the new maximum will need manual adjustment.
          </p>
          <div className="grid grid-cols-1 gap-4">
             {Object.keys(marksConfig).map(key => (
               <div key={key} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                 <label className="capitalize font-medium text-slate-700">{key} Marks</label>
                 <input 
                    type="number"
                    className="w-20 p-2 border rounded-md text-center font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-200"
                    value={marksConfig[key]}
                    onChange={(e) => setMarksConfig({...marksConfig, [key]: parseInt(e.target.value) || 0})}
                 />
               </div>
             ))}
          </div>
          <div className="pt-4 flex justify-end">
            <button 
              onClick={() => setShowMarksConfig(false)} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Save size={16} /> Save Configuration
            </button>
          </div>
        </div>
      </Modal>

      {/* 3. Publish Project Modal with AI Description */}
      <Modal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        title="Publish New Project"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
              placeholder="e.g. Smart Traffic Management System"
              value={newProject.title}
              onChange={e => setNewProject({...newProject, title: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select 
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                value={newProject.type}
                onChange={e => setNewProject({...newProject, type: e.target.value})}
              >
                <option>Team</option>
                <option>Individual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
              <input 
                type="date" 
                className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                value={newProject.deadline}
                onChange={e => setNewProject({...newProject, deadline: e.target.value})}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <label className="block text-sm font-medium text-slate-700">Description & Requirements</label>
              <button 
                 onClick={handleAiGenerateDescription}
                 disabled={isAiLoading || !newProject.title}
                 className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                 title="Enter a title first to generate description"
              >
                {isAiLoading ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Auto-Generate Description
              </button>
            </div>
            <textarea 
              className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 h-32 resize-none text-sm leading-relaxed"
              placeholder="Instructions for students..."
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Target Class</label>
             <select className="w-full p-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" disabled>
                <option>3CSE01</option>
             </select>
             <p className="text-xs text-slate-400 mt-1">Currently selected class in dashboard.</p>
          </div>
          <div className="pt-4 flex justify-end gap-2">
            <button onClick={() => setShowPublishModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button 
              onClick={handlePublishProject} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <Send size={16} /> Publish to Class
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );

  const renderRequests = () => (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
       <div className="mb-6 flex justify-between items-center">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Project Requests</h2>
            <p className="text-slate-500">Review and approve new team formations and project titles.</p>
         </div>
       </div>

       <div className="space-y-4">
         {requests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 flex flex-col items-center text-center text-slate-400 shadow-sm border border-slate-200">
               <CheckCircle2 size={48} className="mb-4 text-emerald-100 fill-emerald-500" />
               <h3 className="text-lg font-medium text-slate-800">All Caught Up!</h3>
               <p>No pending project requests at the moment.</p>
            </div>
         ) : (
            requests.map(req => (
              <div key={req.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                 <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                       <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                          {req.teamName}
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">New Request</span>
                       </h3>
                       <div className="text-sm text-slate-500 mt-1">Proposed Title: <span className="font-medium text-slate-700">{req.title}</span></div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleRequestAction(req.id, 'reject')} className="px-4 py-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">Reject</button>
                        <button onClick={() => handleRequestAction(req.id, 'approve')} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">Approve & Create Team</button>
                    </div>
                 </div>
                 <div className="p-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Team Members ({req.members.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                       {req.members.map((m, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                {m.name.charAt(0)}
                             </div>
                             <div className="overflow-hidden">
                                <div className="text-sm font-medium text-slate-800 truncate">{m.name}</div>
                                <div className="text-xs text-slate-500 font-mono truncate">{m.srn}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>
            ))
         )}
       </div>
    </div>
  );

  const renderClasses = () => (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">My Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CLASSES.map(cls => (
                  <div key={cls.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group" onClick={() => { setActiveView('dashboard'); setSelectedClass(cls); setSelectedSubject(SUBJECTS[0]); }}>
                      <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <BookOpen size={24} />
                          </div>
                          <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{cls.students} Students</span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-1">{cls.name}</h3>
                      <p className="text-sm text-slate-500 mb-4">Advisor: {cls.advisor}</p>
                      <div className="flex items-center text-sm text-indigo-600 font-medium">
                          Manage Projects <ChevronRight size={16} />
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-xl z-20">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
            X
          </div>
          <span className="font-extrabold text-xl tracking-tight text-slate-800">ProjX <span className="text-indigo-600">Monitor</span></span>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-2">Main Menu</div>
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeView === 'dashboard'} 
            onClick={() => setActiveView('dashboard')} 
          />
          <SidebarItem 
            icon={FileText} 
            label="Project Requests" 
            active={activeView === 'requests'} 
            onClick={() => setActiveView('requests')} 
            badge={requests.length > 0 ? requests.length : null}
          />
          <SidebarItem icon={Users} label="Students" active={activeView === 'students'} onClick={() => setActiveView('students')} />
          <SidebarItem icon={BookOpen} label="Classes" active={activeView === 'classes'} onClick={() => setActiveView('classes')} />
          
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-6">System</div>
          <SidebarItem icon={Settings} label="Settings" onClick={() => {}} />
          <SidebarItem icon={LogOut} label="Logout" onClick={() => {}} />
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 border-2 border-white shadow-sm"></div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-slate-800 truncate">Prof. Anderson</p>
               <p className="text-xs text-slate-500 truncate">Admin Access</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white border-b z-30 p-4 flex justify-between items-center">
          <span className="font-bold text-lg">ProjX Monitor</span>
          <button className="text-slate-600"><Menu /></button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative">
         <div className="max-w-7xl mx-auto p-6 md:p-8 pt-20 md:pt-8 h-full">
            
            {activeView === 'dashboard' && (
               !selectedClass ? renderSelectionScreen() : renderDashboard()
            )}
            
            {activeView === 'requests' && renderRequests()}
            {activeView === 'students' && renderStudentsList()} {/* Note: Replaced with specific list renderer */}
            {activeView === 'classes' && renderClasses()}

         </div>
      </main>
    </div>
  );
}