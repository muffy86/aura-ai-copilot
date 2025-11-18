import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import * as agents from "./agents";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ========== Projects ==========
  projects: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        description: z.string().optional(),
        spec: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const projectId = await db.createProject({
          userId: ctx.user.id,
          name: input.name,
          description: input.description,
          spec: input.spec,
        });
        return { id: projectId };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserProjects(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectById(input.id);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["active", "archived", "completed"]).optional(),
        spec: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateProject(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProject(input.id);
        return { success: true };
      }),
  }),

  // ========== Conversations ==========
  conversations: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string().optional(),
        projectId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversationId = await db.createConversation({
          userId: ctx.user.id,
          title: input.title,
          projectId: input.projectId,
        });
        return { id: conversationId };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserConversations(ctx.user.id);
    }),

    get: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getConversationById(input.id);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteConversation(input.id);
        return { success: true };
      }),
  }),

  // ========== Messages & AI Chat ==========
  chat: router({
    send: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        message: z.string(),
        agentType: z.enum(["orchestrator", "code", "research", "ui", "qa", "devops", "bizops"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.createMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.message,
        });

        // Route to appropriate agent (default to orchestrator)
        const agentType = input.agentType || "orchestrator";
        const response = await agents.routeToAgent(agentType, input.message);

        // Save assistant response
        const messageId = await db.createMessage({
          conversationId: input.conversationId,
          role: "assistant",
          content: response.content,
          agentType: response.agentType,
          metadata: JSON.stringify(response.metadata),
        });

        return {
          id: messageId,
          content: response.content,
          agentType: response.agentType,
        };
      }),

    messages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ input }) => {
        return await db.getConversationMessages(input.conversationId);
      }),
  }),

  // ========== Tasks ==========
  tasks: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().optional(),
        conversationId: z.number().optional(),
        agentType: z.enum(["orchestrator", "code", "research", "ui", "qa", "devops", "bizops"]),
        description: z.string(),
      }))
      .mutation(async ({ input }) => {
        const taskId = await db.createTask({
          projectId: input.projectId,
          conversationId: input.conversationId,
          agentType: input.agentType,
          description: input.description,
        });
        return { id: taskId };
      }),

    list: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectTasks(input.projectId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["pending", "in_progress", "completed", "failed"]).optional(),
        result: z.string().optional(),
        error: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateTask(id, data);
        return { success: true };
      }),
  }),

  // ========== Knowledge Base ==========
  knowledge: router({
    create: protectedProcedure
      .input(z.object({
        projectId: z.number().optional(),
        title: z.string(),
        content: z.string(),
        fileUrl: z.string().optional(),
        mimeType: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const knowledgeId = await db.createKnowledge({
          userId: ctx.user.id,
          projectId: input.projectId,
          title: input.title,
          content: input.content,
          fileUrl: input.fileUrl,
          mimeType: input.mimeType,
        });
        return { id: knowledgeId };
      }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserKnowledge(ctx.user.id);
    }),

    byProject: protectedProcedure
      .input(z.object({ projectId: z.number() }))
      .query(async ({ input }) => {
        return await db.getProjectKnowledge(input.projectId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
