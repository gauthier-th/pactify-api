const request = require('request');

const endpoint = 'https://www.pactify.fr/api';

/**
 * An error code
 * @typedef {object} ErrorCode
 * @property {number} statusCode Request status code
 * @property {string} error Error description
 */

/**
 * A player search result
 * @typedef {object} PlayerSearchResult
 * @property {number} statusCode Request status code
 * @property {string} error Error description
 * @property {string} current User ID
 */
/**
 * Player infos
 * @typedef {object} PlayerInfos
 * @property {number} statusCode Request status code
 * @property {string} error Error description
 * @property {string} id User ID
 * @property {string} name Username
 * @property {Date} registrationDate 
 * @property {Date} lastActivityDate 
 * @property {Date} [factionLastActivityDate] 
 * @property {number} activityTime 
 * @property {string} [rank] 
 * @property {number} [power] 
 * @property {string} [role] 
 * @property {FactionInfos} [faction] 
 * @property {boolean} online 
 * @property {string} [onlineServer] 
 */

/**
 * A faction search result
 * @typedef {object} FactionSearchResult
 * @property {string} current Faction ID
 * @property {{ factionId: string, from: Date }[]} history 
 * @property {Object.<string, { id: string, name: string, icon: string }>} factionsRef 
 */
/**
 * Faction infos
 * @typedef {object} FactionInfos
 * @property {string} id Faction ID
 * @property {string} name Faction name
 * @property {string} icon 
 * @property {string} description 
 * @property {Date} creationDate 
 * @property {Date} firstDay 
 * @property {Date} lastDay 
 * @property {Array.<{
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
 *   members: Array.<{ id: string, role: string }>,
 *   alliesCount: number,
 *   allies: Array.<{ id: string, name: string, icon: string }>
 * }>} statesHistory 
 * @property {Object.<string, PlayerInfos>} membersRef
 */

/**
 * Ranking infos
 * @typedef RankingInfos
 * @property {string} month 
 * @property {Date} updateDate 
 * @property {Date} nextUpdateDate 
 * @property {{
 *   faction: FactionInfos,
 *   points: number,
 *   position: number,
 *   ranking: {
 *     members: { value: number, points: number },
 *     claims: { value: number, points: number },
 *     claimsAp: { value: number, points: number },
 *     eventPoints: { value: number, points: number }
 *   }
 * }[]} entries 
 * @property {string} first 
 * @property {string} latest 
 */


/**
 * Search a player by his name
 * @param {string} username 
 * @returns {Promise<PlayerSearchResult>}
 */
function searchPlayer(username) {
	return new Promise((resolve, reject) => {
		request({ uri: endpoint + '/player/search?name=' + encodeURIComponent(username.toLowerCase()) }, (error, response, content) => {
			if (error)
				return reject(errors(1));
			try {
				const result = JSON.parse(content);
				if ('current' in result) {
					resolve({
						...errors(0),
						...result
					});
				}
				else
					reject(errors(2));
			}
			catch (e) {
				reject(errors(1));
			}
		});
	});
}

/**
 * Fetch player infos
 * @param {string} id Player ID
 * @returns {PlayerInfos}
 */
function playerInfos(id) {
	return new Promise(async (resolve, reject) => {
		request({ uri: endpoint + '/player/' + encodeURIComponent(id) }, (error, response, content) => {
			if (error)
				return reject(errors(1));
			try {
				const result = JSON.parse(content);
				if ('registrationDate' in result)
					result.registrationDate = new Date(Date.parse(result.registrationDate));
				if ('lastActivityDate' in result)
					result.lastActivityDate = new Date(Date.parse(result.lastActivityDate));
				if ('factionLastActivityDate' in result)
					result.factionLastActivityDate = new Date(Date.parse(result.factionLastActivityDate));
				if ('faction' in result) {
					if ('creationDate' in result.faction)
						result.faction.creationDate = new Date(Date.parse(result.faction.creationDate));
					if ('firstDay' in result.faction)
						result.faction.firstDay = new Date(Date.parse(result.faction.firstDay));
					if ('lastDay' in result.faction)
						result.faction.lastDay = new Date(Date.parse(result.faction.lastDay));
				}
				resolve({
					...errors(0),
					...result
				});
			}
			catch (e) {
				reject(errors(1));
			}
		});
	});
}



