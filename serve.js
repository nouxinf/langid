import { join, normalize } from "path";

const root = "./public";
const portNum = 3130;

console.log(`Serving LangID at http://localhost:${portNum}`);

Bun.serve({
	port: portNum,
	async fetch(req) {
		const url = new URL(req.url);
		let path = decodeURIComponent(url.pathname);
		if (path.endsWith("/")) path += "index.html";

		const filePath = normalize(join(root, path));
		if (!filePath.startsWith(normalize(root))) {
			return new Response("Forbidden", { status: 403 });
		}

		const file = Bun.file(filePath);
		if (await file.exists()) return new Response(file);
		return new Response("Not found", { status: 404 });
	},
});
