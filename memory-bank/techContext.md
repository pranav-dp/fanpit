# Tech Context

## Technologies Used
- **Frontend:**
  - Next.js 15
  - React
  - TypeScript
  - Tailwind CSS
  - React-Hook-Form / Zod (for any forms)
- **Backend (AI Agent):**
  - LangGraph Server
  - Google Gemini (Pro or Flash)
- **Database:**
  - MongoDB Atlas (with search and vector index capabilities)
- **Search:**
  - A performant search engine like Typesense or similar, or MongoDB Atlas's built-in capabilities.
- **Authentication:**
  - JWT-based authentication

## Development Setup
- Node.js
- npm
- Git for version control

## Technical Constraints
- All user actions must be authenticated via a JWT token passed in the `x-fanpit-token` header.
- The agent should only allow booking for free events.
- The reference for event data structure, booking flow, and content is `events.fanpit.live`.

## Dependencies
- Frontend: `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `react-hook-form`, `zod`, `autoprefixer`, `postcss`, `eslint`.
- Backend: `langgraph`, `@google/generative-ai`, and packages for interacting with the Fanpit API and database.

## Tool Usage Patterns
- The LangGraph agent will use a set of modular tools to interact with the Fanpit API. These tools will be designed to be single-purpose and reusable. Examples include:
  - `search_events(query: str, filters: dict)`
  - `get_event_details(event_id: str)`
  - `check_availability(event_id: str)`
  - `book_event(event_id: str, user_token: str)`
  - `cancel_booking(booking_id: str, user_token: str)`
  - `get_artist_info(artist_id: str)`
  - `get_brand_info(brand_id: str)`
  - `get_user_bookings(user_token: str)`
