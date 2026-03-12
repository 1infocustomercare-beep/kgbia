import { useIndustry } from "@/hooks/useIndustry";
import NCCSettingsPage from "./NCCSettingsPage";
import GenericSettingsPage from "./GenericSettingsPage";

export default function SettingsPage() {
  const { industry } = useIndustry();
  
  if (industry === "ncc") {
    return <NCCSettingsPage />;
  }
  
  return <GenericSettingsPage />;
}
