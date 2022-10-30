# pkmn-romaji
Get romaji transliterations of Pokémon names and moves

## Installation
```bash
yarn add pkmn-romaji
```

## Usage
```ts
import { fetchRomaji } from 'pkmn-romaji';

const mon = await fetchRomaji({ mon: 'greninja' });
console.log(mon.name);
/*
{
  number: '658',
  name: 'Greninja',
  ja: 'ゲッコウガ',
  romaji: 'Gekkōga',
  trademark: 'Gekkouga'
}
*/

const move = await fetchRomaji({ move: 'water shuriken' });
console.log(move);
/*
{
  move: 'Water Shuriken',
  romaji: 'Mizu Shuriken',
}
*/

const allMons = await fetchRomaji({ allMons: true });
console.log(allMons);
/*
[
  {
	number: '001',
	name: 'Bulbasaur',
	ja: 'フシギダネ',
	romaji: 'Fushigidane',
	trademark: 'Fushigidane'
  },
  ...
]
*/

const allMoves = await fetchRomaji({ allMoves: true });
console.log(allMoves);
/*
[
  {
	move: 'Pound',
	romaji: 'Hataku'
  },
  ...
]
*/
```