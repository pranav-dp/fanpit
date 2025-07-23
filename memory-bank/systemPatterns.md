# System Patterns

## System Architecture
The system will be composed of three main parts:
1.  **Frontend:** A Next.js 15 application that provides the user interface for the conversational agent. It will handle user input and display the agent's responses.
2.  **Backend (AI Agent):** A LangGraph Server that orchestrates the AI agent's logic. It will receive requests from the frontend, process them using an LLM, and call the necessary tools to interact with the Fanpit API.
3.  **Fanpit API:** A set of REST endpoints that provide access to the event data, booking functionality, and user authentication.

## Key Technical Decisions
- **LangGraph for Agent Logic:** LangGraph is chosen for its ability to create robust, stateful, and multi-agent workflows, which is ideal for a conversational agent that needs to handle context and complex interactions.
- **Next.js for Frontend:** Next.js 15 provides a modern, performant, and feature-rich framework for building the user interface.
- **Hybrid Search:** A combination of structured, full-text, and vector search will be used to provide the most relevant search results. This will be implemented using a performant search engine like Typesense or a similar service on top of MongoDB Atlas.
- **JWT for Authentication:** JWTs will be used to secure the communication between the frontend, the agent, and the Fanpit API. The token will be passed in the `x-fanpit-token` header.

## Design Patterns in Use
- **Tool-based Agent:** The LangGraph agent will be built using a tool-based architecture. Each specific action (e.g., searching for events, booking an event) will be encapsulated in a separate tool.
- **RESTful API:** The Fanpit backend will expose a RESTful API for the LangGraph agent to consume.
- **Component-Based UI:** The Next.js frontend will be built using a component-based architecture, with reusable components for the chat interface, event display, etc.

## Component Relationships
- The **Next.js Frontend** sends user queries to the **LangGraph Server**.
- The **LangGraph Server** processes the query, and uses its **Tools** to make calls to the **Fanpit API**.
- The **Fanpit API** interacts with the **MongoDB Atlas** database to retrieve or store data.
- The **LangGraph Server** sends the response back to the **Next.js Frontend** to be displayed to the user.

## Critical Implementation Paths
1.  Setting up the LangGraph server with a basic agent structure.
2.  Defining and implementing the toolset for the agent.
3.  Setting up the Next.js frontend with a basic chat interface.
4.  Integrating the frontend with the LangGraph server.
5.  Implementing the hybrid search system.
6.  Implementing the booking and cancellation workflow.
