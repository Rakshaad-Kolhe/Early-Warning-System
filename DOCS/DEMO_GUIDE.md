# Demo Guide - Outbreak Prediction System

## 🎬 Quick Demo Script (5 minutes)

### Setup (30 seconds)
```bash
cd frontend-react
npm run dev
```
Open browser to `http://localhost:5173`

---

## 📋 Demo Scenarios

### Scenario 1: Low Risk - Routine Operations (1 min)

**Story**: "Let's check Kolhapur district during normal conditions"

**Steps**:
1. Click "🎯 Prediction System"
2. Select **Kolhapur** from dropdown
3. Set parameters:
   - Rainfall: **+5mm**
   - Temperature: **26°C**
   - Case Growth: **3%**
   - Baseline: **20 cases**
4. Click **RUN PREDICTION**

**Expected Results**:
- Risk Score: ~35-40 (LOW/MEDIUM border)
- Category: LOW or MEDIUM
- Confidence: 95%
- Action: Routine surveillance
- Teams: 2
- No critical alerts

**Key Points to Highlight**:
- ✅ Clear risk category
- ✅ High confidence (95%)
- ✅ Routine actions only
- ✅ No resource strain
- ✅ 14-day forecast shows stability

---

### Scenario 2: Medium Risk - Enhanced Response (1.5 min)

**Story**: "Mumbai is experiencing increased rainfall and case growth"

**Steps**:
1. Select **Mumbai** from dropdown
2. Set parameters:
   - Rainfall: **+35mm**
   - Temperature: **32°C**
   - Case Growth: **28%**
   - Baseline: **70 cases**
3. Click **RUN PREDICTION**

**Expected Results**:
- Risk Score: ~85-90 (HIGH)
- Category: HIGH
- Confidence: 90-95%
- Action: Deploy 5 field teams
- Deadline: 24 hours
- Resource strain projected

**Key Points to Highlight**:
- ⚠️ Crossed into HIGH threshold
- ⚠️ Mandated actions appear
- ⚠️ 48-hour deployment deadline
- ⚠️ Resource projections show strain
- ⚠️ Intervention impact visible
- ⚠️ Governance actions listed

**Demo the Panels**:
- **Decision Triggers**: Show escalation ladder
- **Confidence**: Point out 90%+ confidence
- **Forecast Timeline**: Toggle intervention on/off
- **Resource Impact**: Show 14-day bed occupancy
- **Governance**: Read public messaging template

---

### Scenario 3: High Risk - Emergency Response (2 min)

**Story**: "Nagpur faces critical outbreak conditions"

**Steps**:
1. Select **Nagpur** from dropdown
2. Set parameters:
   - Rainfall: **+60mm** (heavy monsoon)
   - Temperature: **36°C** (optimal for vectors)
   - Case Growth: **55%** (exponential)
   - Baseline: **100 cases** (high baseline)
3. Click **RUN PREDICTION**

**Expected Results**:
- Risk Score: ~95-100 (HIGH)
- Category: HIGH
- 🔴 **CRITICAL ALERT BANNER**
- Confidence: 85-90%
- Action: Emergency protocols
- Teams: 5 (immediate deployment)
- Deadline: 24 hours
- Authority: Chief District Medical Officer

**Key Points to Highlight**:
- 🔴 **Critical banner unmissable**
- 🔴 Lead time: 6 days remaining
- 🔴 Emergency Operations Center activation
- 🔴 Hospital beds: 85%+ occupancy projected
- 🔴 ICU saturation: 80%+ projected
- 🔴 Supply depletion: 7-9 days
- 🔴 Public messaging: Urgent advisory
- 🔴 Escalation to state recommended

**Demo the Full System**:

1. **Risk Hero**: 
   - Point out large score (95+)
   - Show delta indicator (▲ +X%)
   - Note uncertainty range (±5-6%)

2. **Decision Triggers**:
   - Show current threshold (HIGH)
   - Point to mandated actions
   - Highlight 24-hour deadline
   - Show escalation authority

