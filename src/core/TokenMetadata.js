import { hlGen } from './HLGenIntegration.js';

/**
 * Manages the generation and setting of NFT metadata using hl-gen.js.
 */
export class TokenMetadata {
  /**
   * Sets the token's name, description, and traits based on the artwork config.
   * @param {object} config - The configuration of the generated artwork.
   * @param {string} config.pattern - The name of the pattern.
   * @param {string} config.theme - The name of the theme.
   * @param {object} config.params - The specific parameters for the pattern.
   */
  static set(config) {
    const rarity = this.calculateRarity(config.theme);
    const complexity = this.calculateComplexity(config.pattern, config.params);

    hlGen.token.setName(`Onchain Summer Vibes #${hlGen.randomInt(1, 10000)}`);
    hlGen.token.setDescription(`An animated generative artwork featuring the '${config.pattern}' pattern with the '${config.theme}' theme.`);

    hlGen.token.setTraits({
      "Pattern": config.pattern,
      "Theme": config.theme,
      "Rarity": rarity,
      "Complexity": complexity,
    });
  }

  /**
   * Calculates the rarity based on the theme.
   * @param {string} theme - The name of the theme.
   * @returns {string} The rarity level ('Common', 'Uncommon', 'Rare', 'Epic').
   */
  static calculateRarity(theme) {
    const rarityMap = {
      dawn: 'Common',
      sunrise: 'Common',
      ocean: 'Common',
      forest: 'Uncommon',
      sunset: 'Uncommon',
      monochrome: 'Rare',
      neon: 'Rare',
      pastel: 'Epic'
    };
    return rarityMap[theme.toLowerCase()] || 'Common';
  }

  /**
   * A placeholder for a more complex complexity calculation.
   * @param {string} pattern - The name of the pattern.
   * @param {object} params - The pattern parameters.
   * @returns {string} The complexity level ('Low', 'Medium', 'High').
   */
  static calculateComplexity(pattern, params) {
    // This is a simplified example.
    let score = 0;
    if (params) {
        score = Object.values(params).reduce((acc, val) => typeof val === 'number' ? acc + val : acc, 0);
    }

    if (score < 100) return 'Low';
    if (score < 200) return 'Medium';
    return 'High';
  }
}