'use client';

export function PetalOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden hidden md:block z-[1]">
      <div className="petal petal-1">🌸</div>
      <div className="petal petal-2">🌸</div>
      <div className="petal petal-3">🌸</div>
      <div className="petal petal-4">🌸</div>
      <div className="petal petal-5">🌸</div>
    </div>
  );
}

