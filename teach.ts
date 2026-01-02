import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

// --- Type Definitions ---
interface Subject {
  id: string;
  name: string;
}

interface ClassSection {
  id: string;
  name: string;
  advisor: string;
  students: number;
}

interface Student {
  srn: string;
  name: string;
  email?: string;
}

interface Marks {
  presentation: number;
  assignment: number;
  ppt: number;
  report: number;
  project: number;
}

interface Team {
  id: number;
  name: string;
  projectTitle: string;
  submissionDate: string | null;
  members: Student[];
  marks: Marks;
  status: Record<keyof Marks, boolean>;
  projectStatus: string;
}

interface Request {
  id: number;
  teamName: string;
  title: string;
  subject: string;
  class: string;
  membersCount: number;
  members: Omit<Student, 'email'>[];
}

interface MarksConfig {
  presentation: number;
  assignment: number;
  ppt: number;
  report: number;
  project: number;
}

interface NewProject {
  title: string;
  type: 'Team' | 'Individual';
  deadline: string;
  description: string;
  targetClass: string;
}

interface PublishedProject extends NewProject {
  id: number;
}

interface DeadlineStatus {
  label: string;
  color: string;
}

// --- Mock Data ---
const SUBJECTS: Subject[] = [
  { id: 'sub1', name: 'Web Technology' },
  { id: 'sub2', name: 'Internet of Things (IoT)' },
  { id: 'sub3', name: 'Object Oriented Programming (OOP)' },
];

const CLASSES: ClassSection[] = [
  { id: 'c1', name: '3CSE01', advisor: 'Vivek Sharma', students: 60 },
  { id: 'c2', name: '3CSE02', advisor: 'Jane Doe', students: 58 },
  { id: 'c3', name: '3AIML01', advisor: 'Alan Turing', students: 62 },
];

const STUDENTS_3CSE01: Student[] = [
  { srn: '24SUUBECS0001', name: 'A MOHITH SANTOSH' },
  { srn: '24SUUBECS0002', name: 'A P PRAJWAL GOWDA' },
  { srn: '24SUUBECS0003', name: 'A ROHIT KUMAR' },
  { srn: '24SUUBECS0006', name: 'AAJAY SURYAA' },
  { srn: '24SUUBECS0045', name: 'ADARSH SHUKLA' },
  { srn: '24SUUBECS0046', name: 'ADARSH V' },
  { srn: '24SUUBELCS001', name: 'ABHISHEK N J' },
  { srn: '24SUUBELCS002', name: 'ADARSH B H' },
  { srn: '24SUUBELCS003', name: 'AKASH GOWDA S' },
  { srn: '24SUUBELCS004', name: 'AKASH H' },
  { srn: '24SUUBELCS005', name: 'AMRUTHA C N' },
];

