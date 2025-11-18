import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Brain, MessageSquare, FolderKanban, Database, Activity } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { data: conversations, isLoading: conversationsLoading } = trpc.conversations.list.useQuery();
  const { data: projects, isLoading: projectsLoading } = trpc.projects.list.useQuery();

  const stats = [
    {
      title: "Active Conversations",
      value: conversations?.length || 0,
      icon: <MessageSquare className="h-5 w-5" />,
      link: "/chat",
    },
    {
      title: "Projects",
      value: projects?.length || 0,
      icon: <FolderKanban className="h-5 w-5" />,
      link: "/projects",
    },
    {
      title: "AI Agents",
      value: 7,
      icon: <Brain className="h-5 w-5" />,
      description: "Orchestrator, Code, Research, UI, QA, DevOps, BizOps",
    },
    {
      title: "Knowledge Base",
      value: 0,
      icon: <Database className="h-5 w-5" />,
      link: "/knowledge",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to AURA AI Copilot</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="text-muted-foreground">{stat.icon}</div>
                {stat.link && (
                  <Link href={stat.link}>
                    <Button variant="ghost" size="sm">View</Button>
                  </Link>
                )}
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
              {stat.description && (
                <div className="text-xs text-muted-foreground mt-2">{stat.description}</div>
              )}
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Start New Conversation
            </h2>
            <p className="text-muted-foreground mb-4">
              Chat with AURA's AI agents to get help with development, research, or project management.
            </p>
            <Link href="/chat">
              <Button className="w-full">New Chat</Button>
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Create New Project
            </h2>
            <p className="text-muted-foreground mb-4">
              Start a new project with AI-powered planning, code generation, and task management.
            </p>
            <Link href="/projects">
              <Button className="w-full">New Project</Button>
            </Link>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </h2>
          {conversationsLoading || projectsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : conversations?.length === 0 && projects?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No activity yet. Start a conversation or create a project to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {conversations?.slice(0, 5).map((conv) => (
                <Link key={conv.id} href={`/chat/${conv.id}`}>
                  <div className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{conv.title || `Conversation #${conv.id}`}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(conv.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
