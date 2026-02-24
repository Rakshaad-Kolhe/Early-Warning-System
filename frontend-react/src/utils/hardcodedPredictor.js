// Hardcoded prediction engine for demo purposes
// Simulates backend ML model with realistic calculations

// Hardcoded prediction engine for demo purposes
// Simulates backend ML model with realistic calculations

const DISTRICTS = {
    'Pune': { 
        baseline_risk: 0.45, 
        population: 9.4, 
        hospitals: 340, 
        beds: 18400,
        density: 'high',
        climate: 'moderate',
        infrastructure: 'good',
        recent_cases: 890,
        trend: '+12%',
        hotspots: ['Hadapsar', 'Kothrud', 'Pimpri-Chinchwad', 'Wakad'],
        risk_factors: [
            'IT corridor with high daily commuter influx',
            'Rapid urbanization creating construction water pools',
            'University clusters with dense student housing',
            'Growing suburban sprawl reducing control effectiveness'
        ]
    },
    'Mumbai': { 
        baseline_risk: 0.52, 
        population: 12.4, 
        hospitals: 450, 
        beds: 24500,
        density: 'very_high',
        climate: 'humid_coastal',
        infrastructure: 'excellent',
        recent_cases: 1240,
        trend: '+15%',
        hotspots: ['Dharavi', 'Kurla', 'Andheri', 'Borivali', 'Thane Creek'],
        risk_factors: [
            'Highest population density (20,000/km²) in India',
            'Major international airport and seaport',
            'Monsoon flooding in 45+ low-lying areas',
            'Slum areas affecting 40% of population',
            'Optimal mosquito breeding: 32°C + 78% humidity'
        ]
    },
    'Nashik': { 
        baseline_risk: 0.38, 
        population: 6.1, 
        hospitals: 210, 
        beds: 11200,
        density: 'medium',
        climate: 'semi_arid',
        infrastructure: 'moderate',
        recent_cases: 520,
        trend: '+8%',
        hotspots: ['Nashik Road', 'Satpur MIDC', 'College Road', 'Panchavati'],
        risk_factors: [
            'Industrial MIDC zones with water storage',
            'Godavari river proximity during monsoon',
            'Religious tourism bringing seasonal influx',
            'Wine valley region with agricultural water use'
        ]
    },
    'Nagpur': { 
        baseline_risk: 0.42, 
        population: 4.6, 
        hospitals: 280, 
        beds: 14800,
        density: 'medium',
        climate: 'hot_dry',
        infrastructure: 'good',
        recent_cases: 680,
        trend: '+10%',
        hotspots: ['Sitabuldi', 'Dharampeth', 'Kamptee', 'Hingna'],
        risk_factors: [
            'Central India transport hub with high movement',
            'Nag river and Ambazari lake breeding sites',
            'Hot climate (34°C+) accelerating vector cycles',
            'Orange cultivation areas with irrigation'
        ]
    },
    'Aurangabad': { 
        baseline_risk: 0.35, 
        population: 3.7, 
        hospitals: 180, 
        beds: 9600,
        density: 'medium',
        climate: 'semi_arid',
        infrastructure: 'moderate',
        recent_cases: 420,
        trend: '+6%',
        hotspots: ['CIDCO', 'Jalna Road', 'Beed Bypass', 'Waluj MIDC'],
        risk_factors: [
            'Tourism hub (Ajanta-Ellora) with visitor influx',
            'Industrial MIDC with chemical storage',
            'Water scarcity leading to storage practices',
            'Expanding peri-urban areas with poor drainage'
        ]
    },
    'Thane': { 
        baseline_risk: 0.48, 
        population: 11.0, 
        hospitals: 380, 
        beds: 20100,
        density: 'very_high',
        climate: 'humid_coastal',
        infrastructure: 'good',
        recent_cases: 1050,
        trend: '+13%',
        hotspots: ['Thane West', 'Dombivli', 'Kalyan', 'Ulhasnagar', 'Bhiwandi'],
        risk_factors: [
            'Mumbai Metropolitan Region spillover effects',
            'Thane Creek and Ulhas river breeding grounds',
            'Dense residential complexes with water tanks',
            'Major railway corridor with daily commuters',
            'Creek-side slums with poor sanitation'
        ]
    },
    'Solapur': { 
        baseline_risk: 0.33, 
        population: 4.3, 
        hospitals: 165, 
        beds: 8900,
        density: 'low',
        climate: 'hot_dry',
        infrastructure: 'basic',
        recent_cases: 380,
        trend: '+5%',
        hotspots: ['Solapur City', 'Akkalkot Road', 'Jule Solapur', 'Railway Lines'],
        risk_factors: [
            'Textile industry with water usage',
            'Hot dry climate (37°C+) limiting natural spread',
            'Agricultural region with irrigation canals',
            'Border district with Karnataka movement'
        ]
    },
    'Kolhapur': { 
        baseline_risk: 0.36, 
        population: 3.9, 
        hospitals: 190, 
        beds: 10200,
        density: 'medium',
        climate: 'moderate_humid',
        infrastructure: 'moderate',
        recent_cases: 450,
        trend: '+7%',
        hotspots: ['Shahupuri', 'Rajarampuri', 'Panhala', 'Ichalkaranji'],
        risk_factors: [
            'Heavy monsoon rainfall (2500mm annually)',
            'Panchganga river flooding during monsoon',
            'Sugar belt with agricultural water bodies',
            'Western Ghats proximity increasing humidity'
        ]
    }
};

