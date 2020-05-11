declare module 'pactify-api' {
  export class Player {
    /**
     * Create a new Pactify player store
     * @param {string} id User ID
     * @param {boolean} [partial] Wether the player is partial
     */
    constructor(id: string, partial?: boolean);

    /**
     * Fetch player infos
     */
    fetch(): Promise<void>;

    /**
     * Get a player by his name
     */
    static fromName(name: string): Promise<Player>;
  }

  export class Faction {
    /**
     * Create a new Pactify faction store
     * @param {string} id Faction ID
     * @param {boolean} [partial] Wether the faction is partial
     */
    constructor(id: string, partial?: boolean);

    /**
     * Fetch faction infos
     */
    fetch(): Promise<void>;

    /**
     * Get a faction by his name
     */
    static fromName(name: string): Promise<Faction>;
  }

  export class Ranking {
    /**
     * Create a new Pactify ranking store
     * @param {string} month Stats month
     * @param {boolean} [partial] Wether the ranking is partial
     */
    constructor(month: string, partial?: boolean);

    /**
     * Fetch faction infos
     */
    fetch(): Promise<void>;
  }
}
