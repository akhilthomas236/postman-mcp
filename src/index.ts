import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create server instance
const server = new McpServer({
    name: "postman-mcp",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
    },
});

// Valid HTTP methods
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const;

// Add a tool to make HTTP requests
server.tool(
    "make_request",
    "Make an HTTP request using specified method, URL, headers, and body",
    {
        method: z.enum(HTTP_METHODS).describe("HTTP method (GET, POST, PUT, DELETE, etc.)"),
        url: z.string().url().describe("The URL to make the request to"),
        headers: z.record(z.string()).optional().describe("Request headers"),
        body: z.string().optional().describe("Request body (for POST, PUT, etc.)"),
    },
    async ({ method, url, headers = {}, body }) => {
        try {
            // Don't send body for GET and HEAD requests
            const shouldSendBody = !['GET', 'HEAD'].includes(method.toUpperCase());
            
            // Determine content type from headers or default to JSON
            const contentType = headers['Content-Type'] || headers['content-type'] || 'application/json';
            
            const response = await fetch(url, {
                method: method.toUpperCase(),
                headers: {
                    ...headers,
                    'Content-Type': contentType,
                },
                body: shouldSendBody && body ? body : undefined,
            });

            // Try to parse as JSON first, fallback to text
            let responseData: string;
            const contentTypeHeader = response.headers.get('content-type');
            if (contentTypeHeader?.includes('application/json')) {
                try {
                    const jsonData = await response.json();
                    responseData = JSON.stringify(jsonData, null, 2);
                } catch {
                    responseData = await response.text();
                }
            } else {
                responseData = await response.text();
            }

            const responseHeaders = Object.fromEntries(response.headers.entries());

            return {
                content: [
                    {
                        type: "text",
                        text: `Status: ${response.status} ${response.statusText}\n\nHeaders:\n${JSON.stringify(responseHeaders, null, 2)}\n\nResponse:\n${responseData}`,
                    },
                ],
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                content: [
                    {
                        type: "text",
                        text: `Error making request: ${errorMessage}`,
                    },
                ],
            };
        }
    }
);

// Main execution
async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error("Postman MCP Server running on stdio");
}

main().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});