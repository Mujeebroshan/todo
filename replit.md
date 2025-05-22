# TaskFlow - Collaborative Task Management Application

## Overview

TaskFlow is a collaborative task management application built as a single-page application (SPA) using Vue.js for the frontend and Express.js for the backend. The application provides a modern, responsive interface for teams to manage tasks, track progress, and collaborate effectively.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vue.js 3 with Composition API
- **Routing**: Vue Router with hash-based routing
- **State Management**: Vuex for centralized state management
- **UI Framework**: Bootstrap 5 with Bootstrap Icons
- **Architecture Pattern**: Component-based SPA with modular structure

### Backend Architecture
- **Framework**: Express.js (Node.js)
- **API Style**: RESTful API design
- **Data Storage**: In-memory storage (arrays for tasks and team members)
- **Middleware**: CORS enabled, JSON body parsing

## Key Components

### Frontend Components
1. **Dashboard**: Overview component displaying task statistics and recent activities
2. **TasksList**: Main task management interface with filtering and sorting
3. **TaskCard**: Reusable component for displaying individual task information
4. **TaskForm**: Form component for creating and editing tasks
5. **TeamMemberForm**: Form for managing team member information

### Backend Endpoints
- `GET /api/tasks` - Retrieve tasks with optional filtering (status, assignee, priority)
- Task CRUD operations (implied from frontend structure)
- Team member management endpoints

### State Management Structure
- Tasks collection with filtering capabilities
- Team members data
- UI state (loading, errors, toasts)
- Filters and sorting preferences

## Data Flow

1. **Client-Server Communication**: RESTful API calls from Vue components to Express backend
2. **State Updates**: Vuex store manages application state with getters for filtered/sorted data
3. **Component Communication**: Props down, events up pattern with some Vuex integration
4. **Reactive Updates**: Vue's reactivity system ensures UI updates when data changes

### Task Data Model
```javascript
{
  id: string,
  title: string,
  description: string,
  assigneeId: string,
  priority: 'low' | 'medium' | 'high',
  status: 'todo' | 'in-progress' | 'completed',
  dueDate: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Team Member Data Model
```javascript
{
  id: string,
  name: string,
  email: string,
  role: string
}
```

## External Dependencies

### Frontend Dependencies
- **Vue.js 3**: Core framework via CDN
- **Vue Router**: Client-side routing
- **Vuex**: State management
- **Bootstrap 5**: CSS framework and components
- **Bootstrap Icons**: Icon library

### Backend Dependencies
- **express**: Web application framework
- **cors**: Cross-origin resource sharing middleware
- **uuid**: Unique identifier generation for entities

## Deployment Strategy

### Development Environment
- **Replit Configuration**: Node.js 20 runtime with automatic dependency installation
- **Development Server**: Express server running on port 8000
- **Static File Serving**: HTML, CSS, and JavaScript files served directly

### Production Considerations
- Currently uses in-memory storage (data persistence needed for production)
- No authentication/authorization implemented
- No database integration (ready for migration to persistent storage)
- CORS enabled for cross-origin requests

### Deployment Process
1. Install dependencies: `npm install express cors uuid`
2. Start server: `node server.js`
3. Application accessible on port 8000
4. Frontend assets served statically from root directory

## Architecture Decisions

### In-Memory Storage
- **Problem**: Need for data persistence during development
- **Solution**: Arrays stored in server memory
- **Rationale**: Simple setup for prototyping and development
- **Trade-offs**: Data lost on server restart, not suitable for production

### Vue.js SPA Architecture
- **Problem**: Need for responsive, interactive user interface
- **Solution**: Single-page application with component-based architecture
- **Rationale**: Better user experience, modular code organization
- **Benefits**: Fast navigation, reusable components, reactive updates

### RESTful API Design
- **Problem**: Need for structured client-server communication
- **Solution**: REST API with conventional HTTP methods
- **Rationale**: Standard, predictable interface for frontend consumption
- **Benefits**: Easy to understand, test, and extend

### Bootstrap Integration
- **Problem**: Need for responsive, professional UI quickly
- **Solution**: Bootstrap 5 with custom CSS overrides
- **Rationale**: Rapid development with consistent design system
- **Benefits**: Mobile-responsive, accessible components, reduced CSS development time