
// Native fetch is available in recent Node versions

async function testPayload(name, payload) {
    const url = "https://risk-score-api-599866793520.asia-south1.run.app/predict_risk";
    console.log(`\n--- Testing ${name} ---`);
    console.log("Payload:", JSON.stringify(payload));

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text.substring(0, 500)}`);
    } catch (error) {
        console.error("Error:", error.message);
    }
}

async function runTests() {
    // Valid Payload based on recent findings
    await testPayload("Valid Payload", {
        age: 30,
        sex: "Male",
        bmi: 25.5,
        symptoms: ["fever", "headache"]
    });
}

runTests();
