import { HomepageContentProvider } from "@/hooks/useHomepageContent";
import EmpirePrestigeHome from "@/pages/EmpirePrestigeHome";

/**
 * Compatibility alias for deprecated Empire homepage experiments.
 * Keeps old imports/components alive, but renders the single official homepage.
 */
export default function OfficialEmpireHomeAlias() {
  return (
    <HomepageContentProvider>
      <EmpirePrestigeHome />
    </HomepageContentProvider>
  );
}