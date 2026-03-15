// Mapping agent categories → futuristic alien cartoon images
import agentAlienConcierge from "@/assets/agent-alien-concierge.png";
import agentAlienAnalytics from "@/assets/agent-alien-analytics.png";
import agentAlienContent from "@/assets/agent-alien-content.png";
import agentAlienSales from "@/assets/agent-alien-sales.png";
import agentAlienOperations from "@/assets/agent-alien-operations.png";
import agentAlienCompliance from "@/assets/agent-alien-compliance.png";

// Category → alien image
const CATEGORY_ALIEN_MAP: Record<string, string> = {
  concierge: agentAlienConcierge,
  analytics: agentAlienAnalytics,
  content: agentAlienContent,
  sales: agentAlienSales,
  operations: agentAlienOperations,
  compliance: agentAlienCompliance,
};

export function getAgentImage(
  _name: string,
  category: string,
  _sectors: string[]
): string {
  return CATEGORY_ALIEN_MAP[category] || agentAlienConcierge;
}
