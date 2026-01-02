import React, { useState, useEffect, useRef } from 'react';
import { 
  Kanban, Menu, X, CheckCircle, ArrowRight, Lock, 
  UserCircle, GraduationCap, Presentation, BarChart3, 
  Phone, MapPin, Twitter, Github, Linkedin, Heart,
  Quote, Star, ChevronRight, Mail, Loader2, UserPlus
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithCustomToken, 
  signInAnonymously, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection 
} from 'firebase/firestore';

// --- Firebase Initialization ---
const firebaseConfig = JSON.parse(__firebase_config);
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// --- Custom Hooks ---

const useOnScreen = (options) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options]);

  return [ref, isVisible];
};

const NumberCounter = ({ target, suffix = '+' }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useOnScreen({ threshold: 0.5 });

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, isVisible]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// --- Main Application Component ---
export default function LandingPage(){
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState('auth'); // auth, role, student, teacher
  const [authMode, setAuthMode] = useState('login'); // login, signup
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Auth Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added for signup clarity

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [college, setCollege] = useState('');
  const [otherCollege, setOtherCollege] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [subjects, setSubjects] = useState([]);
  const [subjectInput, setSubjectInput] = useState('');

  // --- 1. Auth Listener ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user explicitly logged out previously to prevent auto-login on reload
        const preferGuest = localStorage.getItem('projx_guest_mode');

        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token && !preferGuest) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Auth init failed", err);
        // Fallback to anonymous if custom token fails
        await signInAnonymously(auth).catch(console.error);
      }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // --- 2. Redirect Logic ---
  useEffect(() => {
    if (isModalOpen && modalView === 'auth' && user && !user.isAnonymous) {
      setModalView('role');
    }
  }, [user, isModalOpen, modalView]);

  // --- Scroll Effect ---
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Handlers ---

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (authMode === 'signup') {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Clear guest mode preference on successful auth
      localStorage.removeItem('projx_guest_mode');
    } catch (err) {
      let msg = "Authentication failed.";
      if(err.message === "Passwords do not match") msg = "Passwords do not match.";
      else if(err.code === 'auth/invalid-credential') msg = "Invalid email or password.";
      else if(err.code === 'auth/email-already-in-use') msg = "Email already in use. Please log in.";
      else if(err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      else if(err.code === 'auth/user-not-found') msg = "No account found with this email.";
      else if(err.code === 'auth/wrong-password') msg = "Incorrect password.";
      else msg = err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Clear guest mode preference on successful auth
      localStorage.removeItem('projx_guest_mode');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    // Set preference to stay logged out on reload
    localStorage.setItem('projx_guest_mode', 'true');
    await signOut(auth);
    setModalView('auth');
    setIsModalOpen(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    await signInAnonymously(auth);
  };

  const submitProfile = async (role) => {
    if (!user) return;
    setLoading(true);

    try {
      const profileData = {
        role,
        fullName,
        email: user.email,
        college: college === 'Other' ? otherCollege : college,
        department,
        updatedAt: new Date().toISOString()
      };

      if (role === 'Teacher') {
        profileData.subjects = subjects;
      }

      await updateProfile(user, { displayName: fullName });

      const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main');
      await setDoc(userDocRef, profileData);

      setIsModalOpen(false);
      // In a real app, you might show a success toast here
      
    } catch (err) {
      console.error(err);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = subjectInput.trim();
      if (val && !subjects.includes(val)) {
        setSubjects([...subjects, val]);
        setSubjectInput('');
      }
    }
  };

  const removeSubject = (sub) => {
    setSubjects(subjects.filter(s => s !== sub));
  };

  const openModal = (mode = 'login') => {
    setError('');
    setAuthMode(mode);
    // If user is already fully logged in, go to role. Otherwise, show auth form.
    setModalView(user && !user.isAnonymous ? 'role' : 'auth');
    setIsModalOpen(true);
  };

  // --- Components ---

  const Nav = () => (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md border-b border-slate-200' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Kanban size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">ProjX Monitor</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">About</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#reviews" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Reviews</a>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user && !user.isAnonymous ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600">{user.displayName || user.email?.split('@')[0]}</span>
                <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={() => openModal('login')} className="text-sm font-medium text-slate-600 hover:text-slate-900">Log In</button>
                <button onClick={() => openModal('signup')} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-full transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 hover:text-slate-900 p-2">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">About</a>
            <a href="#reviews" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Reviews</a>
            {user && !user.isAnonymous ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50">Logout</button>
            ) : (
              <>
                <button onClick={() => { openModal('login'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50">Log In</button>
                <button onClick={() => { openModal('signup'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-blue-600 hover:bg-blue-50">Sign Up</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen overflow-x-hidden">
      <style>{`
        .blue-gradient-text {
          background: linear-gradient(90deg, #2563eb, #3b82f6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .blob {
            position: absolute;
            filter: blur(40px);
            z-index: -1;
            opacity: 0.4;
        }
        .slide-up {
          animation: slideUp 0.8s cubic-bezier(0.5, 0, 0, 1) forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1; 
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8; 
        }
      `}</style>

      <Nav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://i.ibb.co/v41NTDqB/web-Starter-IMG.jpg" alt="Background" className="w-full h-full object-cover blur-[2px]" />
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-blue-50/30"></div>
        </div>

        <div className="blob bg-blue-200 w-96 h-96 rounded-full top-0 left-0 -translate-x-1/2 -translate-y-1/2 mix-blend-multiply"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="text-center lg:text-left slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100 text-blue-600 text-xs font-semibold mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                v2.0 Now Available
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
                A Simple Project <br />
                <span className="blue-gradient-text">Tracking System</span> <br />
                for Colleges
              </h1>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Streamline the academic workflow. Students submit effortlessly, teachers track progress instantly. The bridge between assignment and evaluation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button onClick={() => openModal('signup')} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-4 rounded-xl shadow-xl shadow-blue-600/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  Get Started
                  <ArrowRight size={18} />
                </button>
                <a href="#about" className="bg-white/80 hover:bg-white text-slate-700 border border-slate-200 font-medium px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-sm shadow-sm hover:shadow-md">
                  Learn More
                </a>
              </div>
              
              <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-slate-500 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-500" /> Free for Students
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-blue-500" /> Real-time Updates
                </div>
              </div>
            </div>

            <div className="relative lg:h-[500px] flex items-center justify-center slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="relative w-full max-w-lg bg-white p-2 rounded-2xl shadow-2xl border border-slate-200 transform rotate-2 hover:rotate-0 transition-transform duration-500 z-10 group cursor-pointer">
                <img src="https://i.ibb.co/v41NTDqB/web-Starter-IMG.jpg" alt="Project Dashboard Interface" className="w-full h-auto rounded-xl border border-slate-100 transition-transform group-hover:scale-[1.02] duration-500" />
                <div className="absolute -right-6 top-12 bg-white p-3 rounded-xl shadow-lg border border-slate-100 animate-bounce hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-bold text-slate-700">Submission Received</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
             {[
               { val: 50, label: 'Colleges Partnered', suffix: '+' },
               { val: 12000, label: 'Active Students', suffix: '+' },
               { val: 45000, label: 'Projects Tracked', suffix: '+' },
               { val: 98, label: 'Submission Rate', suffix: '%' }
             ].map((stat, i) => (
                <div key={i} className="slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">
                    <NumberCounter target={stat.val} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 slide-up">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">How it works</h2>
            <p className="text-3xl font-bold text-slate-900 mb-4">Everything you need to manage academic projects.</p>
            <p className="text-slate-600 text-lg">A centralized hub connecting students and faculty, replacing chaotic email threads with structured workflows.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-100', title: 'For Students', desc: 'Submit assignments, track deadlines, and get real-time feedback on your work. Never miss a submission date again.' },
              { icon: Presentation, color: 'text-indigo-600', bg: 'bg-indigo-100', title: 'For Teachers', desc: 'Create checklists, manage cohorts, review submissions efficiently, and grade projects in one unified dashboard.' },
              { icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-100', title: 'Project Evaluation', desc: 'Transparent evaluation criteria and progress tracking help maintain academic standards and fair grading.' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className={`w-14 h-14 ${f.bg} rounded-xl flex items-center justify-center ${f.color} mb-6`}>
                  <f.icon size={30} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        <div className="absolute top-10 right-10 text-slate-200/50 pointer-events-none">
          <Quote size={120} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-3xl font-bold text-slate-900">Loved by Students & Faculty</h2>
            <p className="text-slate-600 mt-4">See what colleges across India are saying about ProjX Monitor.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Finally, a way to keep track of 60+ student projects without drowning in emails. The dashboard is incredibly intuitive.", name: "Dr. Rajesh Kumar", role: "HOD CSE, Delhi Tech University", initial: "R", color: "blue" },
              { quote: "The automated checklists helped our team stay on track for the Final Year Project. Best part? No more missed deadlines!", name: "Ananya Singh", role: "Student, IIT Bombay", initial: "A", color: "purple" },
              { quote: "Implementation was smooth. The support team helped us set up our entire batch in less than 2 days.", name: "Vijyalakshmi H R", role: "Professor, SNPSU", initial: "V", color: "green" },
            ].map((r, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 slide-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <p className="text-slate-600 mb-6 italic">"{r.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full bg-${r.color}-100 flex items-center justify-center text-${r.color}-600 font-bold text-lg`}>{r.initial}</div>
                  <div>
                    <h4 className="font-bold text-slate-900">{r.name}</h4>
                    <p className="text-xs text-slate-500">{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mt-16 text-center pb-20 bg-slate-50">
        <button onClick={() => openModal('signup')} className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-slate-900 rounded-full hover:bg-slate-800 hover:scale-105 transition-all shadow-lg">
          Start Tracking Now
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">
                  <Kanban size={14} />
                </div>
                <span className="font-bold text-lg text-slate-900">ProjX Monitor</span>
              </div>
              <p className="text-slate-500 text-sm mb-2 max-w-xs">
                Empowering Indian institutions with smart project management tools.
              </p>
              <div className="text-slate-500 text-sm flex flex-col gap-1">
                <span className="flex items-center justify-center md:justify-start gap-2 hover:text-blue-600 transition-colors"><Phone size={14} /> +91 98765 43210</span>
                <span className="flex items-center justify-center md:justify-start gap-2"><MapPin size={14} /> Koramangala, Bengaluru, India</span>
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors transform hover:scale-110"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors transform hover:scale-110"><Github size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-blue-600 transition-colors transform hover:scale-110"><Linkedin size={20} /></a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-slate-400 border-t border-slate-100 pt-8 flex items-center justify-center gap-1">
            &copy; 2025 ProjX Monitor. Made with <Heart size={14} className="text-red-400 fill-current" /> in India.
          </div>
        </div>
      </footer>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100]" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)}></div>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg flex flex-col max-h-[90vh]">
                
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 hover:bg-slate-200 rounded-full p-1 z-10">
                  <X size={20} />
                </button>

                <div className="px-6 pt-8 pb-6 overflow-y-auto custom-scrollbar">
                  
                  {/* AUTH VIEW */}
                  {modalView === 'auth' && (
                    <div>
                      {/* Explicit Toggle Tabs */}
                      <div className="flex items-center bg-slate-100 p-1 rounded-xl mb-6 relative">
                         <button 
                           onClick={() => { setAuthMode('login'); setError(''); }} 
                           className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           Log In
                         </button>
                         <button 
                           onClick={() => { setAuthMode('signup'); setError(''); }} 
                           className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMode === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                         >
                           Sign Up
                         </button>
                      </div>

                      <div className="text-center mb-6">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                          {authMode === 'login' ? <Lock className="text-blue-600" /> : <UserPlus className="text-blue-600" />}
                        </div>
                        <h3 className="text-2xl font-bold leading-6 text-slate-900 mb-2">
                          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {authMode === 'login' ? 'Sign in to access your dashboard' : 'Join ProjX Monitor today'}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-2.5 rounded-xl transition-all shadow-sm">
                          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                          Sign in with Google
                        </button>

                        <div className="relative flex py-1 items-center">
                          <div className="flex-grow border-t border-slate-200"></div>
                          <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-medium">Or</span>
                          <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                            <input 
                              type="email" 
                              required 
                              placeholder="name@college.edu" 
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                            <input 
                              type="password" 
                              required 
                              placeholder="••••••••" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                            />
                          </div>

                          {/* Confirm Password Field - Only for Signup */}
                          {authMode === 'signup' && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Confirm Password</label>
                              <input 
                                type="password" 
                                required 
                                placeholder="••••••••" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                              />
                            </div>
                          )}
                          
                          {error && <div className="text-red-500 text-xs text-center bg-red-50 p-2 rounded border border-red-100">{error}</div>}

                          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-blue-600/20 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? <Loader2 className="animate-spin" /> : (
                              <>
                                {authMode === 'login' ? 'Log In' : 'Sign Up'}
                                <ArrowRight className="ml-2" size={16} />
                              </>
                            )}
                          </button>
                        </form>

                        <div className="text-center mt-4">
                          <p className="text-sm text-slate-600">
                            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button 
                              onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setError(''); }} 
                              className="text-blue-600 font-semibold hover:underline ml-1"
                            >
                              {authMode === 'login' ? 'Sign Up' : 'Log In'}
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ROLE SELECTION VIEW */}
                  {modalView === 'role' && (
                    <div>
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                          <UserCircle className="text-blue-600" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold leading-6 text-slate-900 mb-2">Select Your Role</h3>
                        <p className="text-sm text-slate-500 mb-8">How will you be using ProjX Monitor?</p>

                        <div className="grid gap-4">
                          <button onClick={() => setModalView('student')} className="group relative flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              <GraduationCap size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="font-bold text-slate-900">Continue as Student</p>
                              <p className="text-xs text-slate-500 mt-0.5">Submit projects & view grades</p>
                            </div>
                            <div className="ml-auto text-slate-300 group-hover:text-blue-600">
                              <ChevronRight size={24} />
                            </div>
                          </button>

                          <button onClick={() => setModalView('teacher')} className="group relative flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left">
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              <Presentation size={24} />
                            </div>
                            <div className="ml-4">
                              <p className="font-bold text-slate-900">Continue as Teacher</p>
                              <p className="text-xs text-slate-500 mt-0.5">Manage cohorts & evaluate</p>
                            </div>
                            <div className="ml-auto text-slate-300 group-hover:text-indigo-600">
                              <ChevronRight size={24} />
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="bg-slate-50 -mx-6 -mb-6 mt-6 px-6 py-3 border-t border-slate-100 text-center">
                        <button onClick={handleLogout} className="text-xs text-red-500 hover:underline">Sign Out</button>
                      </div>
                    </div>
                  )}

                  {/* FORM VIEWS */}
                  {(modalView === 'student' || modalView === 'teacher') && (
                    <div>
                      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                        <button onClick={() => setModalView('role')} className="text-slate-400 hover:text-blue-600"><ArrowRight className="rotate-180" size={20} /></button>
                        <h3 className="text-xl font-bold text-slate-900">Complete {modalView === 'student' ? 'Student' : 'Teacher'} Profile</h3>
                      </div>
                      
                      <form onSubmit={(e) => { e.preventDefault(); submitProfile(modalView === 'student' ? 'Student' : 'Teacher'); }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Enter your full name" 
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                            />
                          </div>
                          
                          <div className="col-span-2">
                            <label className="block text-xs font-semibold text-slate-700 mb-1">College Name</label>
                            <select 
                              value={college}
                              onChange={(e) => setCollege(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                            >
                              <option value="">Select College</option>
                              <option value="Sapthagiri NPS University">Sapthagiri NPS University</option>
                              <option value="RV University">RV University</option>
                              <option value="PES University">PES University</option>
                              <option value="Reva University">Reva University</option>
                              <option value="Christ University">Christ University</option>
                              <option value="Other">Other (Type Manually)</option>
                            </select>
                          </div>
                          
                          {college === 'Other' && (
                            <div className="col-span-2">
                              <label className="block text-xs font-semibold text-slate-700 mb-1">Enter College Name</label>
                              <input 
                                type="text" 
                                value={otherCollege}
                                onChange={(e) => setOtherCollege(e.target.value)}
                                placeholder="Type your college name..." 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" 
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                            <select 
                              value={department}
                              onChange={(e) => setDepartment(e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white"
                            >
                              {['CSE', 'ECE', 'AIML', 'ISE', 'EEE', 'Mech', 'Civil'].map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                          </div>

                          {modalView === 'student' ? (
                            <>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Semester</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white">
                                  {[...Array(8)].map((_, i) => <option key={i}>{i+1}th Sem</option>)}
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">SRN / Roll No</label>
                                <input type="text" placeholder="e.g. R21EF001" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm" />
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white">
                                  <option>Assistant Professor</option>
                                  <option>Associate Professor</option>
                                  <option>Professor</option>
                                  <option>HOD</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Subjects Taught</label>
                                <div className="border border-slate-300 rounded-lg p-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 bg-white transition-all">
                                  <div className="flex flex-wrap gap-2 mb-1">
                                    {subjects.map(s => (
                                      <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {s}
                                        <button type="button" onClick={() => removeSubject(s)} className="hover:text-indigo-900"><X size={12} /></button>
                                      </span>
                                    ))}
                                  </div>
                                  <input 
                                    type="text" 
                                    value={subjectInput}
                                    onChange={(e) => setSubjectInput(e.target.value)}
                                    onKeyDown={handleAddSubject}
                                    placeholder="Type subject & hit Enter..." 
                                    className="w-full outline-none text-sm bg-transparent" 
                                  />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Press Enter to add multiple subjects.</p>
                              </div>
                            </>
                          )}
                        </div>

                        {error && <div className="text-red-500 text-xs text-center">{error}</div>}

                        <button type="submit" disabled={loading} className={`w-full mt-6 text-white font-bold py-3 rounded-xl transition-colors shadow-lg flex items-center justify-center ${modalView === 'student' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'}`}>
                          {loading ? <Loader2 className="animate-spin" /> : 'Save and Continue'}
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}