import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, MapPin, Clock, Crosshair, AlertTriangle, CheckCircle, Activity } from "lucide-react";

type Zone = "safe" | "moderate" | "high" | "critical" | null;

interface DetectionResult {
  zone: Zone;
  label: string;
  description: string;
  crimeTypes: string[];
  riskScore: number;
}

function getDetectionResult(lat: number, lng: number, hours: number): DetectionResult {
  // Simulated detection logic based on inputs
  const hash = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233 + hours * 4.1414) * 43758.5453) % 1;
  
  if (hash < 0.3) {
    return {
      zone: "safe",
      label: "Safe Zone",
      description: "Low crime density area. Minimal risk detected based on historical patterns.",
      crimeTypes: ["Minor Theft", "Vandalism"],
      riskScore: Math.round(hash * 100 + 5),
    };
  } else if (hash < 0.55) {
    return {
      zone: "moderate",
      label: "Moderate Zone",
      description: "Moderate crime activity observed. Exercise standard precautions.",
      crimeTypes: ["Burglary", "Vehicle Theft", "Assault"],
      riskScore: Math.round(hash * 100 + 20),
    };
  } else if (hash < 0.8) {
    return {
      zone: "high",
      label: "High Risk Zone",
      description: "Elevated crime patterns detected. Increased vigilance recommended.",
      crimeTypes: ["Robbery", "Aggravated Assault", "Drug Offenses"],
      riskScore: Math.round(hash * 100 + 15),
    };
  } else {
    return {
      zone: "critical",
      label: "Critical Zone",
      description: "High crime density area. Significant risk patterns identified.",
      crimeTypes: ["Armed Robbery", "Homicide", "Gang Activity", "Drug Trafficking"],
      riskScore: Math.round(hash * 100),
    };
  }
}

const zoneConfig = {
  safe: { icon: CheckCircle, colorClass: "zone-safe", bgClass: "bg-zone-safe" },
  moderate: { icon: Activity, colorClass: "zone-moderate", bgClass: "bg-zone-moderate" },
  high: { icon: AlertTriangle, colorClass: "zone-high", bgClass: "bg-zone-high" },
  critical: { icon: AlertTriangle, colorClass: "zone-critical", bgClass: "bg-zone-critical" },
};

export default function CrimeDetectionDashboard() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [hours, setHours] = useState("");
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDetect = () => {
    if (!latitude || !longitude || !hours) return;
    setIsAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const res = getDetectionResult(parseFloat(latitude), parseFloat(longitude), parseFloat(hours));
      setResult(res);
      setIsAnalyzing(false);
    }, 1800);
  };

  const canDetect = latitude !== "" && longitude !== "" && hours !== "";

  return (
    <div className="relative min-h-screen bg-background bg-grid-pattern overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 glow-primary">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
              <span className="text-gradient-primary">Crime Detection</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            AI-powered spatial crime analysis and zone classification system
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            System Online — Real-time Detection Active
          </div>
        </motion.header>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-8 mb-8"
        >
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-primary" />
            Detection Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField
              icon={<MapPin className="w-4 h-4" />}
              label="Latitude"
              placeholder="e.g. 28.6139"
              value={latitude}
              onChange={setLatitude}
              type="number"
            />
            <InputField
              icon={<MapPin className="w-4 h-4" />}
              label="Longitude"
              placeholder="e.g. 77.2090"
              value={longitude}
              onChange={setLongitude}
              type="number"
            />
            <InputField
              icon={<Clock className="w-4 h-4" />}
              label="Hour of Crime (0-23)"
              placeholder="e.g. 14"
              value={hours}
              onChange={setHours}
              type="number"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDetect}
            disabled={!canDetect || isAnalyzing}
            className={`mt-8 w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              canDetect && !isAnalyzing
                ? "bg-primary text-primary-foreground glow-primary-strong hover:brightness-110 cursor-pointer"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isAnalyzing ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Analyzing Crime Patterns...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Crosshair className="w-5 h-5" />
                Detect Crime Zone
              </span>
            )}
          </motion.button>
        </motion.div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && result.zone && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring", bounce: 0.3 }}
            >
              <ResultCard result={result} lat={latitude} lng={longitude} hour={hours} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm"
        >
          {[
            { label: "Safe", cls: "zone-safe" },
            { label: "Moderate", cls: "zone-moderate" },
            { label: "High Risk", cls: "zone-high" },
            { label: "Critical", cls: "zone-critical" },
          ].map((z) => (
            <div key={z.label} className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${z.cls.replace("zone-", "bg-zone-")} border`} />
              <span className="text-muted-foreground">{z.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function InputField({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-mono text-sm"
      />
    </div>
  );
}

function ResultCard({
  result,
  lat,
  lng,
  hour,
}: {
  result: DetectionResult;
  lat: string;
  lng: string;
  hour: string;
}) {
  const zone = result.zone!;
  const config = zoneConfig[zone];
  const Icon = config.icon;

  return (
    <div className={`rounded-2xl border ${config.bgClass} p-8`}>
      <div className="flex flex-col md:flex-row md:items-start gap-6">
        {/* Zone Badge */}
        <div className="flex-shrink-0">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className={`w-24 h-24 rounded-2xl flex items-center justify-center ${config.bgClass} border`}
          >
            <Icon className={`w-12 h-12 ${config.colorClass}`} />
          </motion.div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className={`text-2xl font-bold ${config.colorClass}`}>{result.label}</h3>
            <p className="text-secondary-foreground mt-1">{result.description}</p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatBox label="Risk Score" value={`${result.riskScore}%`} />
            <StatBox label="Latitude" value={parseFloat(lat).toFixed(4)} />
            <StatBox label="Longitude" value={parseFloat(lng).toFixed(4)} />
            <StatBox label="Hour" value={`${hour}:00`} />
          </div>

          {/* Crime Types */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">Predicted Crime Types:</p>
            <div className="flex flex-wrap gap-2">
              {result.crimeTypes.map((ct) => (
                <span
                  key={ct}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary border border-border text-secondary-foreground"
                >
                  {ct}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-background/50 rounded-lg p-3 border border-border">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-bold font-mono text-foreground">{value}</p>
    </div>
  );
}
