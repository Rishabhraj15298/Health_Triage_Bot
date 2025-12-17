

/**
 * @desc Predict Health Risk (Proxy to ML Model)
 * @route POST /api/risk/predict
 * @access Private
 */
export const predictRisk = async (req, res) => {
    try {
        const { age, gender, bmi } = req.body;

        // Validate inputs
        if (!age || !gender || !bmi) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: age, gender, bmi"
            });
        }

        // Format data for ML Model
        // ML Logic: 
        // - Sex: (sex == 'Male') -> 1. Implies input must be string "Male".
        // - Symptoms: mlb.transform([list]). Implies input must be [ "string", ... ]

        // Normalize gender to Title Case "Male" / "Female"
        const normalizedSex = (gender && gender.toLowerCase() === "male") ? "Male" : "Female";

        // Ensure symptoms is an array
        let symptomsList = [];
        if (req.body.symptoms) {
            if (Array.isArray(req.body.symptoms)) {
                symptomsList = req.body.symptoms;
            } else if (typeof req.body.symptoms === "string") {
                // Split comma-separated string if provided
                symptomsList = req.body.symptoms.split(",").map(s => s.trim());
            }
        }

        const payload = {
            age: parseInt(age),
            sex: normalizedSex,
            bmi: parseFloat(bmi),
            symptoms: symptomsList
        };

        console.log("sending payload to ML model:", payload);

        const externalApiUrl = "https://risk-score-api-599866793520.asia-south1.run.app/predict_risk";

        const response = await fetch(externalApiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("ML API Error:", response.status, errorText);
            return res.status(response.status).json({
                success: false,
                message: `ML Model Error: ${response.statusText}`
            });
        }

        const data = await response.json();
        return res.status(200).json(data);

    } catch (error) {
        console.error("Risk Prediction Proxy Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to predict risk"
        });
    }
};
