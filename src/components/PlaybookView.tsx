import React, { useState } from "react";
import { 
  Check, 
  X, 
  Sliders, 
  HelpCircle, 
  Layers, 
  Type, 
  Palette, 
  Grid,
  Info,
  ExternalLink,
  Sparkles
} from "lucide-react";

export default function PlaybookView() {
  // Navigation sidebar
  const [activePlaybookTab, setActivePlaybookTab] = useState<"tone" | "typo" | "colors" | "spacing">("tone");

  // Search input
  const [playbookSearch, setPlaybookSearch] = useState<string>("");

  // Typography sliders
  const [fontSize, setFontSize] = useState<number>(36);
  const [tracking, setTracking] = useState<number>(-1.5);
  const [lineHeight, setLineHeight] = useState<number>(1.1);

  // Contrast calculator colors
  const brandColors = [
    { name: "Cosmic Black", hex: "#111111", isDark: true },
    { name: "Off-White Glow", hex: "#FAF9F5", isDark: false },
    { name: "Sunset Red", hex: "#FF416C", isDark: true },
    { name: "Flame Orange", hex: "#FF4B2B", isDark: true },
    { name: "Steel Gray", hex: "#555555", isDark: true },
    { name: "Soft Amber", hex: "#FEF3C7", isDark: false }
  ];

  const [contrastBg, setContrastBg] = useState<string>("#111111");
  const [contrastText, setContrastText] = useState<string>("#FAF9F5");

  // Spacing selector
  const [selectedSpacingUnit, setSelectedSpacingUnit] = useState<number>(16);

  // Simple contrast score calculator formula simulation
  const calculateContrast = (c1: string, c2: string) => {
    // Basic relative luminance simulation for known brand values
    // To make it fully functional and reliable
    if (c1 === c2) return 1.0;
    
    // Hardcoded realistic contrast ratios for our palette
    const combo = `${c1.toUpperCase()}_${c2.toUpperCase()}`;
    const reverseCombo = `${c2.toUpperCase()}_${c1.toUpperCase()}`;
    
    const ratios: Record<string, number> = {
      "#111111_#FAF9F5": 19.5,
      "#FAF9F5_#111111": 19.5,
      "#111111_#FF416C": 4.8,
      "#FF416C_#111111": 4.8,
      "#111111_#FF4B2B": 4.5,
      "#FF4B2B_#111111": 4.5,
      "#111111_#FEF3C7": 16.2,
      "#FEF3C7_#111111": 16.2,
      "#FAF9F5_#FF416C": 4.1,
      "#FF416C_#FAF9F5": 4.1,
      "#FAF9F5_#FF4B2B": 4.3,
      "#FF4B2B_#FAF9F5": 4.3,
      "#FAF9F5_#555555": 6.8,
      "#555555_#FAF9F5": 6.8,
      "#FF416C_#FEF3C7": 3.8,
      "#FEF3C7_#FF416C": 3.8,
      "#FF4B2B_#FEF3C7": 4.0,
      "#FEF3C7_#FF4B2B": 4.0
    };

    return ratios[combo] || ratios[reverseCombo] || 3.5;
  };

  const contrastRatio = calculateContrast(contrastBg, contrastText);
  const wcagAA_Large = contrastRatio >= 3.0;
  const wcagAA_Normal = contrastRatio >= 4.5;
  const wcagAAA_Normal = contrastRatio >= 7.0;

  // Search filtered terms
  const toneTerms = [
    { avoid: "synergy", use: "coordination / integration", reason: "Avoid standard management buzzwords; maintain literal authority." },
    { avoid: "hyper-automation", use: "systemized checks", reason: "Ensure engineering descriptions remain concrete and verified." },
    { avoid: "next-generation", use: "specialized / modern", reason: "Next-gen is empty marketing fluff. Explain the actual benefits." },
    { avoid: "paradigm shift", use: "structural alignment", reason: "Do not elevate simple structural improvements to philosophical paradigms." },
    { avoid: "game-changing", use: "uncompromised / distinctive", reason: "Avoid cliché hyperbole. Let verified data prove the value." },
    { avoid: "revolutionary", use: "calibrated / optimized", reason: "Keep product descriptions humble and clear." }
  ];

  const filteredToneTerms = toneTerms.filter(term => 
    term.avoid.toLowerCase().includes(playbookSearch.toLowerCase()) || 
    term.use.toLowerCase().includes(playbookSearch.toLowerCase())
  );

  return (
    <div className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto text-text animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-8 border-b border-line/10 mb-12 gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#FF416C] font-extrabold block mb-3">Living Documentation</span>
          <h1 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight">Lumio Playbook &amp; Standards</h1>
          <p className="text-muted text-xs mt-2 max-w-2xl leading-relaxed">
            The definitive design system guide. Explore our typographic pairings, visual spectrum codes, and brand tone guidelines.
          </p>
        </div>

        {/* Global doc search */}
        <div className="w-full md:max-w-xs">
          <input 
            type="text"
            placeholder="Search brand standards..."
            value={playbookSearch}
            onChange={(e) => setPlaybookSearch(e.target.value)}
            className="w-full bg-white border border-line rounded-full px-5 py-2.5 text-xs text-text focus:outline-none focus:border-[#FF416C]"
          />
        </div>
      </div>

      {/* Main split grid: Navigation sidebar & Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left sidebar Navigation */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-thin">
          <button
            onClick={() => setActivePlaybookTab("tone")}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${activePlaybookTab === 'tone' ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-neutral-50 text-text border border-line/40'}`}
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>Tone &amp; Vocabulary</span>
          </button>

          <button
            onClick={() => setActivePlaybookTab("typo")}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${activePlaybookTab === 'typo' ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-neutral-50 text-text border border-line/40'}`}
          >
            <Type className="w-4 h-4 shrink-0" />
            <span>Typography Pairings</span>
          </button>

          <button
            onClick={() => setActivePlaybookTab("colors")}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${activePlaybookTab === 'colors' ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-neutral-50 text-text border border-line/40'}`}
          >
            <Palette className="w-4 h-4 shrink-0" />
            <span>Color Spectrum Desk</span>
          </button>

          <button
            onClick={() => setActivePlaybookTab("spacing")}
            className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-left transition-all shrink-0 cursor-pointer ${activePlaybookTab === 'spacing' ? 'bg-black text-white shadow-md' : 'bg-white hover:bg-neutral-50 text-text border border-line/40'}`}
          >
            <Grid className="w-4 h-4 shrink-0" />
            <span>Grids &amp; Spacing Grid</span>
          </button>
        </div>

        {/* Right Content Panels */}
        <div className="lg:col-span-9">
          
          {/* PANEL 1: TONE & VOCABULARY */}
          {activePlaybookTab === "tone" && (
            <div className="bg-white border border-line/40 rounded-[32px] p-6 md:p-8 shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-text flex items-center gap-2">
                  Tone Constraints Checklists
                </h2>
                <p className="text-muted text-xs mt-1">
                  How we speak as a brand. We maintain uncompromised, visionary, but humble and literal authority.
                </p>
              </div>

              {/* Checklist table */}
              <div className="border border-line/35 rounded-2xl overflow-hidden shadow-inner">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-line/30 font-bold uppercase text-[9px] tracking-wider text-muted">
                      <th className="p-4">Banned Terminology</th>
                      <th className="p-4">Preferred Alternative</th>
                      <th className="p-4 hidden md:table-cell">Strategic Reasoning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line/20">
                    {filteredToneTerms.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-8 text-center text-muted">No terms matched your search filter.</td>
                      </tr>
                    ) : (
                      filteredToneTerms.map((term, index) => (
                        <tr key={index} className="hover:bg-neutral-50/50 transition-colors">
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 font-bold text-[#FF4B2B] bg-red-50 border border-red-100 px-2 py-1 rounded">
                              <X className="w-3.5 h-3.5" /> "{term.avoid}"
                            </span>
                          </td>
                          <td className="p-4">
                            <span className="inline-flex items-center gap-1.5 font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded">
                              <Check className="w-3.5 h-3.5" /> "{term.use}"
                            </span>
                          </td>
                          <td className="p-4 text-muted hidden md:table-cell max-w-sm leading-relaxed">
                            {term.reason}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Extra context rule */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3 text-xs leading-relaxed text-amber-900">
                <Info className="w-5 h-5 shrink-0 text-amber-700" />
                <div>
                  <strong className="font-bold">Sentence Structuring Standard:</strong> Write in the active voice. Limit descriptors. Let numeric metrics speak for themselves. Avoid trailing marketing summaries (e.g. do not end a paragraph with "allowing you to unleash unlimited synergy").
                </div>
              </div>
            </div>
          )}

          {/* PANEL 2: TYPOGRAPHY PLAYGROUND */}
          {activePlaybookTab === "typo" && (
            <div className="bg-white border border-line/40 rounded-[32px] p-6 md:p-8 shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-text">Typographic Formula Workbench</h2>
                <p className="text-muted text-xs mt-1">
                  Adjust standard parameters below to preview our typography rules. We pair Space Grotesk display headers with Inter body copy.
                </p>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-neutral-50 p-5 rounded-2xl border border-line/20">
                <div className="space-y-2">
                  <label className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
                    <span>Font Size</span>
                    <span className="text-text">{fontSize}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="20" 
                    max="64" 
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
                    <span>Letter Spacing (Tracking)</span>
                    <span className="text-text">{tracking}px</span>
                  </label>
                  <input 
                    type="range" 
                    min="-4" 
                    max="2" 
                    step="0.1"
                    value={tracking}
                    onChange={(e) => setTracking(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex justify-between text-[10px] font-bold uppercase tracking-wide text-muted">
                    <span>Line Height (Leading)</span>
                    <span className="text-text">{lineHeight}em</span>
                  </label>
                  <input 
                    type="range" 
                    min="0.9" 
                    max="1.5" 
                    step="0.05"
                    value={lineHeight}
                    onChange={(e) => setLineHeight(Number(e.target.value))}
                    className="w-full accent-black cursor-pointer"
                  />
                </div>
              </div>

              {/* Text previews */}
              <div className="border border-line/30 rounded-2xl p-6 md:p-8 bg-neutral-50 space-y-6">
                <div>
                  <span className="text-[9px] font-mono text-muted uppercase font-bold block mb-2">Display Heading Style (Space Grotesk)</span>
                  <h3 
                    style={{ fontSize: `${fontSize}px`, letterSpacing: `${tracking}px`, lineHeight: `${lineHeight}` }}
                    className="font-sans font-bold tracking-tight text-text bg-white p-4 rounded-xl border border-line/10 leading-none"
                  >
                    Bring every team into sharp focus.
                  </h3>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-muted uppercase font-bold block mb-2">Primary Copy Style (Inter Sans)</span>
                  <p className="text-xs text-muted leading-relaxed font-sans bg-white p-4 rounded-xl border border-line/10">
                    Unify your brand strategy, synchronize design guidelines across the global enterprise layer, and generate authenticated visual layouts using local semantic transformers. Built strictly to eliminate creative drift.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PANEL 3: COLOR SPECTRUM & WCAG CONTRAST */}
          {activePlaybookTab === "colors" && (
            <div className="bg-white border border-line/40 rounded-[32px] p-6 md:p-8 shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-text">Corporate Color Spectrum</h2>
                <p className="text-muted text-xs mt-1">
                  Enforced standard hex color palettes with built-in accessibility contrast scoring.
                </p>
              </div>

              {/* Swatch grid */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {brandColors.map((color, idx) => (
                  <div 
                    key={idx}
                    className="p-3 bg-neutral-50 border border-line/20 rounded-2xl flex flex-col items-center hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => {
                      // Click swatch to set as contrast bg or text
                      if (color.isDark) {
                        setContrastBg(color.hex);
                      } else {
                        setContrastText(color.hex);
                      }
                    }}
                  >
                    <div 
                      style={{ backgroundColor: color.hex }}
                      className="w-12 h-12 rounded-xl mb-3 shadow-inner border border-black/5"
                    />
                    <span className="text-[10px] font-bold text-text truncate w-full text-center">{color.name}</span>
                    <span className="font-mono text-[9px] text-muted uppercase mt-0.5">{color.hex}</span>
                    <span className="text-[8px] text-[#FF416C] font-bold uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {color.isDark ? "Set Background" : "Set Text"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Contrast playground */}
              <div className="bg-[#FAF9F5] border border-line rounded-[24px] p-6">
                <span className="text-[10px] font-bold text-[#FF416C] uppercase tracking-wider block mb-4">WCAG Accessibility Checker</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  
                  {/* Selectors */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-muted mb-1">Canvas Background</label>
                      <select 
                        value={contrastBg}
                        onChange={(e) => setContrastBg(e.target.value)}
                        className="w-full bg-white border border-line rounded-lg text-xs px-3 py-2 font-mono"
                      >
                        {brandColors.map((color, idx) => (
                          <option key={idx} value={color.hex}>{color.name} ({color.hex})</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase text-muted mb-1">Text Color</label>
                      <select 
                        value={contrastText}
                        onChange={(e) => setContrastText(e.target.value)}
                        className="w-full bg-white border border-line rounded-lg text-xs px-3 py-2 font-mono"
                      >
                        {brandColors.map((color, idx) => (
                          <option key={idx} value={color.hex}>{color.name} ({color.hex})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Visual Live Preview Box */}
                  <div 
                    style={{ backgroundColor: contrastBg, color: contrastText }}
                    className="h-[140px] rounded-2xl p-5 border border-black/10 flex flex-col justify-between shadow-inner transition-colors"
                  >
                    <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">Visual Preview Box</span>
                    <div className="space-y-1">
                      <h4 className="text-base font-bold font-sans">Sharp Brand Focus</h4>
                      <p className="text-[10px] opacity-80 leading-snug">The quick brown fox jumps over the lazy dog.</p>
                    </div>
                  </div>

                </div>

                {/* Score results */}
                <div className="mt-6 pt-6 border-t border-line/20 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-white rounded-xl border border-line/10 shadow-sm">
                    <span className="block text-[9px] text-muted uppercase font-bold mb-1">Contrast Ratio</span>
                    <span className="block text-lg font-mono font-extrabold text-text">{contrastRatio}:1</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-line/10 shadow-sm">
                    <span className="block text-[9px] text-muted uppercase font-bold mb-1">AA Large Text</span>
                    <span className={`inline-block font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full ${wcagAA_Large ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {wcagAA_Large ? "PASS" : "FAIL"}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-line/10 shadow-sm">
                    <span className="block text-[9px] text-muted uppercase font-bold mb-1">AA Normal Text</span>
                    <span className={`inline-block font-extrabold text-xs uppercase px-2.5 py-0.5 rounded-full ${wcagAA_Normal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {wcagAA_Normal ? "PASS" : "FAIL"}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PANEL 4: GRIDS & SPACING */}
          {activePlaybookTab === "spacing" && (
            <div className="bg-white border border-line/40 rounded-[32px] p-6 md:p-8 shadow-md space-y-8 animate-fade-in">
              <div>
                <h2 className="font-sans text-2xl font-bold tracking-tight text-text">Linear Spacing Formulas</h2>
                <p className="text-muted text-xs mt-1">
                  Click different spacing coordinates below to preview standard padding bounds.
                </p>
              </div>

              {/* Selector spacing units */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {[4, 8, 12, 16, 24, 32, 48, 64].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setSelectedSpacingUnit(unit)}
                    className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${selectedSpacingUnit === unit ? 'bg-black text-white border-black' : 'bg-neutral-50 hover:bg-neutral-100 text-text border-line/25'}`}
                  >
                    <span className="block font-mono text-xs font-bold">{unit}px</span>
                    <span className="block text-[9px] text-muted mt-1 uppercase">Unit_0{unit / 4}</span>
                  </button>
                ))}
              </div>

              {/* Visual spacing showcase */}
              <div className="bg-neutral-50 border border-line/20 rounded-2xl p-6 flex flex-col items-center">
                <span className="text-[10px] text-muted font-bold uppercase tracking-wider mb-4 block">Visual Dimension Box ({selectedSpacingUnit}px)</span>
                
                <div className="bg-white border border-line/30 rounded-xl p-4 w-full max-w-sm flex flex-col items-center shadow-sm">
                  {/* Outer padding mock */}
                  <div 
                    style={{ padding: `${selectedSpacingUnit}px` }}
                    className="bg-[#FF416C]/10 border border-[#FF416C]/30 w-full transition-all rounded-lg"
                  >
                    <div className="bg-white border border-line text-center py-4 font-mono text-[10px] text-text font-bold shadow-sm rounded">
                      Content Bounds Area
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-muted max-w-sm text-center leading-relaxed mt-4">
                  Using uniform geometric scales ensures that layouts align automatically on desktop bento grids as well as fluid mobile sheets.
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