/**
 * Search a faction by its name
 * @param {string} name 
 * @returns {Promise<FactionSearchResult>}
 */
function searchFaction(name) {
	return new Promise((resolve, reject) => {
		request({ uri: endpoint + '/faction/search?name=' + encodeURIComponent(name.toLowerCase()) }, (error, response, content) => {
			if (error)
				return reject(errors(1));
			try {
				const result = JSON.parse(content);
				if ('current' in result) {
					for (let hist of result.history) {
						hist.from = new Date(Date.parse(hist.from));
					}
					resolve({
						...errors(0),
						...result
					});
				}
				else
					reject(errors(3));
			}
			catch (e) {
				reject(errors(1));
			}
		});
	});
}

/**
 * Fetch faction infos
 * @param {string} name Faction ID
 * @returns {Promise<FactionSearchResult>}
 */
function factionInfos(id) {
	return new Promise(async (resolve, reject) => {
		request({ uri: endpoint + '/faction/' + encodeURIComponent(id) }, (error, response, content) => {
			if (error)
				return reject(errors(1));
			try {
				const result = JSON.parse(content);
				if ('creationDate' in result)
					result.creationDate = new Date(Date.parse(result.creationDate));
				if ('firstDay' in result)
					result.firstDay = new Date(Date.parse(result.firstDay));
				if ('lastDay' in result)
					result.lastDay = new Date(Date.parse(result.lastDay));
				if ('statesHistory' in result) {
					for (let state of result.statesHistory) {
						state.day = new Date(Date.parse(state.day));
					}
				}
				if ('membersRef' in result) {
					for (let ref of Object.keys(result.membersRef)) {
						result.membersRef[ref].lastActivityDate = new Date(Date.parse(result.membersRef[ref].lastActivityDate));
						result.membersRef[ref].factionLastActivityDate = new Date(Date.parse(result.membersRef[ref].factionLastActivityDate));
					}
				}
				resolve({
					...errors(0),
					...result
				});
			}
			catch (e) {
				reject(errors(1));
			}
		});
	});
}




/**
 * Fetch ranking infos
 * @param {string} month Month - 'latest' or YYYY-MM
 * @returns {Promise<RankingInfos>}
 */
function rankingInfos(month) {
	return new Promise(async (resolve, reject) => {
		request({ uri: endpoint + '/ranking/' + encodeURIComponent(month) }, (error, response, content) => {
			if (error)
				return reject(errors(1));
			try {
				const result = JSON.parse(content);
				if ('date' in result)
					rankingInfos(result.date).then(resolve).catch(reject);
				else {
					if ('updateDate' in result)
						result.updateDate = new Date(Date.parse(result.updateDate));
					if ('nextUpdateDate' in result)
						result.nextUpdateDate = new Date(Date.parse(result.nextUpdateDate));
					resolve({
						...errors(0),
						...result
					});
				}
			}
			catch (e) {
				reject(errors(1));
			}
		});
	});
}




/**
 * Get a error code
 * @param {number} statusCode 
 * @returns {{ statusCode: number, error: string }}
 */
function errors(statusCode) {
	if (statusCode === 0) {
		return {
			statusCode,
			error: null
		};
	}
	else if (statusCode === 1) {
		return {
			statusCode,
			error: 'Internal error.'
		};
	}
	else if (statusCode === 2) {
		return {
			statusCode,
			error: 'Unknown player.'
		};
	}
	else if (statusCode === 3) {
		return {
			statusCode,
			error: 'Unknown faction.'
		};
	}
}


module.exports = {
	searchPlayer,
	playerInfos,
	searchFaction,
	factionInfos,
	rankingInfos
};