// Calculate risk score based on inputs
export function calculateRiskScore(inputs) {
    const { district, rainfall_dev, temperature, case_growth, baseline } = inputs;
    const districtData = DISTRICTS[district] || DISTRICTS['Pune'];

    // Base score from district baseline (0-20 points)
    let score = districtData.baseline_risk * 40;

    // Rainfall impact (0-25 points)
    // Heavy rainfall increases vector breeding
    if (rainfall_dev > 40) {
        score += 25;
    } else if (rainfall_dev > 20) {
        score += 15 + (rainfall_dev - 20) * 0.5;
    } else if (rainfall_dev > 0) {
        score += rainfall_dev * 0.75;
    } else if (rainfall_dev < -30) {
        score += 5; // Drought stress
    }

    // Temperature impact (0-20 points)
    // Optimal vector temperature: 28-35°C
    if (temperature >= 28 && temperature <= 35) {
        score += 20;
    } else if (temperature >= 25 && temperature < 28) {
        score += 10 + (temperature - 25) * 3;
    } else if (temperature > 35 && temperature <= 40) {
        score += 15 - (temperature - 35) * 1;
    } else if (temperature > 40) {
        score += 5; // Too hot, reduces vector activity
    } else {
        score += Math.max(0, temperature - 18) * 0.5;
    }

    // Case growth impact (0-30 points)
    // Exponential growth is most concerning
    if (case_growth > 50) {
        score += 30;
    } else if (case_growth > 30) {
        score += 20 + (case_growth - 30) * 0.5;
    } else if (case_growth > 10) {
        score += 10 + (case_growth - 10) * 0.5;
    } else if (case_growth > 0) {
        score += case_growth * 1;
    } else {
        // Declining cases still have base risk, ensure non-negative
        score += Math.max(0, 5 + case_growth * 0.2);
    }

    // Baseline cases impact (0-15 points)
    // Higher baseline means more transmission potential
    if (baseline > 80) {
        score += 15;
    } else if (baseline > 60) {
        score += 10 + (baseline - 60) * 0.25;
    } else if (baseline > 40) {
        score += 5 + (baseline - 40) * 0.25;
    } else {
        score += baseline * 0.125;
    }

    // Population density factor (0-10 points)
    const densityFactor = districtData.population / 10;
    score += Math.min(10, densityFactor);

    // Ensure score is non-negative and clamp to 0-100
    score = Math.max(0, Math.min(100, Math.round(score)));

    return score;
}