3. **Confidence Panel**:
   - Show 85-90% confidence
   - Point out confidence interval
   - Note model reliability score
   - Check for drift warnings

4. **Forecast Timeline**:
   - Show baseline trajectory (red)
   - Toggle intervention (green)
   - Point out peak reduction (-18 points)
   - Show case load projections

5. **Resource Impact**:
   - Hospital beds: 85%+ (critical)
   - ICU: 80%+ (warning)
   - Supplies: 7-9 days (critical)
   - Field teams: 5 required

6. **Governance Panel**:
   - Read critical alert banner
   - List 7 mandatory actions
   - Show public messaging template
   - Explain escalation pathway

7. **Contributing Factors**:
   - Case growth: Highest contributor
   - Rainfall: Second highest
   - Temperature: Optimal for vectors
   - Baseline: High transmission potential

8. **Response Protocol**:
   - Level: Emergency
   - Timeline: 24-hour response
   - Authority: Chief District Medical Officer
   - Actions: 8 immediate steps

9. **Audit Trail**:
   - Show run logged automatically
   - Add decision note: "Emergency protocols activated"
   - Click "Export Log"
   - Show JSON download

---

### Scenario 4: Out of Distribution Warning (1 min)

**Story**: "What happens with extreme, unusual conditions?"

**Steps**:
1. Select **Thane** from dropdown
2. Set parameters:
   - Rainfall: **-55mm** (severe drought)
   - Temperature: **42°C** (heat wave)
   - Case Growth: **75%** (unprecedented)
   - Baseline: **115 cases** (very high)
3. Click **RUN PREDICTION**

**Expected Results**:
- Risk Score: ~70-80 (HIGH)
- Category: HIGH
- ⚠️ **OUT OF DISTRIBUTION WARNING**
- Confidence: 60-65% (reduced)
- Drift Status: WARNING
- Multiple warnings listed

**Key Points to Highlight**:
- ⚠️ Yellow warning banner appears
- ⚠️ "Input pattern deviates from training distribution"
- ⚠️ Confidence drops to 60-65%
- ⚠️ Drift warnings listed:
  - Rainfall outside typical range
  - Temperature outside typical range
  - Case growth unusually high
  - Baseline cases unusually high
- ⚠️ System recommends expert review
- ⚠️ Uncertainty increases to ±7-8%

**Message**: "The system is transparent about its limitations"

---

## 🎯 Key Features to Demonstrate

### 1. Decision Clarity (30 sec)
- "At score 72, you deploy 5 teams within 24 hours"
- "No ambiguity, no debate, clear action"

### 2. Confidence Transparency (30 sec)
- "85% confidence with ±5% variance"
- "You know how reliable the prediction is"

### 3. Resource Planning (30 sec)
- "In 14 days, beds will be 83% full"
- "Plan now, not when it's too late"

### 4. Intervention Impact (30 sec)
- "Without action: peak of 85"
- "With intervention: peak of 67"
- "That's 18 points difference"

### 5. Governance Translation (30 sec)
- "Not just epidemiology, but administrative actions"
- "School advisories, travel screening, public messaging"

### 6. Accountability (30 sec)
- "Every prediction logged"
- "Decision documented"
- "Export for stakeholders"

---

## 💬 Demo Script

### Opening (30 sec)
> "This is an AI-powered outbreak prediction system for public health officials. Unlike traditional dashboards that just show data, this system tells you exactly what to do, when to do it, and why. Let me show you."

### Low Risk Demo (1 min)
> "Let's start with Kolhapur during normal conditions. [Run prediction] Score is 38, which is LOW risk. The system recommends routine surveillance with 2 field teams. Confidence is 95%, so we trust this prediction. The 14-day forecast shows stability. No urgent action needed."

### Medium Risk Demo (1.5 min)
> "Now Mumbai with increased rainfall and case growth. [Run prediction] Score jumps to 87, which is HIGH risk. Notice the system immediately shows mandated actions: deploy 5 field teams within 24 hours. The decision trigger panel shows we've crossed the 66-point threshold. Look at the resource projections: hospital beds will hit 83% capacity in 14 days. The forecast timeline shows that with intervention, we can reduce the peak by 18 points. The governance panel gives us ready-to-use public messaging templates."

