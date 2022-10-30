import { request } from 'undici';
import type { BulbaMediaWikiAPIResponse, RomajiMon, RomajiMove } from 'src/@types';

const API_URL = 'https://bulbapedia.bulbagarden.net/w/api.php?action=query&prop=revisions&rvprop=content&format=json&titles=';
const NAME_PAGE = 'List_of_Japanese_Pokémon_names';
const MOVE_PAGE = 'List_of_moves_in_other_languages';

export async function fetchRomaji(options: { mon?: string, move?: string, allMons?: boolean, allMoves?: boolean }): Promise<RomajiMon[]|RomajiMove[]|RomajiMon|RomajiMove|null> {
	if (options.mon) {
		return fetchRomajiMon(options.mon);
	} else if (options.move) {
		return fetchRomajiMove(options.move);
	} else if (options.allMons) {
		return fetchAllRomajiMons();
	} else if (options.allMoves) {
		return fetchAllRomajiMoves();
	} else {
		return null;
	}
}

async function fetchRomajiMon(mon: string): Promise<RomajiMon|null> {
	try {
		const tableString = await fetchBulbaWikiPage(NAME_PAGE);
		const RomajiMons = parseNameTablesFromString(tableString).flat();
		const foundMon = RomajiMons.find(RomajiMon => RomajiMon.name.toLowerCase() === mon.toLowerCase());
		return foundMon ?? null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchRomajiMove(move: string): Promise<RomajiMove|null> {
	try {
		const tableString = await fetchBulbaWikiPage(MOVE_PAGE);
		const RomajiMoves = parseMoveTablesFromString(tableString);
		const foundMove = RomajiMoves.find(RomajiMove => RomajiMove.move.replace(/\s/g, '').toLowerCase() === move.replace(/\s/g, '').toLowerCase());
		return foundMove ?? null;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchAllRomajiMons(): Promise<RomajiMon[]|null> {
	try {
		const tableString = await fetchBulbaWikiPage(NAME_PAGE);
		const RomajiMons = parseNameTablesFromString(tableString).flat();
		return RomajiMons;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchAllRomajiMoves(): Promise<RomajiMove[]|null> {
	try {
		const tableString = await fetchBulbaWikiPage(MOVE_PAGE);
		const RomajiMoves = parseMoveTablesFromString(tableString);
		return RomajiMoves;
	} catch (error) {
		console.error(error);
		return null;
	}
}

async function fetchBulbaWikiPage(page: string): Promise<string> {
	const { body } = await request(API_URL + page);
	const json: BulbaMediaWikiAPIResponse = await body.json();
	const res = json.query.pages[Object.keys(json.query.pages)[0]];
	const content = res.revisions[0]['*'];
	return content;
}

function parseNameTablesFromString(str: string): RomajiMon[][] {
	// use regex to find tables that match the format
	const regex = /===Generation\s(.+?)===\s*{{Lop\/foreignhead\|(.+?)}}\s*((?:{{Lop\/foreign\|.+?}}\s*)+)\|}/g;
	const tables = str.matchAll(regex);

	return Array.from(tables).map(table => {
		// table[3] is the rows

		// use regex to find rows that match the format
		const rowRegex = /{{Lop\/foreign\|(.+?)\|(.+?)\|ja\|(.+?)\|(.+?)\|(.+?)}}/g;
		const rows = table[3].matchAll(rowRegex);

		return Array.from(rows).map(row => {
				// row[1] is the number
				// row[2] is the name
				// row[3] is the ja
				// row[4] is the romaji
				// row[5] is the english romaji trademark

				// the english romaji trademark sometimes contains former spelling like "Gangar{{tt|*|Formerly &quot;Gengar&quot;", so we need to remove it to get "Gangar" instead of "Gangar{{tt|*|Formerly &quot;Gengar&quot;"
				const foundFormerSpelling = row[5].match(/(.+?){{tt\|/);
				const trademark = foundFormerSpelling ? foundFormerSpelling[1] : row[5];

				return {
					number: row[1],
					name: row[2],
					ja: row[3],
					romaji: row[4],
					trademark,
				}
			})
		}
	);
}

function parseMoveTablesFromString(str: string): RomajiMove[] {
	// use regex to find tables that match the format
	const regex = /{{Langlist\|move\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|(.+?)}}/g;
	const tables = str.matchAll(regex);

	return Array.from(tables).map(table => {
		// table[2] is the english name
		// table[4] is the romaji name

		return {
			move: table[2],
			romaji: table[4],
		}
	});
}