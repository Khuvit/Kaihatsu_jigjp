import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { openKv } from "";

const kv = await openKv();

async function saveTasks(tasks) {
    const currentDate = getCurrentDate();
    console.log('Saving tasks to KV:', tasks);
    await kv.set(`tasks_${currentDate}`, tasks);
}

async function loadTasks() {
    const currentDate = getCurrentDate();
    const tasks = await kv.get(`tasks_${currentDate}`) || [];
    console.log('Loaded tasks from KV:', tasks);
    return tasks;
}

function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split('T')[0];
}

serve(async (req) => {
    if (req.method === "POST" && req.url === "/saveTasks") {
        const tasks = await req.json();
        console.log('Received tasks:', tasks);
        await saveTasks(tasks);
        return new Response("Tasks saved", { status: 200 });
    } else if (req.method === "GET" && req.url === "/loadTasks") {
        const tasks = await loadTasks();
        return new Response(JSON.stringify(tasks), { status: 200 });
    } else {
        return new Response("Not Found", { status: 404 });
    }
});