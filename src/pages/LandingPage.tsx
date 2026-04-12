import { useEffect } from "react";

export default function LandingPage() {
  useEffect(() => {
    window.location.replace("/homepage.html");
  }, []);
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
      fontSize: "14px",
      letterSpacing: "0.1em",
      textTransform: "uppercase"
    }}>
      Loading Empire.AI...
    </div>
  );
}
