import { hlGen } from '../src/blockchain/HLGenIntegration.js';
import { TokenMetadata } from '../src/blockchain/TokenMetadata.js';

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ Assertion failed: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

console.log('--- Running hl-gen.js Integration Test ---');

// Test 1: HLGenIntegration fallbacks (since `hl` is not defined in Node.js)
console.log('\n[1] Testing HLGenIntegration fallbacks...');
assert(!hlGen.isAvailable, 'hlGen.isAvailable should be false in Node.js environment.');

const rand = hlGen.random();
assert(typeof rand === 'number' && rand >= 0 && rand < 1, `hlGen.random() returns a valid number: ${rand}`);

const randInt = hlGen.randomInt(10, 20);
assert(typeof randInt === 'number' && randInt >= 10 && randInt <= 20, `hlGen.randomInt(10, 20) returns a valid integer in range: ${randInt}`);

const element = hlGen.randomElement(['a', 'b', 'c']);
assert(['a', 'b', 'c'].includes(element), `hlGen.randomElement(['a', 'b', 'c']) returns a valid element: ${element}`);

console.log('Mocking console.log to check token methods...');
const originalLog = console.log;
let logs = [];
console.log = (...args) => logs.push(args.join(' '));

hlGen.token.setName('Test Name');
assert(logs[0] === 'Mock setName: Test Name', 'Mock token.setName logs correctly.');
logs = [];

hlGen.token.setDescription('Test Desc');
assert(logs[0] === 'Mock setDescription: Test Desc', 'Mock token.setDescription logs correctly.');
logs = [];

hlGen.token.setTraits({ "Test": "Trait" });
assert(logs[0].includes('Mock setTraits:'), 'Mock token.setTraits logs correctly.');
logs = [];

hlGen.capturePreview();
assert(logs[0] === 'Mock capturePreview called.', 'Mock capturePreview called.');

console.log = originalLog; // Restore console.log
console.log('HLGenIntegration fallbacks work as expected.');


// Test 2: TokenMetadata logic
console.log('\n[2] Testing TokenMetadata...');
const testConfig = {
  pattern: 'Interference',
  theme: 'Neon',
  params: { sources: 4, wavelength: 50 },
};

assert(TokenMetadata.calculateRarity('Neon') === 'Rare', 'calculateRarity correctly identifies "Rare" theme.');
assert(TokenMetadata.calculateRarity('Dawn') === 'Common', 'calculateRarity correctly identifies "Common" theme.');
assert(TokenMetadata.calculateComplexity('Interference', testConfig.params) === 'Low', 'calculateComplexity works correctly.');

console.log('Testing TokenMetadata.set() with mocked hlGen...');
console.log = (...args) => logs.push(args.join(' '));
logs = [];
TokenMetadata.set(testConfig);
assert(logs.some(log => log.includes('Onchain Summer Vibes')), 'TokenMetadata.set() calls setName.');
assert(logs.some(log => log.includes('An animated generative artwork')), 'TokenMetadata.set() calls setDescription.');
assert(logs.some(log => log.includes('"Theme": "Neon"')), 'TokenMetadata.set() calls setTraits with correct data.');
console.log = originalLog;
console.log('TokenMetadata logic works as expected.');

console.log('\n--- Test Completed Successfully ---');