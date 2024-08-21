import { serveDir } from
    "https://deno.land/std@0.223.0/http/file_server.ts"
Deno.serve(async (request) => {
    const pathname = new URL(request.url).pathname;
    console.log(`pathname:${pathname}`);
    return serveDir(
        request, {
        fsRoot: "./public/",
        urlRoot: "",
        enableCors: true,
    });
});