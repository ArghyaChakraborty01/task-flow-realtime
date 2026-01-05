import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-primary opacity-5 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container relative z-10 mx-auto px-6 pt-32 pb-20">
        {/* Badge */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-card/50 backdrop-blur-sm shadow-sm">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/80">
              Real-time Task Management
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
            Manage Tasks with{" "}
            <span className="text-gradient">Lightning Speed</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            A powerful REST API with real-time WebSocket updates. 
            Create, track, and collaborate on tasks instantly across your entire team.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* App Preview */}
        <div className="mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="relative max-w-5xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-3xl" />
            
            {/* App mockup */}
            <div className="relative bg-card rounded-2xl shadow-card-hover border border-border/50 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-accent/60" />
                  <div className="w-3 h-3 rounded-full bg-primary/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background/80 text-xs text-muted-foreground">
                    taskflow.app/dashboard
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Task items preview */}
                {[
                  { title: "Design system implementation", status: "completed", color: "bg-accent" },
                  { title: "REST API endpoints", status: "in-progress", color: "bg-primary" },
                  { title: "WebSocket integration", status: "pending", color: "bg-muted-foreground" },
                ].map((task, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border hover:shadow-card transition-all duration-300"
                  >
                    <div className={`w-3 h-3 rounded-full ${task.color}`} />
                    <span className="flex-1 font-medium text-foreground">{task.title}</span>
                    <span className="text-xs px-3 py-1 rounded-full bg-secondary text-muted-foreground capitalize">
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
