// Production server for serving built frontend assets using Bun.serve
const port = parseInt(process.env.PORT || "80");

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname;

    // Default to index.html for root or routes (SPA support)
    if (path === "/" || !path.includes(".")) {
      path = "/index.html";
    }

    // Try to serve the file from dist directory
    const filePath = `./dist${path}`;
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file);
    }

    // If file not found, serve index.html for client-side routing
    const indexFile = Bun.file("./dist/index.html");
    if (await indexFile.exists()) {
      return new Response(indexFile);
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`🚀 Frontend server running at http://localhost:${port}`);
