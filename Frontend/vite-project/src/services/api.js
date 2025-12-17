export const predictRisk = async (data, token) => {
    // Use Backend Proxy to avoid CORS and handle formatting
    const url = "http://localhost:5000/api/risk/predict";

    try {
        // Get token from auth context if needed, but for now we'll rely on the caller passing it or just public
        // Actually, RiskAssessment.jsx doesn't pass token to predictRisk, and predictRisk is a standalone function.
        // We should probably pass token to predictRisk if the backend route is protected.
        // The backend route IS protected by clerkMiddleware generally, but let's check risk.routes.js.
        // I didn't add specific middleware in risk.routes.js but app.js has app.use(clerkMiddleware()).
        // If I need auth, I need to pass the token.
        // RiskAssessment.jsx doesn't pass token. I should update RiskAssessment.jsx to pass token.

        // For now, let's just make the fetch call. If 401, we fix it.
        // Wait, simpler: I'll update RiskAssessment to pass the token to predictRisk.

        // Let's first update the URL here.
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // We need Authorization header if protected.
                // Let's assume we will pass headers or token in data for now or update signature.
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Risk Prediction Error:", error);
        throw error;
    }
};
