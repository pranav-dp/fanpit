# THIS IS THE FIRST ITERATION OF FANPITFINAL REPO. 
CHECK THAT OUT FOR LATEST IMPROVEMENT I DID.
An AI-powered conversational assistant that helps users find, explore, and book free events using natural language queries on the Fanpit platform.

## Features

- **Natural Language Search**: Find events with queries like "Free music events in Chennai this weekend"
- **Event Details**: Get detailed information about events, artists, and venues
- **Real-time Availability**: Check if events still have available spots
- **Free Event Booking**: Book and cancel free events directly through the assistant
- **Artist & Brand Info**: Learn about artists and event organizers

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: LangGraph Server with function-calling tools
- **API**: Mock API server with event data from Fanpit
- **LLM**: Google Gemini 2.5 Flash

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Google Gemini API key

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/fanpit-concierge.git
cd fanpit-concierge
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

4. Start both the Next.js app and the mock API server:

```bash
# The easiest way to start everything
npm run start-all
```

Alternatively, you can run them separately:

```bash
# Terminal 1: Start the mock API server
npm run api

# Terminal 2: Start the Next.js app
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to use the Fanpit Concierge.

### Troubleshooting

If you encounter any issues with file paths, run the copy-data script manually:

```bash
npm run copy-data
```

This will copy the fanpit_data.json file to the correct location in the build directory.

## Usage Examples

Try asking the assistant questions like:

- "What free events are happening in Chennai this week?"
- "Tell me about the Fanpit App Drop event"
- "Are there any music events in Bangalore?"
- "I want to book the Fanpit App Drop event"
- "Show me my bookings"
- "Cancel my booking for the Fanpit App Drop event"

## Project Structure

- `/app`: Next.js frontend components and API routes
- `/tools.js`: LangGraph tools for interacting with the Fanpit API
- `/langgraph.js`: LangGraph agent configuration
- `/mockApi.js`: Mock API server with Fanpit event data
- `/fanpit_data.json`: Sample event data
- `/copy-data.js`: Script to copy data file to build directory

## Development

### Adding New Features

To add new features to the assistant:

1. Define new tools in `tools.js`
2. Update the system prompt in `langgraph.js`
3. Add corresponding API endpoints in `mockApi.js`
4. Update the UI in `app/page.tsx` if needed

### Customizing the UI

The UI is built with Tailwind CSS. You can customize the appearance by:

1. Modifying the color scheme in `globals.css`
2. Updating the chat interface in `app/page.tsx`
3. Adjusting the layout in `app/layout.tsx`

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Fanpit platform for the event data structure and inspiration
- LangGraph for the agent framework
- Next.js team for the frontend framework
