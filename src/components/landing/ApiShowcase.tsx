import { Badge } from "@/components/ui/badge";

const endpoints = [
  { method: "POST", path: "/api/tasks", description: "Create a new task" },
  { method: "GET", path: "/api/tasks", description: "Get all tasks" },
  { method: "GET", path: "/api/tasks?status=pending", description: "Filter by status" },
  { method: "PATCH", path: "/api/tasks/:id", description: "Update task status" },
  { method: "DELETE", path: "/api/tasks/:id", description: "Delete a task" },
];

const methodColors: Record<string, string> = {
  GET: "bg-accent/20 text-accent border-accent/30",
  POST: "bg-primary/20 text-primary border-primary/30",
  PATCH: "bg-amber-500/20 text-amber-600 border-amber-500/30",
  DELETE: "bg-destructive/20 text-destructive border-destructive/30",
};

const ApiShowcase = () => {
  return (
    <section className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              API Reference
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Clean, intuitive{" "}
              <span className="text-gradient">REST endpoints</span>
            </h2>
            <p className="text-muted-foreground mb-8">
              Our API follows REST best practices with proper HTTP methods, 
              status codes, and consistent response formats. Integrate with 
              any frontend framework in minutes.
            </p>

            {/* Code example */}
            <div className="bg-foreground rounded-xl p-5 font-mono text-sm overflow-x-auto">
              <div className="text-muted">
                <span className="text-accent">const</span>{" "}
                <span className="text-primary-foreground">response</span>{" "}
                <span className="text-muted">=</span>{" "}
                <span className="text-accent">await</span>{" "}
                <span className="text-amber-400">fetch</span>
                <span className="text-muted">(</span>
                <span className="text-green-400">'/api/tasks'</span>
                <span className="text-muted">,</span> {"{"}
              </div>
              <div className="pl-4 text-muted">
                method:{" "}
                <span className="text-green-400">'POST'</span>,
              </div>
              <div className="pl-4 text-muted">
                body: <span className="text-amber-400">JSON</span>.
                <span className="text-primary-foreground">stringify</span>({"{"}
              </div>
              <div className="pl-8 text-muted">
                title: <span className="text-green-400">'New Task'</span>,
              </div>
              <div className="pl-8 text-muted">
                status: <span className="text-green-400">'pending'</span>
              </div>
              <div className="pl-4 text-muted">{"}"}</div>
              <div className="text-muted">{"})"}</div>
            </div>
          </div>

          {/* Right content - Endpoints list */}
          <div className="space-y-3">
            {endpoints.map((endpoint, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-card transition-all duration-300"
              >
                <span
                  className={`px-3 py-1 rounded-md text-xs font-bold border ${methodColors[endpoint.method]}`}
                >
                  {endpoint.method}
                </span>
                <code className="flex-1 text-sm font-mono text-foreground">
                  {endpoint.path}
                </code>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {endpoint.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiShowcase;
