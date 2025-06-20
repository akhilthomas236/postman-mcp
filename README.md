# Postman MCP

A Model Context Protocol (MCP) server that provides HTTP request capabilities similar to Postman. This server allows you to make HTTP requests with customizable methods, headers, and body through the MCP interface.

## Features

- Support for common HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Custom headers support
- Request body support for applicable methods
- Automatic JSON parsing and formatting
- Error handling and validation

## Installation

```bash
# Clone the repository
git clone https://github.com/akhilthomas236/postman-mcp.git
cd postman-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

Start the server:

```bash
npm start
```

### Making Requests

The server exposes a `make_request` tool that accepts the following parameters:

- `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
- `url`: The URL to make the request to
- `headers` (optional): Request headers as key-value pairs
- `body` (optional): Request body (for POST, PUT, etc.)

## Development

```bash
# Install dependencies
npm install

# Build the TypeScript code
npm run build

# Start the server in development mode
npm run dev
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