// Classify risk category
export function classifyRisk(score) {
    if (score >= 66) return 'HIGH';
    if (score >= 36) return 'MEDIUM';
    return 'LOW';
}

// Calculate confidence based on input consistency
export function calculateConfidence(inputs) {
    const { rainfall_dev, temperature, case_growth, baseline } = inputs;
    
    let confidence = 85; // Base confidence

    // Reduce confidence for extreme values (out of distribution)
    if (rainfall_dev < -50 || rainfall_dev > 60) confidence -= 10;
    if (temperature < 20 || temperature > 40) confidence -= 8;
    if (case_growth > 60) confidence -= 5;
    if (baseline > 100) confidence -= 5;

    // Increase confidence for typical ranges
    if (rainfall_dev >= -20 && rainfall_dev <= 40) confidence += 5;
    if (temperature >= 24 && temperature <= 36) confidence += 5;
    if (case_growth >= 0 && case_growth <= 40) confidence += 3;

    return Math.max(60, Math.min(95, confidence));
}

// Calculate uncertainty (variance)
export function calculateUncertainty(inputs, score) {
    const { rainfall_dev, temperature, case_growth } = inputs;
    
    let variance = 3.5; // Base variance

    // Higher variance for extreme conditions
    if (Math.abs(rainfall_dev) > 40) variance += 2;
    if (temperature < 22 || temperature > 38) variance += 1.5;
    if (case_growth > 50) variance += 2;

    // Lower variance for stable conditions
    if (case_growth < 15 && Math.abs(rainfall_dev) < 20) variance -= 1;

    // Higher scores have more uncertainty
    if (score > 70) variance += 1.5;
    else if (score < 30) variance -= 0.5;

    return Math.max(2, Math.min(8, parseFloat(variance.toFixed(1))));
}

// Check for drift (out of distribution)
export function checkDrift(inputs) {
    const { rainfall_dev, temperature, case_growth, baseline } = inputs;
    
    const warnings = [];
    
    if (rainfall_dev < -50 || rainfall_dev > 60) {
        warnings.push('Rainfall deviation outside typical range');
    }
    if (temperature < 20 || temperature > 40) {
        warnings.push('Temperature outside typical range');
    }
    if (case_growth > 60) {
        warnings.push('Case growth rate unusually high');
    }
    if (baseline > 100) {
        warnings.push('Baseline cases unusually high');
    }

    return {
        drift_status: warnings.length > 0 ? 'warning' : 'stable',
        warnings
    };
}

// Generate SHAP-like feature contributions
export function generateContributors(inputs, score) {
    const { rainfall_dev, temperature, case_growth, baseline } = inputs;
    
    const contributors = [];

    // Case growth contribution (ensure non-negative)
    const caseContrib = case_growth > 10 ? 
        Math.min(30, 10 + (case_growth - 10) * 0.5) : 
        Math.max(0, case_growth * 1);
    contributors.push({
        feature: 'Case Growth Rate',
        value: case_growth,
        contribution: Math.max(0, Math.round(caseContrib)),
        direction: case_growth > 15 ? 'increases' : 'neutral'
    });

    // Rainfall contribution (ensure non-negative)
    const rainContrib = rainfall_dev > 20 ? 
        Math.min(25, 15 + (rainfall_dev - 20) * 0.5) : 
        Math.max(0, rainfall_dev * 0.75);
    contributors.push({
        feature: 'Rainfall Deviation',
        value: rainfall_dev,
        contribution: Math.max(0, Math.round(rainContrib)),
        direction: rainfall_dev > 20 ? 'increases' : 'neutral'
    });

    // Temperature contribution (ensure non-negative)
    const tempContrib = (temperature >= 28 && temperature <= 35) ? 20 : 
        (temperature >= 25 && temperature < 28) ? 10 + (temperature - 25) * 3 : 
        Math.max(0, (temperature - 18) * 0.5);
    contributors.push({
        feature: 'Temperature',
        value: temperature,
        contribution: Math.max(0, Math.round(tempContrib)),
        direction: (temperature >= 28 && temperature <= 35) ? 'increases' : 'neutral'
    });

    // Baseline contribution (ensure non-negative)
    const baseContrib = baseline > 60 ? 
        10 + (baseline - 60) * 0.25 : 
        Math.max(0, baseline * 0.125);
    contributors.push({
        feature: 'Baseline Cases',
        value: baseline,
        contribution: Math.max(0, Math.round(baseContrib)),
        direction: baseline > 60 ? 'increases' : 'neutral'
    });

    // Sort by contribution
    contributors.sort((a, b) => b.contribution - a.contribution);

    return contributors;
}

