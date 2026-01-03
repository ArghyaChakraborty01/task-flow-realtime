import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-primary opacity-10 blur-3xl rounded-full" />
      </div>

      <div className="container relative z-10 mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Ready to get started?
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Start building your{" "}
            <span className="text-gradient">task management</span> app today
          </h2>

          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Get up and running in minutes with our powerful API. 
            Real-time updates, robust storage, and beautiful UI included.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="xl">
              Launch Dashboard
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="heroOutline" size="xl">
              Read the Docs
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
