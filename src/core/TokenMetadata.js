import { hlGen } from './HLGenIntegration.js';
import { GentlePattern } from '../patterns/GentlePattern.js';
import { MandalaPattern } from '../patterns/MandalaPattern.js';
import { VectorFieldPattern } from '../patterns/VectorFieldPattern.js';
import { ShellRidgePattern } from '../patterns/ShellRidgePattern.js';

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
   * Calculate pattern complexity using pattern-specific methods.
   * @param {string} pattern - The name of the pattern.
   * @param {object} params - The pattern parameters.
   * @param {object} app - The app instance for interference pattern complexity
   * @returns {string} The complexity level ('Low', 'Medium', 'High', 'Very High').
   */
  static calculateComplexity(pattern, params, app = null) {
    let score = 50; // Default score
    
    try {
      switch (pattern?.toLowerCase()) {
        case 'gentle':
          const gentlePattern = new GentlePattern();
          score = gentlePattern.calculateComplexity(params);
          break;
          
        case 'mandala':
          const mandalaPattern = new MandalaPattern();
          score = mandalaPattern.calculateComplexity(params);
          break;
          
        case 'vectorfield':
        case 'vector_field':
          const vectorFieldPattern = new VectorFieldPattern();
          score = vectorFieldPattern.calculateComplexity(params);
          break;
          
        case 'shellridge':
        case 'shell_ridge':
          const shellRidgePattern = new ShellRidgePattern();
          score = shellRidgePattern.calculateComplexity(params);
          break;
          
        case 'interference':
          // Use app instance method for interference pattern
          if (app && typeof app.calculateInterferenceComplexity === 'function') {
            score = app.calculateInterferenceComplexity(params);
          } else {
            // Fallback calculation for interference pattern
            const { sourceCount = 9, wavelength = 25, threshold = 0.12, gradientMode = true } = params || {};
            score = 35;
            score += Math.min(sourceCount / 20, 1) * 40;
            score += Math.max(0, 1 - (wavelength / 100)) * 15;
            score += threshold * 5;
            if (gradientMode) score += 5;
          }
          break;
          
        default:
          console.warn(`Unknown pattern '${pattern}', using default complexity calculation`);
          // Fallback to simple parameter-based calculation
          if (params) {
            score = Object.values(params).reduce((acc, val) => 
              typeof val === 'number' ? acc + Math.abs(val) * 0.5 : acc, 30);
          }
      }
    } catch (error) {
      console.error('Error calculating pattern complexity:', error);
      score = 50; // Safe fallback
    }
    
    // Map numeric score to descriptive string
    if (score < 30) return 'Low';
    if (score < 50) return 'Medium';
    if (score < 75) return 'High';
    return 'Very High';
  }
}