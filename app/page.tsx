export default function HomePage() {
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-2xl border border-blinkit-border shadow-sm">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-blinkit-green-light text-blinkit-green rounded-full mb-2">
          Blinkit Homepage Shell
        </span>
        <h1 className="text-xl font-bold text-blinkit-black mb-1">
          Welcome to Blinkit
        </h1>
        <p className="text-xs text-blinkit-muted">
          Instant 10-minute delivery at your doorstep. Scaffolded empty page shell ready for components.
        </p>
      </div>

      {/* Visual Token Showcase Banner */}
      <div className="bg-blinkit-yellow/20 border border-blinkit-yellow p-4 rounded-2xl">
        <h2 className="text-sm font-semibold text-blinkit-black mb-1">
          Visual Tokens Configured
        </h2>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <div className="bg-blinkit-yellow text-blinkit-black p-2 rounded-lg text-xs font-semibold shadow-sm">
            #F8CB45
            <br />
            Yellow BG
          </div>
          <div className="bg-blinkit-green text-white p-2 rounded-lg text-xs font-semibold shadow-sm">
            #54B226
            <br />
            Green Accent
          </div>
          <div className="bg-blinkit-black text-white p-2 rounded-lg text-xs font-semibold shadow-sm">
            #1F1F1F
            <br />
            Near-Black Text
          </div>
        </div>
      </div>
    </div>
  );
}
