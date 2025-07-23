const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, AIMessage, ToolMessage, SystemMessage } = require('@langchain/core/messages');
const allTools = require('./tools');

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-1.5-flash",
    temperature: 0,
}).bind({
    tools: Object.values(allTools).map(tool => ({
        type: 'function',
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema
        }
    }))
});

const systemPrompt = `You are a helpful Fanpit Event Concierge assistant. Your goal is to help users find and book events on the Fanpit platform (events.fanpit.live).

IMPORTANT GUIDELINES:
1. Always use the provided tools to search for events, get details, check availability, and handle bookings.
2. Only allow booking for FREE events. Paid events require redirecting to the website.
3. Be conversational and friendly, but concise and helpful.
4. When users ask about events, always search the actual event database using the search_events tool.
5. Maintain context about what the user is looking for throughout the conversation.
6. If a user wants to book an event, verify it's free first, then use the book_event tool.
7. For artist or brand information, use the appropriate tools to fetch accurate data.`;

const runAgent = async (input, chatHistory = []) => {
    const messages = [
        new SystemMessage(systemPrompt),
        ...chatHistory.map(msg => {
            if (msg.sender === 'user') return new HumanMessage(msg.text);
            return new AIMessage(msg.text);
        }),
        new HumanMessage(input)
    ];

    try {
        let finalResponse = null;
        for (let i = 0; i < 5; i++) {
            const response = await model.invoke(messages);
            messages.push(response);

            if (response.tool_calls && response.tool_calls.length > 0) {
                const toolCalls = response.tool_calls;
                for (const toolCall of toolCalls) {
                    const toolName = toolCall.name;
                    const toolArgs = toolCall.args;
                    if (allTools[toolName] && typeof allTools[toolName].func === 'function') {
                        try {
                            const toolResult = await allTools[toolName].func(toolArgs);
                            messages.push(new ToolMessage({
                                tool_call_id: toolCall.id,
                                name: toolName,
                                content: JSON.stringify(toolResult, null, 2)
                            }));
                        } catch (toolError) {
                            console.error(`Error executing tool ${toolName}:`, toolError);
                            messages.push(new ToolMessage({
                                tool_call_id: toolCall.id,
                                name: toolName,
                                content: `Error: ${toolError.message}`
                            }));
                        }
                    } else {
                        console.error(`Tool not found or not a function: ${toolName}`);
                        messages.push(new ToolMessage({
                            tool_call_id: toolCall.id,
                            name: toolName,
                            content: `Error: Tool '${toolName}' not found.`
                        }));
                    }
                }
            } else {
                finalResponse = response;
                break;
            }
        }

        if (finalResponse && finalResponse.content) {
            return { messages: [{ type: 'ai', content: finalResponse.content }] };
        } else {
            return { messages: [{ type: 'ai', content: "Sorry, I couldn't find an answer after several steps." }] };
        }
    } catch (error) {
        console.error("Error running agent:", error);
        return {
            messages: [
                { type: 'ai', content: "I'm sorry, I encountered an error while processing your request. Please try again." }
            ]
        };
    }
};

module.exports = { runAgent };
