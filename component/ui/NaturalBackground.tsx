"use client";

export default function NaturalBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Top Center Primary Glowing Orb (Blue / Indigo) */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[800px] md:w-[1200px] h-[500px] md:h-[700px] rounded-full blur-[100px] opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59, 130, 246, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, transparent 70%)",
        }}
      />

      {/* Secondary Ambient Accent Glow (Right side Purple) */}
      <div
        className="absolute top-[25%] -right-[150px] w-[600px] h-[600px] rounded-full blur-[120px] opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(147, 51, 234, 0.35) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 80%)",
        }}
      />

      {/* Bottom Left Accent Glow (Emerald/Cyan) */}
      <div
        className="absolute top-[60%] -left-[150px] w-[500px] h-[500px] rounded-full blur-[130px] opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 80%)",
        }}
      />

      {/* Modern Precision Grid Lines Pattern */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "3.5rem 3.5rem",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 50% 20%, #000 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 70% at 50% 20%, #000 40%, transparent 100%)",
        }}
      />

      {/* Dot Matrix Layer */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "1.75rem 1.75rem",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 25%, #000 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 25%, #000 30%, transparent 100%)",
        }}
      />
    </div>
  );
}
