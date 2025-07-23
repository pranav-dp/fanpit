const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { SystemMessage, HumanMessage } = require('@langchain/core/messages');

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0,
});

const API_BASE_URL = 'http://localhost:8080';

const getAllEvents = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/events`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all events:', error);
        return [];
    }
};

const search_events = {
    name: "search_events",
    description: "Performs a semantic search for events and experiences based on a user's natural language query.",
    inputSchema: {
        type: "object",
        properties: {
            query: { type: "string", description: "The user's natural language query (e.g., 'are there any events on august 15', 'find me a concert in chennai')." }
        },
        required: ["query"]
    },
    func: async ({ query }) => {
        const allEvents = await getAllEvents();
        if (allEvents.length === 0) {
            return { success: false, message: "Could not retrieve any event data." };
        }

        const searchPrompt = `
            You are a smart search assistant. Your task is to filter a list of events based on a user's query.
            The user's query is: "${query}"
            The available event data is:
            ${JSON.stringify(allEvents, null, 2)}

            Analyze the user's query to understand their intent (e.g., location, date, date range, event type, etc.).
            Filter the events based on this intent.
            Return a JSON array of the matching event objects.
            If no events match, return an empty array.
        `;

        try {
            const response = await model.invoke([
                new SystemMessage(searchPrompt),
                new HumanMessage("Filter the events and return the JSON array."),
            ]);
            const cleanedResponse = response.content.replace(/```json\n|```/g, '');
            const searchResults = JSON.parse(cleanedResponse);
            return {
                success: true,
                events: searchResults,
                count: searchResults.length,
                message: `Found ${searchResults.length} events matching your criteria.`
            };
        } catch (error) {
            console.error("Error performing semantic search:", error);
            return { success: false, message: "An error occurred during the search." };
        }
    }
};

const get_event_details = {
    name: "get_event_details",
    description: "Gets the details of a specific event by its ID or title.",
    inputSchema: {
        type: "object",
        properties: {
            event_id: { type: "string", description: "The ID or title of the event." }
        },
        required: ["event_id"]
    },
    func: async ({ event_id }) => {
        const allEvents = await getAllEvents();
        const event = allEvents.find(e => e.id === event_id || (e.title && e.title.toLowerCase().includes(event_id.toLowerCase())));
        if (event) {
            return { success: true, event };
        } else {
            return { success: false, error: 'Event not found.' };
        }
    }
};

const book_event = {
    name: "book_event",
    description: "Books a free event for a user.",
    inputSchema: {
        type: "object",
        properties: {
            event_id: { type: "string", description: "The ID of the event to book." }
        },
        required: ["event_id"]
    },
    func: async ({ event_id }) => {
        const eventDetails = await get_event_details.func({ event_id });
        if (!eventDetails.success) {
            return { success: false, error: "Couldn't retrieve event details." };
        }
        const event = eventDetails.event;
        if (event.price && event.price.toLowerCase() !== "free") {
            return { success: false, error: "Only free events can be booked." };
        }
        const booking_id = `booking_${Date.now()}`;
        return {
            success: true,
            booking: { booking_id, event_id, status: 'confirmed' },
            message: `Successfully booked "${event.title}". Your booking ID is ${booking_id}.`
        };
    }
};

module.exports = {
  search_events,
  get_event_details,
  book_event,
};
