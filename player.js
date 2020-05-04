const fetch = require('./fetch');

class Player {

	/**
	 * Create a new Pactify player store
	 * @param {string} id User ID
	 * @param {boolean} [partial] Wether the player is partial
	 */
	constructor(id, partial = true) {
		/**
		 * @type {string} User ID
		 */
		this.id = id;
		/**
		 * @type {boolean} Wether the player is partial
		 */
		this.partial = partial;
		/**
		 * @type {string} Username
		 */
		this.name;
		/**
		 * @type {Date} Player registration date 
		 */
		this.registrationDate;
		/**
		 * @type {Date} Last player activity date 
		 */
		this.lastActivityDate;
		/**
		 * @type {Date} Last faction activity date - optionnal
		 */
		this.factionLastActivityDate;
		/**
		 * @type {number} activityTime 
		 */
		this.activityTime;
		/**
		 * @type {string} Player rank - optionnal
		 */
		this.rank;
		/**
		 * @type {number} Player power - optionnal
		 */
		this.power;
		/**
		 * @type {string} Player role - optionnal
		 */
		this.role;
		/**
		 * @type {import('./faction')} Player faction - optionnal
		 */
		this.faction;
		/**
		 * @type {boolean} Wether the player is online
		 */
		this.online;
		/**
		 * @type {string} Server where the player is connected - optionnal
		 */
		this.onlineServer;
	}

	/**
	 * Fetch player infos
	 */
	async fetch() {
		const result = await fetch.playerInfos(this.id);
		this._loadObject(result);
		this.partial = false;
	}

	/**
	 * Assign result object to Player
	 * @param {object} result 
	 */
	_loadObject(result) {
		for (let key of Object.keys(result)) {
			if (key !== 'statusCode' && key !== 'error')
				this[key] = result[key];
		}
		if (this.faction) {
			this.faction = new (require('./faction'))(this.faction.id, true);
			this.faction._loadObject(this.faction);
		}
	}

}

/**
 * Get a player by his name
 * @returns {Promise<Player>}
 */
async function fromName(username) {
	const playerID = await fetch.searchPlayer(username);
	const result = await fetch.playerInfos(playerID.current);
	const player = new Player(playerID.current, false);
	player._loadObject(result);
	return player;
}
Player.fromName = fromName;

module.exports = Player;