const INITIAL_TEAMS: Team[] = [
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

const INITIAL_REQUESTS: Request[] = [
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

// --- Angular Component ---

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div class="flex h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-xl z-20">
        <div class="p-6 border-b border-slate-100 flex items-center gap-2">
          <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">X</div>
          <span class="font-extrabold text-xl tracking-tight text-slate-800">ProjX <span class="text-indigo-600">Monitor</span></span>
        </div>

        <nav class="flex-1 p-4 overflow-y-auto">
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-2">Main Menu</div>
          <button (click)="setActiveView('dashboard')" [class]="getSidebarClass('dashboard')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="3" y="12" rx="1"/><rect width="7" height="5" x="14" y="16" rx="1"/></svg>
              <span>Dashboard</span>
            </div>
          </button>
          <button (click)="setActiveView('requests')" [class]="getSidebarClass('requests')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="21" y2="21"/></svg>
              <span>Project Requests</span>
            </div>
            @if (requests().length > 0) {
              <span class="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {{ requests().length }}
              </span>
            }
          </button>
          <button (click)="setActiveView('students')" [class]="getSidebarClass('students')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Students</span>
            </div>
          </button>
          <button (click)="setActiveView('classes')" [class]="getSidebarClass('classes')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5"/><path d="M22 20.5v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5"/><path d="M10 21v-7"/><path d="M14 21v-7"/></svg>
              <span>Classes</span>
            </div>
          </button>
          
          <div class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2 mt-6">System</div>
          <button (click)="onLogout()" [class]="getSidebarClass('settings')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.46a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.44a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.78 1.46a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.46a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.44a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.78-1.46a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Settings</span>
            </div>
          </button>
          <button (click)="onLogout()" [class]="getSidebarClass('logout')" class="w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
              <span>Logout</span>
            </div>
          </button>
        </nav>

        <div class="p-4 border-t border-slate-100">
            <div class="flex items-center gap-3">
             <div class="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 border-2 border-white shadow-sm"></div>
             <div class="overflow-hidden">
               <p class="text-sm font-bold text-slate-800 truncate">Prof. Anderson</p>
               <p class="text-xs text-slate-500 truncate">Admin Access</p>
             </div>
            </div>
        </div>
      </aside>

      <!-- Mobile Header -->
      <div class="md:hidden fixed top-0 w-full bg-white border-b z-30 p-4 flex justify-between items-center">
          <span class="font-bold text-lg">ProjX Monitor</span>
          <button class="text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
      </div>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto relative">
        <div class="max-w-7xl mx-auto p-6 md:p-8 pt-20 md:pt-8 h-full">

          @switch (activeView()) {
            @case ('dashboard') {
              @if (!selectedClass()) {
                <div class="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div class="bg-indigo-100 p-4 rounded-full mb-6 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h2 class="text-2xl font-bold text-slate-800 mb-2">Select Subject & Class</h2>
                  <p class="text-slate-500 mb-8 max-w-md">Please select the academic subject and the specific section you wish to manage marks for.</p>

                  <div class="grid md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <div class="space-y-3 text-left">
                      <label class="text-sm font-semibold text-slate-600 uppercase tracking-wider">Subject</label>
                      <div class="space-y-2">
                        @for (sub of subjects; track sub.id) {
                          <button
                            (click)="selectedSubject.set(sub)"
                            [class]="subjectSelectClass(sub)"
                          >
                            <span [class]="{'font-medium': true, 'text-indigo-700': selectedSubject()?.id === sub.id, 'text-slate-700': selectedSubject()?.id !== sub.id}">{{ sub.name }}</span>
                            @if (selectedSubject()?.id === sub.id) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                            }
                          </button>
                        }
                      </div>
                    </div>

                    <div class="space-y-3 text-left">
                      <label class="text-sm font-semibold text-slate-600 uppercase tracking-wider">Class Section</label>
                      <div class="space-y-2">
                        @for (cls of classes; track cls.id) {
                          <button
                            (click)="selectedClass.set(cls)"
                            [disabled]="!selectedSubject()"
                            [class]="classSelectClass(cls)"
                          >
                            <span [class]="{'font-medium': true, 'text-violet-700': selectedClass()?.id === cls.id, 'text-slate-700': selectedClass()?.id !== cls.id}">{{ cls.name }}</span>
                            @if (selectedClass()?.id === cls.id) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-violet-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                            }
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              } @else {
                <div class="space-y-6 animate-in fade-in duration-500">
                  <!-- Top Controls -->
                  <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100 gap-4">
                    <div>
                      <!-- Breadcrumb Navigation - Clickable to go back -->
                      <div class="flex items-center gap-2 text-sm text-slate-500 mb-1">
                        <button
                            (click)="clearSelection()"
                            class="font-medium text-indigo-600 hover:underline hover:text-indigo-800 transition-colors"
                        >
                            {{ selectedSubject()?.name }}
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                        <button
                            (click)="selectedClass.set(null)"
                            class="font-medium text-violet-600 hover:underline hover:text-violet-800 transition-colors"
                        >
                            {{ selectedClass()?.name }}
                        </button>
                        <button
                            (click)="clearSelection()"
                            class="ml-2 text-xs bg-slate-100 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 px-2 py-0.5 rounded border border-slate-200 transition-colors flex items-center gap-1"
                            title="Switch Subject or Class"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                           Change
                        </button>
                      </div>
                      <h1 class="text-2xl font-bold text-slate-800">Project Evaluation Board</h1>
                    </div>

                    <div class="flex items-center gap-3">
                      <button
                        (click)="showPublishModal.set(true)"
                        class="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md hover:shadow-lg transition-all active:scale-95"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        Publish New Project
                      </button>
                      <div class="bg-slate-100 p-1 rounded-lg flex">
                        <button
                          (click)="viewMode.set('teams')"
                          [class]="{'px-4 py-2 text-sm font-medium rounded-md transition-all': true, 'bg-white text-slate-800 shadow-sm': viewMode() === 'teams', 'text-slate-500 hover:text-slate-700': viewMode() !== 'teams'}"
                        >
                          View by Teams
                        </button>
                        <button
                          (click)="viewMode.set('students')"
                          [class]="{'px-4 py-2 text-sm font-medium rounded-md transition-all': true, 'bg-white text-slate-800 shadow-sm': viewMode() === 'students', 'text-slate-500 hover:text-slate-700': viewMode() !== 'students'}"
                        >
                          View by Students
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="grid grid-cols-1 xl:grid-cols-4 gap-6">

                    <!-- Main Content: Table Area -->
                    <div class="xl:col-span-3 space-y-6">

                      <!-- Filters & Actions Bar (Only show for Teams View) -->
                      @if (viewMode() === 'teams') {
                        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                          <div class="flex items-center gap-3 w-full md:w-auto">
                            <div class="relative group">
                              <button class="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                                <span>{{ filterStatus() === 'All' ? 'All Status' : filterStatus() }}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <div class="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-100 hidden group-hover:block z-10 p-1">
                                @for (s of ['All', 'Completed', 'Pending', 'Late']; track s) {
                                  <button (click)="filterStatus.set(s as 'All' | 'Completed' | 'Pending' | 'Late')" class="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 text-slate-700 rounded-md">{{ s }}</button>
                                }
                              </div>
                            </div>

                            <select
                              class="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 shadow-sm outline-none focus:ring-2 focus:ring-indigo-200"
                              [ngModel]="sortBy()"
                              (ngModelChange)="sortBy.set($event)"
                            >
                              <option value="default">Default Sort</option>
                              <option value="marksHigh">Highest Marks</option>
                              <option value="submissionEarly">Earliest Submission</option>
                            </select>
                          </div>

                          <div class="flex items-center gap-3 w-full md:w-auto">
                            <button
                                (click)="showMarksConfig.set(true)"
                                class="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium text-sm px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.78 1.46a2 2 0 0 0 .73 2.73l.15.08a2 2 0 0 1 1 1.73v.44a2 2 0 0 1-1 1.73l-.15.08a2 2 0 0 0-.73 2.73l.78 1.46a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73v.18a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.78-1.46a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.73v-.44a2 2 0 0 1 1-1.73l.15-.08a2 2 0 0 0 .73-2.73l-.78-1.46a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                                Configure Marks
                            </button>
                            <button class="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2 rounded-lg shadow-sm hover:bg-slate-50">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                              <span>Report</span>
                            </button>
                          </div>
                        </div>
                      }

                      <!-- Dynamic View Switching -->
                      @if (viewMode() === 'teams') {
                        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                          <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                              <thead>
                                <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                  <th class="p-4 w-48 sticky left-0 bg-slate-50 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Team / Details</th>
                                  <th class="p-4 text-center w-32">Present. ({{ marksConfig().presentation }})</th>
                                  <th class="p-4 text-center w-32">Assign. ({{ marksConfig().assignment }})</th>
                                  <th class="p-4 text-center w-32">PPT ({{ marksConfig().ppt }})</th>
                                  <th class="p-4 text-center w-32">Report ({{ marksConfig().report }})</th>
                                  <th class="p-4 text-center w-32">Project ({{ marksConfig().project }})</th>
                                  <th class="p-4 text-center w-24">Total</th>
                                  <th class="p-4 text-center w-32">Deadline Status</th>
                                </tr>
                              </thead>
                              <tbody class="divide-y divide-slate-100">
                                @for (team of filteredTeams(); track team.id) {
                                  <tr class="hover:bg-slate-50/80 group transition-colors">
                                    <!-- Team Info Column -->
                                    <td class="p-4 sticky left-0 bg-white group-hover:bg-slate-50/80 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      <div class="flex flex-col gap-1">
                                        <span class="font-bold text-slate-800">{{ team.name }}</span>
                                        <span class="text-xs text-slate-500 truncate max-w-[160px]">{{ team.projectTitle }}</span>
                                        <button
                                          (click)="setSelectedTeam(team)"
                                          class="text-indigo-600 text-xs font-medium mt-1 hover:underline flex items-center gap-1 w-fit"
                                        >
                                          View Details
                                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                        </button>
                                      </div>
                                    </td>

                                    <!-- Dynamic Marks Columns -->
                                    @for (field of ['presentation', 'assignment', 'ppt', 'report', 'project']; track field) {
                                      <td class="p-4 text-center">
                                        <div class="flex flex-col items-center gap-2">
                                          <input
                                            type="checkbox"
                                            [checked]="team.status[field]"
                                            (change)="handleCheckToggle(team.id, field)"
                                            class="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500 cursor-pointer"
                                          />
                                          <div class="relative w-16">
                                            <input
                                              type="number"
                                              [value]="team.marks[field]"
                                              (change)="handleMarkChange(team.id, field, $event.target.value)"
                                              [class]="getMarkInputClass(team.marks[field])"
                                              [min]="0"
                                              [max]="marksConfig()[field]"
                                            />
                                          </div>
                                        </div>
                                      </td>
                                    }

                                    <!-- Total -->
                                    <td class="p-4 text-center">
                                      <div class="flex items-center justify-center">
                                        <span [class]="getScoreClass(team)">
                                          {{ calculateTotal(team.marks) }}
                                        </span>
                                        <span class="text-xs text-slate-400">/{{ maxScore() }}</span>
                                      </div>
                                    </td>

                                    <!-- Deadline Badge -->
                                    <td class="p-4">
                                      <div class="flex flex-col items-center gap-1">
                                        <span [class]="'px-2 py-1 rounded-md text-xs font-bold border ' + getDeadlineStatus(team.submissionDate).color + ' border-transparent'">
                                           {{ getDeadlineStatus(team.submissionDate).label }}
                                        </span>
                                        <span class="text-[10px] text-slate-400 font-mono">
                                          {{ team.submissionDate ? (team.submissionDate | date:'shortDate') : '--/--' }}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                }
                              </tbody>
                            </table>
                          </div>
                          @if (filteredTeams().length === 0) {
                            <div class="p-12 text-center text-slate-400">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-3 opacity-20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                              <p>No teams found matching current filters.</p>
                            </div>
                          }
                        </div>
                      } @else {
                        <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col h-[600px]">
                          <div class="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <h3 class="font-semibold text-slate-700">Class Roster: 3CSE01</h3>
                            <div class="relative">
                               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3)"/></svg>
                               <input
                                  type="text"
                                  placeholder="Find student..."
                                  class="pl-8 pr-3 py-1 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 w-64"
                                  [ngModel]="studentSearch()"
                                  (ngModelChange)="studentSearch.set($event)"
                               />
                            </div>
                          </div>
                          <div class="overflow-y-auto flex-1">
                            <table class="w-full text-left">
                                <thead class="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 sticky top-0 z-10">
                                <tr>
                                    <th class="p-3 bg-slate-50">SRN</th>
                                    <th class="p-3 bg-slate-50">Student Name</th>
                                    <th class="p-3 bg-slate-50">Team Status</th>
                                    <th class="p-3 bg-slate-50 text-right">Action</th>
                                </tr>
                                </thead>
                                <tbody class="divide-y divide-slate-100 text-sm">
                                @for (student of filteredStudents(); track student.srn) {
                                    <tr [class]="getStudentRowClass(student.srn)">
                                    <td class="p-3 font-mono text-slate-600 text-xs">{{ student.srn }}</td>
                                    <td class="p-3 font-medium text-slate-800">{{ student.name }}</td>
                                    <td class="p-3">
                                        @if (getStudentTeamInfo(student.srn); as teamInfo) {
                                            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                                {{ teamInfo.name }}
                                            </span>
                                        } @else {
                                            <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                                Not Assigned
                                            </span>
                                        }
                                    </td>
                                    <td class="p-3 text-right">
                                        <button class="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-200">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                                        </button>
                                    </td>
                                    </tr>
                                }
                                </tbody>
                            </table>
                          </div>
                        </div>
                      }
                    </div>

                    <!-- Sidebar Widgets -->
                    <div class="xl:col-span-1 space-y-6">

                      <!-- Deadline Card -->
                      <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                        <div class="flex items-center gap-2 text-slate-800 font-bold mb-4">
                           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                           <h3>Project Deadline</h3>
                        </div>

                        <div class="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-4 text-center">
                           <span [class]="getDaysRemainingClass()">
                              {{ daysRemaining() > 0 ? daysRemaining() : 0 }}
                           </span>
                           <p class="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-1">Days Remaining</p>
                        </div>

                        <div class="space-y-2">
                          <label class="text-xs font-semibold text-slate-500 uppercase">Target Date</label>
                          <div class="flex items-center gap-2 bg-white border border-slate-200 p-2 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                            <input
                              type="date"
                              class="w-full outline-none text-sm text-slate-700 font-medium cursor-pointer"
                              [value]="deadline().toISOString().split('T')[0]"
                              (change)="setDeadline($event.target)"
                            />
                          </div>
                        </div>
                      </div>

                      <!-- Published Projects -->
                      @if (publishedProjects().length > 0) {
                        <div class="bg-white p-5 rounded-xl shadow-sm border border-slate-200">
                          <div class="flex items-center gap-2 text-slate-800 font-bold mb-4">
                             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-indigo-500"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>
                             <h3>Published Projects</h3>
                          </div>
                          <div class="space-y-3">
                              @for (p of publishedProjects(); track p.id) {
                                <div class="bg-slate-50 p-3 rounded border border-slate-100">
                                   <div class="font-semibold text-sm text-slate-800">{{ p.title }}</div>
                                   <div class="flex justify-between mt-1 text-xs text-slate-500">
                                       <span>{{ p.type }}</span>
                                       <span>Due: {{ p.deadline | date:'shortDate' }}</span>
                                   </div>
                                </div>
                              }
                          </div>
                        </div>
                      }

                      <!-- Stats Summary -->
                      <div class="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-xl shadow-lg text-white">
                        <h3 class="font-bold text-indigo-100 mb-4 border-b border-white/10 pb-2">Class Stats</h3>
                        <div class="space-y-4">
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-indigo-200">Total Students</span>
                            <span class="font-bold text-xl">{{ studentsRoster.length }}</span>
                          </div>
                           <div class="flex justify-between items-center">
                            <span class="text-sm text-indigo-200">Teams Formed</span>
                            <span class="font-bold text-xl">{{ teams().length }}</span>
                          </div>
                          <div class="flex justify-between items-center">
                            <span class="text-sm text-indigo-200">Submitted</span>
                            <span class="font-bold text-xl">{{ submittedTeamsCount() }}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              }
            }
            @case ('requests') {
              <div class="animate-in fade-in slide-in-from-right-4 duration-500">
                  <div class="mb-6 flex justify-between items-center">
                     <div>
                         <h2 class="text-2xl font-bold text-slate-800">Project Requests</h2>
                         <p class="text-slate-500">Review and approve new team formations and project titles.</p>
                     </div>
                  </div>

                  <div class="space-y-4">
                      @if (requests().length === 0) {
                          <div class="bg-white rounded-xl p-12 flex flex-col items-center text-center text-slate-400 shadow-sm border border-slate-200">
                              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-4 text-emerald-100 fill-emerald-500/50 stroke-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
                              <h3 class="text-lg font-medium text-slate-800">All Caught Up!</h3>
                              <p>No pending project requests at the moment.</p>
                          </div>
                      } @else {
                          @for (req of requests(); track req.id) {
                            <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                               <div class="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                  <div>
                                     <h3 class="font-bold text-lg text-slate-800 flex items-center gap-2">
                                         {{ req.teamName }}
                                         <span class="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">New Request</span>
                                     </h3>
                                     <div class="text-sm text-slate-500 mt-1">Proposed Title: <span class="font-medium text-slate-700">{{ req.title }}</span></div>
                                  </div>
                                  <div class="flex gap-2">
                                      <button (click)="handleRequestAction(req.id, 'reject')" class="px-4 py-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-colors">Reject</button>
                                      <button (click)="handleRequestAction(req.id, 'approve')" class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 shadow-sm transition-colors">Approve & Create Team</button>
                                  </div>
                               </div>
                               <div class="p-5">
                                   <h4 class="text-xs font-bold text-slate-400 uppercase mb-3">Team Members ({{ req.members.length }})</h4>
                                   <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                       @for (m of req.members; track m.srn) {
                                           <div class="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50">
                                               <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                                                   {{ m.name.charAt(0) }}
                                               </div>
                                               <div class="overflow-hidden">
                                                   <div class="text-sm font-medium text-slate-800 truncate">{{ m.name }}</div>
                                                   <div class="text-xs text-slate-500 font-mono truncate">{{ m.srn }}</div>
                                               </div>
                                           </div>
                                       }
                                   </div>
                               </div>
                            </div>
                          }
                      }
                  </div>
              </div>
            }
            @case ('students') {
              <div class="animate-in fade-in slide-in-from-right-4 duration-500">
                 <h2 class="text-2xl font-bold text-slate-800 mb-6">Student Roster</h2>
                 <div class="h-[80vh] flex flex-col">
                  <!-- Reusing student list renderer, wrapped in a div for height control -->
                  <ng-container *ngTemplateOutlet="studentListTemplate"></ng-container>
                 </div>
              </div>
            }
            @case ('classes') {
              <div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 class="text-2xl font-bold text-slate-800 mb-6">My Classes</h2>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                      @for (cls of classes; track cls.id) {
                          <div (click)="selectClass(cls)" class="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer group">
                              <div class="flex justify-between items-start mb-4">
                                  <div class="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V15a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4.5"/><path d="M22 20.5v-2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2.5"/><path d="M10 21v-7"/><path d="M14 21v-7"/></svg>
                                  </div>
                                  <span class="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{{ cls.students }} Students</span>
                              </div>
                              <h3 class="text-xl font-bold text-slate-800 mb-1">{{ cls.name }}</h3>
                              <p class="text-sm text-slate-500 mb-4">Advisor: {{ cls.advisor }}</p>
                              <div class="flex items-center text-sm text-indigo-600 font-medium">
                                   Manage Projects
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                              </div>
                          </div>
                      }
                  </div>
              </div>
            }
          }
        </div>
      </main>
    </div>

    <!-- Modals -->

    <!-- 1. Team Details & AI Feedback -->
    @if (selectedTeam(); as team) {
      <div [class]="getModalClass(true)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">{{ team.name }} Details</h3>
            <button (click)="selectedTeam.set(null)" class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-6">
            <div class="grid grid-cols-2 gap-4">
               <div class="bg-slate-50 p-3 rounded-lg">
                 <span class="text-xs text-slate-500 uppercase font-bold block mb-1">Project Title</span>
                 <span class="text-slate-800 font-medium">{{ team.projectTitle }}</span>
               </div>
               <div class="bg-slate-50 p-3 rounded-lg">
                 <span class="text-xs text-slate-500 uppercase font-bold block mb-1">Class & Section</span>
                 <span class="text-slate-800 font-medium">{{ selectedSubject()?.name }} - {{ selectedClass()?.name }}</span>
               </div>
            </div>

            <div>
              <h4 class="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                 Team Members
              </h4>
              <div class="border rounded-lg overflow-hidden">
                 <table class="w-full text-sm text-left">
                    <thead class="bg-slate-100 text-slate-600 font-semibold">
                      <tr>
                        <th class="p-3">Name</th>
                        <th class="p-3">SRN</th>
                        <th class="p-3">Email</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y">
                      @for (m of team.members; track $index) {
                        <tr class="bg-white">
                          <td class="p-3 font-medium text-slate-800">{{ m.name }}</td>
                          <td class="p-3 text-slate-600 font-mono">{{ m.srn }}</td>
                          <td class="p-3 text-slate-500">{{ m.email || 'N/A' }}</td>
                        </tr>
                      }
                    </tbody>
                 </table>
              </div>
            </div>

            <div class="pt-2 border-t border-slate-100">
              <div class="flex justify-between items-center mb-3">
                <h4 class="text-sm font-bold text-indigo-600 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 10.9v.8m5.4-3.6v.8m-4.6 2.8v.8m4.6-2.8v.8M12 21a9 9 0 0 1-9-9c0-2.3 1.1-4.4 3-5.7l1.4-1.2C9 3 10.5 2 12 2h0c1.5 0 3 1 4.6 2.1l1.4 1.2a9 9 0 0 1 3 5.7 9 9 0 0 1-9 9Z"/></svg>
                  AI Performance Analysis
                </h4>
                <button
                  (click)="handleAiGenerateFeedback(team)"
                  [disabled]="isAiLoading()"
                  class="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-200 font-medium transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  @if (isAiLoading()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 10.9v.8m5.4-3.6v.8m-4.6 2.8v.8m4.6-2.8v.8M12 21a9 9 0 0 1-9-9c0-2.3 1.1-4.4 3-5.7l1.4-1.2C9 3 10.5 2 12 2h0c1.5 0 3 1 4.6 2.1l1.4 1.2a9 9 0 0 1 3 5.7 9 9 0 0 1-9 9Z"/></svg>
                  }
                  Generate AI Feedback
                </button>
              </div>

              @if (generatedFeedback()) {
                <div class="bg-gradient-to-r from-indigo-50 to-violet-50 p-4 rounded-lg border border-indigo-100 text-sm text-slate-700 leading-relaxed shadow-sm animate-in fade-in zoom-in duration-300">
                  <span class="font-bold text-indigo-800 block mb-1">Feedback Generated:</span>
                  "{{ generatedFeedback() }}"
                </div>
              } @else {
                <div class="p-4 rounded-lg border border-dashed border-slate-200 text-xs text-slate-400 text-center bg-slate-50/50">
                    Click generate to analyze student performance based on current marks.
                </div>
              }
            </div>

            <div class="flex justify-end pt-2">
               <button (click)="selectedTeam.set(null)" class="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors">Close</button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- 2. Marks Config -->
    @if (showMarksConfig()) {
      <div [class]="getModalClass(true)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">Configure Scoring Rubric</h3>
            <button (click)="showMarksConfig.set(false)" class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <p class="text-sm text-slate-500 bg-amber-50 text-amber-700 p-3 rounded border border-amber-100 flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              Changing these values sets the maximum possible score for each category. Existing marks exceeding the new maximum will need manual adjustment.
            </p>
            <div class="grid grid-cols-1 gap-4">
                @for (key of marksConfigKeys; track key) {
                    <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                      <label class="capitalize font-medium text-slate-700">{{ key }} Marks</label>
                      <input
                          type="number"
                          class="w-20 p-2 border rounded-md text-center font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-200"
                          [value]="marksConfig()[key]"
                          (change)="setMarksConfigValue(key, $event.target.value)"
                      />
                    </div>
                }
            </div>
            <div class="pt-4 flex justify-end">
              <button
                (click)="showMarksConfig.set(false)"
                class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- 3. Publish Project Modal with AI Description -->
    @if (showPublishModal()) {
      <div [class]="getModalClass(true)" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
          <div class="flex justify-between items-center p-6 border-b border-slate-100">
            <h3 class="text-lg font-bold text-slate-800">Publish New Project</h3>
            <button (click)="showPublishModal.set(false)" class="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                placeholder="e.g. Smart Traffic Management System"
                [ngModel]="newProject().title"
                (ngModelChange)="updateNewProject('title', $event)"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  [ngModel]="newProject().type"
                  (ngModelChange)="updateNewProject('type', $event)"
                >
                  <option>Team</option>
                  <option>Individual</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Deadline</label>
                <input
                  type="date"
                  class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200"
                  [ngModel]="newProject().deadline"
                  (ngModelChange)="updateNewProject('deadline', $event)"
                />
              </div>
            </div>
            <div>
              <div class="flex justify-between items-end mb-1">
                <label class="block text-sm font-medium text-slate-700">Description & Requirements</label>
                <button
                    (click)="handleAiGenerateDescription()"
                    [disabled]="isAiLoading() || !newProject().title"
                    class="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Enter a title first to generate description"
                >
                  @if (isAiLoading()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 10.9v.8m5.4-3.6v.8m-4.6 2.8v.8m4.6-2.8v.8M12 21a9 9 0 0 1-9-9c0-2.3 1.1-4.4 3-5.7l1.4-1.2C9 3 10.5 2 12 2h0c1.5 0 3 1 4.6 2.1l1.4 1.2a9 9 0 0 1 3 5.7 9 9 0 0 1-9 9Z"/></svg>
                  }
                  Auto-Generate Description
                </button>
              </div>
              <textarea
                class="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 h-32 resize-none text-sm leading-relaxed"
                placeholder="Instructions for students..."
                [ngModel]="newProject().description"
                (ngModelChange)="updateNewProject('description', $event)"
              ></textarea>
            </div>
            <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Target Class</label>
                <select class="w-full p-2 border rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" disabled>
                   <option>3CSE01</option>
                </select>
                <p class="text-xs text-slate-400 mt-1">Currently selected class in dashboard.</p>
            </div>
            <div class="pt-4 flex justify-end gap-2">
              <button (click)="showPublishModal.set(false)" class="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button
                (click)="handlePublishProject()"
                class="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                Publish to Class
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Template for Student List (used in dashboard and students view) -->
    <ng-template #studentListTemplate>
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-hidden flex flex-col">
        <div class="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
            <h3 class="font-semibold text-slate-700">Class Roster: 3CSE01</h3>
            <div class="relative">
               <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3)"/></svg>
               <input
                  type="text"
                  placeholder="Find student..."
                  class="pl-8 pr-3 py-1 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-indigo-200 w-64"
                  [ngModel]="studentSearch()"
                  (ngModelChange)="studentSearch.set($event)"
               />
            </div>
        </div>
        <div class="overflow-y-auto flex-1">
          <table class="w-full text-left">
              <thead class="bg-white border-b border-slate-200 text-xs uppercase font-semibold text-slate-500 sticky top-0 z-10">
              <tr>
                  <th class="p-3 bg-slate-50">SRN</th>
                  <th class="p-3 bg-slate-50">Student Name</th>
                  <th class="p-3 bg-slate-50">Team Status</th>
                  <th class="p-3 bg-slate-50 text-right">Action</th>
              </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
              @for (student of filteredStudents(); track student.srn) {
                  <tr [class]="getStudentRowClass(student.srn)">
                  <td class="p-3 font-mono text-slate-600 text-xs">{{ student.srn }}</td>
                  <td class="p-3 font-medium text-slate-800">{{ student.name }}</td>
                  <td class="p-3">
                      @if (getStudentTeamInfo(student.srn); as teamInfo) {
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                              {{ teamInfo.name }}
                          </span>
                      } @else {
                          <span class="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                              Not Assigned
                          </span>
                      }
                  </td>
                  <td class="p-3 text-right">
                      <button class="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded hover:bg-slate-200">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                      </button>
                  </td>
                  </tr>
              }
              </tbody>
          </table>
        </div>
      </div>
    </ng-template>
  `,
  styles: ``, // Tailwind handles styles
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  // --- Static Data ---
  subjects = SUBJECTS;
  classes = CLASSES;
  studentsRoster = STUDENTS_3CSE01;
  marksConfigKeys: (keyof MarksConfig)[] = ['presentation', 'assignment', 'ppt', 'report', 'project'];

  // --- State Signals (Reactive) ---
  activeView = signal<'dashboard' | 'requests' | 'students' | 'classes'>('classes'); // Start at classes for a clearer entry point
  selectedSubject = signal<Subject | null>(null);
  selectedClass = signal<ClassSection | null>(null);
  viewMode = signal<'teams' | 'students'>('teams');

  // Data State
  teams = signal<Team[]>(INITIAL_TEAMS);
  requests = signal<Request[]>(INITIAL_REQUESTS);
  publishedProjects = signal<PublishedProject[]>([]);
  marksConfig = signal<MarksConfig>({ presentation: 20, assignment: 10, ppt: 10, report: 20, project: 40 });

  // UI State
  selectedTeam = signal<Team | null>(null);
  showMarksConfig = signal(false);
  showPublishModal = signal(false);
  deadline = signal(new Date('2024-12-01')); // Updated to a future date
  isAiLoading = signal(false);
  generatedFeedback = signal('');
  newProject = signal<NewProject>({ title: '', type: 'Team', deadline: '', description: '', targetClass: '3CSE01' });

  // Filters
  filterStatus = signal<'All' | 'Completed' | 'Pending' | 'Late'>('All');
  sortBy = signal<'default' | 'marksHigh' | 'submissionEarly'>('default');
  studentSearch = signal('');


  // --- Computed Signals ---

  maxScore = computed(() => this.calculateTotal(this.marksConfig()));
  submittedTeamsCount = computed(() => this.teams().filter(t => t.submissionDate).length);

  daysRemaining = computed(() => {
    const now = new Date();
    const dead = this.deadline();
    const diffTime = dead.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  });

  filteredStudents = computed(() => {
    const search = this.studentSearch().toLowerCase();
    return this.studentsRoster.filter(s =>
      s.name.toLowerCase().includes(search) ||
      s.srn.toLowerCase().includes(search)
    );
  });

  filteredTeams = computed(() => {
    let result = [...this.teams()];
    const status = this.filterStatus();

    if (status !== 'All') {
      if (status === 'Completed') {
        result = result.filter(t => t.projectStatus === 'Completed');
      } else if (status === 'Pending') {
        result = result.filter(t => t.projectStatus.includes('Pending'));
      } else if (status === 'Late') {
        result = result.filter(t => this.getDeadlineStatus(t.submissionDate).label === 'Late Submission');
      }
    }

    const sort = this.sortBy();
    if (sort === 'marksHigh') {
      result.sort((a, b) => this.calculateTotal(b.marks) - this.calculateTotal(a.marks));
    } else if (sort === 'submissionEarly') {
      result.sort((a, b) => new Date(a.submissionDate || '2099-01-01').getTime() - new Date(b.submissionDate || '2099-01-01').getTime());
    }

    return result;
  });

  // --- Utility Methods ---

  getSidebarClass(view: string): string {
    const isActive = this.activeView() === view;
    return `w-full flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-colors ${
      isActive
        ? 'bg-indigo-50 text-indigo-700 font-medium'
        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
    }`;
  }

  getModalClass(isOpen: boolean): string {
    return isOpen ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4' : 'hidden';
  }

  calculateTotal(marks: Marks | MarksConfig): number {
    return Object.values(marks).reduce((a, b) => a + b, 0);
  }

  getDeadlineStatus(submissionDate: string | null): DeadlineStatus {
    if (!submissionDate) return { label: 'Not Submitted', color: 'text-slate-400 bg-slate-100' };
    const submit = new Date(submissionDate);
    const dead = this.deadline();

    if (submit.toDateString() === dead.toDateString()) return { label: 'On Time', color: 'text-amber-600 bg-amber-50' };
    if (submit.getTime() < dead.getTime()) return { label: 'Early', color: 'text-emerald-600 bg-emerald-50' };
    return { label: 'Late Submission', color: 'text-rose-600 bg-rose-50' };
  }

  getStudentTeamInfo(srn: string): { name: string, id: number } | null {
    const team = this.teams().find(t => t.members.some(m => m.srn === srn));
    return team ? { name: team.name, id: team.id } : null;
  }

  getDaysRemainingClass(): string {
    const days = this.daysRemaining();
    return `text-3xl font-black ${days < 3 ? 'text-rose-600' : 'text-slate-700'}`;
  }

  getMarkInputClass(score: number): string {
    return `w-full text-center text-sm p-1 rounded border outline-none focus:ring-2 focus:ring-indigo-200 transition-all ${
      score > 0 ? 'border-indigo-300 bg-indigo-50 font-semibold text-indigo-700' : 'border-slate-200 bg-white text-slate-400'
    }`;
  }

  getScoreClass(team: Team): string {
    const totalScore = this.calculateTotal(team.marks);
    const maxScore = this.maxScore();
    return `text-base font-bold ${totalScore > (maxScore * 0.7) ? 'text-emerald-600' : 'text-slate-700'}`;
  }

  getStudentRowClass(srn: string): string {
    const isUnassigned = !this.getStudentTeamInfo(srn);
    return `hover:bg-slate-50 ${isUnassigned ? 'bg-red-50/30' : ''}`;
  }

  subjectSelectClass(sub: Subject): string {
    return `w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
      this.selectedSubject()?.id === sub.id
        ? 'border-indigo-500 bg-indigo-50 shadow-md ring-1 ring-indigo-500'
        : 'border-slate-200 bg-white hover:border-indigo-300'
    }`;
  }

  classSelectClass(cls: ClassSection): string {
    const isDisabled = !this.selectedSubject();
    return `w-full p-4 rounded-xl border text-left transition-all flex justify-between items-center ${
      this.selectedClass()?.id === cls.id
        ? 'border-violet-500 bg-violet-50 shadow-md ring-1 ring-violet-500'
        : 'border-slate-200 bg-white hover:border-violet-300'
    } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`;
  }

  // --- Handler Methods ---

  selectClass(cls: ClassSection) {
    this.setActiveView('dashboard');
    this.selectedClass.set(cls);
    this.selectedSubject.set(this.subjects[0]); // Default subject for demo
  }

  clearSelection() {
    this.selectedClass.set(null);
    this.selectedSubject.set(null);
  }

  setActiveView(view: 'dashboard' | 'requests' | 'students' | 'classes') {
    this.activeView.set(view);
  }

  onLogout() {
    console.log('User logged out');
  }

  setMarksConfigValue(key: keyof MarksConfig, value: string) {
    const numValue = parseInt(value) || 0;
    this.marksConfig.update(config => ({ ...config, [key]: numValue }));
  }

  setDeadline(target: EventTarget | null) {
    const value = (target as HTMLInputElement)?.value;
    if (value) {
      this.deadline.set(new Date(value));
    }
  }

  updateNewProject(key: keyof NewProject, value: any) {
    this.newProject.update(proj => ({ ...proj, [key]: value }));
  }

  handleMarkChange(teamId: number, field: keyof Marks, value: string) {
    const max = this.marksConfig()[field];
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), max);

    this.teams.update(teams =>
      teams.map(team => {
        if (team.id === teamId) {
          return {
            ...team,
            marks: { ...team.marks, [field]: numValue },
            status: { ...team.status, [field]: true }
          };
        }
        return team;
      })
    );
  }

  handleCheckToggle(teamId: number, field: keyof Marks) {
    this.teams.update(teams =>
      teams.map(team => {
        if (team.id === teamId) {
          const newStatus = !team.status[field];
          return {
            ...team,
            status: { ...team.status, [field]: newStatus },
          };
        }
        return team;
      })
    );
  }

  handleRequestAction(id: number, action: 'approve' | 'reject') {
    const request = this.requests().find(r => r.id === id);
    this.requests.update(prev => prev.filter(req => req.id !== id));

    if (action === 'approve' && request) {
      const duplicateMembers = request.members.filter(m => this.getStudentTeamInfo(m.srn));

      if (duplicateMembers.length > 0) {
        // Re-add request if validation fails (mock UI logic)
        this.requests.update(prev => [...prev, request]);
        alert(`Cannot approve. ${duplicateMembers.map(m => m.name).join(', ')} are already in a team.`);
        return;
      }

      const newTeam: Team = {
        id: Date.now(),
        name: request.teamName,
        projectTitle: request.title,
        submissionDate: null,
        members: request.members.map(m => ({ ...m, email: `${m.srn.toLowerCase()}@uni.edu` })),
        marks: { presentation: 0, assignment: 0, ppt: 0, report: 0, project: 0 },
        status: { presentation: false, assignment: false, ppt: false, report: false, project: false },
        projectStatus: 'Pending Presentation'
      };
      this.teams.update(prev => [...prev, newTeam]);
    }
  }

  handlePublishProject() {
    const project = this.newProject();
    if (!project.title || !project.deadline) return;

    const published: PublishedProject = { ...project, id: Date.now() };
    this.publishedProjects.update(prev => [...prev, published]);
    this.deadline.set(new Date(project.deadline));
    this.showPublishModal.set(false);
    this.newProject.set({ title: '', type: 'Team', deadline: '', description: '', targetClass: '3CSE01' });
  }

  // --- Gemini AI Integration ---

  private async callGemini(prompt: string): Promise<string> {
    const apiKey = "";
    if (!apiKey) {
        console.error("Please add a Gemini API Key to use AI features!");
        return "API Key Missing in Code.";
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
    };

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                if (response.status === 429 && attempts < maxAttempts - 1) {
                    // Too many requests, retry with exponential backoff
                    const delay = Math.pow(2, attempts) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    attempts++;
                    continue;
                }
                throw new Error(`Gemini API Error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.candidates?.[0]?.content?.parts?.[0]?.text || "Could not generate content.";

        } catch (error) {
            console.error("Gemini Error:", error);
            return "Error connecting to AI service.";
        }
    }
    return "Error: Maximum retry attempts reached.";
  }

  async handleAiGenerateDescription() {
    const title = this.newProject().title;
    if (!title) {
      alert("Please enter a project title first.");
      return;
    }
    this.isAiLoading.set(true);
    const subjectName = this.selectedSubject()?.name || 'Computer Science';
    const prompt = `You are a professor. Create a concise, professional project description (max 60 words) and 3 key technical requirements for a university course project on "${subjectName}" titled "${title}".`;

    const text = await this.callGemini(prompt);
    this.newProject.update(prev => ({ ...prev, description: text }));
    this.isAiLoading.set(false);
  }

  async handleAiGenerateFeedback(team: Team) {
    this.generatedFeedback.set('');
    this.isAiLoading.set(true);

    const marks = team.marks;
    const config = this.marksConfig();
    const total = this.calculateTotal(marks);
    const max = this.calculateTotal(config);

    const prompt = `You are a strict but fair university professor. Generate a concise, constructive feedback summary (max 2 sentences) for a student team named "${team.name}" working on "${team.projectTitle}".
    Their scores: Presentation: ${marks.presentation}/${config.presentation}, Assignment: ${marks.assignment}/${config.assignment}, Total: ${total}/${max}.
    If scores are low (<60% of max), suggest specific improvements (e.g., 'focus on data validation'). If high (>85%), congratulate them specifically on their strong points.`;

    const text = await this.callGemini(prompt);
    this.generatedFeedback.set(text);
    this.isAiLoading.set(false);
  }
}