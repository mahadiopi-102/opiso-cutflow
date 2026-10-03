"use client";

import React, { useState, useEffect } from 'react';
import { Clock, ExternalLink, User, Calendar, FileText, MessageCircle, DollarSign, CheckCircle2, Plus, Users, X, Briefcase } from 'lucide-react';

type ProjectStatus = 'To-Do' | 'Assigned' | 'Rough Cut' | 'In Review' | 'Delivered';
type PaymentStatus = 'Unpaid' | 'Paid';

interface Assignee {
  id: string;
  name: string;
  phone: string;
}

interface Project {
  id: string;
  clientName: string;
  projectName: string;
  projectLink: string;
  instructions: string;
  deadline: string;
  assigneeId: string;
  status: ProjectStatus;
  clientPaymentAmount: number;
  clientPaymentStatus: PaymentStatus;
  assigneePaymentAmount: number;
  assigneePaymentStatus: PaymentStatus;
}

const statuses: ProjectStatus[] = ['To-Do', 'Assigned', 'Rough Cut', 'In Review', 'Delivered'];

function getCardColorStyles(status: ProjectStatus) {
  // Vibrant, distinct colors for each column so they are instantly recognizable
  switch (status) {
    case 'To-Do': return 'bg-gray-800/60 border-gray-500/50 shadow-[0_4px_20px_rgba(156,163,175,0.1)]';
    case 'Assigned': return 'bg-amber-900/50 border-amber-500/50 shadow-[0_4px_20px_rgba(245,158,11,0.15)]';
    case 'Rough Cut': return 'bg-fuchsia-900/50 border-fuchsia-500/50 shadow-[0_4px_20px_rgba(217,70,239,0.15)]';
    case 'In Review': return 'bg-blue-900/50 border-blue-500/50 shadow-[0_4px_20px_rgba(59,130,246,0.15)]';
    case 'Delivered': return 'bg-emerald-900/50 border-emerald-500/50 shadow-[0_4px_20px_rgba(16,185,129,0.15)]';
    default: return 'bg-white/10 border-white/20';
  }
}

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignees, setAssignees] = useState<Assignee[]>([]);
  
  // Modals state
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isAssigneeModalOpen, setAssigneeModalOpen] = useState(false);
  
  // New Assignee Form
  const [newAssigneeName, setNewAssigneeName] = useState('');
  const [newAssigneePhone, setNewAssigneePhone] = useState('');

  // Initial Load from LocalStorage
  useEffect(() => {
    const savedProjects = localStorage.getItem('opiso-projects');
    const savedAssignees = localStorage.getItem('opiso-assignees');
    
    if (savedProjects) setProjects(JSON.parse(savedProjects));
    if (savedAssignees) {
      setAssignees(JSON.parse(savedAssignees));
    } else {
      setAssignees([{ id: '1', name: 'Arif', phone: '1234567890' }]);
    }
    setMounted(true);
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('opiso-projects', JSON.stringify(projects));
      localStorage.setItem('opiso-assignees', JSON.stringify(assignees));
    }
  }, [projects, assignees, mounted]);

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('projectId', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newStatus: ProjectStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('projectId');
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  const getWhatsAppLink = (project: Project) => {
    const assignee = assignees.find(a => a.id === project.assigneeId);
    if (!assignee) return '#';
    const text = `Hey ${assignee.name},\n\nYou have been assigned a new video project: *${project.clientName} - ${project.projectName}*.\n\n*Instructions:* ${project.instructions}\n*Deadline:* ${project.deadline}\n*Files:* ${project.projectLink}\n\nPlease let me know when you start the Rough Cut!`;
    return `https://wa.me/${assignee.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;
  };

  const handleAddAssignee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssigneeName || !newAssigneePhone) return;
    setAssignees(prev => [...prev, { id: Date.now().toString(), name: newAssigneeName, phone: newAssigneePhone }]);
    setNewAssigneeName('');
    setNewAssigneePhone('');
  };

  const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProject: Project = {
      id: `PRJ-${Math.floor(Math.random() * 10000)}`,
      clientName: formData.get('clientName') as string,
      projectName: formData.get('projectName') as string,
      projectLink: formData.get('projectLink') as string,
      instructions: formData.get('instructions') as string,
      deadline: formData.get('deadline') as string,
      assigneeId: formData.get('assigneeId') as string,
      clientPaymentAmount: Number(formData.get('clientPaymentAmount')),
      clientPaymentStatus: formData.get('clientPaymentStatus') as PaymentStatus,
      assigneePaymentAmount: Number(formData.get('assigneePaymentAmount')),
      assigneePaymentStatus: formData.get('assigneePaymentStatus') as PaymentStatus,
      status: 'To-Do'
    };
    setProjects(prev => [...prev, newProject]);
    setProjectModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen text-white font-sans selection:bg-white/20 bg-black relative">
      {/* Cinematic Editing Background */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-fixed pointer-events-none"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=3840&auto=format&fit=crop')" }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/95 to-[#0a0a0a] pointer-events-none" />

      <div className="relative z-10 p-6 md:p-12">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Opiso CutFlow</h1>
            <p className="text-white/60 text-sm md:text-base font-medium flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Global Project Management Studio
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setAssigneeModalOpen(true)}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              <Users className="w-4 h-4" /> Team
            </button>
            <button 
              onClick={() => setProjectModalOpen(true)}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              <Plus className="w-4 h-4" /> New Project
            </button>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar min-h-[65vh]">
          {statuses.map((status) => (
            <div 
              key={status} 
              className="flex-1 min-w-[340px] max-w-[420px] snap-center bg-black/40 backdrop-blur-xl rounded-3xl p-4 border border-white/10 shadow-2xl"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-sm font-bold tracking-widest uppercase text-white/80 flex items-center gap-2">
                  {status}
                  <span className="flex items-center justify-center bg-white/20 text-white text-xs rounded-full h-5 w-5">
                    {projects.filter((p) => p.status === status).length}
                  </span>
                </h2>
              </div>

              {/* Column Cards */}
              <div className="flex flex-col gap-4 min-h-[100px]">
                {projects
                  .filter((p) => p.status === status)
                  .map((project) => {
                    const assignee = assignees.find(a => a.id === project.assigneeId);
                    
                    return (
                      <div 
                        key={project.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, project.id)}
                        className={`rounded-2xl p-5 backdrop-blur-md transition-all duration-300 cursor-grab active:cursor-grabbing border ${getCardColorStyles(status)} hover:brightness-110 hover:scale-[1.01]`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-mono text-xs text-white/60 tracking-wider bg-black/40 px-2 py-1 rounded">
                            {project.id}
                          </span>
                        </div>

                        <h3 className="font-serif italic text-2xl mb-1 text-white">{project.clientName}</h3>
                        <p className="font-medium text-sm text-white/80 leading-snug mb-5">{project.projectName}</p>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-start gap-2 text-white/60 text-xs">
                            <FileText className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                            <span className="leading-relaxed">{project.instructions}</span>
                          </div>
                          
                          {project.projectLink && (
                            <a href={project.projectLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-300 hover:text-blue-200 text-xs font-bold w-fit transition-colors bg-blue-500/10 px-2 py-1 rounded">
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open Assets
                            </a>
                          )}
                        </div>

                        {/* Dual Payment Tracking */}
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          {/* Client Payment */}
                          <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                            <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">Client Paid You</span>
                            <button 
                              onClick={() => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, clientPaymentStatus: p.clientPaymentStatus === 'Paid' ? 'Unpaid' : 'Paid' } : p))}
                              className={`w-full text-xs font-bold px-2 py-1.5 rounded flex justify-center items-center gap-1 cursor-pointer transition-colors ${project.clientPaymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                              {project.clientPaymentStatus === 'Paid' ? <CheckCircle2 className="size-3" /> : <DollarSign className="size-3" />}
                              ${project.clientPaymentAmount}
                            </button>
                          </div>
                          {/* Assignee Payment */}
                          <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                            <span className="block text-[9px] uppercase tracking-wider text-white/40 mb-1">You Paid Editor</span>
                            <button 
                              onClick={() => setProjects(prev => prev.map(p => p.id === project.id ? { ...p, assigneePaymentStatus: p.assigneePaymentStatus === 'Paid' ? 'Unpaid' : 'Paid' } : p))}
                              className={`w-full text-xs font-bold px-2 py-1.5 rounded flex justify-center items-center gap-1 cursor-pointer transition-colors ${project.assigneePaymentStatus === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                            >
                              {project.assigneePaymentStatus === 'Paid' ? <CheckCircle2 className="size-3" /> : <DollarSign className="size-3" />}
                              ${project.assigneePaymentAmount}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2 text-xs font-bold text-white/80 bg-white/10 px-2 py-1 rounded">
                            <User className="w-3.5 h-3.5" />
                            {assignee ? assignee.name : 'Unassigned'}
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded ${
                            new Date(project.deadline) < new Date() ? 'bg-red-500/30 text-red-300' : 'bg-white/10 text-white/80'
                          }`}>
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        </div>

                        {/* WhatsApp Notify Button */}
                        {status === 'Assigned' && assignee?.phone && (
                          <a 
                            href={getWhatsAppLink(project)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#25D366] text-black hover:bg-[#25D366]/90 transition-colors py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#25D366]/20"
                          >
                            <MessageCircle className="size-4" />
                            Notify {assignee.name}
                          </a>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* --- MODALS --- */}
        {/* New Project Modal */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5">
                <h2 className="text-2xl font-bold tracking-tight">Create New Project</h2>
                <button onClick={() => setProjectModalOpen(false)} className="text-white/50 hover:text-white bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateProject} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Client Name</label>
                    <input required name="clientName" className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Project Name</label>
                    <input required name="projectName" className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Assets / Frame.io Link</label>
                  <input required name="projectLink" type="url" className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Instructions / Scope</label>
                  <textarea required name="instructions" rows={3} className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Deadline</label>
                    <input required name="deadline" type="date" className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 [color-scheme:dark] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/60 mb-2 uppercase tracking-wider">Assign To</label>
                    <select required name="assigneeId" className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 text-white transition-colors">
                      <option value="">Select a team member...</option>
                      {assignees.map(a => (
                        <option key={a.id} value={a.id}>{a.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dual Payment Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mt-4">
                  <h3 className="text-sm font-bold mb-4 text-white/80">Financial Tracking</h3>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-green-400 mb-1 uppercase tracking-wider">Client Pays You ($)</label>
                        <input required name="clientPaymentAmount" type="number" min="0" className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/50" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-1 uppercase tracking-wider">Status</label>
                        <select required name="clientPaymentStatus" className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-500/50 text-white">
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-amber-400 mb-1 uppercase tracking-wider">You Pay Editor ($)</label>
                        <input required name="assigneePaymentAmount" type="number" min="0" className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-white/50 mb-1 uppercase tracking-wider">Status</label>
                        <select required name="assigneePaymentStatus" className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500/50 text-white">
                          <option value="Unpaid">Unpaid</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex justify-end gap-4">
                  <button type="button" onClick={() => setProjectModalOpen(false)} className="px-6 py-3 text-sm font-bold text-white/70 hover:text-white transition-colors">Cancel</button>
                  <button type="submit" className="bg-white text-black px-8 py-3 rounded-xl text-sm font-black hover:bg-white/90 transition-colors shadow-xl">Create Project</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Assignee Manager Modal */}
        {isAssigneeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
              <div className="flex justify-between items-center p-6 border-b border-white/10 shrink-0 bg-white/5">
                <h2 className="text-xl font-bold tracking-tight">Team Roster</h2>
                <button onClick={() => setAssigneeModalOpen(false)} className="text-white/50 hover:text-white bg-white/10 p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                {assignees.length === 0 ? (
                  <p className="text-white/40 text-sm text-center py-4">No team members added yet.</p>
                ) : (
                  <div className="space-y-3 mb-8">
                    {assignees.map(a => (
                      <div key={a.id} className="flex justify-between items-center bg-black border border-white/10 p-4 rounded-xl">
                        <div>
                          <p className="font-bold text-sm text-white">{a.name}</p>
                          <p className="text-xs text-white/50 font-mono mt-1">{a.phone}</p>
                        </div>
                        <button 
                          onClick={() => setAssignees(prev => prev.filter(x => x.id !== a.id))}
                          className="text-red-400 hover:text-red-300 text-xs font-bold px-3 py-1.5 bg-red-400/10 rounded-lg transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <h3 className="text-xs font-bold text-white/70 mb-3 uppercase tracking-widest border-t border-white/10 pt-6">Add New Member</h3>
                <form onSubmit={handleAddAssignee} className="space-y-3">
                  <input 
                    required 
                    placeholder="Name (e.g. Arif)" 
                    value={newAssigneeName}
                    onChange={e => setNewAssigneeName(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" 
                  />
                  <input 
                    required 
                    placeholder="WhatsApp Number (with country code)" 
                    value={newAssigneePhone}
                    onChange={e => setNewAssigneePhone(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500/50 transition-colors" 
                  />
                  <button type="submit" className="w-full bg-white text-black hover:bg-white/90 px-4 py-3 rounded-xl text-sm font-bold transition-colors shadow-lg">
                    Save Assignee
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
