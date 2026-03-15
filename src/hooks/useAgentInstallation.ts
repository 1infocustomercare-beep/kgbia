import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useAgentInstallation(agentId?: string) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const tenantId = user?.id;

  const { data: installations = [], isLoading } = useQuery({
    queryKey: ["agent-installations", tenantId],
    enabled: !!tenantId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_installations" as any)
        .select("*")
        .eq("tenant_id", tenantId!);
      if (error) throw error;
      return data as any[];
    },
  });

  const isInstalled = agentId ? installations.some((i: any) => i.agent_id === agentId && i.status === 'active') : false;
  const installationId = agentId ? installations.find((i: any) => i.agent_id === agentId)?.id : null;

  const installMutation = useMutation({
    mutationFn: async (aId: string) => {
      const { error } = await supabase
        .from("agent_installations" as any)
        .insert({ agent_id: aId, tenant_id: tenantId!, status: 'active', config: {} } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-installations"] });
      toast({ title: "✅ Agente attivato", description: "L'agente è ora attivo nel tuo account." });
    },
    onError: () => toast({ title: "Errore", description: "Impossibile attivare l'agente.", variant: "destructive" }),
  });

  const uninstallMutation = useMutation({
    mutationFn: async (aId: string) => {
      const { error } = await supabase
        .from("agent_installations" as any)
        .delete()
        .eq("agent_id", aId)
        .eq("tenant_id", tenantId!);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent-installations"] });
      toast({ title: "Agente disattivato", description: "L'agente è stato rimosso." });
    },
    onError: () => toast({ title: "Errore", description: "Impossibile disattivare l'agente.", variant: "destructive" }),
  });

  return {
    installations,
    isInstalled,
    installationId,
    loading: isLoading,
    install: (aId: string) => installMutation.mutate(aId),
    uninstall: (aId: string) => uninstallMutation.mutate(aId),
    installing: installMutation.isPending,
    uninstalling: uninstallMutation.isPending,
  };
}
