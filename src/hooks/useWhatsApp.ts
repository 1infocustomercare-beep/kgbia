// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Orchestrator — React Hooks
// ══════════════════════════════════════════════════════════════
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import type {
  WhatsAppConfig,
  WhatsAppConversation,
  WhatsAppMessage,
  WhatsAppNotification,
} from "@/types/whatsapp";

// ── Config ──
export function useWhatsAppConfig() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-config", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_config" as any)
        .select("*")
        .eq("tenant_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as WhatsAppConfig | null;
    },
  });
}

export function useSaveWhatsAppConfig() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config: Partial<WhatsAppConfig>) => {
      const existing = await supabase
        .from("whatsapp_config" as any)
        .select("id")
        .eq("tenant_id", user!.id)
        .maybeSingle();

      if (existing.data) {
        const { error } = await supabase
          .from("whatsapp_config" as any)
          .update({ ...config, updated_at: new Date().toISOString() })
          .eq("id", existing.data.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("whatsapp_config" as any)
          .insert({ ...config, tenant_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp-config"] }),
  });
}

// ── Conversations ──
export function useWhatsAppConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_conversations" as any)
        .select("*")
        .eq("tenant_id", user!.id)
        .order("last_message_at", { ascending: false });
      if (error) throw error;
      return (data || []) as WhatsAppConversation[];
    },
  });
}

// ── Messages for a conversation ──
export function useWhatsAppMessages(conversationId: string | null) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-messages", conversationId],
    enabled: !!user && !!conversationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_messages" as any)
        .select("*")
        .eq("conversation_id", conversationId!)
        .eq("tenant_id", user!.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data || []) as WhatsAppMessage[];
    },
  });
}

// ── Send message ──
export function useSendWhatsAppMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
    }: {
      conversationId: string;
      content: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-send", {
        body: { action: "send_message", conversation_id: conversationId, content },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ["whatsapp-messages", vars.conversationId] });
      qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });
}

// ── AI suggestion ──
export function useWhatsAppAISuggestion() {
  return useMutation({
    mutationFn: async ({
      conversationId,
      userMessage,
    }: {
      conversationId: string;
      userMessage: string;
    }) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-ai-chat", {
        body: { conversation_id: conversationId, user_message: userMessage },
      });
      if (error) throw error;
      return data?.suggestion as string;
    },
  });
}

// ── Notifications ──
export function useWhatsAppNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["whatsapp-notifications", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("whatsapp_notifications" as any)
        .select("*")
        .eq("tenant_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as WhatsAppNotification[];
    },
  });
}

// ── Realtime subscription for new messages ──
export function useWhatsAppRealtime(conversationId: string | null) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`wa-messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "whatsapp_messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          qc.invalidateQueries({ queryKey: ["whatsapp-messages", conversationId] });
          qc.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, qc]);
}
