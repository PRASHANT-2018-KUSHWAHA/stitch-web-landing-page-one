import React, { useState } from "react";
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Plus, 
  Trash2, 
  Send,
  HelpCircle,
  FileText,
  Clock,
  ArrowRight
} from "lucide-react";

interface Rule {
  id: string;
  type: "word" | "color" | "tag";
  target: string;
  severity: "high" | "medium" | "low";
  description: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  resource: string;
  issue: string;
  severity: "high" | "medium" | "low";
}

export default function DashboardView() {
  // Brand score
  const [brandScore, setBrandScore] = useState<number>(94.2);
  const [isScanningGlobal, setIsScanningGlobal] = useState<boolean>(false);

  // Custom scanner states
  const [scanText, setScanText] = useState<string>(
    "We are launching a revolutionary new paradigm that will drive synergy across all teams. Our next-generation hyper-automation platform creates next-level value."
  );
  const [isScanningText, setIsScanningText] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    score: number;
    grade: string;
    driftWordCount: number;
    issues: { word: string; suggestion: string; reason: string }[];
  } | null>(null);

  // Telemetry alert rules
  const [activeRules, setActiveRules] = useState<Rule[]>([
    { id: "r-1", type: "word", target: "synergy", severity: "medium", description: "Enforce humble terminology. Avoid buzzwords." },
    { id: "r-2", type: "word", target: "revolutionary", severity: "high", description: "Enforce design standards and literal terms." },
    { id: "r-3", type: "color", target: "#FF4B5C", severity: "high", description: "Enforce standard brand red #FF416C." },
    { id: "r-4", type: "tag", target: "v2-approved", severity: "low", description: "Ensure marketing decks have release tags." }
  ]);
  const [newRuleTarget, setNewRuleTarget] = useState<string>("");
  const [newRuleType, setNewRuleType] = useState<"word" | "color" | "tag">("word");
  const [newRuleSeverity, setNewRuleSeverity] = useState<"high" | "medium" | "low">("medium");
  const [newRuleDesc, setNewRuleDesc] = useState<string>("");

  // Audit Logs
  const [logs, setLogs] = useState<AuditLog[]>([
    { id: "l-1", timestamp: "10:42 AM", resource: "SalesDeck_US_v3.pdf", issue: "Used banned corporate buzzword 'synergy' on page 4", severity: "medium" },
    { id: "l-2", timestamp: "09:15 AM", resource: "Landing_Page_Hero_Copy.txt", issue: "Found unapproved color value #FF4B5C in CSS specs", severity: "high" },
    { id: "l-3", timestamp: "Yesterday", resource: "Newsletter_July.html", issue: "Missing 'v2-approved' meta tag in release header", severity: "low" }
  ]);

  // SVG Chart Month State
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(5); // June

  const chartData = [
    { month: "Jan", score: 86, incidents: 14, activeUsers: 42 },
    { month: "Feb", score: 89, incidents: 11, activeUsers: 48 },
    { month: "Mar", score: 91, incidents: 8, activeUsers: 55 },
    { month: "Apr", score: 88, incidents: 12, activeUsers: 62 },
    { month: "May", score: 92, incidents: 6, activeUsers: 74 },
    { month: "Jun", score: 94, incidents: 3, activeUsers: 89 }
  ];

  // Recalculate brand score simulation
  const handleTriggerGlobalScan = () => {
    setIsScanningGlobal(true);
    setTimeout(() => {
      // Calculate average rules + logs score
      const driftPenalty = logs.length * 2.5;
      const base = 98 - driftPenalty;
      setBrandScore(Math.min(100, Math.max(70, Number(base.toFixed(1)))));
      setIsScanningGlobal(false);
    }, 1200);
  };

  // Text Scanner
  const handleRunTextScan = () => {
    setIsScanningText(true);
    setScanResult(null);

    setTimeout(() => {
      const textToScan = scanText.toLowerCase();
      const identifiedIssues: { word: string; suggestion: string; reason: string }[] = [];

      // Check against current word rules
      activeRules.forEach(rule => {
        if (rule.type === "word" && textToScan.includes(rule.target.toLowerCase())) {
          let suggestion = "unify";
          let reason = rule.description;
          if (rule.target === "synergy") {
            suggestion = "integration / coordination";
          } else if (rule.target === "revolutionary") {
            suggestion = "distinctive / optimized";
          }
          identifiedIssues.push({
            word: rule.target,
            suggestion,
            reason
          });
        }
      });

      // Also check standard fluff terms
      const generalFluff = ["next-generation", "hyper-automation", "next-level", "paradigm"];
      generalFluff.forEach(fluff => {
        if (textToScan.includes(fluff)) {
          let suggestion = "optimized";
          if (fluff === "paradigm") suggestion = "framework";
          if (fluff === "next-level") suggestion = "uncompromising";
          identifiedIssues.push({
            word: fluff,
            suggestion,
            reason: "Standard corporate jargon. Keep language literal, humble and clear."
          });
        }
      });

      const scorePenalty = identifiedIssues.length * 8;
      const computedScore = Math.max(40, 100 - scorePenalty);
      let grade = "A";
      if (computedScore < 60) grade = "F";
      else if (computedScore < 75) grade = "C";
      else if (computedScore < 90) grade = "B";

      setScanResult({
        score: computedScore,
        grade,
        driftWordCount: identifiedIssues.length,
        issues: identifiedIssues
      });
      setIsScanningText(false);
    }, 1000);
  };

  // Add a brand alert rule
  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTarget.trim()) return;

    const newRule: Rule = {
      id: "r-" + Date.now(),
      type: newRuleType,
      target: newRuleTarget.trim(),
      severity: newRuleSeverity,
      description: newRuleDesc.trim() || `Automated compliance check for ${newRuleType} matches.`
    };

    setActiveRules(prev => [...prev, newRule]);
    setNewRuleTarget("");
    setNewRuleDesc("");

    // Simulate audit check
    const newLog: AuditLog = {
      id: "l-" + Date.now(),
      timestamp: "Just Now",
      resource: "Active Workspace System",
      issue: `New compliance rule compiled: enforce standard ${newRuleType} '${newRuleTarget}'`,
      severity: "low"
    };
    setLogs(prev => [newLog, ...prev]);
  };

  // Purge a brand rule
  const handleRemoveRule = (id: string) => {
    setActiveRules(prev => prev.filter(r => r.id !== id));
  };

  // Acknowledge logs
  const handleDismissLog = (id: string) => {
    setLogs(prev => prev.filter(l => l.id !== id));
  };

  // Auto-correct text scanning results
  const handleAutoAlignCopy = () => {
    if (!scanResult) return;
    let corrected = scanText;
    
    // Simple replacements
    corrected = corrected.replace(/revolutionary/gi, "distinctive");
    corrected = corrected.replace(/synergy/gi, "integration");
    corrected = corrected.replace(/next-generation/gi, "specialized");
    corrected = corrected.replace(/hyper-automation/gi, "systemized");
    corrected = corrected.replace(/next-level/gi, "uncompromising");
    corrected = corrected.replace(/paradigm/gi, "framework");

    setScanText(corrected);
    // Run scan again
    setTimeout(() => {
      handleRunTextScan();
    }, 100);
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto text-text animate-fade-in">
      {/* Upper header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 bg-[#FF416C]/10 text-[#FF416C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest w-fit mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lumio Brand Console</span>
          </div>
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight">Enterprise Compliance Workspace</h1>
          <p className="text-muted text-xs mt-2 max-w-2xl leading-relaxed">
            Monitor real-time semantic drift telemetry, evaluate dynamic campaigns, and codify automated corporate styling rules globally.
          </p>
        </div>

        <button 
          onClick={handleTriggerGlobalScan}
          disabled={isScanningGlobal}
          className="bg-black text-white hover:bg-[#FF416C] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md disabled:bg-neutral-300"
        >
          <RefreshCw className={`w-4 h-4 ${isScanningGlobal ? 'animate-spin' : ''}`} />
          <span>{isScanningGlobal ? "Analyzing Channels..." : "Run Global Workspace Scan"}</span>
        </button>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {/* Card 1: Score */}
        <div className="bg-white border border-line/40 rounded-3xl p-6 shadow-md flex items-center justify-between">
          <div>
            <span className="block text-[10px] text-muted uppercase font-extrabold tracking-wider mb-1">Brand Harmony Score</span>
            <span className="text-4xl font-extrabold font-sans text-text">{brandScore}%</span>
            <span className="block text-[10px] text-green-600 font-bold mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Standard Compliant
            </span>
          </div>
          <div className="w-16 h-16 flex items-center justify-center relative">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" fill="transparent" stroke="#E5E7EB" strokeWidth="4" />
              <circle 
                cx="32" 
                cy="32" 
                r="28" 
                fill="transparent" 
                stroke="#FF416C" 
                strokeWidth="4" 
                strokeDasharray="175" 
                strokeDashoffset={175 - (175 * brandScore) / 100} 
              />
            </svg>
            <span className="absolute text-[10px] font-extrabold text-[#FF416C] font-mono">OS</span>
          </div>
        </div>

        {/* Card 2: Scanned resources */}
        <div className="bg-white border border-line/40 rounded-3xl p-6 shadow-md">
          <span className="block text-[10px] text-muted uppercase font-extrabold tracking-wider mb-1">Scanned Asset Pool</span>
          <span className="text-4xl font-extrabold font-sans text-text">148</span>
          <p className="text-[10px] text-muted mt-2">
            12 marketing feeds, 22 presentations, 114 style scripts.
          </p>
        </div>

        {/* Card 3: Drift Incidents */}
        <div className="bg-white border border-line/40 rounded-3xl p-6 shadow-md">
          <span className="block text-[10px] text-muted uppercase font-extrabold tracking-wider mb-1">Active Drift Logs</span>
          <span className="text-4xl font-bold font-sans text-[#FF4B2B] flex items-center gap-1.5">
            {logs.length} <AlertTriangle className="w-5 h-5 text-[#FF4B2B] animate-pulse" />
          </span>
          <p className="text-[10px] text-muted mt-2">
            Requires attention to avoid brand guidelines compromise.
          </p>
        </div>

        {/* Card 4: Team active agents */}
        <div className="bg-white border border-line/40 rounded-3xl p-6 shadow-md">
          <span className="block text-[10px] text-muted uppercase font-extrabold tracking-wider mb-1">Active Compliance Filters</span>
          <span className="text-4xl font-extrabold font-sans text-text">{activeRules.length}</span>
          <p className="text-[10px] text-muted mt-2">
            Enforces corporate grammar, spelling, & color palettes.
          </p>
        </div>
      </div>

      {/* Main split grid: Charts & Active logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Left: Interactive Trend Chart */}
        <div className="lg:col-span-8 bg-white border border-line/40 rounded-[32px] p-6 shadow-md flex flex-col justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-line/10 mb-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-text">Brand Consistency Trends</h3>
              <p className="text-xs text-muted">Weekly historical scores & drift incident incidents.</p>
            </div>
            
            {/* Custom Interactive Legend */}
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5 text-[10px] text-text font-bold">
                <span className="w-2.5 h-2.5 bg-[#FF416C] rounded-full"></span> Harmony Score
              </span>
              <span className="flex items-center gap-1.5 text-[10px] text-text font-bold">
                <span className="w-2.5 h-2.5 bg-neutral-300 rounded-full"></span> Drift Incidents
              </span>
            </div>
          </div>

          {/* Interactive SVG Chart container */}
          <div className="h-[280px] w-full relative">
            <svg viewBox="0 0 600 240" className="w-full h-full">
              {/* Grids */}
              <line x1="40" y1="30" x2="560" y2="30" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="40" y1="80" x2="560" y2="80" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="40" y1="130" x2="560" y2="130" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="40" y1="180" x2="560" y2="180" stroke="#f1f1f1" strokeWidth="1" />
              <line x1="40" y1="210" x2="560" y2="210" stroke="#d1d1d1" strokeWidth="1" />

              {/* Draw Bar charts (incidents) */}
              {chartData.map((d, index) => {
                const x = 70 + index * 85;
                const barHeight = d.incidents * 8;
                const y = 210 - barHeight;
                return (
                  <rect 
                    key={index} 
                    x={x - 15} 
                    y={y} 
                    width="30" 
                    height={barHeight} 
                    fill={selectedMonthIndex === index ? "#e5e5e5" : "#f1f1f1"} 
                    className="transition-colors hover:fill-neutral-300 cursor-pointer"
                    onClick={() => setSelectedMonthIndex(index)}
                  />
                );
              })}

              {/* Draw Line chart (score) */}
              <path 
                d={chartData.map((d, index) => {
                  const x = 70 + index * 85;
                  const y = 210 - (d.score - 50) * 3.5;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(" ")}
                fill="none" 
                stroke="#FF416C" 
                strokeWidth="3.5"
                strokeLinecap="round" 
              />

              {/* Points on Line chart */}
              {chartData.map((d, index) => {
                const x = 70 + index * 85;
                const y = 210 - (d.score - 50) * 3.5;
                return (
                  <circle 
                    key={index} 
                    cx={x} 
                    cy={y} 
                    r={selectedMonthIndex === index ? "7" : "5"} 
                    fill={selectedMonthIndex === index ? "#FF4B2B" : "#FF416C"} 
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all hover:scale-125"
                    onClick={() => setSelectedMonthIndex(index)}
                  />
                );
              })}

              {/* Axis labels */}
              {chartData.map((d, index) => {
                const x = 70 + index * 85;
                return (
                  <text 
                    key={index} 
                    x={x} 
                    y="232" 
                    textAnchor="middle" 
                    className={`font-mono text-[10px] font-bold ${selectedMonthIndex === index ? 'fill-[#FF416C]' : 'fill-muted'}`}
                  >
                    {d.month}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Interactive Month details */}
          <div className="mt-4 pt-4 border-t border-line/10 flex items-center justify-between text-xs font-mono bg-neutral-50 p-3.5 rounded-2xl border border-line/20">
            <div>
              <span className="text-muted uppercase font-bold">Selected Month:</span>{" "}
              <strong className="text-text font-bold uppercase">{chartData[selectedMonthIndex].month} 2026</strong>
            </div>
            <div className="flex gap-6">
              <div>
                <span className="text-muted">Harmony Score:</span>{" "}
                <strong className="text-text font-bold">{chartData[selectedMonthIndex].score}%</strong>
              </div>
              <div>
                <span className="text-muted">Drift Warnings:</span>{" "}
                <strong className="text-text font-bold">{chartData[selectedMonthIndex].incidents} incidents</strong>
              </div>
              <div>
                <span className="text-[#FF416C]">Active Creators:</span>{" "}
                <strong className="text-text font-bold">{chartData[selectedMonthIndex].activeUsers} accounts</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Active Live Logs Console */}
        <div className="lg:col-span-4 bg-white border border-line/40 rounded-[32px] p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-line/10 mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#FF4B2B]" /> Real-time Drift Alerts
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 text-muted rounded-full">
                {logs.length} Warnings
              </span>
            </div>

            {/* List */}
            <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {logs.length === 0 ? (
                <div className="text-center py-12 text-muted text-xs space-y-2">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                  <p>All scanned documents meet visual standards.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="p-3.5 bg-neutral-50 rounded-2xl border border-line/20 relative group hover:border-[#FF416C] transition-all">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-mono text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {log.timestamp}
                      </span>
                      <span className={`text-[8px] uppercase tracking-wide font-extrabold px-2 py-0.5 rounded-full ${log.severity === 'high' ? 'bg-red-100 text-red-600' : log.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        {log.severity}
                      </span>
                    </div>

                    <h4 className="text-[11px] font-bold text-text mb-0.5">{log.resource}</h4>
                    <p className="text-[11px] text-muted leading-snug">{log.issue}</p>

                    <button 
                      onClick={() => handleDismissLog(log.id)}
                      className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 p-1 text-muted hover:text-red-500 transition-all rounded hover:bg-neutral-200 cursor-pointer"
                      title="Acknowledge & Dismiss"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted leading-tight text-center mt-4">
            Drift warnings are automatically pushed to developers via custom webhook routes.
          </p>
        </div>
      </div>

      {/* Segment 3: Brand Rule Codifier + Interactive Copy Checker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Brand Rule Codifier */}
        <div className="lg:col-span-5 bg-[#1b1b1b] text-white-soft rounded-[32px] p-6 border border-white/10 shadow-2xl flex flex-col justify-between min-h-[580px]">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white">Rule Codification Engine</h3>
              <span className="text-[9px] font-mono text-white/40">v2.4_parser</span>
            </div>

            {/* List of rules */}
            <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1 mb-6">
              {activeRules.map((rule) => (
                <div key={rule.id} className="flex justify-between items-start p-3 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex gap-3">
                    <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded mt-0.5 shrink-0 ${rule.severity === 'high' ? 'bg-red-500/20 text-red-400' : rule.severity === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {rule.type}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        "{rule.target}" 
                      </h4>
                      <p className="text-[10px] text-white/60 leading-snug">{rule.description}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleRemoveRule(rule.id)}
                    className="text-white/30 hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    title="Purge rule filter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Rule form */}
            <form onSubmit={handleAddRule} className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-3 text-white">
              <span className="text-[10px] font-bold text-[#FF416C] uppercase tracking-wider block">Add Custom Constraint Rule</span>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-white/50 mb-1">Constraint Type</label>
                  <select 
                    value={newRuleType}
                    onChange={(e) => setNewRuleType(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg text-xs px-2 py-1.5 focus:outline-none"
                  >
                    <option value="word">Banned Term</option>
                    <option value="color">Hex Color Limit</option>
                    <option value="tag">Meta tag requirement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] text-white/50 mb-1">Target Match</label>
                  <input 
                    type="text" 
                    placeholder="e.g. game-changing"
                    value={newRuleTarget}
                    onChange={(e) => setNewRuleTarget(e.target.value)}
                    className="w-full bg-neutral-900 border border-white/10 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:border-[#FF416C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[9px] text-white/50 mb-1">Severity & Rule description</label>
                  <div className="flex gap-2">
                    <select 
                      value={newRuleSeverity}
                      onChange={(e) => setNewRuleSeverity(e.target.value as any)}
                      className="bg-neutral-900 border border-white/10 rounded-lg text-xs px-2 py-1.5 focus:outline-none shrink-0"
                    >
                      <option value="high">High Alert</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low Warning</option>
                    </select>
                    
                    <input 
                      type="text"
                      placeholder="e.g. Enforce humble corporate vocab lists"
                      value={newRuleDesc}
                      onChange={(e) => setNewRuleDesc(e.target.value)}
                      className="flex-1 bg-neutral-900 border border-white/10 rounded-lg text-xs px-3 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={!newRuleTarget.trim()}
                className="w-full bg-white text-black hover:bg-[#FF416C] hover:text-white rounded-xl py-2 text-[10px] font-bold uppercase tracking-wider transition-colors disabled:bg-neutral-700 disabled:text-neutral-500 cursor-pointer"
              >
                + Compile Standard Constraint
              </button>
            </form>
          </div>
        </div>

        {/* Right: Interactive Compliance Text Checker */}
        <div className="lg:col-span-7 bg-[#FAF9F5] border border-line/55 rounded-[32px] p-6 shadow-xl min-h-[580px] flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-line/20 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF416C] animate-pulse"></span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-text">Dynamic Compliance Scanner</h3>
              </div>
              <span className="text-[10px] bg-[#FF416C]/10 text-[#FF416C] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                Live Sandbox
              </span>
            </div>

            <p className="text-xs text-muted mb-4 leading-relaxed">
              Paste draft sales pitches, taglines, or brand documents. Our parser will instantly evaluate content against active constraints.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-muted mb-1">Evaluate Copy</label>
                <textarea 
                  rows={4}
                  value={scanText}
                  onChange={(e) => setScanText(e.target.value)}
                  placeholder="Paste your content draft..."
                  className="w-full bg-white border border-line rounded-2xl p-4 text-xs text-text focus:outline-none focus:border-[#FF416C] resize-none"
                ></textarea>
              </div>

              <button 
                onClick={handleRunTextScan}
                disabled={isScanningText || !scanText.trim()}
                className="w-full py-3 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {isScanningText ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Scanning Tone Vectors...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#FF4B2B]" />
                    <span>Run Compliance Check</span>
                  </>
                )}
              </button>
            </div>

            {/* SCAN RESULTS DISPLAY */}
            {scanResult && (
              <div className="mt-6 bg-white border border-line rounded-2xl p-4 shadow-sm animate-fade-in">
                <div className="flex justify-between items-center pb-3.5 border-b border-line/10 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg ${scanResult.grade === 'A' ? 'bg-green-600' : scanResult.grade === 'B' ? 'bg-blue-600' : scanResult.grade === 'C' ? 'bg-amber-600' : 'bg-red-600'}`}>
                      {scanResult.grade}
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-muted">Analysis Grade</span>
                      <span className="block text-xs font-bold text-text">Compliance Score: {scanResult.score}/100</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-[9px] uppercase font-bold text-muted">Banned Terms Found</span>
                    <span className="block text-xs font-bold text-red-500">{scanResult.driftWordCount} incidents</span>
                  </div>
                </div>

                {/* Detected Issues Lists */}
                {scanResult.issues.length === 0 ? (
                  <p className="text-xs text-green-600 font-medium flex items-center gap-1.5 py-2">
                    <CheckCircle className="w-4 h-4" /> Pristine alignment! This text aligns perfectly with Lumio guidelines.
                  </p>
                ) : (
                  <div className="space-y-3">
                    <span className="block text-[10px] uppercase font-bold text-muted">Identified Compliance Adjustments</span>
                    <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                      {scanResult.issues.map((issue, idx) => (
                        <div key={idx} className="p-2.5 bg-red-50/50 border border-red-100 rounded-xl flex gap-3 text-xs leading-relaxed">
                          <span className="text-red-600 font-extrabold font-mono text-[10px] mt-0.5">drift</span>
                          <div>
                            <p className="text-text">
                              The term <strong className="text-red-600 font-bold">"{issue.word}"</strong> violates tone rules.
                            </p>
                            <p className="text-muted text-[11px] mt-0.5">{issue.reason}</p>
                            <div className="flex items-center gap-1.5 text-[10px] mt-1 text-green-700 font-bold uppercase">
                              <span>Recommended replacement:</span>
                              <span className="bg-green-50 px-2 py-0.5 rounded border border-green-200">"{issue.suggestion}"</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Auto correct button */}
                    <button 
                      onClick={handleAutoAlignCopy}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-[10px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Auto-Correct Jargon Compliance ({scanResult.driftWordCount} fixes)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-[9px] text-muted text-center leading-normal pt-4 border-t border-line/10 mt-6">
            Scans evaluated locally against Lumio OS dictionary models. Real-time API proxy integration is online.
          </p>
        </div>
      </div>
    </div>
  );
}