// Recommend resources based on risk
export function recommendResources(score, district) {
    const districtData = DISTRICTS[district] || DISTRICTS['Pune'];
    
    let field_teams = 2;
    let surveillance_level = 'routine';
    let vector_control = 'standard';
    let public_messaging = 'awareness';

    if (score >= 66) {
        field_teams = 5;
        surveillance_level = 'intensive';
        vector_control = 'emergency';
        public_messaging = 'urgent';
    } else if (score >= 36) {
        field_teams = 3;
        surveillance_level = 'enhanced';
        vector_control = 'active';
        public_messaging = 'advisory';
    }

    return {
        field_teams,
        surveillance_level,
        vector_control,
        public_messaging,
        hospital_beds: districtData.beds,
        hospitals: districtData.hospitals
    };
}

// Generate response protocols
export function generateResponse(category) {
    const responses = {
        'LOW': {
            level: 'Routine',
            actions: [
                'Continue standard surveillance protocols',
                'Weekly reporting to district health office',
                'Community awareness programs',
                'Vector control maintenance'
            ],
            timeline: 'Ongoing monitoring',
            escalation: 'District Health Officer'
        },
        'MEDIUM': {
            level: 'Enhanced',
            actions: [
                'Activate enhanced surveillance',
                'Deploy additional field teams',
                'Daily situation reports',
                'Intensify vector control operations',
                'Issue health advisory to schools',
                'Coordinate with neighboring districts'
            ],
            timeline: '48-hour activation',
            escalation: 'District Epidemiology Officer'
        },
        'HIGH': {
            level: 'Emergency',
            actions: [
                'Activate Emergency Operations Center',
                'Deploy all available field teams',
                'Implement emergency vector control',
                'Issue public health advisory',
                'Coordinate with state health department',
                'Activate hospital surge capacity',
                'Implement travel screening protocols',
                'Daily media briefings'
            ],
            timeline: '24-hour immediate response',
            escalation: 'Chief District Medical Officer'
        }
    };

    return responses[category] || responses['LOW'];
}

// Main prediction function
export function predictOutbreak(inputs) {
    const districtData = DISTRICTS[inputs.district] || DISTRICTS['Pune'];
    const score = calculateRiskScore(inputs);
    const category = classifyRisk(score);
    const confidence = calculateConfidence(inputs);
    const uncertainty = calculateUncertainty(inputs, score);
    const drift = checkDrift(inputs);
    const contributors = generateContributors(inputs, score);
    const resources = recommendResources(score, inputs.district);
    const response = generateResponse(category);

    // Generate district-specific insights
    const insights = {
        district_profile: {
            name: inputs.district,
            population: `${districtData.population}M`,
            density: districtData.density,
            climate: districtData.climate,
            infrastructure: districtData.infrastructure,
            recent_cases: districtData.recent_cases,
            trend: districtData.trend
        },
        hotspots: districtData.hotspots,
        risk_factors: districtData.risk_factors,
        prediction_7day: score >= 66 ? '+18-25%' : score >= 36 ? '+8-15%' : '+2-5%',
        prediction_14day: score >= 66 ? '+35-45%' : score >= 36 ? '+15-25%' : '+5-10%',
        peak_expected: score >= 66 ? 'Week 3-4' : score >= 36 ? 'Week 5-7' : 'Week 8-10',
        intervention_impact: score >= 66 ? 'Critical - Immediate action required' : 
                            score >= 36 ? 'Moderate - Enhanced monitoring needed' : 
                            'Low - Routine surveillance sufficient'
    };

    // Generate forecast timeline data
    const forecast = generateForecast(score, inputs);

    // Generate detailed reasoning
    const reasoning = generateDetailedReasoning(inputs, score, districtData);

    return {
        district: inputs.district,
        raw_score: score,
        calibrated_score: score,
        category,
        confidence,
        uncertainty,
        drift_status: drift.drift_status,
        drift_warnings: drift.warnings,
        top_contributors: contributors,
        recommended_resources: resources,
        response,
        insights,
        forecast,
        reasoning,
        timestamp: new Date().toISOString(),
        _latencyMs: Math.round(50 + Math.random() * 100) // Simulate processing time
    };
}

