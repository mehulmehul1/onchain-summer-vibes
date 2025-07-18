/**
 * A wrapper for highlight.xyz's hl-gen.js library.
 * Provides a consistent interface and fallbacks for local development
 * when hl-gen.js is not present.
 */
class HLGen {
  constructor() {
    this.isAvailable = typeof hl !== 'undefined';
  }

  /**
   * Generates a random number between 0 (inclusive) and 1 (exclusive).
   * Uses hl.random() if available, otherwise falls back to Math.random().
   * @returns {number} A random number.
   */
  random() {
    if (this.isAvailable) {
      return hl.random();
    }
    return Math.random();
  }

  /**
   * Generates a random integer between min (inclusive) and max (inclusive).
   * @param {number} min - The minimum value.
   * @param {number} max - The maximum value.
   * @returns {number} A random integer.
   */
  randomInt(min, max) {
    if (this.isAvailable) {
      return hl.randomInt(min, max);
    }
    return Math.floor(min + this.random() * (max - min + 1));
  }

  /**
   * Selects a random element from an array.
   * @param {Array<T>} arr - The array to select from.
   * @returns {T} A random element from the array.
   */
  randomElement(arr) {
    if (this.isAvailable) {
      return hl.randomElement(arr);
    }
    return arr[Math.floor(this.random() * arr.length)];
  }

  /**
   * Gets the token metadata object.
   * @returns {object} The token metadata object or a mock object.
   */
  get token() {
    if (this.isAvailable) {
      return hl.token;
    }
    // Mock token object for local development
    return {
      setName: (name) => console.log(`Mock setName: ${name}`),
      setDescription: (desc) => console.log(`Mock setDescription: ${desc}`),
      setTraits: (traits) => console.log('Mock setTraits:', traits),
    };
  }

  /**
   * Captures a preview of the canvas.
   */
  capturePreview() {
    if (this.isAvailable) {
      hl.capturePreview();
    } else {
      console.log('Mock capturePreview called.');
    }
  }
}

export const hlGen = new HLGen();