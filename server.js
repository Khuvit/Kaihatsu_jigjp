import { serveDir } from
    "https://deno.land/std@0.223.0/http/file_server.ts"

Deno.serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(`pathname:${pathname}`);
    return serveDir(
        req, {
        fsRoot: "./public/",
        urlRoot: "",
        enableCors: true,
    });
});