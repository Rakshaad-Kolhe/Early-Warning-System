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
            "Pre-position medical supplies",
            "Notify regional health authority",
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
            "Initiate contact tracing protocols",
            "Request state-level resource support",
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
