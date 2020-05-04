const fetch = require('./fetch');

class Ranking {

	/**
	 * Create a new Pactify ranking store
	 * @param {string} month Stats month
	 * @param {boolean} [partial] Wether the ranking is partial
	 */
	constructor(month, partial = true) {
		/**
		 * @type {string} Stats month
		 */
		this.month = month;
		/**
		 * @type {boolean} Wether the ranking is partial
		 */
		this.partial = partial;
		/**
		 * @type {Date} Last stats update date
		 */
		this.updateDate;
		/**
		 * @type {Date} Next stats update date
		 */
		this.nextUpdateDate;
		/**
		 * @type {{
		 *   faction: import('./faction'),
		 *   points: number,
		 *   position: number,
		 *   ranking: {
		 *     members: { value: number, points: number },
		 *     claims: { value: number, points: number },
		 *     claimsAp: { value: number, points: number },
		 *     eventPoints: { value: number, points: number }
		 *   }
		 * }[]} Stats entries - one entry per faction
		 */
		this.entries;
		/**
		 * @type {string} First available stats month
		 */
		this.first;
		/**
		 * @type {string} Last available stats month
		 */
		this.latest;
	}

	/**
	 * Fetch faction infos
	 */
	async fetch() {
		const result = await fetch.rankingInfos(this.month);
		this._loadObject(result);
		this.partial = false;
	}

	/**
	 * Assign result object to Ranking
	 * @param {object} result 
	 */
	_loadObject(result) {
		for (let key of Object.keys(result)) {
			if (key !== 'statusCode' && key !== 'error')
				this[key] = result[key];
		}
		if (this.entries) {
			for (let entry of this.entries) {
				const faction = new (require('./faction'))(entry.faction.id);
				faction._loadObject(entry.faction);
				entry.faction = faction;
			}
		}
	}

}

module.exports = Ranking;