### High Risk Demo (2 min)
> "Let's see a critical scenario in Nagpur. [Run prediction] Score is 98, HIGH risk. See this red banner? 'DISTRICT RISK CRITICAL - Lead Time Remaining: 6 Days.' This is unmissable. The system shows Emergency Operations Center activation is mandatory. Look at the resource impact: ICU saturation at 80%, supplies depleting in 7 days. The governance panel lists 8 immediate actions including school closure advisory and travel screening. Every decision is logged in the audit trail for accountability. I can export this entire log for stakeholders."

### OOD Demo (1 min)
> "What about extreme conditions? [Run prediction] Notice the yellow warning: 'Input pattern deviates from training distribution.' The system is honest about its limitations. Confidence drops to 60%, and it recommends expert review. This transparency builds trust."

### Closing (30 sec)
> "This system transforms outbreak intelligence from 'here's what's happening' to 'here's what to do.' It reduces decision time from hours to minutes, provides complete accountability, and enables proactive resource planning. It's not just a tool—it's a decision-support platform."

---

## 🎓 Audience-Specific Demos

### For Public Health Officials
Focus on:
- Decision triggers and mandated actions
- Resource projections for planning
- Governance actions and messaging
- Audit trail for accountability

### For Technical Audience
Focus on:
- Confidence intervals and uncertainty
- Feature contributions (SHAP-like)
- Drift detection
- Algorithm transparency

### For Executives
Focus on:
- Time savings (hours → minutes)
- Resource optimization
- Risk reduction
- Accountability and compliance

### For Funders/Investors
Focus on:
- Lives saved through early detection
- Cost reduction through optimization
- Scalability to other regions
- Impact metrics

---

## 📊 Comparison Demo

### Before (Traditional Dashboard)
1. Open "🗺️ National Overview"
2. Show map with colored regions
3. Click on a state
4. Point out: "Interesting data, but what do I do?"

### After (Decision-Support Platform)
1. Open "🎯 Prediction System"
2. Run a HIGH risk prediction
3. Point out: "Clear actions, timelines, resources, messaging"
4. Show audit trail: "Complete accountability"

**Message**: "From information to intelligence, from awareness to action"

---

## 🎬 Video Demo Script (3 min)

**[0:00-0:15] Opening**
- Show landing page
- "AI-powered outbreak prediction for public health"

**[0:15-0:45] Low Risk**
- Select Kolhapur
- Run prediction
- "Score 38, routine surveillance, high confidence"

**[0:45-1:45] High Risk**
- Select Nagpur
- Set extreme parameters
- Run prediction
- "Score 98, critical alert, deploy 5 teams"
- Pan through all panels
- "Resource projections, governance actions, audit trail"

**[1:45-2:15] Key Features**
- Show decision triggers
- Show forecast timeline
- Show resource impact
- "Clear, actionable, accountable"

**[2:15-2:45] Audit Trail**
- Show run history
- Add decision note
- Export log
- "Complete documentation"

**[2:45-3:00] Closing**
- "From hours to minutes"
- "From uncertainty to confidence"
- "From information to action"

---

## ✅ Demo Checklist

Before demo:
- [ ] Frontend running (`npm run dev`)
- [ ] Browser open to correct URL
- [ ] No console errors
- [ ] All districts working
- [ ] Test one prediction beforehand

During demo:
- [ ] Speak clearly and confidently
- [ ] Point to specific UI elements
- [ ] Explain the "why" not just "what"
- [ ] Show real-world value
- [ ] Handle questions gracefully

After demo:
- [ ] Offer to run custom scenarios
- [ ] Share documentation links
- [ ] Collect feedback
- [ ] Follow up on questions

---

**Demo Duration**: 5 minutes (flexible)  
**Preparation Time**: 2 minutes  
**Wow Factor**: High  
**Technical Difficulty**: Low  
**Impact**: Maximum
