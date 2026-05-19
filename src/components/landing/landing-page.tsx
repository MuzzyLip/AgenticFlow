import { CTA } from "./cta";
import { FeatureGrid } from "./feature-grid";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { Navbar } from "./navbar";
import { WorkflowCanvas } from "./workflow-canvas";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <WorkflowCanvas />
        <FeatureGrid />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
