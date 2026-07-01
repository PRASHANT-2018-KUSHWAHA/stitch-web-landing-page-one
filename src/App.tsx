import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Check, 
  Copy, 
  Folder, 
  FileText, 
  Image, 
  BarChart3, 
  MoreHorizontal, 
  ArrowRight, 
  Calendar, 
  Clock, 
  User, 
  Send,
  X,
  Volume2,
  Settings,
  XCircle,
  HelpCircle
} from "lucide-react";
import { TONE_OPTIONS, ASSET_TYPES, TEAM_USE_CASES, NEWS_ARTICLES, INITIAL_COMMENTS } from "./data/mockData";
import { BrandFile, UserComment, NewsArticle } from "./types";
import DashboardView from "./components/DashboardView";
import PlaybookView from "./components/PlaybookView";
import PricingView from "./components/PricingView";

export default function App() {
  // Navigation states
  const [activeTab, setActiveTab] = useState<string>("Product");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<"product" | "dashboard" | "playbook" | "pricing">("product");

  // File explorer states
  const [files, setFiles] = useState<BrandFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<BrandFile | null>(null);
  const [isAddingFile, setIsAddingFile] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [newFileType, setNewFileType] = useState<string>("description");
  const [newFileCategory, setNewFileCategory] = useState<string>("Strategy");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [fileError, setFileError] = useState<string>("");

  // Gemini generator states
  const [selectedAsset, setSelectedAsset] = useState<string>("email");
  const [selectedTone, setSelectedTone] = useState<string>("confident");
  const [promptInput, setPromptInput] = useState<string>(
    "Draft a product announcement email for the new 'Pro' tier, adopting our confident but approachable tone."
  );
  const [generatedResult, setGeneratedResult] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationMode, setGenerationMode] = useState<"demo" | "live" | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Collage interactive states
  const [processingProgress, setProcessingProgress] = useState<number>(78);
  const [isProcessingActive, setIsProcessingActive] = useState<boolean>(true);
  const [isAutoSyncActive, setIsAutoSyncActive] = useState<boolean>(true);
  const [collageComments, setCollageComments] = useState<string[]>([
    "This is so good!!!!",
    "Absolutely loving the new brand layout",
    "The alignment looks perfect on mobile"
  ]);
  const [newCommentInput, setNewCommentInput] = useState<string>("");
  const [isCommentInputVisible, setIsCommentInputVisible] = useState<boolean>(false);

  // Use Case filter state
  const [selectedUseCaseCategory, setSelectedUseCaseCategory] = useState<string>("Strategy");

  // User comments/testimonial queue state
  const [testimonials, setTestimonials] = useState<UserComment[]>(INITIAL_COMMENTS);
  const [newTestimonialName, setNewTestimonialName] = useState<string>("");
  const [newTestimonialRole, setNewTestimonialRole] = useState<string>("");
  const [newTestimonialText, setNewTestimonialText] = useState<string>("");
  const [showTestimonialForm, setShowTestimonialForm] = useState<boolean>(false);

  // Modals
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showDemoModal, setShowDemoModal] = useState<boolean>(false);
  const [demoDate, setDemoDate] = useState<string>("");
  const [demoTime, setDemoTime] = useState<string>("");
  const [demoName, setDemoName] = useState<string>("");
  const [demoEmail, setDemoEmail] = useState<string>("");
  const [demoSubmitted, setDemoSubmitted] = useState<boolean>(false);

  // Load files from express server
  const fetchFiles = async () => {
    try {
      const res = await fetch("/api/files");
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
        if (data.length > 0 && !selectedFile) {
          setSelectedFile(data[0]);
        }
      }
    } catch (e) {
      console.error("Failed to load files from server. Using local fallback.");
      // Fallback local structures if API is unreachable
      const defaultFiles = [
        { id: "1", name: "Lumio_Strategy.pdf", type: "folder", category: "Strategy", icon: "folder", date: "June 25, 2026", size: "4.2 MB", content: "Comprehensive brand strategy guidelines for Lumio, containing visual style principles, mission alignments, and market positioning." },
        { id: "2", name: "BrandBook_v2.docx", type: "description", category: "Guidelines", icon: "description", date: "June 28, 2026", size: "1.8 MB", content: "Master brand guidelines. Covers typography pairing, spacing grids, brand voice principles, and standard logo usage rules." },
        { id: "3", name: "Campaign_Assets.zip", type: "image", category: "Assets", icon: "image", date: "June 29, 2026", size: "48.5 MB", content: "High-resolution graphic assets, Figma exports, and social media image templates for the summer launch campaign." },
        { id: "4", name: "Q3_Performance.xlsx", type: "analytics", category: "Strategy", icon: "analytics", date: "June 30, 2026", size: "1.2 MB", content: "Q3 performance analysis metrics, click-through rates on visual campaigns, and asset ROI calculations." }
      ];
      setFiles(defaultFiles);
      setSelectedFile(defaultFiles[0]);
    }
  };

  useEffect(() => {
    fetchFiles();

    // Scroll listener
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Update prompt placeholder when asset type changes
  useEffect(() => {
    const matchedAsset = ASSET_TYPES.find(a => a.id === selectedAsset);
    if (matchedAsset) {
      setPromptInput(matchedAsset.promptPlaceholder);
    }
  }, [selectedAsset]);

  // Handle file progress simulation in collage
  useEffect(() => {
    let interval: any;
    if (isProcessingActive) {
      interval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessingActive]);

  // Handle adding custom file
  const handleCreateFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) {
      setFileError("Please provide a name for the brand resource.");
      return;
    }

    setFileError("");
    try {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newFileName,
          type: newFileType,
          category: newFileCategory,
          content: newFileContent || `Custom brand resource compiled for ${newFileCategory} category.`
        })
      });

      if (res.ok) {
        const file = await res.json();
        setFiles(prev => [...prev, file]);
        setSelectedFile(file);
        setNewFileName("");
        setNewFileContent("");
        setIsAddingFile(false);
      } else {
        setFileError("Failed to store file on server.");
      }
    } catch (err) {
      setFileError("Connection error while creating files.");
    }
  };

  // Handle deleting file
  const handleDeleteFile = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/files/${id}`, { method: "DELETE" });
      if (res.ok) {
        setFiles(prev => {
          const filtered = prev.filter(f => f.id !== id);
          if (selectedFile?.id === id) {
            setSelectedFile(filtered.length > 0 ? filtered[0] : null);
          }
          return filtered;
        });
      }
    } catch (err) {
      console.error("Failed to delete file.");
    }
  };

  // Handle generating assets via Gemini
  const handleGenerateAsset = async () => {
    setIsGenerating(true);
    setGeneratedResult("");
    setCopied(false);

    try {
      const activeToneObject = TONE_OPTIONS.find(t => t.id === selectedTone);
      const toneValue = activeToneObject ? activeToneObject.value : "confident";

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptInput,
          tone: toneValue,
          assetType: selectedAsset
        })
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedResult(data.text);
        setGenerationMode(data.mode);
      } else {
        setGeneratedResult("An error occurred while connecting to Lumio Studio services. Please verify your system configuration.");
      }
    } catch (err) {
      setGeneratedResult("Network error. Unable to establish a connection with the creative intelligence network.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle clipboard copy
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle Demo form submission
  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoName || !demoEmail || !demoDate || !demoTime) return;
    setDemoSubmitted(true);
    setTimeout(() => {
      setDemoSubmitted(false);
      setShowDemoModal(false);
      setDemoName("");
      setDemoEmail("");
      setDemoDate("");
      setDemoTime("");
    }, 3000);
  };

  // Handle adding collage comment
  const handleAddCollageComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentInput.trim()) {
      setCollageComments(prev => [...prev, newCommentInput.trim()]);
      setNewCommentInput("");
      setIsCommentInputVisible(false);
    }
  };

  // Handle testimonial submission
  const handleAddTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonialName || !newTestimonialText) return;

    const newFeedback: UserComment = {
      id: String(testimonials.length + 1),
      author: newTestimonialName,
      role: newTestimonialRole || "Creative Partner",
      text: newTestimonialText,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
      date: "Today"
    };

    setTestimonials(prev => [newFeedback, ...prev]);
    setNewTestimonialName("");
    setNewTestimonialRole("");
    setNewTestimonialText("");
    setShowTestimonialForm(false);
  };

  // Helper file icons mapper
  const renderFileIcon = (iconName: string) => {
    switch (iconName) {
      case "folder": return <Folder className="w-5 h-5 text-[#FF4B2B]" />;
      case "image": return <Image className="w-5 h-5 text-[#E94057]" />;
      case "analytics": return <BarChart3 className="w-5 h-5 text-[#F27121]" />;
      default: return <FileText className="w-5 h-5 text-[#8A2387]" />;
    }
  };

  return (
    <div id="lumio-app-root" className="text-text font-sans bg-page-bg min-h-screen relative overflow-x-hidden antialiased selection:bg-black selection:text-white pb-16">
      
      {/* 1. Floating Navigation Header */}
      <header className="fixed top-[24px] left-0 right-0 z-50 flex items-center justify-center px-4 w-full pointer-events-none transition-all duration-300">
        <div className={`pointer-events-auto w-full max-w-[760px] flex items-center justify-between bg-black/95 backdrop-blur-xl rounded-full px-2 py-2 shadow-xl border border-white/10 h-[56px] transition-all duration-300 ${isScrolled ? 'scale-95 shadow-2xl' : 'scale-100'}`}>
          <div className="flex items-center gap-4 md:gap-6 pl-3 flex-1 min-w-0">
            <button 
              onClick={() => {
                setActiveView("product");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-[34px] h-[34px] rounded-full border border-page-bg/80 flex items-center justify-center shrink-0 hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-page-bg font-black text-sm leading-none">L</span>
            </button>
            
            <nav className="flex items-center gap-3 md:gap-6 overflow-x-auto scrollbar-none flex-1 py-1">
              {[
                { label: "Product", id: "product" },
                { label: "Dashboard", id: "dashboard" },
                { label: "Playbook", id: "playbook" },
                { label: "Pricing", id: "pricing" }
              ].map((view) => (
                <button 
                  key={view.id}
                  onClick={() => {
                    setActiveView(view.id as any);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`font-medium tracking-wide text-[10px] md:text-xs uppercase cursor-pointer transition-colors duration-300 shrink-0 ${activeView === view.id ? 'text-[#FF416C]' : 'text-page-bg/75 hover:text-page-bg'}`}
                >
                  {view.label}
                </button>
              ))}
            </nav>
          </div>
          
          <button 
            onClick={() => setShowDemoModal(true)}
            className="border border-white/30 text-page-bg bg-white/5 hover:bg-page-bg hover:text-black hover:border-page-bg font-semibold rounded-full transition-all duration-300 shrink-0 flex items-center px-3.5 md:px-5 text-[9px] md:text-[10px] h-[36px] uppercase tracking-wider cursor-pointer ml-2"
          >
            Book a demo
          </button>
        </div>
      </header>

      <main className={activeView === "product" ? "" : "pt-[80px]"}>
        {activeView === "product" && (
          <>
            {/* 1. Hero Section */}
        <section className="pt-[180px] md:pt-[220px] px-6 max-w-[1728px] mx-auto flex flex-col items-center text-center relative overflow-visible bg-page-bg pb-[100px] md:pb-[140px]">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-soft-card-2 border border-line/40 rounded-full mb-6 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Lumio Version 2.4 Live</span>
          </div>
          
          <h1 className="font-sans text-[48px] md:text-[88px] font-extrabold tracking-tighter leading-[1.05] text-balance max-w-5xl mb-8 text-text">
            Bring every team <br className="hidden md:inline"/>
            <span className="bg-gradient-to-r from-[#FF416C] via-[#FF4B2B] to-[#F27121] bg-clip-text text-transparent">into sharp focus</span>
          </h1>
          
          <p className="font-sans text-base md:text-xl text-muted max-w-2xl mb-12 leading-relaxed">
            Unify your strategy, sync guidelines across the enterprise, and empower creative assets generation with safe, contextual brand intelligence.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16">
            <button 
              onClick={() => {
                document.getElementById("studio-section")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-black hover:bg-neutral-800 text-white rounded-full px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-transform hover:-translate-y-0.5 cursor-pointer shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-[#FF4B2B]" />
              Try Studio Playground
            </button>
            <button 
              onClick={() => setShowDemoModal(true)}
              className="bg-white hover:bg-neutral-50 text-black border border-line rounded-full px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              Request Custom Demo
            </button>
          </div>

          <div className="w-full max-w-[1360px] bg-panel-bg overflow-hidden shadow-2xl relative z-10 rounded-[30px] md:rounded-[40px] h-[340px] md:h-[680px]">
            <img 
              alt="Vibrant abstract gradient representing brand intelligence" 
              className="w-full h-full object-cover select-none" 
              src="https://images.unsplash.com/photo-1776009009253-759b31cd3908?q=80&w=2664&auto=format&fit=crop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            
            {/* Embedded interactive hint on the hero image */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
              <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-left">
                <span className="text-[10px] uppercase tracking-wider text-white-soft font-bold">Ambient Brand Environment</span>
                <p className="text-white text-xs mt-1">Calibrated to 6000K daylight spectrum</p>
              </div>
              <button 
                onClick={() => {
                  document.getElementById("brand-os-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-white text-black p-3 rounded-full hover:scale-110 transition-transform shadow-md"
                title="Browse Brand OS"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* 2. Trust Strip with Looping Marquee */}
        <section className="py-12 border-y border-line/30 bg-page-bg relative overflow-hidden">
          <div className="w-full flex flex-col items-center">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest mb-6">Empowering Creative Leaders Across Brands</span>
            
            <div className="w-full overflow-hidden relative">
              {/* Left/Right blur gradients for seamless look */}
              <div className="absolute top-0 left-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-page-bg to-transparent z-10 pointer-events-none"></div>
              <div className="absolute top-0 right-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-page-bg to-transparent z-10 pointer-events-none"></div>
              
              <div className="flex whitespace-nowrap overflow-x-hidden w-full">
                <div className="animate-marquee-scroll flex gap-12 md:gap-24 items-center">
                  {["Northline", "Arcform", "Velo Group", "Juniper", "Meridian", "Krypton", "Apex Core", "Spectral"].map((brand, idx) => (
                    <div key={`${brand}-${idx}`} className="flex items-center gap-3 cursor-default hover:scale-105 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-[#FF416C]"></div>
                      <span className="font-sans text-xl md:text-3xl font-extrabold tracking-tighter text-[#1b1b1b] opacity-80 hover:opacity-100 transition-opacity">
                        {brand}
                      </span>
                    </div>
                  ))}
                  {/* Duplicate content to loop seamless */}
                  {["Northline", "Arcform", "Velo Group", "Juniper", "Meridian", "Krypton", "Apex Core", "Spectral"].map((brand, idx) => (
                    <div key={`${brand}-dup-${idx}`} className="flex items-center gap-3 cursor-default hover:scale-105 transition-transform">
                      <div className="w-2 h-2 rounded-full bg-[#FF4B2B]"></div>
                      <span className="font-sans text-xl md:text-3xl font-extrabold tracking-tighter text-[#1b1b1b] opacity-80 hover:opacity-100 transition-opacity">
                        {brand}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Floating Visual Collage (Interactive Widgets) */}
        <section id="collage-section" className="min-h-[1100px] md:min-h-[1400px] w-full max-w-[1728px] mx-auto relative overflow-hidden bg-page-bg py-24 px-6">
          
          {/* Central Anchor Text */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none mt-20 text-center">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#FF416C] mb-4">Interactive System</span>
            <h2 className="font-sans text-[56px] md:text-[120px] font-black text-text/10 tracking-tighter leading-[0.9]">
              Creative<br />Intelligence
            </h2>
          </div>

          {/* Interactive Widget 1: Top-left Card with Simulation Control */}
          <div 
            id="widget-processing"
            className="md:absolute rounded-[32px] overflow-hidden bg-white-card border border-line/40 shadow-2xl p-4 flex flex-col justify-between mb-8 md:mb-0 transition-all hover:shadow-3xl"
            style={{ left: "8%", top: "10%", width: "100%", maxWidth: "340px", height: "300px", zIndex: 5 }}
          >
            <div className="relative h-2/3 rounded-2xl overflow-hidden mb-3">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1751467928435-22c8826b5310?q=80&w=1064&auto=format&fit=crop" 
                alt="Brand asset auditing"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 rounded-full">
                <span className="text-[9px] text-white font-bold uppercase tracking-wider">Asset Analyzer</span>
              </div>
            </div>

            <div className="bg-soft-card-2 rounded-xl p-3 border border-line/30">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isProcessingActive ? 'bg-[#FF416C] animate-ping' : 'bg-muted'}`}></span>
                  <span className="font-sans text-[10px] text-text font-bold uppercase tracking-wider">
                    {isProcessingActive ? "Evaluating Alignment..." : "Auditor Paused"}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-text font-bold">{processingProgress}%</span>
              </div>
              <div className="w-full bg-black/10 rounded-full h-2 mb-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] h-full rounded-full transition-all duration-300" 
                  style={{ width: `${processingProgress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-muted">Style compliance index</span>
                <button 
                  onClick={() => setIsProcessingActive(!isProcessingActive)}
                  className="px-2.5 py-1 rounded bg-black hover:bg-neutral-800 text-white text-[9px] uppercase font-bold tracking-wider transition-all"
                >
                  {isProcessingActive ? "Pause" : "Resume"}
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Widget 2: Top-right Tall Card */}
          <div 
            id="widget-awesome"
            className="md:absolute rounded-[32px] overflow-hidden bg-white-card border border-line/40 shadow-2xl p-4 flex flex-col mb-8 md:mb-0 transition-all hover:-translate-y-2"
            style={{ right: "10%", top: "12%", width: "100%", maxWidth: "300px", height: "340px", zIndex: 5 }}
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1762532264999-7dde57d37f22?q=80&w=2664&auto=format&fit=crop"
                alt="Abstract art"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"></div>
              
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md border border-white/50 flex items-center justify-center shadow-md animate-pulse">
                <Sparkles className="w-4 h-4 text-[#FF4B2B]" />
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-[10px] bg-[#FF416C] text-white px-2 py-0.5 rounded uppercase font-bold tracking-wide">AI Recommended</span>
                <h4 className="text-white text-sm font-bold mt-1 tracking-tight">Summer Campaign Palette</h4>
              </div>
            </div>
          </div>

          {/* Interactive Widget 3: Mid-left Glass UI Sync Switcher */}
          <div 
            id="widget-sync"
            className="md:absolute rounded-[28px] bg-white/95 border border-line/50 shadow-2xl p-5 flex flex-col mb-8 md:mb-0 hover:border-[#FF416C] transition-all"
            style={{ left: "5%", top: "42%", width: "100%", maxWidth: "280px", zIndex: 15 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-xs font-bold text-text uppercase tracking-wide">Sync Engine</span>
              <div 
                onClick={() => setIsAutoSyncActive(!isAutoSyncActive)}
                className={`w-10 h-6 rounded-full relative shadow-inner cursor-pointer transition-colors duration-300 ${isAutoSyncActive ? 'bg-[#FF4B2B]' : 'bg-neutral-300'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${isAutoSyncActive ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF416C] to-[#FF4B2B] flex items-center justify-center shadow-md transition-transform ${isAutoSyncActive ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
                <span className="material-symbols-outlined text-white text-sm">sync</span>
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-xs font-bold text-text">Creative Cloud</span>
                <span className="text-[11px] text-muted leading-tight">
                  {isAutoSyncActive ? "Standardized Voice Active" : "Disconnected"}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Widget 4: Mid-right Audio Guidelines */}
          <div 
            id="widget-guidelines"
            className="md:absolute rounded-[32px] overflow-hidden bg-white-card border border-line/40 shadow-2xl p-4 flex flex-col justify-between mb-8 md:mb-0"
            style={{ right: "6%", top: "48%", width: "100%", maxWidth: "340px", height: "260px", zIndex: 5 }}
          >
            <div className="relative h-2/3 rounded-2xl overflow-hidden mb-3">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1607874089816-bf5af74fe2c5?q=80&w=2070&auto=format&fit=crop"
                alt="Design meeting"
              />
              <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/60 shadow-sm flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div>
                <span className="font-sans text-[10px] font-bold text-text uppercase tracking-wider">Audio &amp; Music Sync</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[9px] text-muted uppercase tracking-wider font-bold">Acoustic Alignment</span>
                <h5 className="text-xs font-bold text-text">Ambient Sonic Brand guidelines</h5>
              </div>
              <button 
                onClick={() => {
                  const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
                  audio.volume = 0.1;
                  audio.play().catch(() => console.log("Sound simulation requested, auto-blocked by iframe settings. Expected behavior."));
                }}
                className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors" 
                title="Play Brand Chime Sample"
              >
                <Volume2 className="w-4 h-4 text-text" />
              </button>
            </div>
          </div>

          {/* Interactive Widget 5: Bottom-left with voice badge */}
          <div 
            id="widget-voice"
            className="md:absolute rounded-[32px] overflow-hidden bg-white-card border border-line/40 shadow-2xl p-4 flex flex-col justify-between mb-8 md:mb-0"
            style={{ left: "12%", top: "70%", width: "100%", maxWidth: "360px", height: "280px", zIndex: 5 }}
          >
            <div className="relative h-3/4 rounded-2xl overflow-hidden mb-3">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1758369636841-241369c12f3b?q=80&w=1064&auto=format&fit=crop"
                alt="Brand voice"
              />
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/50 shadow-sm flex items-center gap-1.5">
                <span className="material-symbols-outlined text-text text-sm">record_voice_over</span>
                <span className="font-sans text-[9px] font-bold text-text uppercase tracking-wider">Empathetic Voice Profile</span>
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold">Standard dictionary limits updated</span>
              <span className="text-[10px] text-muted">Vetted 1h ago</span>
            </div>
          </div>

          {/* Interactive Widget 6: Bottom-right wide block */}
          <div 
            id="widget-creative"
            className="md:absolute rounded-[32px] overflow-hidden bg-white-card border border-line/40 shadow-2xl p-4 flex flex-col justify-between mb-8 md:mb-0"
            style={{ right: "12%", top: "76%", width: "100%", maxWidth: "360px", height: "260px", zIndex: 5 }}
          >
            <div className="relative h-3/4 rounded-2xl overflow-hidden mb-3">
              <img 
                className="w-full h-full object-cover" 
                src="https://images.unsplash.com/photo-1661962399580-80301d32d791?q=80&w=1625&auto=format&fit=crop"
                alt="Creative asset"
              />
              <div className="absolute top-3 left-3 px-3 py-1 bg-[#1b1b1b]/80 text-white rounded-full text-[9px] font-bold uppercase tracking-wider">
                Vetted Campaign File
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-xs font-bold text-[#FF416C]">Campaign Launch Assets</span>
              <span className="text-[10px] text-muted">32 Files</span>
            </div>
          </div>

          {/* Interactive Widget 7: Floating Interactive Comments Box */}
          <div 
            id="widget-comment"
            className="md:absolute bg-white/95 backdrop-blur-2xl rounded-2xl flex flex-col p-4 shadow-2xl border border-line/40 transition-transform duration-300 hover:scale-105"
            style={{ left: "42%", top: "86%", width: "100%", maxWidth: "380px", zIndex: 20 }}
          >
            <div className="flex items-center gap-3.5 pb-3 border-b border-line/20">
              <div className="w-9 h-9 rounded-full bg-soft-card overflow-hidden shadow-sm border border-white">
                <img 
                  className="w-full h-full object-cover animate-pulse" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxUZpAK7kBAK1H5Anlz-i_nh19XyaGUt1hLDC6ZASnuBK2vRcwFDP46vx7HodMWCGvWJVA3aKLfp00pDRGNPsH0LVYvOGBSQ1KJIx2wTCxFcEJMNlnv9DHJKT0wyVelxRunXJN3d41Z2MPDK4poxQF_iybQaYL4ebVjC52RWnq9U6Y-VA7k5seZ7Z4c1n3nq7ply6CwSNm8-OH_B6wae1-h-Zmn2y3jh9urDyal2zhahuy408MHHCcPTmA9TNKUOA7WEsjuEy1iMvC"
                  alt="Alex avatar"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-text">Alex Morgan</span>
                  <span className="text-[9px] text-muted">2m ago</span>
                </div>
                <span className="text-[10px] text-muted leading-none">VP of Brand, Northline</span>
              </div>
            </div>

            {/* Loop comments */}
            <div className="max-h-[120px] overflow-y-auto space-y-2.5 my-3 pr-1">
              {collageComments.map((commentText, idx) => (
                <div key={idx} className="bg-soft-card-2 p-2.5 rounded-xl border border-line/20 text-xs">
                  <p className="text-text font-medium leading-relaxed">{commentText}</p>
                </div>
              ))}
            </div>

            {/* Post reply widget */}
            {isCommentInputVisible ? (
              <form onSubmit={handleAddCollageComment} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="Post comment to team feed..."
                  value={newCommentInput}
                  onChange={(e) => setNewCommentInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-soft-card-2 border border-line rounded-lg focus:outline-none focus:border-[#FF4B2B]"
                />
                <button 
                  type="submit"
                  className="bg-black text-white p-1.5 rounded-lg hover:bg-neutral-800 shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button 
                onClick={() => setIsCommentInputVisible(true)}
                className="w-full text-center py-2 bg-neutral-100 hover:bg-neutral-200 transition-colors text-[10px] text-text font-bold uppercase tracking-wider rounded-lg"
              >
                + Post A Message
              </button>
            )}
          </div>

        </section>

        {/* 4. Manifesto Statement Block */}
        <section className="py-24 md:py-36 px-6 max-w-[1728px] mx-auto relative flex flex-col items-center text-center bg-page-bg">
          <div className="absolute top-0 right-[10%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] opacity-10 pointer-events-none">
            <svg className="w-full h-full" fill="none" stroke="url(#manifesto-grad)" strokeWidth="0.5" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="manifesto-grad" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor="#FF416C"></stop>
                  <stop offset="100%" stopColor="#FF4B2B"></stop>
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48"></circle>
              <ellipse cx="50" cy="50" rx="24" ry="48"></ellipse>
              <ellipse cx="50" cy="50" rx="48" ry="24"></ellipse>
              <line x1="2" x2="98" y1="50" y2="50"></line>
              <line x1="50" x2="50" y1="2" y2="98"></line>
            </svg>
          </div>
          
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.3em] mb-4">THE OPERATING PRINCIPLE</span>
          <h2 className="font-sans text-[28px] md:text-[48px] leading-[1.2] text-balance tracking-tight text-text relative z-10 max-w-4xl font-light">
            As intelligent agents expand across the modern enterprise, the need for a <span className="font-semibold bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] bg-clip-text text-transparent">singular, uncompromised source of truth</span> has never been more critical. Lumio unifies your creative DNA.
          </h2>
        </section>

        {/* 5. Brand OS Section (Dynamic File Explorer Integration) */}
        <section id="brand-os-section" className="py-24 px-6 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Interactive File Explorer Container (Left) */}
            <div className="lg:col-span-7 bg-[#1b1b1b] text-white-soft rounded-[32px] md:rounded-[40px] p-6 md:p-8 min-h-[640px] flex flex-col justify-between relative overflow-hidden border border-white/10 shadow-2xl">
              
              {/* Header inside explorer */}
              <div>
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="font-mono text-xs font-semibold text-white/50 ml-3">/brand_os_database</span>
                  </div>
                  
                  <button 
                    onClick={() => setIsAddingFile(!isAddingFile)}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-[#FF416C] hover:text-white text-white-soft text-[10px] px-3.5 py-2 rounded-full font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    {isAddingFile ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {isAddingFile ? "Cancel" : "Add Brand Asset"}
                  </button>
                </div>

                {/* Add Custom Asset Form */}
                {isAddingFile && (
                  <form onSubmit={handleCreateFile} className="bg-white/5 border border-white/10 rounded-2xl p-5 my-6 space-y-4 animate-fade-in text-white">
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF4B2B]" /> Commit New Document
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-white/60 mb-1.5">Asset Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. LogoGuidelines_v4" 
                          value={newFileName}
                          onChange={(e) => setNewFileName(e.target.value)}
                          className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-[#FF416C]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-white/60 mb-1.5">Asset Type</label>
                        <select 
                          value={newFileType} 
                          onChange={(e) => setNewFileType(e.target.value)}
                          className="w-full bg-neutral-800 text-white rounded-lg px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-[#FF416C]"
                        >
                          <option value="folder">Folder / Suite</option>
                          <option value="description">Style Document</option>
                          <option value="image">Media Package</option>
                          <option value="analytics">Performance Report</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase font-semibold text-white/60 mb-1.5">Corporate Category</label>
                        <select 
                          value={newFileCategory} 
                          onChange={(e) => setNewFileCategory(e.target.value)}
                          className="w-full bg-neutral-800 text-white rounded-lg px-3 py-2 text-xs border border-white/10 focus:outline-none"
                        >
                          <option value="Strategy">Strategy Team</option>
                          <option value="Marketing">Marketing Systems</option>
                          <option value="Design">Visual Standards</option>
                          <option value="Sales">Go-To-Market</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase font-semibold text-white/60 mb-1.5">Asset Metadata / Core Concept</label>
                      <textarea 
                        rows={3}
                        placeholder="Define visual, verbal, or operational rules for this asset..."
                        value={newFileContent}
                        onChange={(e) => setNewFileContent(e.target.value)}
                        className="w-full bg-white/10 text-white rounded-lg px-3 py-2 text-xs border border-white/10 focus:outline-none focus:border-[#FF416C] resize-none"
                      ></textarea>
                    </div>

                    {fileError && <p className="text-red-400 text-xs">{fileError}</p>}

                    <div className="flex justify-end gap-3 pt-2">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingFile(false)} 
                        className="px-4 py-2 text-[10px] uppercase font-bold text-white/60 hover:text-white"
                      >
                        Discard
                      </button>
                      <button 
                        type="submit" 
                        className="bg-white hover:bg-[#FF416C] hover:text-white text-black px-5 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors"
                      >
                        Commit to Brand OS
                      </button>
                    </div>
                  </form>
                )}

                {/* File Explorer Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {files.map((file) => (
                    <div 
                      key={file.id}
                      onClick={() => setSelectedFile(file)}
                      className={`flex items-start justify-between p-4 rounded-2xl border transition-all cursor-pointer ${selectedFile?.id === file.id ? 'bg-white/10 border-white/30 shadow-lg' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
                    >
                      <div className="flex gap-4">
                        <div className="p-2.5 bg-white/10 rounded-xl">
                          {renderFileIcon(file.type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold tracking-tight text-white">{file.name}</h4>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[9px] text-white/40">{file.category}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                            <span className="text-[9px] text-white/40">{file.size}</span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={(e) => handleDeleteFile(file.id, e)}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors rounded hover:bg-white/5"
                        title="Purge Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic File Viewer (Bottom) */}
              {selectedFile && (
                <div className="mt-8 pt-6 border-t border-white/10 bg-white/5 rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold text-[#FF416C]">Selected Resource Info</span>
                      <span className="text-[9px] px-2 py-0.5 bg-white/10 text-white-soft rounded-full">{selectedFile.date}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{selectedFile.size}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{selectedFile.name}</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-sans">
                    {selectedFile.content}
                  </p>
                </div>
              )}
            </div>

            {/* Strategic Details Copy (Right) */}
            <div id="solutions-text" className="lg:col-span-5 flex flex-col justify-center h-full max-w-lg lg:pl-10">
              <span className="text-[10px] font-bold text-[#FF4B2B] uppercase tracking-[0.25em] mb-4">Central Database</span>
              <h3 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-text mb-8">
                The intelligent foundation for your brand.
              </h3>
              
              <div className="relative pl-6 border-l-[3px] border-line space-y-8">
                <div className="absolute left-[-3px] top-0 w-[3px] h-1/4 bg-gradient-to-b from-[#FF416C] to-[#FF4B2B]"></div>
                
                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Centralized Knowledge</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Bring all your disparate assets, guidelines, and strategic documents into one cohesive, searchable environment with real-time feedback loops.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Contextual Intelligence</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Our semantic AI understands the specific nuances of your brand tone, warning you about corporate drift and suggesting on-brand alternative styling.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Frictionless Distribution</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Ensure every internal designer, external agency partner, and marketing representative has instantaneous, access to the latest approved files.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 6. Lumio Studio Section (On-Brand Asset Generator Playground) */}
        <section id="studio-section" className="py-24 px-6 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Context Info Copy (Left) */}
            <div className="lg:col-span-5 flex flex-col justify-center h-full max-w-lg">
              <span className="text-[10px] font-bold text-[#FF416C] uppercase tracking-[0.25em] mb-4">Lumio Creative Studio</span>
              <h3 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-text mb-8">
                Generate vetted on-brand assets.
              </h3>
              
              <div className="relative pl-6 border-l-[3px] border-line space-y-8">
                <div className="absolute left-[-3px] top-0 w-[3px] h-1/3 bg-gradient-to-b from-[#FF416C] to-[#FF4B2B]"></div>
                
                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Automated Brand Compliance</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Every text asset generated is automatically cross-referenced and structured against your core brand identity dictionary.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Vibrant Context Layouts</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Dynamic outputs optimized automatically for the specific channel constraint—whether it is a fast-paced Twitter thread or enterprise campaign brief.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans text-lg font-bold mb-2 text-text">Predictive Alignment Scapes</h4>
                  <p className="text-xs text-muted leading-relaxed">
                    Leverages state-of-the-art semantic transformers to align word choices, voice intensity, and key themes effortlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Creator Sandbox (Right) */}
            <div className="lg:col-span-7 bg-[#FAF9F5] border border-line/60 rounded-[32px] md:rounded-[40px] p-6 md:p-8 shadow-xl">
              <div className="flex items-center justify-between pb-6 border-b border-line/30 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] bg-black rounded-full flex items-center justify-center">
                    <span className="text-white text-[11px] font-black">L</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted">LUMIO STUDIO PLAYGROUND</span>
                </div>
                
                {/* Visual state pill */}
                <div className="flex items-center gap-1 bg-[#FF416C]/10 text-[#FF416C] px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interactive Playground</span>
                </div>
              </div>

              {/* Step 1: Select Asset Type */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">1. Target Asset Medium</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  {ASSET_TYPES.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => setSelectedAsset(asset.value)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${selectedAsset === asset.value ? 'bg-black text-white border-black shadow-md' : 'bg-white text-text border-line/60 hover:bg-neutral-50'}`}
                    >
                      <span className="material-symbols-outlined text-base mb-1">{asset.icon}</span>
                      <span className="text-[10px] font-bold tracking-tight">{asset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Choose Tone Mode */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2.5">2. Brand Tone Filter</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TONE_OPTIONS.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedTone(tone.id)}
                      className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${selectedTone === tone.id ? 'bg-neutral-100 border-[#FF416C] shadow-sm' : 'bg-white border-line/60 hover:bg-neutral-50'}`}
                    >
                      <span className="material-symbols-outlined text-lg mt-0.5 text-[#FF416C]">{tone.icon}</span>
                      <div>
                        <span className="block text-xs font-bold text-text">{tone.label}</span>
                        <span className="block text-[10px] text-muted leading-tight mt-0.5">{tone.description}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Custom Guidance Prompter */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted mb-2">3. Strategic Focus Prompt</label>
                <textarea
                  rows={3}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ask Gemini to draft creative copy, emails, or rules..."
                  className="w-full bg-white border border-line rounded-xl px-4 py-3 text-xs text-text focus:outline-none focus:border-[#FF4B2B] resize-none"
                ></textarea>
              </div>

              {/* Execute generation */}
              <button
                type="button"
                onClick={handleGenerateAsset}
                disabled={isGenerating || !promptInput.trim()}
                className="w-full py-3.5 bg-black hover:bg-neutral-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Aligning Tone Guidelines...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FF4B2B] animate-pulse" />
                    <span>Generate Asset via Gemini</span>
                  </>
                )}
              </button>

              {/* Generated Result Container */}
              {generatedResult && (
                <div className="mt-8 bg-white border border-line rounded-2xl p-5 shadow-inner animate-fade-in relative">
                  
                  {/* Result utility header */}
                  <div className="flex items-center justify-between pb-3.5 border-b border-line/20 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-muted">
                        {generationMode === "live" ? "Gemini Live Output" : "Simulated Enterprise Preview"}
                      </span>
                    </div>

                    <button
                      onClick={handleCopyToClipboard}
                      className="flex items-center gap-1 text-[10px] uppercase font-bold text-text hover:text-[#FF416C] transition-colors cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? "Copied" : "Copy Copy"}</span>
                    </button>
                  </div>

                  {/* Scrollable markdown block */}
                  <div className="max-h-[350px] overflow-y-auto text-xs text-text leading-relaxed font-mono whitespace-pre-line bg-neutral-50 p-4 rounded-xl border border-line/20">
                    {generatedResult}
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[9px] text-muted text-center mt-3 leading-snug">
                    Verified automatically against Lumio brand vocabulary files to prevent off-brand deviations.
                  </p>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* 7. Team Use Cases Filterable Segment */}
        <section id="use-cases-section" className="py-24 px-6 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-[#FF416C] uppercase tracking-[0.25em] mb-4">Tailored Solutions</span>
            <h2 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-center text-text mb-8">
              Built for every team.
            </h2>

            {/* Category filter pills */}
            <div className="flex flex-wrap justify-center gap-2.5 mb-12">
              {["Strategy", "Marketing", "Design", "Sales"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedUseCaseCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer ${selectedUseCaseCategory === cat ? 'bg-black text-white shadow-md' : 'bg-white text-text hover:bg-neutral-50 border border-line/40'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Use cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[1200px]">
              {TEAM_USE_CASES.filter(uc => uc.category === selectedUseCaseCategory).map((uc) => (
                <div 
                  key={uc.id}
                  className="relative h-[340px] rounded-[24px] md:rounded-[32px] p-6 md:p-8 flex flex-col justify-end group overflow-hidden shadow-lg border border-line/20"
                >
                  {/* Background photo */}
                  <img 
                    alt={uc.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={uc.imageUrl}
                  />
                  {/* Dark gradient filter */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
                  
                  {/* Contents */}
                  <div className="relative z-10 text-white">
                    <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FF416C] bg-white/15 px-3 py-1 rounded-full mb-3 inline-block">
                      {uc.category}
                    </span>
                    <h4 className="font-sans text-xl md:text-2xl font-bold mb-2 text-white">
                      {uc.title}
                    </h4>
                    <p className="text-xs text-white/80 leading-relaxed max-w-lg">
                      {uc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. Comprehensive Interactive Testimonials & Review Desk */}
        <section id="testimonials-section" className="py-24 px-6 max-w-[1200px] mx-auto flex flex-col items-center text-center bg-page-bg border-t border-line/20">
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.25em] mb-4">Partner Testimonials</span>
          
          {/* Main big block quote */}
          <h2 className="font-sans text-2xl md:text-5xl leading-[1.25] tracking-tight text-text mb-12 text-balance max-w-4xl font-normal">
            "Lumio was built with the absolute commitment to liberate creative minds from standard, menial repetitive checks, allowing them to focus on true strategic innovation."
          </h2>

          <div className="flex items-center gap-4 mb-16">
            <div className="w-14 h-14 rounded-full bg-line overflow-hidden shadow-md border-2 border-[#FF416C]">
              <img 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_dQOYUXm-9ocUk-1cRA5ZyP6tu7OdWwNIU7SRhouWt3u89anzj3A5_pr7FGCCICOiz6a2FoSpC-bN53AYbiVQ-spgKPawBtGZtLq-9c6QyNclym7oEuOsCnQllJenEGuMkAeM3mwnTOLdgJakEE63ozCYcDA2l-C2EQnZiozAakUbDrwJG_jxTwrvV9I5p2oiVPXIDBv-rltdG9P0TX6X2OUHQcwckpskXXJEawplcI8ff_rzn1YnIDgrniF27Vjc0Lz4LKcazue9"
                alt="VP of Brand"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-text">Alex Morgan</p>
              <p className="text-xs text-muted font-semibold">VP of Brand, Northline Group</p>
            </div>
          </div>

          {/* Interactive Community Reviews Grid */}
          <div className="w-full max-w-4xl bg-white border border-line rounded-[30px] p-6 md:p-8 shadow-xl text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-line/20 mb-6 gap-4">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-text">Lumio Partner Reviews</h4>
                <p className="text-xs text-muted">What leading creative directors say about the Operating System.</p>
              </div>

              <button
                onClick={() => setShowTestimonialForm(!showTestimonialForm)}
                className="bg-black text-white hover:bg-[#FF416C] px-5 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {showTestimonialForm ? "Close Review Drawer" : "+ Submit Feedback"}
              </button>
            </div>

            {/* Add testimonial form */}
            {showTestimonialForm && (
              <form onSubmit={handleAddTestimonial} className="bg-neutral-50 rounded-2xl p-5 border border-line mb-6 space-y-4 animate-fade-in text-text">
                <h5 className="text-xs font-bold text-text uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF416C]" /> Post Your Experience
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Your Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Marcus Aurelius" 
                      required
                      value={newTestimonialName}
                      onChange={(e) => setNewTestimonialName(e.target.value)}
                      className="w-full bg-white text-text border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Your Corporate Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lead Product Designer" 
                      value={newTestimonialRole}
                      onChange={(e) => setNewTestimonialRole(e.target.value)}
                      className="w-full bg-white text-text border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-muted mb-1">Review Description</label>
                  <textarea 
                    rows={3} 
                    required
                    placeholder="Describe how brand alignment checks has optimized your daily delivery pipeline..."
                    value={newTestimonialText}
                    onChange={(e) => setNewTestimonialText(e.target.value)}
                    className="w-full bg-white text-text border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF416C] resize-none"
                  ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowTestimonialForm(false)} 
                    className="px-4 py-2 text-[10px] uppercase font-bold text-muted hover:text-text"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-black hover:bg-[#FF416C] hover:text-white text-white px-5 py-2 rounded-lg text-[10px] uppercase font-bold tracking-wider transition-colors"
                  >
                    Commit Review
                  </button>
                </div>
              </form>
            )}

            {/* Testimonials List */}
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {testimonials.map((feedback) => (
                <div key={feedback.id} className="bg-soft-card-2 border border-line/25 p-5 rounded-2xl flex gap-4 transition-all hover:bg-white-card">
                  <div className="w-10 h-10 rounded-full bg-line overflow-hidden shrink-0">
                    <img className="w-full h-full object-cover" src={feedback.avatarUrl} alt={feedback.author} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-bold text-text">{feedback.author}</span>
                      <span className="w-1 h-1 rounded-full bg-muted"></span>
                      <span className="text-[10px] text-muted">{feedback.role}</span>
                    </div>
                    <p className="text-xs text-text/80 leading-relaxed italic">
                      "{feedback.text}"
                    </p>
                    <span className="block text-[9px] text-muted mt-2">{feedback.date}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 9. Latest Updates & Product Announcements */}
        <section id="updates-section" className="py-24 px-6 max-w-[1728px] mx-auto bg-page-bg border-t border-line/20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[10px] font-bold text-[#FF416C] uppercase tracking-[0.25em] mb-4 block">Lumio Newsroom</span>
              <h2 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-text">Latest Updates</h2>
            </div>
            
            <button 
              onClick={() => {
                // Open first update as showcase
                setSelectedArticle(NEWS_ARTICLES[0]);
              }}
              className="text-xs font-bold border-b-2 border-black text-text pb-1 hover:text-[#FF416C] hover:border-[#FF416C] transition-all cursor-pointer"
            >
              Show Featured Update
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ARTICLES.map((article) => (
              <div 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer bg-white border border-line/40 rounded-[30px] overflow-hidden p-4 shadow-md hover:shadow-2xl transition-all hover:-translate-y-1.5"
              >
                <div className="h-[260px] rounded-[24px] overflow-hidden mb-5 relative">
                  <img 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    src={article.imageUrl}
                  />
                  <div className="absolute top-3 left-3 bg-black/60 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {article.category}
                  </div>
                </div>

                <p className="text-[10px] text-muted uppercase font-bold mb-2 tracking-wide">{article.date}</p>
                <h4 className="font-sans text-lg font-bold text-text group-hover:text-[#FF416C] transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>
                <p className="text-xs text-muted line-clamp-3 mt-3 leading-relaxed">
                  {article.content}
                </p>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#FF416C] mt-4 hover:underline">
                  Read Article <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Call to Action (CTA Experience) */}
        <section className="py-24 md:py-32 px-6 bg-page-bg border-t border-line/20">
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-[50px] h-[50px] rounded-full border border-text flex items-center justify-center mb-10 hover:scale-110 transition-transform">
                <span className="text-text font-black text-xl leading-none">L</span>
              </div>
              
              <h2 className="font-sans text-4xl md:text-[72px] font-extrabold text-text tracking-tighter leading-[1.05] mb-8 max-w-3xl text-balance">
                Experience the future of brand intelligence
              </h2>
              
              <p className="text-base text-muted max-w-xl mb-12 leading-relaxed">
                Connect your brand guidelines to the delivery layer, align every creator globally, and never compromise design sovereignty again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => setShowDemoModal(true)}
                  className="bg-black hover:bg-neutral-800 text-white font-bold rounded-full transition-all shrink-0 flex items-center justify-center px-8 text-xs h-[52px] uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Schedule a call
                </button>
                <button 
                  onClick={() => {
                    document.getElementById("brand-os-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-transparent border border-text/30 text-text hover:bg-text hover:text-white font-bold rounded-full transition-all shrink-0 flex items-center justify-center px-8 text-xs h-[52px] uppercase tracking-wider cursor-pointer"
                >
                  Get started
                </button>
              </div>
            </div>
          </div>
        </section>
        </>)}

        {activeView === "dashboard" && <DashboardView />}
        {activeView === "playbook" && <PlaybookView />}
        {activeView === "pricing" && <PricingView />}
      </main>

      {/* 11. Footer Section */}
      <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 rounded-t-[40px] md:rounded-t-[64px] relative z-20">
        <div className="max-w-[1728px] mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
            
            {/* Brand column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-base leading-none">L</span>
              </div>
              <p className="text-xs text-white/50 max-w-xs leading-relaxed">
                The operating system for modern creative teams. Empowering global focus through uncompromised semantic brand intelligence.
              </p>
              
              {/* Fake but interactive workspace sharing trigger */}
              <div className="flex gap-3">
                <button 
                  onClick={() => alert("Lumio Share link compiled to workspace. Open in settings to export to GitHub.")}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white-soft cursor-pointer"
                  title="Share Space"
                >
                  <span className="material-symbols-outlined text-[18px]">share</span>
                </button>
                <a 
                  href="https://ai.studio/build" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white-soft"
                  title="Google AI Studio"
                >
                  <span className="material-symbols-outlined text-[18px]">public</span>
                </a>
                <button 
                  onClick={() => alert("All 4 Core systems are currently connected and syncing securely.")}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/15 transition-colors text-white-soft"
                  title="System Status"
                >
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </button>
              </div>
            </div>

            {/* Link column 1 */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-extrabold text-white mb-6 uppercase tracking-widest">Product</h4>
              <ul className="flex flex-col gap-3.5">
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Platform Console</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("dashboard"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Compliance Engine</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("product"); setTimeout(() => document.getElementById("studio-section")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Studio Playground</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("pricing"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Cost Pricing Scale</button></li>
              </ul>
            </div>

            {/* Link column 2 */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-extrabold text-white mb-6 uppercase tracking-widest">Company</h4>
              <ul className="flex flex-col gap-3.5">
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("product"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>About Us</button></li>
                <li><a className="text-xs text-white/60 hover:text-white transition-colors" href="#">Careers</a></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("product"); setTimeout(() => document.getElementById("updates-section")?.scrollIntoView({ behavior: "smooth" }), 100); }}>Newsroom</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => setShowDemoModal(true)}>Contact team</button></li>
              </ul>
            </div>

            {/* Link column 3 */}
            <div className="lg:col-span-2">
              <h4 className="text-[10px] font-extrabold text-white mb-6 uppercase tracking-widest">Resources</h4>
              <ul className="flex flex-col gap-3.5">
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("playbook"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Blog Insights</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("playbook"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Documentation Playbook</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => { setActiveView("playbook"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Community Standards</button></li>
                <li><button className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left" onClick={() => setShowDemoModal(true)}>Customer Support</button></li>
              </ul>
            </div>

            {/* Help indicator */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col justify-between">
              <HelpCircle className="w-5 h-5 text-[#FF416C]" />
              <div className="mt-4">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white">Need support?</span>
                <span className="block text-[11px] text-white/50 mt-1">Our brand strategy agents are ready.</span>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-white/40">© 2026 Lumio Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a className="text-[10px] text-white/40 hover:text-white transition-colors" href="#">Privacy Policy</a>
              <a className="text-[10px] text-white/40 hover:text-white transition-colors" href="#">Terms of Service</a>
              <a className="text-[10px] text-white/40 hover:text-white transition-colors" href="#">Cookie Settings</a>
            </div>
          </div>

        </div>
      </footer>


      {/* MODAL 1: Book a Demo Form Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-line rounded-[30px] max-w-lg w-full p-6 md:p-8 relative shadow-2xl text-text">
            
            <button 
              onClick={() => {
                setShowDemoModal(false);
                setDemoSubmitted(false);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-muted"
            >
              <X className="w-5 h-5" />
            </button>

            {demoSubmitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-sans text-xl font-bold">Demo Schedule Reserved!</h3>
                <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  Excellent, {demoName}. We've allocated a brand strategist on <strong>{demoDate}</strong> at <strong>{demoTime}</strong>. A connection ticket has been sent to <strong>{demoEmail}</strong>.
                </p>
                <p className="text-[10px] text-muted-light font-mono">Calibrating workspace...</p>
              </div>
            ) : (
              <form onSubmit={handleDemoSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#FF416C]"></span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF416C]">Corporate Integration Walkthrough</span>
                </div>
                <h3 className="font-sans text-xl font-bold tracking-tight">Book a custom Lumio demo</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Pick a preferred date and time. Our team will prepare a structured workspace demonstrating compliance checkers on your corporate domain.
                </p>

                <div className="space-y-3.5 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Jessica Chen"
                      value={demoName}
                      onChange={(e) => setDemoName(e.target.value)}
                      className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1">Corporate Email Address</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jessica@arcform.com"
                      value={demoEmail}
                      onChange={(e) => setDemoEmail(e.target.value)}
                      className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Preferred Date</label>
                      <input 
                        type="date" 
                        required
                        value={demoDate}
                        onChange={(e) => setDemoDate(e.target.value)}
                        className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-muted mb-1">Preferred Time</label>
                      <input 
                        type="time" 
                        required
                        value={demoTime}
                        onChange={(e) => setDemoTime(e.target.value)}
                        className="w-full bg-white border border-line rounded-lg px-3.5 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
                >
                  Commit Reservation Slot
                </button>
              </form>
            )}

          </div>
        </div>
      )}


      {/* MODAL 2: Full News Article Viewer Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-line rounded-[30px] max-w-2xl w-full p-6 md:p-8 relative shadow-2xl text-text max-h-[90vh] overflow-y-auto">
            
            <button 
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-muted"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#FF416C] bg-[#FF416C]/10 px-3 py-1 rounded-full inline-block">
                {selectedArticle.category}
              </span>
              <p className="text-[10px] text-muted font-bold">{selectedArticle.date}</p>
              
              <h3 className="font-sans text-2xl md:text-3xl font-bold tracking-tight text-text leading-tight">
                {selectedArticle.title}
              </h3>

              <div className="h-[280px] md:h-[340px] rounded-2xl overflow-hidden relative border border-line/20">
                <img className="w-full h-full object-cover" src={selectedArticle.imageUrl} alt={selectedArticle.title} />
              </div>

              <div className="text-xs md:text-sm text-text/80 leading-relaxed font-sans space-y-4 pt-2">
                <p>{selectedArticle.content}</p>
                <p>
                  As brand intelligence scales to cover multiple regions, Lumio unifies strategic and marketing standards automatically. With this toolset, creative managers have the power to protect design intent and ensure semantic consistency in real-time.
                </p>
                <p>
                  Our R&amp;D division is committed to refining compliance check times and expanding language compatibility profiles. Stay tuned for further updates as we execute the Q3 Roadmap.
                </p>
              </div>

              <div className="pt-4 border-t border-line/30 flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg text-[10px] uppercase font-bold tracking-wider cursor-pointer"
                >
                  Close Article
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
