TaskFlow: Real-Time Task Management System
A high-performance Task Management application featuring a robust RESTful API and Real-Time updates via WebSockets. Built with a modern tech stack focused on speed, type safety, and a seamless user experience. 
Tech Stack :
Frontend: React (Vite), TypeScript, Tailwind CSS, Shadcn UI.
Backend: Node.js, Express.js.
Real-time: Socket.io for live bi-directional synchronization.
Database: PostgreSQL (managed via Supabase).
State Management: Custom React Hooks with Optimistic UI updates.
Key Features:
Full CRUD: Create, read, update, and delete tasks through standard REST endpoints.
Real-Time Sync: Changes made by one user are broadcast instantly to all other active clients using Socket.io.
Optimistic UI: The interface updates instantly while server requests process, providing zero-latency feedback.
Status Filtering: Dedicated views to filter tasks by pending, in-progress, or completed.
Input Validation: Basic error handling and validation for task titles and descriptions.
Responsive Design: Fully optimized for mobile, tablet, and desktop experiences. 
API Reference MethodEndpointDescriptionGET/api/tasksFetch all tasksGET/api/tasks?status=pendingFilter tasks by their current statusPOST/api/tasksCreate a new taskPATCH/api/tasks/:idUpdate a task's status or detailsDELETE/api/tasks/:idRemove a task from the database Getting StartedFollow these steps to run the project locally:1. PrerequisitesNode.js (v18 or higher).An active Supabase project for the database.2. InstallationClone the repository:Bashgit clone https://github.com/your-username/task-management-rest-app.git
cd task-management-rest-app
Install dependencies:Bashnpm install
3. ConfigurationCreate a .env file in the root directory and add your connection keys:Code snippetVITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
4. Running the AppStart the local development server:Bashnpm run dev.
