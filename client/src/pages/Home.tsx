import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, Code, Sparkles, Zap, ArrowRight, MessageSquare, FolderKanban, Database } from "lucide-react";
import { APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={toggleTheme}>
              {theme === "dark" ? "☀️" : "🌙"}
            </Button>
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button>Sign In</Button>
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Enterprise-Grade AI Development Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            AURA AI Copilot
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Autonomous Unified Reality Architect - A multi-agent AI system that orchestrates specialized agents for code generation, research, UI design, testing, and deployment.
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Open Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <a href={getLoginUrl()}>
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Powerful AI Agents at Your Command</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="Multi-Agent Orchestration"
            description="Coordinate specialized AI agents (Code, Research, UI, QA, DevOps, BizOps) to tackle complex development tasks."
          />
          <FeatureCard
            icon={<Code className="h-8 w-8" />}
            title="Code Generation"
            description="Generate production-ready code in multiple languages with deep understanding of frameworks and best practices."
          />
          <FeatureCard
            icon={<MessageSquare className="h-8 w-8" />}
            title="Intelligent Chat"
            description="Natural language interface with context-aware responses and agent routing for optimal results."
          />
          <FeatureCard
            icon={<Database className="h-8 w-8" />}
            title="RAG Knowledge Base"
            description="Store and retrieve project documentation with semantic search powered by vector embeddings."
          />
          <FeatureCard
            icon={<FolderKanban className="h-8 w-8" />}
            title="Project Management"
            description="Track projects, tasks, and agent activities with comprehensive dashboards and analytics."
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8" />}
            title="MCP Integration"
            description="Model Context Protocol support for structured context passing and tool integration."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build with AI?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the future of AI-powered development. Start building with AURA's multi-agent system today.
          </p>
          {!isAuthenticated && (
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2">
                Start Free <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2025 {APP_TITLE}. Enterprise-grade AI development platform.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
