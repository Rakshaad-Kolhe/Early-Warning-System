RESPONSE_PROTOCOLS = {
    "LOW": {
        "urgency": "Routine",
        "actions": [
            "Continue standard surveillance",
            "Review weekly case reports",
            "Ensure baseline supplies are stocked",
        ],
        "resources": {
            "medical_teams": 0,
            "alert_level": "Green",
            "escalation": "None required",
        },
    },
    "MEDIUM": {
        "urgency": "Elevated",
        "actions": [
            "Activate district health cell",
            "Increase surveillance frequency to daily",
            "Pre-position IV Fluids and Medical supplies",
            "Initiate targeted mosquito control drive",
            "Begin community awareness campaigns",
        ],
        "resources": {
            "medical_teams": 2,
            "alert_level": "Amber",
            "escalation": "District Health Officer",
        },
    },
    "HIGH": {
        "urgency": "Critical",
        "actions": [
            "Activate emergency operations center",
            "Deploy rapid response teams immediately",
            "Establish isolation facilities",
            "Initiate aggressive mosquito control drive",
            "Resource prioritization for critical medical supplies",
            "Issue public health advisory",
            "Begin mass screening in affected zones",
        ],
        "resources": {
            "medical_teams": 5,
            "alert_level": "Red",
            "escalation": "State Health Commissioner",
        },
    },
}


def generate_response(category: str) -> dict:
    return RESPONSE_PROTOCOLS.get(category, RESPONSE_PROTOCOLS["LOW"])
