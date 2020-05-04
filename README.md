
# pactify-api

A simple API wrapper for Pactify - see https://www.pactify.fr/.
It returns data from https://www.pactify.fr/api/player, https://www.pactify.fr/api/faction and https://www.pactify.fr/api/ranking.

## Usage

Due to the simplicity of the API, I think there is no need to write a long documentation, theses examples clearly show how to use it. If you want more details, methods and properties are also explained using [JSDoc](https://jsdoc.app/).

### Imports

```js
const { Player, Faction, Ranking } = require('pactify-api');
```
### Player

The only guaranteed properties are `id`, `name`, `registrationDate`, `lastActivityDate`, `activityTime`, `online`.
- Get a player by his name:
	```js
	Player.fromName('username').then(player => {
	    console.log(player);
	}).catch(error => {
	    console.log(error.error);
	});
	```
- Get a player by his ID:
	```js
	const player = new Player('id');
	player.fetch().then(() => {
	    console.log(player);
	}).catch(error => {
	    console.log(error.error);
	});
	```

### Faction

- Get a faction by its name:
	```js
	Faction.fromName('FAC').then(faction => {
	    console.log(faction);
	}).catch(error => {
	    console.log(error.error);
	});
	```
- Get a faction by its ID:
	```js
	const faction = new Faction('id');
	faction.fetch().then(() => {
	    console.log(faction);
	}).catch(error => {
	    console.log(error.error);
	});
	```

### Ranking

- Get factions ranking for a month:
```js
const ranking = new Ranking('latest');
// you can also specify a YYYY-MM formatted month (e.g. 2020-05) instead of 'latest':
// const ranking = new Ranking('2020-05');
ranking.fetch().then(() => {
    console.log(ranking);
}).catch(error => {
    console.log(error.error);
});
```

## Error codes

Errors returned by the API are objects containing a statusCode and an error property:
| statusCode | error |
|---|---|
| `0` | no error |
| `1` | internal error (which surely comes from a connection error from you or the server) |
| `2` | unknown player |
| `3` | unknown faction |

## Partial data

### Explanations

When parsing an object, you can have properties containing other data type. For instance, when you parse a Player, if he is in a faction, the `faction` Player property will result in a Faction object. This object is partial, which means you cannot expect it to have any information beside its ID.
You can know whether a data is partial by checking its `partial` property. The only data you can expect to don't be partial are these fetched with `fetch` or `fromName` methods.

### Example

This example simply requests a player, then retrieves information from its faction. While the first log will only show the faction ID, the second will display all the property of the faction.
```js
Player.fromName('username').then(async  player => {
    if (player.faction) {
        console.log(player.faction);
        await player.faction.fetch();
        console.log(player.faction);
    }
    else
        console.log('This player is not in a faction.');
}).catch(error => {
    console.log(error.error);
});
```
