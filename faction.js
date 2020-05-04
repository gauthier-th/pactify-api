const fetch = require('./fetch');

class Faction {

	/**
	 * Create a new Pactify faction store
	 * @param {string} id Faction ID
	 * @param {boolean} [partial] Wether the faction is partial
	 */
	constructor(id, partial = true) {
		/**
		 * @type {string} Faction ID
		 */
		this.id = id;
		/**
		 * @type {boolean} Wether the faction is partial
		 */
		this.partial = partial;
		/**
		 * @type {string} Faction name
		 */
		this.name;
		/**
		 * @type {string} Faction emoji
		 */
		this.icon;
		/**
		 * @type {string} A short description of the faction
		 */
		this.description;
		/**
		 * @type {Date} Faction creation date
		 */
		this.creationDate;
		/**
		 * @type {Date} Faction creation date - rounded to day
		 */
		this.firstDay;
		/**
		 * @type {Date} Last faction activity day
		 */
		this.lastDay;
		/**
		 * @type {Array.<{
		 *   day: Date,
		 *   name: string,
		 *   power: number,
		 *   powerLow: number,
		 *   maxPower: number,
		 *   claimsCount: number,
		 *   claimsCountLow: number,
		 *   claimsCountHigh: number,
		 *   claimsApCount: number,
		 *   claimsApCountLow: number,
		 *   claimsApCountHigh: number,
		 *   membersCount: number,
		 *   members: import('./player')[],
		 *   alliesCount: number,
		 *   allies: Faction[]
		 * }>} Faction states history
		 */
		this.statesHistory;
		/**
		 * @type {Object.<string, import('./player')>} Faction members
		 */
		this.membersRef;
	}

	/**
	 * Fetch faction infos
	 */
	async fetch() {
		const result = await fetch.factionInfos(this.id);
		this._loadObject(result);
		this.partial = false;
	}

	/**
	 * Assign result object to Faction
	 * @param {object} result 
	 */
	_loadObject(result) {
		for (let key of Object.keys(result)) {
			if (key !== 'statusCode' && key !== 'error')
				this[key] = result[key];
		}
		if (this.statesHistory) {
			for (let state of this.statesHistory) {
				state.members.map(member => {
					const player = new (require('./player'))(member.id);
					player._loadObject(member);
					return player;
				});
				state.allies.map(ally => {
					const faction = new Faction(ally.id);
					faction._loadObject(ally);
					return faction;
				});
			}
		}
	}

}

/**
 * Get a faction by his name
 * @returns {Faction}
 */
async function fromName(name) {
	const factionID = await fetch.searchFaction(name);
	const result = await fetch.factionInfos(factionID.current);
	const faction = new Faction(factionID.current, false);
	faction._loadObject(result);
	return faction;
}
Faction.fromName = fromName;

module.exports = Faction;
