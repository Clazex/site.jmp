import { VercelRequest, VercelResponse } from "@vercel/node";
import got from "got";

const modMap : Record<string, string> = {
	"god-seeker-plus": "GodSeekerPlus",
	"companion-cloth": "CompanionCloth",
	"health-share": "HealthShare",
	"everwatchers": "Everwatchers",
	"tribe-of-battle": "TribeOfBattle",
	"crystalblobbles": "Crystalblobbles",
	"continue-countdown": "ContinueCountdown"
};

export default async function (req: VercelRequest, res: VercelResponse) {
	const { id = "", version = "latest" } = req.query;
	const name = modMap[id.toString()];

	if (!name) {
		res.statusCode = 404;
		res.send("");
		return;
	}

	res.statusCode = 200;
	const buf = await getRelease(name, version.toString());

	res.setHeader("Content-Type", "application/octet-stream");
	res.setHeader("Content-Length", buf.length);
	res.setHeader("Content-Disposition", `attachment; filename="${name}-${version}.zip"`)

	res.send(buf);
}


function getRelease(name: string, version: string) : Promise<Buffer> {
	if (version == "latest") {
		return getFile(`https://github.com/Clazex/HollowKnight.${name}/releases/latest/download/${name}.zip`);
	} else {
		return getFile(`https://github.com/Clazex/HollowKnight.${name}/releases/download/${version}/${name}.zip`);
	}
}

function getFile(url: string): Promise<Buffer> {
	return got(url).buffer();
}
