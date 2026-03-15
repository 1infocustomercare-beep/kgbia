export interface Agent {
  id: string;
  name: string;
  type: 'universal' | 'sector-specific';
  category: 'concierge' | 'analytics' | 'content' | 'sales' | 'operations' | 'compliance';
  description_it: string;
  icon_emoji: string;
  color_hex: string;
  sectors: string[];
  status: 'active' | 'beta' | 'inactive';
  capabilities: string[];
  pricing: { base: number; currency: string };
  created_at?: string;
  updated_at?: string;
}

export interface AgentInstallation {
  id: string;
  agent_id: string;
  tenant_id: string;
  status: string;
  config: Record<string, any>;
  created_at: string;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  tenant_id: string;
  execution_type: string;
  status: string;
  input: any;
  output: any;
  duration_ms: number;
  created_at: string;
}

export const CATEGORY_LABELS: Record<string, { label: string; color: string; icon: string }> = {
  concierge: { label: 'Concierge', color: '#8B5CF6', icon: '🤖' },
  analytics: { label: 'Analytics', color: '#06B6D4', icon: '📊' },
  content: { label: 'Content', color: '#EC4899', icon: '📱' },
  sales: { label: 'Sales', color: '#10B981', icon: '🎯' },
  operations: { label: 'Operations', color: '#F59E0B', icon: '⚙️' },
  compliance: { label: 'Compliance', color: '#6366F1', icon: '🛡️' },
};
