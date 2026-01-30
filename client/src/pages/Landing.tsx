import { Button } from "@/components/ui/button";
import { ShieldCheck, Database, Zap, ArrowRight, Lock } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {/* Header */}
      <header className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-primary-foreground w-5 h-5" />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Enterprise RAG</span>
            </div>
            <Button onClick={handleLogin} className="font-medium">
              Log In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-16 lg:pt-48 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium animate-enter">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Secure Enterprise Intelligence
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-foreground leading-[1.1] animate-enter delay-100">
              Unlock the knowledge hidden in your <span className="text-primary">documents</span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed animate-enter delay-200">
              A secure, private RAG system designed for enterprise data. 
              Upload contracts, reports, and manuals to chat with your organizational knowledge base instantly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-enter delay-300">
              <Button size="lg" className="h-12 px-8 text-base rounded-xl shadow-lg shadow-primary/25" onClick={handleLogin}>
                Get Started Securely
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base rounded-xl">
                View Documentation
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid md:grid-cols-3 gap-8 animate-enter delay-300">
            {[
              {
                icon: Database,
                title: "Vector Database",
                desc: "Powered by pgvector for semantic similarity search across millions of document chunks."
              },
              {
                icon: Lock,
                title: "Enterprise Security",
                desc: "RBAC ready with sensitivity labels (Red/Amber/Green) for granular access control."
              },
              {
                icon: Zap,
                title: "Instant Processing",
                desc: "Automated ingestion pipeline extracts text, chunks content, and generates embeddings."
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-display mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Enterprise RAG System. Built for security.
        </div>
      </footer>
    </div>
  );
}
