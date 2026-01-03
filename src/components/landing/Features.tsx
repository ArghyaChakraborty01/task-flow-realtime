import { Zap, RefreshCw, Shield, Code2, Database, Wifi } from "lucide-react";

const features = [
  {
    icon: Code2,
    title: "RESTful API",
    description: "Clean, intuitive endpoints for creating, reading, updating, and deleting tasks with proper HTTP status codes.",
  },
  {
    icon: Wifi,
    title: "Real-time Updates",
    description: "WebSocket integration with Socket.io for instant task synchronization across all connected clients.",
  },
  {
    icon: Database,
    title: "PostgreSQL Storage",
    description: "Robust data persistence with Postgres, featuring optimized queries and reliable task management.",
  },
  {
    icon: RefreshCw,
    title: "Optimistic Updates",
    description: "Instant UI feedback with automatic rollback on errors for a seamless user experience.",
  },
  {
    icon: Shield,
    title: "Input Validation",
    description: "Comprehensive validation and error handling to ensure data integrity and security.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with efficient data fetching and minimal latency.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for{" "}
            <span className="text-gradient">task management</span>
          </h2>
          <p className="text-muted-foreground">
            Built with modern technologies and best practices to deliver a powerful, reliable task management solution.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
