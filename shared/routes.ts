import { z } from 'zod';
import { insertDocumentSchema, insertMessageSchema, insertChatSchema, documents, chats, messages } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  documents: {
    list: {
      method: 'GET' as const,
      path: '/api/documents',
      responses: {
        200: z.array(z.custom<typeof documents.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/documents',
      input: insertDocumentSchema,
      responses: {
        201: z.custom<typeof documents.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    process: {
      method: 'POST' as const,
      path: '/api/documents/:id/process',
      responses: {
        200: z.object({ status: z.string() }),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/documents/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    }
  },
  chats: {
    list: {
      method: 'GET' as const,
      path: '/api/chats',
      responses: {
        200: z.array(z.custom<typeof chats.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/chats',
      input: z.object({ title: z.string() }),
      responses: {
        201: z.custom<typeof chats.$inferSelect>(),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/chats/:id',
      responses: {
        200: z.object({
          chat: z.custom<typeof chats.$inferSelect>(),
          messages: z.array(z.custom<typeof messages.$inferSelect>())
        }),
        404: errorSchemas.notFound,
      },
    },
    message: {
      method: 'POST' as const,
      path: '/api/chats/:id/messages',
      input: z.object({ content: z.string() }),
      responses: {
        201: z.custom<typeof messages.$inferSelect>(), // The user message
        // Streaming response for assistant is handled via specific endpoint or just SSE
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
