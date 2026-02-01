# Comprehensive React Application Design & Troubleshooting Guide

This guide is designed for developers who are new to React, specifically focused on the Enterprise RAG system.

## 1. The React "Mental Model"
React doesn't update the whole page when something changes. Instead, it updates small "Components" based on **State**.

### What is State?
Think of state as the "memory" of a component.
- **Example**: In our `ChatWindow`, the list of messages is stored in state. When a new message arrives, the state is updated, and React automatically redraws only that specific part of the screen.

## 2. Directory Structure Walkthrough
- `client/src/main.tsx`: The entry point. It starts the React engine and mounts it to the HTML.
- `client/src/App.tsx`: The "root" component. It defines the layout and routes (which page to show).
- `client/src/pages/`: Contains the main screens (Chat page, Knowledge Base page).
- `client/src/components/`: Reusable building blocks (Buttons, Inputs, Sidebars).
- `client/src/hooks/`: Custom logic for data fetching (`use-auth.ts`, `use-upload.ts`).

## 3. The Data Flow ( TanStack Query)
We use a library called **TanStack Query** (also known as React Query) to talk to the backend. It simplifies everything.

1. **Fetching (GET)**:
   ```tsx
   const { data, isLoading } = useQuery({ queryKey: ['/api/documents'] });
   // 'data' will be the list of documents from the database.
   // 'isLoading' is true while the network request is happening.
   ```
2. **Updating (POST/PATCH/DELETE)**:
   ```tsx
   const mutation = useMutation({
     mutationFn: (newDoc) => apiRequest('POST', '/api/documents', newDoc),
     onSuccess: () => queryClient.invalidateQueries(['/api/documents'])
     // Invalidate tells React: "The data changed, go fetch the fresh version!"
   });
   ```

## 4. How to Debug Bugs Independently

### Problem: The UI isn't showing new data
- **Check**: Did the backend request succeed? Open Browser DevTools (F12) -> **Network** tab. Look for the red requests.
- **Check**: Did you "invalidate" the cache? If you add a document but don't see it, you likely forgot `queryClient.invalidateQueries`.

### Problem: The "Upload" button does nothing
- **Check**: Look at the **Console** tab in DevTools. You'll likely see a `401 Unauthorized` (login expired) or a `500 Internal Server Error`.
- **Check**: `client/src/hooks/use-upload.ts`. This file handles the logic of talking to the storage server.

### Problem: Layout is broken
- **Check**: We use **Tailwind CSS**. Classes like `flex`, `grid`, and `p-4` control the layout. If something is overlapping, check the `className` properties in the component.

## 5. Coding Conventions in this Project
- **Naming**: Components start with Capital Letters (`ChatWindow`). Hooks start with "use" (`useAuth`).
- **Icons**: We use `lucide-react`. If you need a new icon, search the [Lucide Gallery](https://lucide.dev/icons/) and import it.
- **UI Kit**: We use **Shadcn UI**. These are high-quality, accessible components. Don't build buttons from scratch; use the ones in `client/src/components/ui/`.

## 6. Pro-Tip: "React DevTools"
Install the "React Developer Tools" extension for Chrome/Firefox. It allows you to click on any part of your app and see exactly what "state" and "props" (inputs) it currently has.