// Generate forecast timeline
function generateForecast(score, inputs) {
    const weeks = [];
    let currentCases = inputs.baseline;
    
    // Growth rate based on risk score
    const growthRate = score >= 66 ? 1.18 : score >= 36 ? 1.08 : 1.03;
    
    for (let week = 0; week <= 8; week++) {
        const cases = Math.round(currentCases);
        const riskLevel = cases > inputs.baseline * 2 ? 'high' : 
                         cases > inputs.baseline * 1.3 ? 'medium' : 'low';
        
        weeks.push({
            week,
            cases,
            riskLevel,
            interventionRecommended: cases > inputs.baseline * 1.5
        });
        
        currentCases *= growthRate;
    }
    
    return weeks;
}

// Generate detailed reasoning
function generateDetailedReasoning(inputs, score, districtData) {
    const reasons = [];
    
    // Climate factors
    if (inputs.rainfall_dev > 30) {
        reasons.push({
            factor: 'Heavy Rainfall',
            impact: 'High',
            description: `Rainfall ${inputs.rainfall_dev}mm above normal creating extensive breeding sites in ${districtData.hotspots[0]} and surrounding areas`
        });
    } else if (inputs.rainfall_dev > 10) {
        reasons.push({
            factor: 'Moderate Rainfall',
            impact: 'Medium',
            description: `Rainfall ${inputs.rainfall_dev}mm above normal increasing vector breeding potential`
        });
    }
    
    // Temperature factors
    if (inputs.temperature >= 28 && inputs.temperature <= 35) {
        reasons.push({
            factor: 'Optimal Temperature',
            impact: 'High',
            description: `Temperature ${inputs.temperature}°C is optimal for mosquito breeding and disease transmission`
        });
    } else if (inputs.temperature > 35) {
        reasons.push({
            factor: 'High Temperature',
            impact: 'Medium',
            description: `Temperature ${inputs.temperature}°C may reduce vector activity but increases human vulnerability`
        });
    }
    
    // Case growth factors
    if (inputs.case_growth > 20) {
        reasons.push({
            factor: 'Rapid Case Growth',
            impact: 'Critical',
            description: `${inputs.case_growth}% growth rate indicates active community transmission in ${districtData.hotspots.slice(0, 2).join(', ')}`
        });
    } else if (inputs.case_growth > 10) {
        reasons.push({
            factor: 'Moderate Case Growth',
            impact: 'Medium',
            description: `${inputs.case_growth}% growth rate suggests sustained transmission requiring monitoring`
        });
    }
    
    // District-specific factors
    districtData.risk_factors.slice(0, 2).forEach(factor => {
        reasons.push({
            factor: 'Local Risk Factor',
            impact: score >= 66 ? 'High' : 'Medium',
            description: factor
        });
    });
    
    // Population density
    if (districtData.density === 'very_high') {
        reasons.push({
            factor: 'Population Density',
            impact: 'High',
            description: `Very high population density (${districtData.population}M) enabling rapid person-to-person transmission`
        });
    } else if (districtData.density === 'high') {
        reasons.push({
            factor: 'Population Density',
            impact: 'Medium',
            description: `High population density facilitating disease spread across ${inputs.district}`
        });
    }
    
    return reasons;
}

// Export district list
export const DISTRICT_LIST = Object.keys(DISTRICTS);
