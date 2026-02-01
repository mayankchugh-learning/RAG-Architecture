# React Application Design Guide for Beginners

*Note: For a more detailed technical breakdown, see [React-Application-Design-Guide.md](./React-Application-Design-Guide.md).*

## 1. Core Concepts
React is a library for building user interfaces using **Components**. A component is a self-contained piece of UI (like a Button or a ChatWindow).

### Components (`client/src/components`)
Components are the building blocks. We use **Functional Components** with **Hooks**.
- **`AppSidebar.tsx`**: Manages the main navigation.
- **`ChatWindow.tsx`**: Handles the message list and user input.
- **`ObjectUploader.tsx`**: Manages the complex logic of sending files to cloud storage.

### Hooks
Hooks allow you to "hook into" React features like state and lifecycle.
- **`useState`**: Stores data that changes over time (e.g., the current message being typed).
- **`useEffect`**: Runs code when the component loads or data changes (e.g., scrolling to the bottom of the chat).
- **`useAuth`**: Custom hook for checking if a user is logged in.

## 2. Data Fetching (TanStack Query)
We use `@tanstack/react-query` to talk to the backend. It handles:
- **Loading states**: Showing a spinner while waiting for data.
- **Caching**: Storing data so it doesn't need to be fetched twice.
- **Mutations**: Handling data updates (like sending a new message).

Example pattern:
```tsx
const { data: messages, isLoading } = useQuery({ 
  queryKey: ['/api/chats', id] 
});
```

## 3. Styling (Tailwind CSS)
Styling is done using utility classes directly in the HTML elements.
- `flex`: Creates a flexible layout.
- `bg-primary`: Uses the theme's primary color.
- `p-4`: Adds 1rem of padding.

## 4. Troubleshooting Steps
1. **Console Logs**: Press F12 in your browser to see errors in the "Console" tab.
2. **Network Tab**: Check the "Network" tab to see if API calls to `/api/...` are failing.
3. **Form Validation**: If a button doesn't work, check if a form field is missing required data.
