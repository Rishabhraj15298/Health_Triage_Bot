import { useState, useEffect } from "react";
import { Activity, Calculator, RefreshCw, AlertTriangle, CheckCircle, AlertOctagon } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { predictRisk } from "../services/api";

export default function RiskAssessment() {
    const { user } = useUser();
    const { getToken } = useAuth();

    const [loadingProfile, setLoadingProfile] = useState(true);
    const [profileData, setProfileData] = useState({
        age: "",
        gender: "",
        allergies: [],
    });

    const [formData, setFormData] = useState({
        height: "",
        weight: "",
        symptoms: "",
    });

    const [bmi, setBmi] = useState(null);
    const [riskResult, setRiskResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const token = await getToken();
                // Assuming the backend endpoint is on port 5000 as per previous context
                const response = await fetch("http://localhost:5000/api/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.data) {
                        const p = data.data;
                        // Calculate age from DOB
                        let age = "N/A";
                        if (p.dateOfBirth) {
                            const dob = new Date(p.dateOfBirth);
                            const diff_ms = Date.now() - dob.getTime();
                            const age_dt = new Date(diff_ms);
                            age = Math.abs(age_dt.getUTCFullYear() - 1970);
                        }

                        setProfileData({
                            age: age,
                            gender: p.gender || "N/A",
                            allergies: p.allergies || [],
                        });
                    }
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchProfile();
    }, [user, getToken]);

    useEffect(() => {
        if (formData.height && formData.weight) {
            const h = parseFloat(formData.height) / 100; // cm to m
            const w = parseFloat(formData.weight);
            if (h > 0 && w > 0) {
                const bmiValue = (w / (h * h)).toFixed(1);
                setBmi(bmiValue);
            } else {
                setBmi(null);
            }
        } else {
            setBmi(null);
        }
    }, [formData]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCalculate = async () => {
        if (!formData.height || !formData.weight) return;

        setLoading(true);
        setError(null);
        setRiskResult(null);

        try {
            // payload construction
            const payload = {
                age: profileData.age,
                gender: profileData.gender,
                allergies: profileData.allergies,
                height: parseFloat(formData.height),
                weight: parseFloat(formData.weight),
                bmi: parseFloat(bmi),
                symptoms: formData.symptoms || "" // Backend splits this string
            };

            const token = await getToken();
            const result = await predictRisk(payload, token);
            setRiskResult(result);
        } catch (err) {
            setError("Failed to calculate risk. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRetest = () => {
        setFormData({ height: "", weight: "", symptoms: "" });
        setBmi(null);
        setRiskResult(null);
        setError(null);
    };

    // Update getRiskColor to handle risk_label
    const getRiskColor = (score) => {
        // Score can be string "Low", "High" etc (from risk_label) or number
        if (typeof score === 'string') {
            const lower = score.toLowerCase();
            if (lower.includes('high')) return "text-red-400 border-red-500/50 bg-red-500/10";
            if (lower.includes('moderate') || lower.includes('medium')) return "text-orange-400 border-orange-500/50 bg-orange-500/10";
            return "text-green-400 border-green-500/50 bg-green-500/10";
        }
        // If number (fallback)
        if (typeof score === 'number') {
            if (score > 66) return "text-red-400 border-red-500/50 bg-red-500/10";
            if (score > 33) return "text-orange-400 border-orange-500/50 bg-orange-500/10";
            return "text-green-400 border-green-500/50 bg-green-500/10";
        }
        return "text-blue-400 border-blue-500/50 bg-blue-500/10";
    };

    const getRiskIcon = (score) => {
        if (typeof score === 'string') {
            const lower = score.toLowerCase();
            if (lower.includes('high')) return AlertTriangle;
            if (lower.includes('moderate')) return AlertOctagon;
            return CheckCircle;
        }
        return Activity;
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Activity className="w-8 h-8 text-blue-400" />
                    Health Risk Assessment
                </h1>
                <p className="text-gray-400">
                    Get a predictive analysis of your health risk based on your profile and vital metrics.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Form */}
                <div className="space-y-6">
                    {/* Section 1: Auto-filled Data */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Patient Profile (Auto-filled)</h3>
                        {loadingProfile ? (
                            <div className="animate-pulse space-y-3">
                                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                            </div>
                        ) : (
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Age</span>
                                    <span className="text-white font-medium">{profileData.age} Years</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-700 pb-2">
                                    <span className="text-gray-400">Gender</span>
                                    <span className="text-white font-medium capitalize">{profileData.gender}</span>
                                </div>
                                <div>
                                    <span className="text-gray-400 block mb-1">Allergies</span>
                                    {profileData.allergies && profileData.allergies.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {profileData.allergies.map((allergy, i) => (
                                                <span key={i} className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-xs border border-red-500/20">
                                                    {allergy}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">None recorded</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Section 2: User Input */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Current Vitals</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Height (cm)</label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 175"
                                    className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 70"
                                    className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Symptoms</label>
                                <input
                                    type="text"
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleInputChange}
                                    placeholder="e.g. fever, headache, nausea"
                                    className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple symptoms with commas</p>
                            </div>

                            {bmi && (
                                <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-3 flex justify-between items-center animate-in fade-in slide-in-from-top-2">
                                    <span className="text-blue-200 text-sm">Calculated BMI</span>
                                    <span className="text-blue-400 font-bold text-lg">{bmi}</span>
                                </div>
                            )}

                            <button
                                onClick={handleCalculate}
                                disabled={loading || !bmi}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                            >
                                {loading ? (
                                    <>Processing...</>
                                ) : (
                                    <>
                                        <Calculator className="w-5 h-5" /> Calculate Risk
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Result */}
                <div className="space-y-6">
                    <div className={`h-full bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${riskResult ? "ring-2 ring-blue-500/20" : ""}`}>

                        {!riskResult && !loading && !error && (
                            <div className="text-gray-500">
                                <Activity className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p className="text-lg">Enter your vitals and click calculate to see your risk assessment.</p>
                            </div>
                        )}

                        {loading && (
                            <div className="space-y-4">
                                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <p className="text-blue-400 animate-pulse">Analyzing health profile...</p>
                            </div>
                        )}

                        {error && (
                            <div className="text-red-400">
                                <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                <p>{error}</p>
                            </div>
                        )}

                        {riskResult && (
                            <div className="w-full space-y-6 animate-in zoom-in-95 duration-300">
                                <div className={`inline-flex p-4 rounded-full ${getRiskColor(riskResult.risk_label || riskResult.risk_score)}`}>
                                    {(() => {
                                        const Icon = getRiskIcon(riskResult.risk_label || riskResult.risk_score);
                                        return <Icon className="w-12 h-12" />;
                                    })()}
                                </div>

                                <div>
                                    <h2 className="text-gray-400 uppercase tracking-wider text-sm font-semibold mb-1">Estimated Risk Level</h2>
                                    <div className="text-4xl font-bold text-white mb-2">
                                        {riskResult.risk_label || (riskResult.risk_score !== undefined ? riskResult.risk_score : "Unknown")}
                                    </div>
                                    {/* Display exact number/probability if available */}
                                    {riskResult.risk_score !== undefined && (
                                        <div className="text-xl text-gray-400 font-mono">
                                            Score: {riskResult.risk_score}
                                        </div>
                                    )}
                                </div>

                                {riskResult.recommendation && (
                                    <div className="bg-gray-800/50 rounded-lg p-4 text-left border border-gray-700">
                                        <h4 className="text-gray-300 font-semibold mb-2">Recommendation:</h4>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {riskResult.recommendation}
                                        </p>
                                    </div>
                                )}

                                <button
                                    onClick={handleRetest}
                                    className="text-gray-400 hover:text-white flex items-center gap-2 mx-auto text-sm transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" /> Start Over
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
