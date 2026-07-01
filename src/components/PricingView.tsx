import React, { useState } from "react";
import { 
  Check, 
  Sparkles, 
  X, 
  HelpCircle,
  Sliders, 
  CreditCard, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function PricingView() {
  const [isAnnual, setIsAnnual] = useState<boolean>(true);
  
  // Custom slider values
  const [seats, setSeats] = useState<number>(20);
  const [scans, setScans] = useState<number>(50000);

  // Sign up modal state
  const [activePlanModal, setActivePlanModal] = useState<string | null>(null);
  const [signupName, setSignupName] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupCard, setSignupCard] = useState<string>("");
  const [isPaidSuccess, setIsPaidSuccess] = useState<boolean>(false);
  const [isPaying, setIsPaying] = useState<boolean>(false);

  // Determine dynamic tier based on custom sliders
  const calculatePlanType = () => {
    if (seats <= 10 && scans <= 20000) {
      return {
        tier: "Essential",
        base: 49,
        badge: "Growth Starter",
        desc: "Ideal for small creative studios setting up initial design safeguards."
      };
    } else if (seats <= 75 && scans <= 250000) {
      return {
        tier: "Growth OS",
        base: 189,
        badge: "Corporate Standard",
        desc: "Optimized for high-velocity teams coordinating multi-channel campaigns."
      };
    } else {
      return {
        tier: "Enterprise Pro",
        base: 599,
        badge: "Global Sovereign",
        desc: "Uncompromised security, custom fine-tuning models, and dedicated support."
      };
    }
  };

  const activePlan = calculatePlanType();

  // Dynamic price calculations
  const calculateTotalPrice = () => {
    const plan = calculatePlanType();
    let seatCharge = seats * 6;
    let scanCharge = (scans / 1000) * 0.4;
    
    // Base tier discount rules
    if (plan.tier === "Essential") {
      seatCharge = seats * 4;
    } else if (plan.tier === "Enterprise Pro") {
      seatCharge = seats * 8;
    }

    const subtotal = plan.base + seatCharge + scanCharge;
    const finalRate = isAnnual ? subtotal * 0.8 : subtotal;

    return Number(finalRate.toFixed(0));
  };

  const totalPrice = calculateTotalPrice();

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName || !signupEmail) return;

    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsPaidSuccess(true);
      setTimeout(() => {
        // Reset states
        setIsPaidSuccess(false);
        setActivePlanModal(null);
        setSignupName("");
        setSignupEmail("");
        setSignupCard("");
      }, 3000);
    }, 1500);
  };

  return (
    <div className="py-12 px-4 md:px-8 max-w-[1440px] mx-auto text-text animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center pb-8 border-b border-line/10 mb-16 max-w-3xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest text-[#FF416C] font-extrabold block mb-3">Enterprise Cost Scaling</span>
        <h1 className="font-sans text-3xl md:text-6xl font-extrabold tracking-tight">Flexible, Uncompromised Value</h1>
        <p className="text-muted text-xs md:text-sm mt-3 leading-relaxed">
          Predictable scale curves. Choose a pre-configured tier below or sliders to calibrate a tailored brand operating plan.
        </p>

        {/* Toggle Annual */}
        <div className="flex items-center gap-3.5 mt-8 bg-neutral-100 p-1.5 rounded-full border border-line/20">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors ${!isAnnual ? 'bg-black text-white' : 'text-muted hover:text-text'}`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide cursor-pointer transition-colors flex items-center gap-1.5 ${isAnnual ? 'bg-black text-white' : 'text-muted hover:text-text'}`}
          >
            <span>Annual (20% Save)</span>
            <span className="bg-[#FF416C]/10 text-[#FF416C] px-1.5 py-0.5 rounded text-[8px] font-extrabold">Active</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Interactive Cost Calculator */}
      <div className="bg-[#FAF9F5] border border-line rounded-[32px] p-6 md:p-8 shadow-xl mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Sliders (Left) */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#FF416C] tracking-wider flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Calibrate Resource Bounds
              </span>
              <h2 className="text-xl font-bold font-sans text-text mt-1">Estimate Custom Seat Capacity</h2>
            </div>

            {/* Slider 1: Seats */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted font-bold uppercase">Active Creative Users (Seats)</span>
                <span className="bg-white px-3 py-1 rounded border border-line/50 text-text font-black">{seats} Accounts</span>
              </div>
              <input 
                type="range"
                min="5"
                max="500"
                step="5"
                value={seats}
                onChange={(e) => setSeats(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>Min: 5 Seats</span>
                <span>Max: 500 Seats</span>
              </div>
            </div>

            {/* Slider 2: Scan count */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-muted font-bold uppercase">Monthly AI Compliance Scans</span>
                <span className="bg-white px-3 py-1 rounded border border-line/50 text-text font-black">
                  {scans.toLocaleString()} Scans
                </span>
              </div>
              <input 
                type="range"
                min="5000"
                max="1000000"
                step="5000"
                value={scans}
                onChange={(e) => setScans(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted font-mono">
                <span>Min: 5,000 / mo</span>
                <span>Max: 1,000,000 / mo</span>
              </div>
            </div>
          </div>

          {/* Recalculate output (Right) */}
          <div className="lg:col-span-5 bg-white border border-line rounded-[24px] p-6 shadow-md flex flex-col justify-between min-h-[340px]">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-line/10 mb-4">
                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Dynamic Plan Assessment</span>
                <span className="bg-[#FF416C]/10 text-[#FF416C] text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {activePlan.badge}
                </span>
              </div>

              <h3 className="text-2xl font-bold font-sans text-text mb-2">Lumio {activePlan.tier}</h3>
              <p className="text-xs text-muted leading-relaxed mb-6">{activePlan.desc}</p>

              {/* Dynamic pricing breakdowns */}
              <div className="space-y-2 text-xs font-mono border-t border-b border-line/15 py-4 my-4">
                <div className="flex justify-between text-muted">
                  <span>Base Plan cost:</span>
                  <span className="text-text font-bold">${activePlan.base} / mo</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Capacity Seats multiplier:</span>
                  <span className="text-text font-bold">+{seats * 6} / mo</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Compliance Scan volume allocation:</span>
                  <span className="text-text font-bold">+{(scans / 1000 * 0.4).toFixed(1)} / mo</span>
                </div>
                {isAnnual && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Annual discount (20%):</span>
                    <span>-20% Save</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[10px] uppercase font-bold text-muted">Estimated Billing Rate</span>
                <span className="text-4xl font-extrabold tracking-tight text-text">
                  ${totalPrice}<span className="text-xs font-medium text-muted font-mono"> / mo</span>
                </span>
              </div>

              <button 
                onClick={() => setActivePlanModal(`Custom Calculator Tier (${activePlan.tier})`)}
                className="w-full bg-black hover:bg-[#FF416C] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <span>Commit Scaled Reservation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* SECTION 2: Standard Plan Grids */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        
        {/* Tier 1: Essential */}
        <div className="bg-white border border-line/45 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-md hover:border-black/50 transition-all">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block mb-1">Essential Starter</span>
              <h3 className="text-xl font-bold font-sans text-text">Platform Basic</h3>
              <p className="text-xs text-muted leading-relaxed mt-2">
                All basic guidelines checks for individual content creators and freelancers.
              </p>
            </div>

            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight text-text">
                ${isAnnual ? 39 : 49}
              </span>
              <span className="text-xs text-muted font-mono ml-1">/ month</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-line/10 text-xs text-muted">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>5 Active Team Seats Included</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>10,000 scans / mo allocation</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Standard Tone Avoid/Use Lists</span></li>
              <li className="flex items-center gap-2 text-muted-light"><X className="w-4 h-4 text-red-400 shrink-0" /> <span className="line-through">Custom fine-tuning models</span></li>
              <li className="flex items-center gap-2 text-muted-light"><X className="w-4 h-4 text-red-400 shrink-0" /> <span className="line-through">Active drift alerts & webhooks</span></li>
            </ul>
          </div>

          <button 
            onClick={() => setActivePlanModal("Essential Plan")}
            className="w-full bg-neutral-100 hover:bg-neutral-800 hover:text-white text-text font-bold py-3 rounded-xl text-[10px] uppercase tracking-wider mt-8 transition-colors cursor-pointer"
          >
            Initialize Starter Tier
          </button>
        </div>

        {/* Tier 2: Growth OS (Featured) */}
        <div className="bg-white border-2 border-black rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-xl relative scale-105">
          <div className="absolute top-4 right-4 bg-[#FF416C]/10 text-[#FF416C] px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest">
            Corporate Standard
          </div>

          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#FF416C] tracking-widest block mb-1">Corporate Core</span>
              <h3 className="text-xl font-bold font-sans text-text">Growth OS</h3>
              <p className="text-xs text-muted leading-relaxed mt-2">
                The absolute sweet spot for fast-growing businesses coordinating multi-channel visual assets.
              </p>
            </div>

            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight text-text">
                ${isAnnual ? 149 : 189}
              </span>
              <span className="text-xs text-muted font-mono ml-1">/ month</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-line/10 text-xs text-muted">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span className="text-text font-semibold">50 Active Team Seats Included</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span className="text-text font-semibold">100,000 scans / mo allocation</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Standard Tone Avoid/Use Lists</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Active drift alerts & webhooks</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Figma & slack integrations</span></li>
            </ul>
          </div>

          <button 
            onClick={() => setActivePlanModal("Growth OS Plan")}
            className="w-full bg-black hover:bg-[#FF416C] text-white font-bold py-3 rounded-xl text-[10px] uppercase tracking-wider mt-8 transition-colors cursor-pointer shadow-md"
          >
            Initialize Growth Tier
          </button>
        </div>

        {/* Tier 3: Enterprise Pro */}
        <div className="bg-white border border-line/45 rounded-[32px] p-6 md:p-8 flex flex-col justify-between shadow-md hover:border-black/50 transition-all">
          <div className="space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted tracking-widest block mb-1">Corporate Scale</span>
              <h3 className="text-xl font-bold font-sans text-text">Enterprise Pro</h3>
              <p className="text-xs text-muted leading-relaxed mt-2">
                Uncompromising compliance checks, custom fine-tuning tone models, and single sign-on security.
              </p>
            </div>

            <div className="flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight text-text">
                ${isAnnual ? 479 : 599}
              </span>
              <span className="text-xs text-muted font-mono ml-1">/ month</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-line/10 text-xs text-muted">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>200+ Active Team Seats Included</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>500,000 scans / mo allocation</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>SSO & active directory synchronization</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Custom fine-tuning tone models</span></li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Dedicated brand strategist support</span></li>
            </ul>
          </div>

          <button 
            onClick={() => setActivePlanModal("Enterprise Pro Plan")}
            className="w-full bg-neutral-100 hover:bg-neutral-800 hover:text-white text-text font-bold py-3 rounded-xl text-[10px] uppercase tracking-wider mt-8 transition-colors cursor-pointer"
          >
            Request Enterprise Terms
          </button>
        </div>

      </div>

      {/* MODAL: Checkout Simulator */}
      {activePlanModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FAF9F5] border border-line rounded-[30px] max-w-md w-full p-6 relative shadow-2xl text-text">
            
            <button 
              onClick={() => {
                setActivePlanModal(null);
                setIsPaidSuccess(false);
              }}
              className="absolute top-4 right-4 p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-muted"
            >
              <X className="w-5 h-5" />
            </button>

            {isPaidSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-sans text-xl font-bold">Workspace Provisioned Successfully!</h3>
                <p className="text-xs text-muted max-w-sm mx-auto leading-relaxed">
                  Excellent choice! Your transaction has been approved. A workspace compilation ticket has been dispatched to <strong>{signupEmail || "your email address"}</strong>.
                </p>
                <p className="text-[10px] text-muted-light font-mono">Initializing compliance telemetry nodes...</p>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF416C]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF416C]">Secure Sandbox Transaction</span>
                </div>

                <h3 className="font-sans text-xl font-bold tracking-tight">Checkout: {activePlanModal}</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Confirm details below to provision your custom corporate brand workspace environment immediately.
                </p>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1 font-mono">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Jessica Chen"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      className="w-full bg-white border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1 font-mono">Billing Email</label>
                    <input 
                      type="email" 
                      required 
                      placeholder="jessica@arcform.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full bg-white border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#FF416C]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-muted mb-1 font-mono">Simulated Card Details</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required 
                        placeholder="4111 •••• •••• ••••"
                        value={signupCard}
                        onChange={(e) => setSignupCard(e.target.value)}
                        className="w-full bg-white border border-line rounded-lg pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-[#FF416C] font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-muted absolute left-3 top-2.5" />
                    </div>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-3 bg-black hover:bg-neutral-800 disabled:bg-neutral-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Validating Account Credentials...</span>
                    </>
                  ) : (
                    <span>Provision Workspace License</span>
                  )}
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
