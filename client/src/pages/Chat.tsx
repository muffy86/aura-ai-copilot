import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { Streamdown } from "streamdown";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type AgentType = "orchestrator" | "code" | "research" | "ui" | "qa" | "devops" | "bizops";

const AGENT_INFO: Record<AgentType, { name: string; description: string }> = {
  orchestrator: { name: "Orchestrator", description: "Coordinates all agents" },
  code: { name: "Code Agent", description: "Code generation & debugging" },
  research: { name: "Research Agent", description: "Information gathering" },
  ui: { name: "UI Agent", description: "UI/UX design" },
  qa: { name: "QA Agent", description: "Testing & quality" },
  devops: { name: "DevOps Agent", description: "Deployment & infrastructure" },
  bizops: { name: "BizOps Agent", description: "Project management" },
};

export default function Chat() {
  const [, params] = useRoute("/chat/:id?");
  const conversationId = params?.id ? parseInt(params.id) : null;
  
  const [message, setMessage] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<AgentType>("orchestrator");
  const [currentConvId, setCurrentConvId] = useState<number | null>(conversationId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const utils = trpc.useUtils();
  const { data: messages, isLoading: messagesLoading } = trpc.chat.messages.useQuery(
    { conversationId: currentConvId! },
    { enabled: !!currentConvId }
  );

  const createConversation = trpc.conversations.create.useMutation({
    onSuccess: (data) => {
      setCurrentConvId(data.id);
      utils.conversations.list.invalidate();
    },
  });

  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: () => {
      utils.chat.messages.invalidate({ conversationId: currentConvId! });
      setMessage("");
    },
    onError: (error) => {
      toast.error("Failed to send message: " + error.message);
    },
  });

  const handleSend = async () => {
    if (!message.trim()) return;

    // Create conversation if needed
    if (!currentConvId) {
      const conv = await createConversation.mutateAsync({
        title: message.substring(0, 50),
      });
      setCurrentConvId(conv.id);
      
      // Send message after conversation is created
      await sendMessage.mutateAsync({
        conversationId: conv.id,
        message: message.trim(),
        agentType: selectedAgent,
      });
    } else {
      await sendMessage.mutateAsync({
        conversationId: currentConvId,
        message: message.trim(),
        agentType: selectedAgent,
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold">AI Chat</h1>
          <p className="text-muted-foreground">Converse with AURA's specialized AI agents</p>
        </div>

        {/* Agent Selector */}
        <div className="mb-4">
          <Select value={selectedAgent} onValueChange={(v) => setSelectedAgent(v as AgentType)}>
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(AGENT_INFO).map(([key, info]) => (
                <SelectItem key={key} value={key}>
                  <div>
                    <div className="font-medium">{info.name}</div>
                    <div className="text-xs text-muted-foreground">{info.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Messages Area */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : !currentConvId || messages?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-center">
                <div>
                  <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
                  <p className="text-muted-foreground">
                    Ask AURA anything about development, research, or project management.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages?.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.agentType && msg.role === "assistant" && (
                        <div className="text-xs font-medium mb-2 opacity-70">
                          {AGENT_INFO[msg.agentType as AgentType]?.name || msg.agentType}
                        </div>
                      )}
                      {msg.role === "assistant" ? (
                        <Streamdown>{msg.content}</Streamdown>
                      ) : (
                        <div>{msg.content}</div>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {sendMessage.isPending && (
                  <div className="flex gap-3 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask AURA anything..."
                disabled={sendMessage.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!message.trim() || sendMessage.isPending}
                size="icon"
              >
                {sendMessage.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
