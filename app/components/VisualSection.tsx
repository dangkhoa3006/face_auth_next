"use client";

export default function VisualSection() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary/10 h-screen">
      {/* Abstract Background Pattern */}
      <div
        className="absolute inset-0 opacity-20 dark:opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, #248f7d 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
        <div className="w-full max-w-md aspect-square bg-gradient-to-br from-primary via-emerald-600 to-[#121716] rounded-3xl shadow-2xl flex items-center justify-center p-1">
          <div className="w-full h-full bg-[#16181d] rounded-[calc(1.5rem-4px)] flex flex-col items-center justify-center text-white/90 gap-8 overflow-hidden relative">
            <span className="material-symbols-outlined text-9xl text-primary opacity-80 animate-pulse">
              shield_lock
            </span>
            <div className="text-center px-8">
              <h3 className="text-2xl font-bold mb-2">Next-Gen Protection</h3>
              <p className="text-white/60 text-sm">
                State-of-the-art biometric authentication for your digital
                workspace.
              </p>
            </div>
            {/* Decorative glow */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
        <div className="mt-12 text-left w-full max-w-md">
          <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-xs mb-4">
            <span className="w-8 h-[2px] bg-primary"></span>
            Trusted by industry leaders
          </div>
          <div className="flex gap-6 opacity-40">
            <span className="material-symbols-outlined text-3xl">
              verified_user
            </span>
            <span className="material-symbols-outlined text-3xl">security</span>
            <span className="material-symbols-outlined text-3xl">
              fingerprint
            </span>
            <span className="material-symbols-outlined text-3xl">
              key_visualizer
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
