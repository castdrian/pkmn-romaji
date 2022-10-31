export interface BulbaMediaWikiAPIResponse 
{
	batchcomplete: string;
	warnings:{
		main:{
			"*": string;
		},
		revisions:{
			"*": string;
		}
	},
	query:{
		normalized:[
			{
				from: string;
				to: string;
			}
		],
		pages:{
			[key: string]:{
				pageid: number;
				ns: number;
				title: string;
				revisions:[
					{
						contentformat: string;
						contentmodel: string;
						"*": string;
					}
				]
			}
		}
	}
}

export interface RomajiMon
{
	number: string;
	name: string;
	ja: string;
	romaji: string;
	trademark: string;
}

export interface RomajiMove
{
	move: string;
	romaji: string;
}