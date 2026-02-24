// Test file for hardcoded predictor
import { predictOutbreak, DISTRICT_LIST } from './hardcodedPredictor.js';

console.log('=== Testing Hardcoded Predictor ===\n');

// Test all districts
console.log('Available Districts:', DISTRICT_LIST);
console.log('');

// Test Case 1: Low Risk Scenario
console.log('Test 1: Low Risk (Pune)');
const lowRisk = predictOutbreak({
    district: 'Pune',
    rainfall_dev: 5,
    temperature: 26,
    case_growth: 3,
    baseline: 25
});
console.log(`Score: ${lowRisk.calibrated_score}, Category: ${lowRisk.category}, Confidence: ${lowRisk.confidence}%`);
console.log('');

// Test Case 2: Medium Risk Scenario
console.log('Test 2: Medium Risk (Mumbai)');
const mediumRisk = predictOutbreak({
    district: 'Mumbai',
    rainfall_dev: 30,
    temperature: 32,
    case_growth: 25,
    baseline: 65
});
console.log(`Score: ${mediumRisk.calibrated_score}, Category: ${mediumRisk.category}, Confidence: ${mediumRisk.confidence}%`);
console.log('');

// Test Case 3: High Risk Scenario
console.log('Test 3: High Risk (Nagpur)');
const highRisk = predictOutbreak({
    district: 'Nagpur',
    rainfall_dev: 55,
    temperature: 35,
    case_growth: 50,
    baseline: 95
});
console.log(`Score: ${highRisk.calibrated_score}, Category: ${highRisk.category}, Confidence: ${highRisk.confidence}%`);
console.log('Top Contributors:');
highRisk.top_contributors.forEach(c => {
    console.log(`  - ${c.feature}: ${c.contribution} (${c.direction})`);
});
console.log('');

// Test Case 4: Out of Distribution
console.log('Test 4: Out of Distribution (Extreme values)');
const ood = predictOutbreak({
    district: 'Thane',
    rainfall_dev: -55,
    temperature: 42,
    case_growth: 70,
    baseline: 110
});
console.log(`Score: ${ood.calibrated_score}, Category: ${ood.category}, Confidence: ${ood.confidence}%`);
console.log(`Drift Status: ${ood.drift_status}`);
if (ood.drift_warnings && ood.drift_warnings.length > 0) {
    console.log('Warnings:');
    ood.drift_warnings.forEach(w => console.log(`  - ${w}`));
}
console.log('');

// Test all districts with same inputs
console.log('Test 5: All Districts (same inputs)');
const testInputs = {
    rainfall_dev: 25,
    temperature: 30,
    case_growth: 20,
    baseline: 50
};

DISTRICT_LIST.forEach(district => {
    const result = predictOutbreak({ ...testInputs, district });
    console.log(`${district.padEnd(15)} Score: ${result.calibrated_score.toString().padStart(2)}, Category: ${result.category.padEnd(6)}, Teams: ${result.recommended_resources.field_teams}`);
});

console.log('\n=== All Tests Complete ===');
