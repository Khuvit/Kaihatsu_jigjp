Deno.serve(async (request) => {
    const htmlText = await
        Deno.readTextFile("./public/index.html");
    return new Response(htmlText, {
        headers: {
            "content-type": "text/html",
        }

    })
})