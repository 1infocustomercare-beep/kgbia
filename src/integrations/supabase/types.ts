export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      agent_executions: {
        Row: {
          agent_id: string | null
          created_at: string | null
          duration_ms: number | null
          execution_type: string | null
          id: string
          input: Json | null
          output: Json | null
          status: string | null
          tenant_id: string
        }
        Insert: {
          agent_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          execution_type?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          status?: string | null
          tenant_id: string
        }
        Update: {
          agent_id?: string | null
          created_at?: string | null
          duration_ms?: number | null
          execution_type?: string | null
          id?: string
          input?: Json | null
          output?: Json | null
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_executions_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_installations: {
        Row: {
          agent_id: string | null
          config: Json | null
          created_at: string | null
          id: string
          status: string | null
          tenant_id: string
        }
        Insert: {
          agent_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          status?: string | null
          tenant_id: string
        }
        Update: {
          agent_id?: string | null
          config?: Json | null
          created_at?: string | null
          id?: string
          status?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_installations_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_metrics: {
        Row: {
          agent_id: string | null
          avg_duration_ms: number | null
          executions_success: number | null
          executions_total: number | null
          id: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          agent_id?: string | null
          avg_duration_ms?: number | null
          executions_success?: number | null
          executions_total?: number | null
          id?: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          agent_id?: string | null
          avg_duration_ms?: number | null
          executions_success?: number | null
          executions_total?: number | null
          id?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_metrics_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_requests: {
        Row: {
          admin_note: string | null
          agent_id: string
          created_at: string
          id: string
          requested_by: string
          resolved_at: string | null
          status: string
          tenant_id: string
          tenant_name: string | null
          tenant_type: string | null
        }
        Insert: {
          admin_note?: string | null
          agent_id: string
          created_at?: string
          id?: string
          requested_by: string
          resolved_at?: string | null
          status?: string
          tenant_id: string
          tenant_name?: string | null
          tenant_type?: string | null
        }
        Update: {
          admin_note?: string | null
          agent_id?: string
          created_at?: string
          id?: string
          requested_by?: string
          resolved_at?: string | null
          status?: string
          tenant_id?: string
          tenant_name?: string | null
          tenant_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_requests_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          ai_model: string
          autonomy_level: number
          capabilities: string[] | null
          category: string
          color_hex: string | null
          created_at: string | null
          description_it: string
          icon_emoji: string | null
          id: string
          learning_enabled: boolean
          name: string
          pricing: Json | null
          privacy_level: string
          sectors: string[]
          status: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          ai_model?: string
          autonomy_level?: number
          capabilities?: string[] | null
          category: string
          color_hex?: string | null
          created_at?: string | null
          description_it: string
          icon_emoji?: string | null
          id?: string
          learning_enabled?: boolean
          name: string
          pricing?: Json | null
          privacy_level?: string
          sectors?: string[]
          status?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          ai_model?: string
          autonomy_level?: number
          capabilities?: string[] | null
          category?: string
          color_hex?: string | null
          created_at?: string | null
          description_it?: string
          icon_emoji?: string | null
          id?: string
          learning_enabled?: boolean
          name?: string
          pricing?: Json | null
          privacy_level?: string
          sectors?: string[]
          status?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_agent_configs: {
        Row: {
          agent_name: string
          allowed_industries: string[] | null
          color: string | null
          created_at: string | null
          description: string | null
          display_name: string | null
          icon: string | null
          id: string
          is_enabled: boolean | null
          max_calls_per_hour: number | null
          max_monthly_budget_usd: number | null
          system_prompt_override: string | null
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          allowed_industries?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          max_calls_per_hour?: number | null
          max_monthly_budget_usd?: number | null
          system_prompt_override?: string | null
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          allowed_industries?: string[] | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          max_calls_per_hour?: number | null
          max_monthly_budget_usd?: number | null
          system_prompt_override?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_agent_prompts: {
        Row: {
          agent_name: string
          autonomy_level: number | null
          blocked_capabilities: Json | null
          capabilities: Json | null
          created_at: string | null
          id: string
          industry_type: string
          is_active: boolean | null
          prompt_text: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          agent_name: string
          autonomy_level?: number | null
          blocked_capabilities?: Json | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          industry_type: string
          is_active?: boolean | null
          prompt_text: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          agent_name?: string
          autonomy_level?: number | null
          blocked_capabilities?: Json | null
          capabilities?: Json | null
          created_at?: string | null
          id?: string
          industry_type?: string
          is_active?: boolean | null
          prompt_text?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_alerts: {
        Row: {
          agent_name: string | null
          alert_type: string
          company_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
        }
        Insert: {
          agent_name?: string | null
          alert_type?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
        }
        Update: {
          agent_name?: string | null
          alert_type?: string
          company_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_alerts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_token_history: {
        Row: {
          action: string
          created_at: string
          id: string
          restaurant_id: string
          tokens: number
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          restaurant_id: string
          tokens: number
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          restaurant_id?: string
          tokens?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_token_history_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_token_purchases: {
        Row: {
          amount_cents: number
          buyer_user_id: string | null
          created_at: string
          credits: number
          currency: string
          id: string
          paid_at: string | null
          restaurant_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount_cents: number
          buyer_user_id?: string | null
          created_at?: string
          credits: number
          currency?: string
          id?: string
          paid_at?: string | null
          restaurant_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount_cents?: number
          buyer_user_id?: string | null
          created_at?: string
          credits?: number
          currency?: string
          id?: string
          paid_at?: string | null
          restaurant_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      ai_token_usage: {
        Row: {
          company_id: string
          created_at: string | null
          feature: string
          id: string
          month: number
          tokens_used: number
          year: number
        }
        Insert: {
          company_id: string
          created_at?: string | null
          feature: string
          id?: string
          month: number
          tokens_used: number
          year: number
        }
        Update: {
          company_id?: string
          created_at?: string | null
          feature?: string
          id?: string
          month?: number
          tokens_used?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "ai_token_usage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_tokens: {
        Row: {
          balance: number
          id: string
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          balance?: number
          id?: string
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          balance?: number
          id?: string
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_tokens_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_usage_logs: {
        Row: {
          agent_name: string
          company_id: string | null
          cost_usd: number | null
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          input_tokens: number | null
          is_test: boolean | null
          model_used: string | null
          output_tokens: number | null
          restaurant_id: string | null
          status: string | null
        }
        Insert: {
          agent_name: string
          company_id?: string | null
          cost_usd?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          is_test?: boolean | null
          model_used?: string | null
          output_tokens?: number | null
          restaurant_id?: string | null
          status?: string | null
        }
        Update: {
          agent_name?: string
          company_id?: string | null
          cost_usd?: number | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_tokens?: number | null
          is_test?: boolean | null
          model_used?: string | null
          output_tokens?: number | null
          restaurant_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_usage_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_usage_logs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          client_id: string | null
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          price: number | null
          scheduled_at: string
          service_id: string | null
          service_name: string | null
          staff_name: string | null
          status: string | null
        }
        Insert: {
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          scheduled_at: string
          service_id?: string | null
          service_name?: string | null
          staff_name?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          scheduled_at?: string
          service_id?: string | null
          service_name?: string | null
          staff_name?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      arianna_autopilot_state: {
        Row: {
          auto_send_messages: boolean
          auto_tune_enabled: boolean
          created_at: string
          current_city: string | null
          current_sector: string | null
          cycles_completed: number
          hot_leads_found: number
          id: string
          is_running: boolean
          last_cycle_at: string | null
          last_tuned_at: string | null
          next_cycle_at: string | null
          quality_filters: Json
          recently_scanned: Json
          tuning_history: Json
          updated_at: string
          user_id: string
          zone_sector_weights: Json
        }
        Insert: {
          auto_send_messages?: boolean
          auto_tune_enabled?: boolean
          created_at?: string
          current_city?: string | null
          current_sector?: string | null
          cycles_completed?: number
          hot_leads_found?: number
          id?: string
          is_running?: boolean
          last_cycle_at?: string | null
          last_tuned_at?: string | null
          next_cycle_at?: string | null
          quality_filters?: Json
          recently_scanned?: Json
          tuning_history?: Json
          updated_at?: string
          user_id: string
          zone_sector_weights?: Json
        }
        Update: {
          auto_send_messages?: boolean
          auto_tune_enabled?: boolean
          created_at?: string
          current_city?: string | null
          current_sector?: string | null
          cycles_completed?: number
          hot_leads_found?: number
          id?: string
          is_running?: boolean
          last_cycle_at?: string | null
          last_tuned_at?: string | null
          next_cycle_at?: string | null
          quality_filters?: Json
          recently_scanned?: Json
          tuning_history?: Json
          updated_at?: string
          user_id?: string
          zone_sector_weights?: Json
        }
        Relationships: []
      }
      arianna_learning_log: {
        Row: {
          city: string
          created_at: string
          credits_spent: number
          cycle_number: number
          decision_reasoning: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          leads_contacted: number
          leads_converted: number
          leads_passed_filters: number
          leads_replied: number
          leads_saved_to_pipeline: number
          leads_scanned: number
          performance_score: number
          sector: string
          selected_weight: number | null
          status: string
          user_id: string
        }
        Insert: {
          city: string
          created_at?: string
          credits_spent?: number
          cycle_number: number
          decision_reasoning?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          leads_contacted?: number
          leads_converted?: number
          leads_passed_filters?: number
          leads_replied?: number
          leads_saved_to_pipeline?: number
          leads_scanned?: number
          performance_score?: number
          sector: string
          selected_weight?: number | null
          status?: string
          user_id: string
        }
        Update: {
          city?: string
          created_at?: string
          credits_spent?: number
          cycle_number?: number
          decision_reasoning?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          leads_contacted?: number
          leads_converted?: number
          leads_passed_filters?: number
          leads_replied?: number
          leads_saved_to_pipeline?: number
          leads_scanned?: number
          performance_score?: number
          sector?: string
          selected_weight?: number | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      automations: {
        Row: {
          automation_type: string
          company_id: string
          id: string
          is_active: boolean | null
          sent_count: number | null
          template_body: string | null
          template_subject: string | null
        }
        Insert: {
          automation_type: string
          company_id: string
          id?: string
          is_active?: boolean | null
          sent_count?: number | null
          template_body?: string | null
          template_subject?: string | null
        }
        Update: {
          automation_type?: string
          company_id?: string
          id?: string
          is_active?: boolean | null
          sent_count?: number | null
          template_body?: string | null
          template_subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      autopilot_config: {
        Row: {
          ai_model: string
          autonomy_level: string
          created_at: string
          custom_instructions: string | null
          daily_scan_cap: number
          daily_scans_used: number
          enabled_channels: Json
          id: string
          is_enabled: boolean
          last_run_at: string | null
          last_run_status: string | null
          last_run_summary: Json | null
          max_concurrent_conversations: number
          max_new_conversations_per_run: number
          next_run_at: string | null
          operating_hours: Json
          owner_id: string
          paused_channels: Json | null
          paused_sectors: Json
          priority_rules: Json
          run_interval_minutes: number
          scans_reset_at: string
          target_sectors: Json
          total_runs: number
          updated_at: string
        }
        Insert: {
          ai_model?: string
          autonomy_level?: string
          created_at?: string
          custom_instructions?: string | null
          daily_scan_cap?: number
          daily_scans_used?: number
          enabled_channels?: Json
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          last_run_status?: string | null
          last_run_summary?: Json | null
          max_concurrent_conversations?: number
          max_new_conversations_per_run?: number
          next_run_at?: string | null
          operating_hours?: Json
          owner_id: string
          paused_channels?: Json | null
          paused_sectors?: Json
          priority_rules?: Json
          run_interval_minutes?: number
          scans_reset_at?: string
          target_sectors?: Json
          total_runs?: number
          updated_at?: string
        }
        Update: {
          ai_model?: string
          autonomy_level?: string
          created_at?: string
          custom_instructions?: string | null
          daily_scan_cap?: number
          daily_scans_used?: number
          enabled_channels?: Json
          id?: string
          is_enabled?: boolean
          last_run_at?: string | null
          last_run_status?: string | null
          last_run_summary?: Json | null
          max_concurrent_conversations?: number
          max_new_conversations_per_run?: number
          next_run_at?: string | null
          operating_hours?: Json
          owner_id?: string
          paused_channels?: Json | null
          paused_sectors?: Json
          priority_rules?: Json
          run_interval_minutes?: number
          scans_reset_at?: string
          target_sectors?: Json
          total_runs?: number
          updated_at?: string
        }
        Relationships: []
      }
      autopilot_conversations: {
        Row: {
          ai_confidence: number | null
          channel: string
          closed_at: string | null
          closed_reason: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          funnel_stage: string
          id: string
          last_ai_message_at: string | null
          last_lead_message_at: string | null
          lead_id: string | null
          next_action: string | null
          next_action_at: string | null
          owner_id: string
          pain_scan_id: string | null
          roi_calculation_id: string | null
          sentiment: string | null
          shared_context: Json
          status: string
          updated_at: string
        }
        Insert: {
          ai_confidence?: number | null
          channel?: string
          closed_at?: string | null
          closed_reason?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          funnel_stage?: string
          id?: string
          last_ai_message_at?: string | null
          last_lead_message_at?: string | null
          lead_id?: string | null
          next_action?: string | null
          next_action_at?: string | null
          owner_id: string
          pain_scan_id?: string | null
          roi_calculation_id?: string | null
          sentiment?: string | null
          shared_context?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          ai_confidence?: number | null
          channel?: string
          closed_at?: string | null
          closed_reason?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          funnel_stage?: string
          id?: string
          last_ai_message_at?: string | null
          last_lead_message_at?: string | null
          lead_id?: string | null
          next_action?: string | null
          next_action_at?: string | null
          owner_id?: string
          pain_scan_id?: string | null
          roi_calculation_id?: string | null
          sentiment?: string | null
          shared_context?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "autopilot_conversations_pain_scan_id_fkey"
            columns: ["pain_scan_id"]
            isOneToOne: false
            referencedRelation: "pain_scans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "autopilot_conversations_roi_calculation_id_fkey"
            columns: ["roi_calculation_id"]
            isOneToOne: false
            referencedRelation: "roi_calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      autopilot_messages: {
        Row: {
          ai_metadata: Json | null
          channel: string
          content: string
          conversation_id: string
          created_at: string
          delivered_at: string | null
          id: string
          owner_id: string
          read_at: string | null
          sender: string
        }
        Insert: {
          ai_metadata?: Json | null
          channel?: string
          content: string
          conversation_id: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          owner_id: string
          read_at?: string | null
          sender: string
        }
        Update: {
          ai_metadata?: Json | null
          channel?: string
          content?: string
          conversation_id?: string
          created_at?: string
          delivered_at?: string | null
          id?: string
          owner_id?: string
          read_at?: string | null
          sender?: string
        }
        Relationships: [
          {
            foreignKeyName: "autopilot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "autopilot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      autopilot_retry_queue: {
        Row: {
          abandoned_at: string | null
          attempt_count: number
          backoff_seconds: number
          created_at: string
          id: string
          last_attempt_at: string | null
          last_error: string | null
          last_error_code: string | null
          max_attempts: number
          metadata: Json
          next_retry_at: string
          owner_id: string
          payload: Json
          priority: number
          source_function: string | null
          status: string
          step_type: string
          succeeded_at: string | null
          target_id: string | null
          target_table: string | null
          updated_at: string
        }
        Insert: {
          abandoned_at?: string | null
          attempt_count?: number
          backoff_seconds?: number
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          last_error_code?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string
          owner_id: string
          payload?: Json
          priority?: number
          source_function?: string | null
          status?: string
          step_type: string
          succeeded_at?: string | null
          target_id?: string | null
          target_table?: string | null
          updated_at?: string
        }
        Update: {
          abandoned_at?: string | null
          attempt_count?: number
          backoff_seconds?: number
          created_at?: string
          id?: string
          last_attempt_at?: string | null
          last_error?: string | null
          last_error_code?: string | null
          max_attempts?: number
          metadata?: Json
          next_retry_at?: string
          owner_id?: string
          payload?: Json
          priority?: number
          source_function?: string | null
          status?: string
          step_type?: string
          succeeded_at?: string | null
          target_id?: string | null
          target_table?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      autopilot_scheduler_runs: {
        Row: {
          channels_used: Json
          conversations_advanced: number
          duration_ms: number | null
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json
          owner_id: string
          scans_executed: number
          skip_reason: string | null
          status: string
          triggered_at: string
        }
        Insert: {
          channels_used?: Json
          conversations_advanced?: number
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json
          owner_id: string
          scans_executed?: number
          skip_reason?: string | null
          status?: string
          triggered_at?: string
        }
        Update: {
          channels_used?: Json
          conversations_advanced?: number
          duration_ms?: number | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json
          owner_id?: string
          scans_executed?: number
          skip_reason?: string | null
          status?: string
          triggered_at?: string
        }
        Relationships: []
      }
      b2b_invoices: {
        Row: {
          codice_univoco: string | null
          created_at: string
          id: string
          invoice_number: string
          invoice_type: string
          issued_at: string
          line_items: Json
          notes: string | null
          partita_iva: string | null
          partner_id: string | null
          pec: string | null
          recipient_email: string | null
          recipient_name: string | null
          restaurant_id: string
          status: string
          subtotal: number
          total: number
          vat_amount: number
          vat_rate: number
        }
        Insert: {
          codice_univoco?: string | null
          created_at?: string
          id?: string
          invoice_number: string
          invoice_type?: string
          issued_at?: string
          line_items?: Json
          notes?: string | null
          partita_iva?: string | null
          partner_id?: string | null
          pec?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          restaurant_id: string
          status?: string
          subtotal?: number
          total?: number
          vat_amount?: number
          vat_rate?: number
        }
        Update: {
          codice_univoco?: string | null
          created_at?: string
          id?: string
          invoice_number?: string
          invoice_type?: string
          issued_at?: string
          line_items?: Json
          notes?: string | null
          partita_iva?: string | null
          partner_id?: string | null
          pec?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          restaurant_id?: string
          status?: string
          subtotal?: number
          total?: number
          vat_amount?: number
          vat_rate?: number
        }
        Relationships: [
          {
            foreignKeyName: "b2b_invoices_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      beach_bookings: {
        Row: {
          booking_date: string
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string | null
          extras_json: Json | null
          id: string
          period: string | null
          spot_id: string | null
          status: string | null
          total: number | null
        }
        Insert: {
          booking_date: string
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string | null
          extras_json?: Json | null
          id?: string
          period?: string | null
          spot_id?: string | null
          status?: string | null
          total?: number | null
        }
        Update: {
          booking_date?: string
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string | null
          extras_json?: Json | null
          id?: string
          period?: string | null
          spot_id?: string | null
          status?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "beach_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beach_bookings_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "beach_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      beach_passes: {
        Row: {
          client_name: string
          client_phone: string | null
          company_id: string
          end_date: string | null
          id: string
          is_active: boolean | null
          pass_type: string | null
          price: number | null
          spot_id: string | null
          start_date: string | null
        }
        Insert: {
          client_name: string
          client_phone?: string | null
          company_id: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          pass_type?: string | null
          price?: number | null
          spot_id?: string | null
          start_date?: string | null
        }
        Update: {
          client_name?: string
          client_phone?: string | null
          company_id?: string
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          pass_type?: string | null
          price?: number | null
          spot_id?: string | null
          start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beach_passes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "beach_passes_spot_id_fkey"
            columns: ["spot_id"]
            isOneToOne: false
            referencedRelation: "beach_spots"
            referencedColumns: ["id"]
          },
        ]
      }
      beach_spots: {
        Row: {
          company_id: string
          id: string
          is_active: boolean | null
          price_afternoon: number | null
          price_daily: number | null
          price_morning: number | null
          row_letter: string
          spot_number: number
          spot_type: string | null
        }
        Insert: {
          company_id: string
          id?: string
          is_active?: boolean | null
          price_afternoon?: number | null
          price_daily?: number | null
          price_morning?: number | null
          row_letter: string
          spot_number: number
          spot_type?: string | null
        }
        Update: {
          company_id?: string
          id?: string
          is_active?: boolean | null
          price_afternoon?: number | null
          price_daily?: number | null
          price_morning?: number | null
          row_letter?: string
          spot_number?: number
          spot_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beach_spots_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      boat_prices: {
        Row: {
          children_price: number | null
          created_at: string
          destination_id: string
          group_price: number | null
          id: string
          standard_price: number | null
          updated_at: string
        }
        Insert: {
          children_price?: number | null
          created_at?: string
          destination_id: string
          group_price?: number | null
          id?: string
          standard_price?: number | null
          updated_at?: string
        }
        Update: {
          children_price?: number | null
          created_at?: string
          destination_id?: string
          group_price?: number | null
          id?: string
          standard_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "boat_prices_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: true
            referencedRelation: "ncc_destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      business_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          company_id: string
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string
          trial_start: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          company_id: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string
          trial_start?: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          company_id?: string
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string
          trial_start?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          is_from_restaurant: boolean
          message: string
          restaurant_id: string
          sender_id: string | null
          sender_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_from_restaurant?: boolean
          message: string
          restaurant_id: string
          sender_id?: string | null
          sender_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_from_restaurant?: boolean
          message?: string
          restaurant_id?: string
          sender_id?: string | null
          sender_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          capacity: number | null
          company_id: string
          created_at: string
          day_of_week: string | null
          duration_minutes: number | null
          enrolled: number | null
          id: string
          instructor: string | null
          is_active: boolean | null
          name: string
          time: string | null
        }
        Insert: {
          capacity?: number | null
          company_id: string
          created_at?: string
          day_of_week?: string | null
          duration_minutes?: number | null
          enrolled?: number | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          name: string
          time?: string | null
        }
        Update: {
          capacity?: number | null
          company_id?: string
          created_at?: string
          day_of_week?: string | null
          duration_minutes?: number | null
          enrolled?: number | null
          id?: string
          instructor?: string | null
          is_active?: boolean | null
          name?: string
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "classes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      clock_entries: {
        Row: {
          clock_in: string
          clock_out: string | null
          company_id: string
          created_at: string
          id: string
          staff_id: string
        }
        Insert: {
          clock_in?: string
          clock_out?: string | null
          company_id: string
          created_at?: string
          id?: string
          staff_id: string
        }
        Update: {
          clock_in?: string
          clock_out?: string | null
          company_id?: string
          created_at?: string
          id?: string
          staff_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clock_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clock_entries_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      command_audit_log: {
        Row: {
          actions_executed: Json
          created_at: string
          error_message: string | null
          id: string
          parsed_intent: Json
          raw_command: string
          resource_id: string
          sender_phone: string | null
          source: string
          status: string
          tenant_id: string
          tenant_type: string
        }
        Insert: {
          actions_executed?: Json
          created_at?: string
          error_message?: string | null
          id?: string
          parsed_intent?: Json
          raw_command: string
          resource_id: string
          sender_phone?: string | null
          source?: string
          status?: string
          tenant_id: string
          tenant_type?: string
        }
        Update: {
          actions_executed?: Json
          created_at?: string
          error_message?: string | null
          id?: string
          parsed_intent?: Json
          raw_command?: string
          resource_id?: string
          sender_phone?: string | null
          source?: string
          status?: string
          tenant_id?: string
          tenant_type?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          acquired_by_partner_id: string | null
          acquired_by_sub_partner_id: string | null
          address: string | null
          blocked_reason: string | null
          city: string | null
          created_at: string
          email: string | null
          font_family: string | null
          id: string
          industry: string
          is_active: boolean
          is_blocked: boolean
          logo_url: string | null
          modules_config: Json | null
          modules_enabled: string[] | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          primary_color: string | null
          secondary_color: string | null
          selected_installments: number | null
          selected_plan: string | null
          setup_paid: boolean
          setup_paid_at: string | null
          slug: string
          social_links: Json | null
          stripe_setup_session_id: string | null
          subscription_plan: string
          tagline: string | null
          theme_config: Json | null
          updated_at: string
        }
        Insert: {
          acquired_by_partner_id?: string | null
          acquired_by_sub_partner_id?: string | null
          address?: string | null
          blocked_reason?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          font_family?: string | null
          id?: string
          industry?: string
          is_active?: boolean
          is_blocked?: boolean
          logo_url?: string | null
          modules_config?: Json | null
          modules_enabled?: string[] | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          selected_installments?: number | null
          selected_plan?: string | null
          setup_paid?: boolean
          setup_paid_at?: string | null
          slug: string
          social_links?: Json | null
          stripe_setup_session_id?: string | null
          subscription_plan?: string
          tagline?: string | null
          theme_config?: Json | null
          updated_at?: string
        }
        Update: {
          acquired_by_partner_id?: string | null
          acquired_by_sub_partner_id?: string | null
          address?: string | null
          blocked_reason?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          font_family?: string | null
          id?: string
          industry?: string
          is_active?: boolean
          is_blocked?: boolean
          logo_url?: string | null
          modules_config?: Json | null
          modules_enabled?: string[] | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          selected_installments?: number | null
          selected_plan?: string | null
          setup_paid?: boolean
          setup_paid_at?: string | null
          slug?: string
          social_links?: Json | null
          stripe_setup_session_id?: string | null
          subscription_plan?: string
          tagline?: string | null
          theme_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      company_memberships: {
        Row: {
          company_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_memberships_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_modules: {
        Row: {
          activated_at: string
          company_id: string
          id: string
          module_id: string
        }
        Insert: {
          activated_at?: string
          company_id: string
          id?: string
          module_id: string
        }
        Update: {
          activated_at?: string
          company_id?: string
          id?: string
          module_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_modules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_modules_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "marketplace_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          bookings_enabled: boolean | null
          company_id: string
          confirmation_message: string | null
          created_at: string
          currency: string | null
          deposit_percentage: number | null
          email_template: string | null
          facebook_url: string | null
          hours: string | null
          id: string
          instagram_url: string | null
          require_deposit: boolean | null
          updated_at: string
          vat: string | null
          whatsapp: string | null
        }
        Insert: {
          bookings_enabled?: boolean | null
          company_id: string
          confirmation_message?: string | null
          created_at?: string
          currency?: string | null
          deposit_percentage?: number | null
          email_template?: string | null
          facebook_url?: string | null
          hours?: string | null
          id?: string
          instagram_url?: string | null
          require_deposit?: boolean | null
          updated_at?: string
          vat?: string | null
          whatsapp?: string | null
        }
        Update: {
          bookings_enabled?: boolean | null
          company_id?: string
          confirmation_message?: string | null
          created_at?: string
          currency?: string | null
          deposit_percentage?: number | null
          email_template?: string | null
          facebook_url?: string | null
          hours?: string | null
          id?: string
          instagram_url?: string | null
          require_deposit?: boolean | null
          updated_at?: string
          vat?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      content_blocks: {
        Row: {
          company_id: string
          field_key: string
          id: string
          section: string
          updated_at: string
          value: string | null
        }
        Insert: {
          company_id: string
          field_key: string
          id?: string
          section: string
          updated_at?: string
          value?: string | null
        }
        Update: {
          company_id?: string
          field_key?: string
          id?: string
          section?: string
          updated_at?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_catalog_audit: {
        Row: {
          action_code: string | null
          changed_at: string
          changed_by: string | null
          field_changed: string
          id: string
          new_value: string | null
          old_value: string | null
          row_id: string
          table_name: string
        }
        Insert: {
          action_code?: string | null
          changed_at?: string
          changed_by?: string | null
          field_changed: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          row_id: string
          table_name: string
        }
        Update: {
          action_code?: string | null
          changed_at?: string
          changed_by?: string | null
          field_changed?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          row_id?: string
          table_name?: string
        }
        Relationships: []
      }
      cost_reconciliation_snapshots: {
        Row: {
          amount_eur: number
          amount_usd: number | null
          created_at: string
          created_by: string | null
          events_count: number
          id: string
          metadata: Json
          period_days: number
          period_end: string
          period_start: string
          source: string
        }
        Insert: {
          amount_eur?: number
          amount_usd?: number | null
          created_at?: string
          created_by?: string | null
          events_count?: number
          id?: string
          metadata?: Json
          period_days: number
          period_end?: string
          period_start: string
          source: string
        }
        Update: {
          amount_eur?: number
          amount_usd?: number | null
          created_at?: string
          created_by?: string | null
          events_count?: number
          id?: string
          metadata?: Json
          period_days?: number
          period_end?: string
          period_start?: string
          source?: string
        }
        Relationships: []
      }
      crm_clients: {
        Row: {
          address: string | null
          city: string | null
          company_id: string
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string | null
          notes: string | null
          notes_technical: string | null
          phone: string | null
          total_spent: number | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          company_id: string
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name?: string | null
          notes?: string | null
          notes_technical?: string | null
          phone?: string | null
          total_spent?: number | null
        }
        Update: {
          address?: string | null
          city?: string | null
          company_id?: string
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string | null
          notes?: string | null
          notes_technical?: string | null
          phone?: string | null
          total_spent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      cross_sells: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          icon_emoji: string | null
          id: string
          is_active: boolean | null
          is_free: boolean | null
          price: number | null
          shown_to: string | null
          sort_order: number | null
          title: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          price?: number | null
          shown_to?: string | null
          sort_order?: number | null
          title: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          icon_emoji?: string | null
          id?: string
          is_active?: boolean | null
          is_free?: boolean | null
          price?: number | null
          shown_to?: string | null
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "cross_sells_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_activity: {
        Row: {
          created_at: string
          customer_name: string | null
          customer_phone: string
          discount_sent: boolean
          discount_sent_at: string | null
          id: string
          last_order_at: string
          restaurant_id: string
          total_orders: number
          total_spent: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name?: string | null
          customer_phone: string
          discount_sent?: boolean
          discount_sent_at?: string | null
          id?: string
          last_order_at?: string
          restaurant_id: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string | null
          customer_phone?: string
          discount_sent?: boolean
          discount_sent_at?: string | null
          id?: string
          last_order_at?: string
          restaurant_id?: string
          total_orders?: number
          total_spent?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_activity_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_blacklist: {
        Row: {
          blocked_at: string
          blocked_by: string | null
          customer_name: string | null
          customer_phone: string
          id: string
          is_active: boolean
          reason: string | null
          restaurant_id: string
        }
        Insert: {
          blocked_at?: string
          blocked_by?: string | null
          customer_name?: string | null
          customer_phone: string
          id?: string
          is_active?: boolean
          reason?: string | null
          restaurant_id: string
        }
        Update: {
          blocked_at?: string
          blocked_by?: string | null
          customer_name?: string | null
          customer_phone?: string
          id?: string
          is_active?: boolean
          reason?: string | null
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_blacklist_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_credit_usage: {
        Row: {
          action: string
          action_label: string | null
          cost_eur_estimate: number | null
          created_at: string
          credits_used: number
          expires_at: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action?: string
          action_label?: string | null
          cost_eur_estimate?: number | null
          created_at?: string
          credits_used?: number
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          action_label?: string | null
          cost_eur_estimate?: number | null
          created_at?: string
          credits_used?: number
          expires_at?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      demo_factory_runs: {
        Row: {
          admin_email: string | null
          admin_password: string | null
          admin_url: string | null
          agents_status: Json
          brand_kit: Json | null
          call_script: Json | null
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          lead_id: string | null
          objections: Json | null
          owner_id: string
          preview_url: string | null
          scraped_data: Json | null
          started_at: string
          status: string
          sub_sector: string | null
          template_variant: string | null
          updated_at: string
          whatsapp_link: string | null
          whatsapp_message: string | null
        }
        Insert: {
          admin_email?: string | null
          admin_password?: string | null
          admin_url?: string | null
          agents_status?: Json
          brand_kit?: Json | null
          call_script?: Json | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          objections?: Json | null
          owner_id: string
          preview_url?: string | null
          scraped_data?: Json | null
          started_at?: string
          status?: string
          sub_sector?: string | null
          template_variant?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          admin_email?: string | null
          admin_password?: string | null
          admin_url?: string | null
          agents_status?: Json
          brand_kit?: Json | null
          call_script?: Json | null
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          lead_id?: string | null
          objections?: Json | null
          owner_id?: string
          preview_url?: string | null
          scraped_data?: Json | null
          started_at?: string
          status?: string
          sub_sector?: string | null
          template_variant?: string | null
          updated_at?: string
          whatsapp_link?: string | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      demo_site_analytics: {
        Row: {
          created_at: string
          demo_site_id: string
          event_metadata: Json | null
          event_type: string
          id: string
          referrer: string | null
          session_duration_ms: number | null
          user_agent: string | null
          visitor_ip: string | null
        }
        Insert: {
          created_at?: string
          demo_site_id: string
          event_metadata?: Json | null
          event_type: string
          id?: string
          referrer?: string | null
          session_duration_ms?: number | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Update: {
          created_at?: string
          demo_site_id?: string
          event_metadata?: Json | null
          event_type?: string
          id?: string
          referrer?: string | null
          session_duration_ms?: number | null
          user_agent?: string | null
          visitor_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_site_analytics_demo_site_id_fkey"
            columns: ["demo_site_id"]
            isOneToOne: false
            referencedRelation: "demo_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_site_blueprints: {
        Row: {
          created_at: string
          default_colors: Json | null
          default_fonts: Json | null
          display_order: number | null
          functional_modules: Json
          id: string
          is_active: boolean
          name: string
          preview_thumbnail_url: string | null
          required_agents: Json
          sector: string
          seed_schema: Json
          slug: string
          sub_sectors: string[] | null
          template_variants: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_colors?: Json | null
          default_fonts?: Json | null
          display_order?: number | null
          functional_modules?: Json
          id?: string
          is_active?: boolean
          name: string
          preview_thumbnail_url?: string | null
          required_agents?: Json
          sector: string
          seed_schema?: Json
          slug: string
          sub_sectors?: string[] | null
          template_variants?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_colors?: Json | null
          default_fonts?: Json | null
          display_order?: number | null
          functional_modules?: Json
          id?: string
          is_active?: boolean
          name?: string
          preview_thumbnail_url?: string | null
          required_agents?: Json
          sector?: string
          seed_schema?: Json
          slug?: string
          sub_sectors?: string[] | null
          template_variants?: Json
          updated_at?: string
        }
        Relationships: []
      }
      demo_sites: {
        Row: {
          ab_test_group: string | null
          admin_email: string | null
          admin_password: string | null
          admin_url: string | null
          agents_activated: Json | null
          archived_at: string | null
          blueprint_id: string | null
          branding_snapshot: Json
          business_name: string
          conversion_status: string | null
          converted_at: string | null
          created_at: string
          cta_click_count: number
          generated_at: string | null
          generation_duration_ms: number | null
          generation_error: string | null
          id: string
          last_viewed_at: string | null
          lead_id: string | null
          modules_enabled: Json | null
          owner_id: string
          preview_url: string | null
          public_slug: string
          reuse_count: number
          reuse_source_id: string | null
          scraped_data: Json | null
          sector: string
          status: string
          sub_sector: string | null
          template_variant: string | null
          updated_at: string
          view_count: number
          whatsapp_link: string | null
          whatsapp_message: string | null
        }
        Insert: {
          ab_test_group?: string | null
          admin_email?: string | null
          admin_password?: string | null
          admin_url?: string | null
          agents_activated?: Json | null
          archived_at?: string | null
          blueprint_id?: string | null
          branding_snapshot?: Json
          business_name: string
          conversion_status?: string | null
          converted_at?: string | null
          created_at?: string
          cta_click_count?: number
          generated_at?: string | null
          generation_duration_ms?: number | null
          generation_error?: string | null
          id?: string
          last_viewed_at?: string | null
          lead_id?: string | null
          modules_enabled?: Json | null
          owner_id: string
          preview_url?: string | null
          public_slug: string
          reuse_count?: number
          reuse_source_id?: string | null
          scraped_data?: Json | null
          sector: string
          status?: string
          sub_sector?: string | null
          template_variant?: string | null
          updated_at?: string
          view_count?: number
          whatsapp_link?: string | null
          whatsapp_message?: string | null
        }
        Update: {
          ab_test_group?: string | null
          admin_email?: string | null
          admin_password?: string | null
          admin_url?: string | null
          agents_activated?: Json | null
          archived_at?: string | null
          blueprint_id?: string | null
          branding_snapshot?: Json
          business_name?: string
          conversion_status?: string | null
          converted_at?: string | null
          created_at?: string
          cta_click_count?: number
          generated_at?: string | null
          generation_duration_ms?: number | null
          generation_error?: string | null
          id?: string
          last_viewed_at?: string | null
          lead_id?: string | null
          modules_enabled?: Json | null
          owner_id?: string
          preview_url?: string | null
          public_slug?: string
          reuse_count?: number
          reuse_source_id?: string | null
          scraped_data?: Json | null
          sector?: string
          status?: string
          sub_sector?: string | null
          template_variant?: string | null
          updated_at?: string
          view_count?: number
          whatsapp_link?: string | null
          whatsapp_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_sites_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "demo_site_blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "demo_sites_reuse_source_id_fkey"
            columns: ["reuse_source_id"]
            isOneToOne: false
            referencedRelation: "demo_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          company_id: string
          cqc_expiry: string | null
          created_at: string
          email: string | null
          first_name: string
          has_cqc: boolean | null
          id: string
          languages: string[] | null
          last_name: string
          license_expiry: string
          license_number: string
          notes: string | null
          phone: string
          photo_url: string | null
          preferred_vehicle_id: string | null
          rating_avg: number | null
          status: string
        }
        Insert: {
          company_id: string
          cqc_expiry?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          has_cqc?: boolean | null
          id?: string
          languages?: string[] | null
          last_name: string
          license_expiry: string
          license_number: string
          notes?: string | null
          phone: string
          photo_url?: string | null
          preferred_vehicle_id?: string | null
          rating_avg?: number | null
          status?: string
        }
        Update: {
          company_id?: string
          cqc_expiry?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          has_cqc?: boolean | null
          id?: string
          languages?: string[] | null
          last_name?: string
          license_expiry?: string
          license_number?: string
          notes?: string | null
          phone?: string
          photo_url?: string | null
          preferred_vehicle_id?: string | null
          rating_avg?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_preferred_vehicle_id_fkey"
            columns: ["preferred_vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      empire_brain_agents: {
        Row: {
          ai_model: string | null
          avg_duration_ms: number | null
          category_code: string
          category_label: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          is_orchestrator: boolean | null
          model_preference: string | null
          name: string
          slug: string
          system_prompt: string
          tools: string | null
          total_runs: number | null
          total_success: number | null
          updated_at: string | null
        }
        Insert: {
          ai_model?: string | null
          avg_duration_ms?: number | null
          category_code: string
          category_label: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_orchestrator?: boolean | null
          model_preference?: string | null
          name: string
          slug: string
          system_prompt: string
          tools?: string | null
          total_runs?: number | null
          total_success?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_model?: string | null
          avg_duration_ms?: number | null
          category_code?: string
          category_label?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_orchestrator?: boolean | null
          model_preference?: string | null
          name?: string
          slug?: string
          system_prompt?: string
          tools?: string | null
          total_runs?: number | null
          total_success?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      empire_brain_messages: {
        Row: {
          agent_name: string
          agent_slug: string
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          input_payload: Json | null
          output_data: Json | null
          output_text: string | null
          role: string
          run_id: string
          status: string
          step_index: number
        }
        Insert: {
          agent_name: string
          agent_slug: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json | null
          output_data?: Json | null
          output_text?: string | null
          role?: string
          run_id: string
          status?: string
          step_index: number
        }
        Update: {
          agent_name?: string
          agent_slug?: string
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json | null
          output_data?: Json | null
          output_text?: string | null
          role?: string
          run_id?: string
          status?: string
          step_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "empire_brain_messages_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "empire_brain_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      empire_brain_runs: {
        Row: {
          agents_used: string[] | null
          completed_at: string | null
          completed_steps: number | null
          created_at: string | null
          created_by: string | null
          duration_ms: number | null
          error_message: string | null
          final_output: string | null
          id: string
          orchestrator_plan: Json | null
          schedule_id: string | null
          shared_context: Json | null
          status: string
          task_input: string
          task_title: string
          total_steps: number | null
          trigger_source: string
        }
        Insert: {
          agents_used?: string[] | null
          completed_at?: string | null
          completed_steps?: number | null
          created_at?: string | null
          created_by?: string | null
          duration_ms?: number | null
          error_message?: string | null
          final_output?: string | null
          id?: string
          orchestrator_plan?: Json | null
          schedule_id?: string | null
          shared_context?: Json | null
          status?: string
          task_input: string
          task_title: string
          total_steps?: number | null
          trigger_source?: string
        }
        Update: {
          agents_used?: string[] | null
          completed_at?: string | null
          completed_steps?: number | null
          created_at?: string | null
          created_by?: string | null
          duration_ms?: number | null
          error_message?: string | null
          final_output?: string | null
          id?: string
          orchestrator_plan?: Json | null
          schedule_id?: string | null
          shared_context?: Json | null
          status?: string
          task_input?: string
          task_title?: string
          total_steps?: number | null
          trigger_source?: string
        }
        Relationships: []
      }
      empire_brain_schedules: {
        Row: {
          created_at: string | null
          created_by: string | null
          cron_expression: string
          id: string
          is_active: boolean | null
          last_run_at: string | null
          last_run_status: string | null
          next_run_at: string | null
          preferred_agents: string[] | null
          task_input: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cron_expression: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          preferred_agents?: string[] | null
          task_input: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cron_expression?: string
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          last_run_status?: string | null
          next_run_at?: string | null
          preferred_agents?: string[] | null
          task_input?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      extra_prices: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_percentage: boolean | null
          key: string
          label: string
          value: number
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_percentage?: boolean | null
          key: string
          label?: string
          value?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_percentage?: boolean | null
          key?: string
          label?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "extra_prices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      faq_items: {
        Row: {
          answer: string
          company_id: string
          created_at: string
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
        }
        Insert: {
          answer: string
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
        }
        Update: {
          answer?: string
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "faq_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_request_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          request_id: string
          sender_id: string | null
          sender_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          request_id: string
          sender_id?: string | null
          sender_type?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          request_id?: string
          sender_id?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feature_request_messages_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "feature_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      feature_requests: {
        Row: {
          admin_notes: string | null
          company_id: string
          created_at: string
          deployed_at: string | null
          description: string | null
          estimated_price: number | null
          id: string
          priority: string | null
          reply_message: string | null
          sector: string | null
          status: string
          title: string
          updated_at: string | null
          votes: number | null
        }
        Insert: {
          admin_notes?: string | null
          company_id: string
          created_at?: string
          deployed_at?: string | null
          description?: string | null
          estimated_price?: number | null
          id?: string
          priority?: string | null
          reply_message?: string | null
          sector?: string | null
          status?: string
          title: string
          updated_at?: string | null
          votes?: number | null
        }
        Update: {
          admin_notes?: string | null
          company_id?: string
          created_at?: string
          deployed_at?: string | null
          description?: string | null
          estimated_price?: number | null
          id?: string
          priority?: string | null
          reply_message?: string | null
          sector?: string | null
          status?: string
          title?: string
          updated_at?: string | null
          votes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fisco_configs: {
        Row: {
          api_key_encrypted: string | null
          api_key_secondary_encrypted: string | null
          auto_send_enabled: boolean
          configured: boolean
          configured_by: string | null
          disclaimer_accepted: boolean
          disclaimer_accepted_at: string | null
          id: string
          provider: string
          provider_secondary: string | null
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          api_key_encrypted?: string | null
          api_key_secondary_encrypted?: string | null
          auto_send_enabled?: boolean
          configured?: boolean
          configured_by?: string | null
          disclaimer_accepted?: boolean
          disclaimer_accepted_at?: string | null
          id?: string
          provider?: string
          provider_secondary?: string | null
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          api_key_encrypted?: string | null
          api_key_secondary_encrypted?: string | null
          auto_send_enabled?: boolean
          configured?: boolean
          configured_by?: string | null
          disclaimer_accepted?: boolean
          disclaimer_accepted_at?: string | null
          id?: string
          provider?: string
          provider_secondary?: string | null
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fisco_configs_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      fleet_vehicles: {
        Row: {
          base_price: number | null
          brand: string | null
          capacity: number
          category: string
          company_id: string
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          image_url: string | null
          insurance_expiry: string | null
          is_active: boolean
          is_popular: boolean | null
          license_plate: string | null
          luggage_capacity: number | null
          maintenance_notes: string | null
          max_pax: number | null
          min_pax: number | null
          model: string | null
          name: string
          plate: string | null
          price_per_km: number | null
          revision_expiry: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          base_price?: number | null
          brand?: string | null
          capacity?: number
          category?: string
          company_id: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          is_active?: boolean
          is_popular?: boolean | null
          license_plate?: string | null
          luggage_capacity?: number | null
          maintenance_notes?: string | null
          max_pax?: number | null
          min_pax?: number | null
          model?: string | null
          name: string
          plate?: string | null
          price_per_km?: number | null
          revision_expiry?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          base_price?: number | null
          brand?: string | null
          capacity?: number
          category?: string
          company_id?: string
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          image_url?: string | null
          insurance_expiry?: string | null
          is_active?: boolean
          is_popular?: boolean | null
          license_plate?: string | null
          luggage_capacity?: number | null
          maintenance_notes?: string | null
          max_pax?: number | null
          min_pax?: number | null
          model?: string | null
          name?: string
          plate?: string | null
          price_per_km?: number | null
          revision_expiry?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fleet_vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      gdpr_consents: {
        Row: {
          consent_analytics: boolean
          consent_marketing: boolean
          consent_necessary: boolean
          created_at: string
          id: string
          ip_hash: string | null
          restaurant_id: string | null
          session_id: string
          updated_at: string
        }
        Insert: {
          consent_analytics?: boolean
          consent_marketing?: boolean
          consent_necessary?: boolean
          created_at?: string
          id?: string
          ip_hash?: string | null
          restaurant_id?: string | null
          session_id: string
          updated_at?: string
        }
        Update: {
          consent_analytics?: boolean
          consent_marketing?: boolean
          consent_necessary?: boolean
          created_at?: string
          id?: string
          ip_hash?: string | null
          restaurant_id?: string | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gdpr_consents_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      haccp_logs: {
        Row: {
          check_type: string
          checked_at: string
          company_id: string
          created_at: string
          id: string
          notes: string | null
          operator_name: string
          result: string
          temperature: number | null
        }
        Insert: {
          check_type: string
          checked_at?: string
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          operator_name: string
          result?: string
          temperature?: number | null
        }
        Update: {
          check_type?: string
          checked_at?: string
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          operator_name?: string
          result?: string
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "haccp_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      homepage_content: {
        Row: {
          content: Json
          created_at: string
          id: string
          published_content: Json
          singleton: boolean
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          published_content?: Json
          singleton?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          published_content?: Json
          singleton?: boolean
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      homepage_media: {
        Row: {
          category: string
          created_at: string
          description: string | null
          focal_x: number | null
          focal_y: number | null
          height: number | null
          id: string
          is_video: boolean | null
          mime_type: string | null
          poster_url: string | null
          public_url: string
          size_bytes: number | null
          storage_path: string
          tags: string[] | null
          title: string | null
          updated_at: string
          uploaded_by: string | null
          width: number | null
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          focal_x?: number | null
          focal_y?: number | null
          height?: number | null
          id?: string
          is_video?: boolean | null
          mime_type?: string | null
          poster_url?: string | null
          public_url: string
          size_bytes?: number | null
          storage_path: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          focal_x?: number | null
          focal_y?: number | null
          height?: number | null
          id?: string
          is_video?: boolean | null
          mime_type?: string | null
          poster_url?: string | null
          public_url?: string
          size_bytes?: number | null
          storage_path?: string
          tags?: string[] | null
          title?: string | null
          updated_at?: string
          uploaded_by?: string | null
          width?: number | null
        }
        Relationships: []
      }
      infrastructure_costs: {
        Row: {
          category: string
          code: string
          cost_model: string
          created_at: string
          id: string
          is_active: boolean
          label: string
          monthly_estimate_eur: number | null
          notes: string | null
          provider: string | null
          unit: string | null
          unit_cost_eur: number
          updated_at: string
        }
        Insert: {
          category?: string
          code: string
          cost_model?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label: string
          monthly_estimate_eur?: number | null
          notes?: string | null
          provider?: string | null
          unit?: string | null
          unit_cost_eur?: number
          updated_at?: string
        }
        Update: {
          category?: string
          code?: string
          cost_model?: string
          created_at?: string
          id?: string
          is_active?: boolean
          label?: string
          monthly_estimate_eur?: number | null
          notes?: string | null
          provider?: string | null
          unit?: string | null
          unit_cost_eur?: number
          updated_at?: string
        }
        Relationships: []
      }
      interventions: {
        Row: {
          address: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string | null
          estimated_price: number | null
          final_price: number | null
          id: string
          intervention_type: string
          notes: string | null
          photos_json: Json | null
          scheduled_at: string | null
          status: string | null
          technician_name: string | null
          updated_at: string | null
          urgency: string | null
        }
        Insert: {
          address?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          intervention_type: string
          notes?: string | null
          photos_json?: Json | null
          scheduled_at?: string | null
          status?: string | null
          technician_name?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Update: {
          address?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string | null
          estimated_price?: number | null
          final_price?: number | null
          id?: string
          intervention_type?: string
          notes?: string | null
          photos_json?: Json | null
          scheduled_at?: string | null
          status?: string | null
          technician_name?: string | null
          updated_at?: string | null
          urgency?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interventions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          category: string
          cost_per_unit: number
          created_at: string
          id: string
          is_active: boolean
          last_restocked_at: string | null
          min_qty: number
          name: string
          notes: string | null
          par_qty: number
          restaurant_id: string
          sku: string | null
          stock_qty: number
          supplier_id: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string
          cost_per_unit?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_restocked_at?: string | null
          min_qty?: number
          name: string
          notes?: string | null
          par_qty?: number
          restaurant_id: string
          sku?: string | null
          stock_qty?: number
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          cost_per_unit?: number
          created_at?: string
          id?: string
          is_active?: boolean
          last_restocked_at?: string | null
          min_qty?: number
          name?: string
          notes?: string | null
          par_qty?: number
          restaurant_id?: string
          sku?: string | null
          stock_qty?: number
          supplier_id?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "restock_suggestions"
            referencedColumns: ["supplier_id"]
          },
          {
            foreignKeyName: "inventory_items_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          id: string
          item_id: string
          movement_type: string
          performed_by: string | null
          quantity: number
          reason: string | null
          reference: string | null
          restaurant_id: string
          unit_cost: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          movement_type: string
          performed_by?: string | null
          quantity: number
          reason?: string | null
          reference?: string | null
          restaurant_id: string
          unit_cost?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          movement_type?: string
          performed_by?: string | null
          quantity?: number
          reason?: string | null
          reference?: string | null
          restaurant_id?: string
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "restock_suggestions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      kitchen_access_pins: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          label: string | null
          pin_code: string
          restaurant_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          pin_code: string
          restaurant_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          label?: string | null
          pin_code?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kitchen_access_pins_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_automations: {
        Row: {
          ai_time_optimize: boolean | null
          channel: string | null
          company_id: string
          created_at: string | null
          day_of_week: string | null
          description: string | null
          exact_time: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          last_run_at: string | null
          max_per_run: number | null
          min_score: number | null
          name: string
          skip_if_replied: boolean | null
          target_sector: string | null
          target_stage: string | null
          time_slot: string | null
          total_sent: number | null
        }
        Insert: {
          ai_time_optimize?: boolean | null
          channel?: string | null
          company_id: string
          created_at?: string | null
          day_of_week?: string | null
          description?: string | null
          exact_time?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_per_run?: number | null
          min_score?: number | null
          name: string
          skip_if_replied?: boolean | null
          target_sector?: string | null
          target_stage?: string | null
          time_slot?: string | null
          total_sent?: number | null
        }
        Update: {
          ai_time_optimize?: boolean | null
          channel?: string | null
          company_id?: string
          created_at?: string | null
          day_of_week?: string | null
          description?: string | null
          exact_time?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          last_run_at?: string | null
          max_per_run?: number | null
          min_score?: number | null
          name?: string
          skip_if_replied?: boolean | null
          target_sector?: string | null
          target_stage?: string | null
          time_slot?: string | null
          total_sent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_automations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_campaigns: {
        Row: {
          channel: string | null
          company_id: string
          created_at: string | null
          description: string | null
          id: string
          min_score: number | null
          name: string
          opened_count: number | null
          reply_count: number | null
          sent_count: number | null
          status: string | null
          target_city: string | null
          target_leads_count: number | null
          target_sector: string | null
          template_text: string | null
          updated_at: string | null
        }
        Insert: {
          channel?: string | null
          company_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          min_score?: number | null
          name: string
          opened_count?: number | null
          reply_count?: number | null
          sent_count?: number | null
          status?: string | null
          target_city?: string | null
          target_leads_count?: number | null
          target_sector?: string | null
          template_text?: string | null
          updated_at?: string | null
        }
        Update: {
          channel?: string | null
          company_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          min_score?: number | null
          name?: string
          opened_count?: number | null
          reply_count?: number | null
          sent_count?: number | null
          status?: string | null
          target_city?: string | null
          target_leads_count?: number | null
          target_sector?: string | null
          template_text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_campaigns_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_enrichment_cache: {
        Row: {
          cache_key: string
          city: string | null
          created_at: string | null
          expires_at: string | null
          facebook_url: string | null
          has_facebook: boolean | null
          has_instagram: boolean | null
          has_website: boolean | null
          hot_score: number | null
          id: string
          instagram_url: string | null
          lead_name: string
          paginegialle_listing: boolean | null
          piva: string | null
          raw_data: Json | null
          registro_imprese_status: string | null
          tripadvisor_rating: number | null
          tripadvisor_reviews: number | null
          yelp_rating: number | null
          yelp_reviews: number | null
        }
        Insert: {
          cache_key: string
          city?: string | null
          created_at?: string | null
          expires_at?: string | null
          facebook_url?: string | null
          has_facebook?: boolean | null
          has_instagram?: boolean | null
          has_website?: boolean | null
          hot_score?: number | null
          id?: string
          instagram_url?: string | null
          lead_name: string
          paginegialle_listing?: boolean | null
          piva?: string | null
          raw_data?: Json | null
          registro_imprese_status?: string | null
          tripadvisor_rating?: number | null
          tripadvisor_reviews?: number | null
          yelp_rating?: number | null
          yelp_reviews?: number | null
        }
        Update: {
          cache_key?: string
          city?: string | null
          created_at?: string | null
          expires_at?: string | null
          facebook_url?: string | null
          has_facebook?: boolean | null
          has_instagram?: boolean | null
          has_website?: boolean | null
          hot_score?: number | null
          id?: string
          instagram_url?: string | null
          lead_name?: string
          paginegialle_listing?: boolean | null
          piva?: string | null
          raw_data?: Json | null
          registro_imprese_status?: string | null
          tripadvisor_rating?: number | null
          tripadvisor_reviews?: number | null
          yelp_rating?: number | null
          yelp_reviews?: number | null
        }
        Relationships: []
      }
      lead_intelligence_reports: {
        Row: {
          ai_model_used: string | null
          approach_strategy: string | null
          brand_colors: Json | null
          brand_fonts: Json | null
          brand_logo_url: string | null
          brand_photos: Json | null
          brand_video_frames: Json | null
          brand_videos: Json | null
          cache_key: string
          category: string
          category_reason: string | null
          created_at: string
          credits_spent: number | null
          expires_at: string
          extracted_business_data: Json | null
          google_rating: number | null
          google_reviews_count: number | null
          has_facebook: boolean | null
          has_instagram: boolean | null
          has_website: boolean | null
          id: string
          improvement_proposal: string | null
          lead_city: string | null
          lead_name: string
          lead_phone: string | null
          lead_sector: string | null
          lead_website: string | null
          missing_features: Json | null
          mockup_after_url: string | null
          mockup_before_url: string | null
          mockup_generated_at: string | null
          owner_id: string
          raw_analysis: Json | null
          recommended_package: string | null
          reputation_issues: Json | null
          reputation_score: number | null
          sales_pitch: string | null
          social_engagement_score: number | null
          social_handles: Json | null
          social_issues: Json | null
          updated_at: string
          vendibility_score: number
          weak_points: Json | null
          website_issues: Json | null
          website_quality_score: number | null
        }
        Insert: {
          ai_model_used?: string | null
          approach_strategy?: string | null
          brand_colors?: Json | null
          brand_fonts?: Json | null
          brand_logo_url?: string | null
          brand_photos?: Json | null
          brand_video_frames?: Json | null
          brand_videos?: Json | null
          cache_key: string
          category?: string
          category_reason?: string | null
          created_at?: string
          credits_spent?: number | null
          expires_at?: string
          extracted_business_data?: Json | null
          google_rating?: number | null
          google_reviews_count?: number | null
          has_facebook?: boolean | null
          has_instagram?: boolean | null
          has_website?: boolean | null
          id?: string
          improvement_proposal?: string | null
          lead_city?: string | null
          lead_name: string
          lead_phone?: string | null
          lead_sector?: string | null
          lead_website?: string | null
          missing_features?: Json | null
          mockup_after_url?: string | null
          mockup_before_url?: string | null
          mockup_generated_at?: string | null
          owner_id: string
          raw_analysis?: Json | null
          recommended_package?: string | null
          reputation_issues?: Json | null
          reputation_score?: number | null
          sales_pitch?: string | null
          social_engagement_score?: number | null
          social_handles?: Json | null
          social_issues?: Json | null
          updated_at?: string
          vendibility_score?: number
          weak_points?: Json | null
          website_issues?: Json | null
          website_quality_score?: number | null
        }
        Update: {
          ai_model_used?: string | null
          approach_strategy?: string | null
          brand_colors?: Json | null
          brand_fonts?: Json | null
          brand_logo_url?: string | null
          brand_photos?: Json | null
          brand_video_frames?: Json | null
          brand_videos?: Json | null
          cache_key?: string
          category?: string
          category_reason?: string | null
          created_at?: string
          credits_spent?: number | null
          expires_at?: string
          extracted_business_data?: Json | null
          google_rating?: number | null
          google_reviews_count?: number | null
          has_facebook?: boolean | null
          has_instagram?: boolean | null
          has_website?: boolean | null
          id?: string
          improvement_proposal?: string | null
          lead_city?: string | null
          lead_name?: string
          lead_phone?: string | null
          lead_sector?: string | null
          lead_website?: string | null
          missing_features?: Json | null
          mockup_after_url?: string | null
          mockup_before_url?: string | null
          mockup_generated_at?: string | null
          owner_id?: string
          raw_analysis?: Json | null
          recommended_package?: string | null
          reputation_issues?: Json | null
          reputation_score?: number | null
          sales_pitch?: string | null
          social_engagement_score?: number | null
          social_handles?: Json | null
          social_issues?: Json | null
          updated_at?: string
          vendibility_score?: number
          weak_points?: Json | null
          website_issues?: Json | null
          website_quality_score?: number | null
        }
        Relationships: []
      }
      lead_outreach_sequences: {
        Row: {
          ai_reasoning: string | null
          channels_priority: string[]
          conversion_signal: string | null
          created_at: string
          current_touch_number: number
          id: string
          last_touch_at: string | null
          lead_id: string
          max_touches: number
          next_touch_at: string | null
          next_touch_channel: string | null
          owner_id: string
          status: string
          strategy: string
          updated_at: string
        }
        Insert: {
          ai_reasoning?: string | null
          channels_priority?: string[]
          conversion_signal?: string | null
          created_at?: string
          current_touch_number?: number
          id?: string
          last_touch_at?: string | null
          lead_id: string
          max_touches?: number
          next_touch_at?: string | null
          next_touch_channel?: string | null
          owner_id: string
          status?: string
          strategy?: string
          updated_at?: string
        }
        Update: {
          ai_reasoning?: string | null
          channels_priority?: string[]
          conversion_signal?: string | null
          created_at?: string
          current_touch_number?: number
          id?: string
          last_touch_at?: string | null
          lead_id?: string
          max_touches?: number
          next_touch_at?: string | null
          next_touch_channel?: string | null
          owner_id?: string
          status?: string
          strategy?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_outreach_sequences_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_outreach_touches: {
        Row: {
          ai_persuasion_score: number | null
          body_html: string | null
          body_text: string | null
          channel: string
          created_at: string
          error_message: string | null
          id: string
          lead_id: string
          manual_dm_url: string | null
          metadata: Json | null
          opened_at: string | null
          owner_id: string
          preview_url: string | null
          provider: string | null
          recipient: string | null
          replied_at: string | null
          scheduled_for: string | null
          sent_at: string | null
          sequence_id: string | null
          status: string
          subject: string | null
          touch_number: number
        }
        Insert: {
          ai_persuasion_score?: number | null
          body_html?: string | null
          body_text?: string | null
          channel: string
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id: string
          manual_dm_url?: string | null
          metadata?: Json | null
          opened_at?: string | null
          owner_id: string
          preview_url?: string | null
          provider?: string | null
          recipient?: string | null
          replied_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          subject?: string | null
          touch_number: number
        }
        Update: {
          ai_persuasion_score?: number | null
          body_html?: string | null
          body_text?: string | null
          channel?: string
          created_at?: string
          error_message?: string | null
          id?: string
          lead_id?: string
          manual_dm_url?: string | null
          metadata?: Json | null
          opened_at?: string | null
          owner_id?: string
          preview_url?: string | null
          provider?: string | null
          recipient?: string | null
          replied_at?: string | null
          scheduled_for?: string | null
          sent_at?: string | null
          sequence_id?: string | null
          status?: string
          subject?: string | null
          touch_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "lead_outreach_touches_sequence_id_fkey"
            columns: ["sequence_id"]
            isOneToOne: false
            referencedRelation: "lead_outreach_sequences"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_search_cache: {
        Row: {
          action: string
          created_at: string
          expires_at: string
          fingerprint: string
          hit_count: number
          id: string
          last_hit_at: string | null
          meta: Json
          result_count: number
          results: Json
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          expires_at?: string
          fingerprint: string
          hit_count?: number
          id?: string
          last_hit_at?: string | null
          meta?: Json
          result_count?: number
          results?: Json
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          expires_at?: string
          fingerprint?: string
          hit_count?: number
          id?: string
          last_hit_at?: string | null
          meta?: Json
          result_count?: number
          results?: Json
          user_id?: string
        }
        Relationships: []
      }
      lead_whatsapp_ab_tests: {
        Row: {
          created_at: string
          id: string
          lead_id: string | null
          lead_name: string
          lead_phone: string | null
          notes: string | null
          owner_id: string
          status: string
          updated_at: string
          variant_a_clicks: number
          variant_a_first_clicked_at: string | null
          variant_a_label: string
          variant_a_last_clicked_at: string | null
          variant_a_message: string
          variant_a_replies: number
          variant_a_short_id: string
          variant_b_clicks: number
          variant_b_first_clicked_at: string | null
          variant_b_label: string
          variant_b_last_clicked_at: string | null
          variant_b_message: string
          variant_b_replies: number
          variant_b_short_id: string
          winner: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_name: string
          lead_phone?: string | null
          notes?: string | null
          owner_id?: string
          status?: string
          updated_at?: string
          variant_a_clicks?: number
          variant_a_first_clicked_at?: string | null
          variant_a_label?: string
          variant_a_last_clicked_at?: string | null
          variant_a_message: string
          variant_a_replies?: number
          variant_a_short_id?: string
          variant_b_clicks?: number
          variant_b_first_clicked_at?: string | null
          variant_b_label?: string
          variant_b_last_clicked_at?: string | null
          variant_b_message: string
          variant_b_replies?: number
          variant_b_short_id?: string
          winner?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string | null
          lead_name?: string
          lead_phone?: string | null
          notes?: string | null
          owner_id?: string
          status?: string
          updated_at?: string
          variant_a_clicks?: number
          variant_a_first_clicked_at?: string | null
          variant_a_label?: string
          variant_a_last_clicked_at?: string | null
          variant_a_message?: string
          variant_a_replies?: number
          variant_a_short_id?: string
          variant_b_clicks?: number
          variant_b_first_clicked_at?: string | null
          variant_b_label?: string
          variant_b_last_clicked_at?: string | null
          variant_b_message?: string
          variant_b_replies?: number
          variant_b_short_id?: string
          winner?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          ai_score: number | null
          ai_search_query: string | null
          ai_summary: string | null
          assigned_to: string | null
          channel_used: string | null
          channels_available: string[] | null
          city: string | null
          company_id: string | null
          contact_stage: string | null
          created_at: string
          demo_admin_url: string | null
          demo_auto_status: string | null
          demo_generated_at: string | null
          demo_preview_url: string | null
          demo_run_id: string | null
          demo_sub_sector: string | null
          demo_template_variant: string | null
          demo_whatsapp_message: string | null
          email: string | null
          estimated_value: number | null
          full_address: string | null
          google_rating: number | null
          google_reviews: number | null
          id: string
          instagram: string | null
          interactions: Json
          last_contacted_at: string | null
          lead_platform: string | null
          lead_source_data: Json | null
          name: string
          next_followup_at: string | null
          notes: string | null
          outcome: string | null
          owner_id: string | null
          pain_points: string[] | null
          phone: string | null
          sector: string | null
          source: string | null
          status: string
          updated_at: string
          value: number
          website: string | null
        }
        Insert: {
          ai_score?: number | null
          ai_search_query?: string | null
          ai_summary?: string | null
          assigned_to?: string | null
          channel_used?: string | null
          channels_available?: string[] | null
          city?: string | null
          company_id?: string | null
          contact_stage?: string | null
          created_at?: string
          demo_admin_url?: string | null
          demo_auto_status?: string | null
          demo_generated_at?: string | null
          demo_preview_url?: string | null
          demo_run_id?: string | null
          demo_sub_sector?: string | null
          demo_template_variant?: string | null
          demo_whatsapp_message?: string | null
          email?: string | null
          estimated_value?: number | null
          full_address?: string | null
          google_rating?: number | null
          google_reviews?: number | null
          id?: string
          instagram?: string | null
          interactions?: Json
          last_contacted_at?: string | null
          lead_platform?: string | null
          lead_source_data?: Json | null
          name: string
          next_followup_at?: string | null
          notes?: string | null
          outcome?: string | null
          owner_id?: string | null
          pain_points?: string[] | null
          phone?: string | null
          sector?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          value?: number
          website?: string | null
        }
        Update: {
          ai_score?: number | null
          ai_search_query?: string | null
          ai_summary?: string | null
          assigned_to?: string | null
          channel_used?: string | null
          channels_available?: string[] | null
          city?: string | null
          company_id?: string | null
          contact_stage?: string | null
          created_at?: string
          demo_admin_url?: string | null
          demo_auto_status?: string | null
          demo_generated_at?: string | null
          demo_preview_url?: string | null
          demo_run_id?: string | null
          demo_sub_sector?: string | null
          demo_template_variant?: string | null
          demo_whatsapp_message?: string | null
          email?: string | null
          estimated_value?: number | null
          full_address?: string | null
          google_rating?: number | null
          google_reviews?: number | null
          id?: string
          instagram?: string | null
          interactions?: Json
          last_contacted_at?: string | null
          lead_platform?: string | null
          lead_source_data?: Json | null
          name?: string
          next_followup_at?: string | null
          notes?: string | null
          outcome?: string | null
          owner_id?: string | null
          pain_points?: string[] | null
          phone?: string | null
          sector?: string | null
          source?: string | null
          status?: string
          updated_at?: string
          value?: number
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_demo_run_id_fkey"
            columns: ["demo_run_id"]
            isOneToOne: false
            referencedRelation: "demo_factory_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_modules: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          price: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          price?: number
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
      media_vault: {
        Row: {
          created_at: string
          description: string | null
          dimensions: string | null
          id: string
          is_bundled: boolean
          name: string
          section: string | null
          sort_order: number
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          is_bundled?: boolean
          name: string
          section?: string | null
          sort_order?: number
          type?: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dimensions?: string | null
          id?: string
          is_bundled?: boolean
          name?: string
          section?: string | null
          sort_order?: number
          type?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          allergens: string[] | null
          category: string
          created_at: string
          description: string | null
          description_translations: Json | null
          id: string
          image_url: string | null
          is_active: boolean
          is_popular: boolean
          name: string
          name_translations: Json | null
          price: number
          restaurant_id: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          allergens?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          description_translations?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_popular?: boolean
          name: string
          name_translations?: Json | null
          price?: number
          restaurant_id: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          allergens?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          description_translations?: Json | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_popular?: boolean
          name?: string
          name_translations?: Json | null
          price?: number
          restaurant_id?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_fee_invoices: {
        Row: {
          generated_at: string
          id: string
          month_year: string
          restaurant_id: string
          total_fees: number
          total_orders: number
          total_revenue: number
        }
        Insert: {
          generated_at?: string
          id?: string
          month_year: string
          restaurant_id: string
          total_fees?: number
          total_orders?: number
          total_revenue?: number
        }
        Update: {
          generated_at?: string
          id?: string
          month_year?: string
          restaurant_id?: string
          total_fees?: number
          total_orders?: number
          total_revenue?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_fee_invoices_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      ncc_bookings: {
        Row: {
          admin_notes: string | null
          client_email: string | null
          company_id: string
          created_at: string
          created_by: string | null
          custom_destination: string | null
          custom_origin: string | null
          customer_email: string | null
          customer_name: string
          customer_phone: string | null
          deposit: number | null
          driver_id: string | null
          driver_notes: string | null
          dropoff_address: string
          flight_code: string | null
          id: string
          luggage: number | null
          notes: string | null
          passengers: number
          payment_method: string | null
          pickup_address: string
          pickup_datetime: string
          route_id: string | null
          service_type: string | null
          status: string
          total_price: number | null
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          client_email?: string | null
          company_id: string
          created_at?: string
          created_by?: string | null
          custom_destination?: string | null
          custom_origin?: string | null
          customer_email?: string | null
          customer_name: string
          customer_phone?: string | null
          deposit?: number | null
          driver_id?: string | null
          driver_notes?: string | null
          dropoff_address: string
          flight_code?: string | null
          id?: string
          luggage?: number | null
          notes?: string | null
          passengers?: number
          payment_method?: string | null
          pickup_address: string
          pickup_datetime: string
          route_id?: string | null
          service_type?: string | null
          status?: string
          total_price?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          client_email?: string | null
          company_id?: string
          created_at?: string
          created_by?: string | null
          custom_destination?: string | null
          custom_origin?: string | null
          customer_email?: string | null
          customer_name?: string
          customer_phone?: string | null
          deposit?: number | null
          driver_id?: string | null
          driver_notes?: string | null
          dropoff_address?: string
          flight_code?: string | null
          id?: string
          luggage?: number | null
          notes?: string | null
          passengers?: number
          payment_method?: string | null
          pickup_address?: string
          pickup_datetime?: string
          route_id?: string | null
          service_type?: string | null
          status?: string
          total_price?: number | null
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ncc_bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncc_bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncc_bookings_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "ncc_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncc_bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      ncc_destinations: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean
          name: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "ncc_destinations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ncc_reviews: {
        Row: {
          admin_reply: string | null
          booking_id: string | null
          comment: string | null
          company_id: string
          created_at: string
          customer_name: string | null
          id: string
          is_public: boolean
          rating: number
          status: string | null
        }
        Insert: {
          admin_reply?: string | null
          booking_id?: string | null
          comment?: string | null
          company_id: string
          created_at?: string
          customer_name?: string | null
          id?: string
          is_public?: boolean
          rating: number
          status?: string | null
        }
        Update: {
          admin_reply?: string | null
          booking_id?: string | null
          comment?: string | null
          company_id?: string
          created_at?: string
          customer_name?: string | null
          id?: string
          is_public?: boolean
          rating?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ncc_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "ncc_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ncc_reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      ncc_routes: {
        Row: {
          base_price: number
          company_id: string
          created_at: string
          destination: string
          distance_km: number | null
          duration_min: number | null
          id: string
          is_active: boolean
          notes: string | null
          origin: string
          transport_type: string | null
        }
        Insert: {
          base_price?: number
          company_id: string
          created_at?: string
          destination: string
          distance_km?: number | null
          duration_min?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          origin: string
          transport_type?: string | null
        }
        Update: {
          base_price?: number
          company_id?: string
          created_at?: string
          destination?: string
          distance_km?: number | null
          duration_min?: number | null
          id?: string
          is_active?: boolean
          notes?: string | null
          origin?: string
          transport_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ncc_routes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications_log: {
        Row: {
          channel: string
          company_id: string
          id: string
          is_read: boolean | null
          message: string
          recipient: string
          sent_at: string | null
          status: string | null
          template: string | null
          title: string | null
        }
        Insert: {
          channel?: string
          company_id: string
          id?: string
          is_read?: boolean | null
          message: string
          recipient: string
          sent_at?: string | null
          status?: string | null
          template?: string | null
          title?: string | null
        }
        Update: {
          channel?: string
          company_id?: string
          id?: string
          is_read?: boolean | null
          message?: string
          recipient?: string
          sent_at?: string | null
          status?: string | null
          template?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_log_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_address: string | null
          customer_id: string | null
          customer_name: string | null
          customer_phone: string | null
          id: string
          items: Json
          notes: string | null
          order_type: string
          referrer: string | null
          restaurant_id: string
          status: string
          stripe_payment_id: string | null
          table_number: number | null
          total: number
          updated_at: string
          utm_source: string | null
        }
        Insert: {
          created_at?: string
          customer_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_type?: string
          referrer?: string | null
          restaurant_id: string
          status?: string
          stripe_payment_id?: string | null
          table_number?: number | null
          total?: number
          updated_at?: string
          utm_source?: string | null
        }
        Update: {
          created_at?: string
          customer_address?: string | null
          customer_id?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_type?: string
          referrer?: string | null
          restaurant_id?: string
          status?: string
          stripe_payment_id?: string | null
          table_number?: number | null
          total?: number
          updated_at?: string
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_failures: {
        Row: {
          channel: string
          created_at: string
          deploy_version: string | null
          error_code: string | null
          error_message: string
          http_status: number | null
          id: string
          lead_id: string | null
          owner_id: string | null
          payload: Json | null
          provider: string | null
          recipient: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
          sequence_id: string | null
          severity: string
          source_function: string
          touch_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          deploy_version?: string | null
          error_code?: string | null
          error_message: string
          http_status?: number | null
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          payload?: Json | null
          provider?: string | null
          recipient?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          sequence_id?: string | null
          severity?: string
          source_function?: string
          touch_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          deploy_version?: string | null
          error_code?: string | null
          error_message?: string
          http_status?: number | null
          id?: string
          lead_id?: string | null
          owner_id?: string | null
          payload?: Json | null
          provider?: string | null
          recipient?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
          sequence_id?: string | null
          severity?: string
          source_function?: string
          touch_id?: string | null
        }
        Relationships: []
      }
      outreach_health_alerts: {
        Row: {
          acknowledged: boolean
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_level: string
          attempts_count: number
          created_at: string
          deploy_version: string | null
          failure_rate: number
          failures_count: number
          id: string
          message: string
          metadata: Json | null
          resolved: boolean
          resolved_at: string | null
          source_function: string
          title: string
          window_minutes: number
        }
        Insert: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_level?: string
          attempts_count?: number
          created_at?: string
          deploy_version?: string | null
          failure_rate?: number
          failures_count?: number
          id?: string
          message: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          source_function: string
          title: string
          window_minutes?: number
        }
        Update: {
          acknowledged?: boolean
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_level?: string
          attempts_count?: number
          created_at?: string
          deploy_version?: string | null
          failure_rate?: number
          failures_count?: number
          id?: string
          message?: string
          metadata?: Json | null
          resolved?: boolean
          resolved_at?: string | null
          source_function?: string
          title?: string
          window_minutes?: number
        }
        Relationships: []
      }
      outreach_suppression: {
        Row: {
          channel: string
          created_at: string
          id: string
          identifier: string
          owner_id: string
          reason: string
          source_touch_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          id?: string
          identifier: string
          owner_id: string
          reason?: string
          source_touch_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          identifier?: string
          owner_id?: string
          reason?: string
          source_touch_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "outreach_suppression_source_touch_id_fkey"
            columns: ["source_touch_id"]
            isOneToOne: false
            referencedRelation: "lead_outreach_touches"
            referencedColumns: ["id"]
          },
        ]
      }
      pain_scans: {
        Row: {
          ai_model: string
          ai_summary: string | null
          competitive_signals: Json
          cost_cents: number | null
          created_at: string
          domain: string
          domain_hash: string
          duration_ms: number | null
          error_message: string | null
          expires_at: string
          id: string
          lead_id: string | null
          owner_id: string
          pain_points: Json
          pain_score: number
          sector: string | null
          source_url: string
          status: string
          technical_metrics: Json
          updated_at: string
        }
        Insert: {
          ai_model?: string
          ai_summary?: string | null
          competitive_signals?: Json
          cost_cents?: number | null
          created_at?: string
          domain: string
          domain_hash: string
          duration_ms?: number | null
          error_message?: string | null
          expires_at?: string
          id?: string
          lead_id?: string | null
          owner_id: string
          pain_points?: Json
          pain_score?: number
          sector?: string | null
          source_url: string
          status?: string
          technical_metrics?: Json
          updated_at?: string
        }
        Update: {
          ai_model?: string
          ai_summary?: string | null
          competitive_signals?: Json
          cost_cents?: number | null
          created_at?: string
          domain?: string
          domain_hash?: string
          duration_ms?: number | null
          error_message?: string | null
          expires_at?: string
          id?: string
          lead_id?: string | null
          owner_id?: string
          pain_points?: Json
          pain_score?: number
          sector?: string | null
          source_url?: string
          status?: string
          technical_metrics?: Json
          updated_at?: string
        }
        Relationships: []
      }
      partner_commission_notes: {
        Row: {
          created_at: string
          id: string
          net_amount: number
          partner_id: string
          period: string
          status: string
          total_bonuses: number
          total_commission: number
          total_overrides: number
          total_sales: number
        }
        Insert: {
          created_at?: string
          id?: string
          net_amount?: number
          partner_id: string
          period: string
          status?: string
          total_bonuses?: number
          total_commission?: number
          total_overrides?: number
          total_sales?: number
        }
        Update: {
          created_at?: string
          id?: string
          net_amount?: number
          partner_id?: string
          period?: string
          status?: string
          total_bonuses?: number
          total_commission?: number
          total_overrides?: number
          total_sales?: number
        }
        Relationships: []
      }
      partner_credit_purchases: {
        Row: {
          amount_eur: number
          completed_at: string | null
          created_at: string | null
          credits_purchased: number
          id: string
          package_label: string
          status: string
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_eur: number
          completed_at?: string | null
          created_at?: string | null
          credits_purchased: number
          id?: string
          package_label: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_eur?: number
          completed_at?: string | null
          created_at?: string | null
          credits_purchased?: number
          id?: string
          package_label?: string
          status?: string
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_demo_credits: {
        Row: {
          alert_threshold_pct: number | null
          auto_block_on_cap: boolean | null
          balance: number
          created_at: string
          id: string
          monthly_cap: number | null
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_threshold_pct?: number | null
          auto_block_on_cap?: boolean | null
          balance?: number
          created_at?: string
          id?: string
          monthly_cap?: number | null
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_threshold_pct?: number | null
          auto_block_on_cap?: boolean | null
          balance?: number
          created_at?: string
          id?: string
          monthly_cap?: number | null
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_demo_projects: {
        Row: {
          client_logo_url: string | null
          client_name: string
          created_at: string | null
          id: string
          notes: string | null
          primary_color: string | null
          sector: string
          tagline: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          client_logo_url?: string | null
          client_name: string
          created_at?: string | null
          id?: string
          notes?: string | null
          primary_color?: string | null
          sector: string
          tagline?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          client_logo_url?: string | null
          client_name?: string
          created_at?: string | null
          id?: string
          notes?: string | null
          primary_color?: string | null
          sector?: string
          tagline?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      partner_outreach: {
        Row: {
          channel: string
          created_at: string
          id: string
          message_sent: string | null
          next_followup_at: string | null
          notes: string | null
          partner_id: string
          prospect_contact: string | null
          prospect_name: string
          sector_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          channel?: string
          created_at?: string
          id?: string
          message_sent?: string | null
          next_followup_at?: string | null
          notes?: string | null
          partner_id: string
          prospect_contact?: string | null
          prospect_name: string
          sector_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          channel?: string
          created_at?: string
          id?: string
          message_sent?: string | null
          next_followup_at?: string | null
          notes?: string | null
          partner_id?: string
          prospect_contact?: string | null
          prospect_name?: string
          sector_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_sales: {
        Row: {
          bonus_amount: number
          bonus_type: string | null
          created_at: string
          id: string
          partner_commission: number
          partner_id: string
          restaurant_payment_id: string | null
          sale_amount: number
          sale_month: string
          team_leader_id: string | null
          team_leader_override: number
        }
        Insert: {
          bonus_amount?: number
          bonus_type?: string | null
          created_at?: string
          id?: string
          partner_commission?: number
          partner_id: string
          restaurant_payment_id?: string | null
          sale_amount?: number
          sale_month?: string
          team_leader_id?: string | null
          team_leader_override?: number
        }
        Update: {
          bonus_amount?: number
          bonus_type?: string | null
          created_at?: string
          id?: string
          partner_commission?: number
          partner_id?: string
          restaurant_payment_id?: string | null
          sale_amount?: number
          sale_month?: string
          team_leader_id?: string | null
          team_leader_override?: number
        }
        Relationships: [
          {
            foreignKeyName: "partner_sales_restaurant_payment_id_fkey"
            columns: ["restaurant_payment_id"]
            isOneToOne: false
            referencedRelation: "restaurant_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_stripe_accounts: {
        Row: {
          charges_enabled: boolean
          created_at: string
          email: string | null
          id: string
          onboarding_complete: boolean
          payouts_enabled: boolean
          stripe_account_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          charges_enabled?: boolean
          created_at?: string
          email?: string | null
          id?: string
          onboarding_complete?: boolean
          payouts_enabled?: boolean
          stripe_account_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          charges_enabled?: boolean
          created_at?: string
          email?: string | null
          id?: string
          onboarding_complete?: boolean
          payouts_enabled?: boolean
          stripe_account_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      partner_teams: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          team_leader_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          team_leader_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          team_leader_id?: string
        }
        Relationships: []
      }
      payroll: {
        Row: {
          company_id: string
          created_at: string
          deductions: number | null
          gross_pay: number | null
          hours_worked: number | null
          id: string
          net_pay: number | null
          overtime_hours: number | null
          paid_at: string | null
          period: string
          staff_id: string
          status: string
        }
        Insert: {
          company_id: string
          created_at?: string
          deductions?: number | null
          gross_pay?: number | null
          hours_worked?: number | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          period: string
          staff_id: string
          status?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          deductions?: number | null
          gross_pay?: number | null
          hours_worked?: number | null
          id?: string
          net_pay?: number | null
          overtime_hours?: number | null
          paid_at?: string | null
          period?: string
          staff_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payroll_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_bonuses: {
        Row: {
          bonus_amount: number
          bonus_month: string
          bonus_tier: string
          created_at: string
          id: string
          paid: boolean
          partner_id: string
          sales_count: number
        }
        Insert: {
          bonus_amount?: number
          bonus_month: string
          bonus_tier?: string
          created_at?: string
          id?: string
          paid?: boolean
          partner_id: string
          sales_count?: number
        }
        Update: {
          bonus_amount?: number
          bonus_month?: string
          bonus_tier?: string
          created_at?: string
          id?: string
          paid?: boolean
          partner_id?: string
          sales_count?: number
        }
        Relationships: []
      }
      platform_fees: {
        Row: {
          created_at: string
          fee_amount: number
          fee_percent: number
          id: string
          order_id: string
          order_total: number
          restaurant_id: string
          stripe_fee_id: string | null
        }
        Insert: {
          created_at?: string
          fee_amount?: number
          fee_percent?: number
          id?: string
          order_id: string
          order_total?: number
          restaurant_id: string
          stripe_fee_id?: string | null
        }
        Update: {
          created_at?: string
          fee_amount?: number
          fee_percent?: number
          id?: string
          order_id?: string
          order_total?: number
          restaurant_id?: string
          stripe_fee_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_fees_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_fees_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          company_id: string
          cost: number | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          min_stock: number | null
          name: string
          price: number
          sku: string | null
          stock: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          company_id: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          min_stock?: number | null
          name: string
          price?: number
          sku?: string | null
          stock?: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          min_stock?: number | null
          name?: string
          price?: number
          sku?: string | null
          stock?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          created_at: string
          demo_section_enabled: boolean
          email: string | null
          full_name: string | null
          id: string
          instagram_handle: string | null
          phone: string | null
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          demo_section_enabled?: boolean
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string
          demo_section_enabled?: boolean
          email?: string | null
          full_name?: string | null
          id?: string
          instagram_handle?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      public_site_config: {
        Row: {
          about_text: string | null
          active_sections: Json | null
          booking_enabled: boolean | null
          company_id: string
          custom_css: string | null
          font_body: string | null
          font_heading: string | null
          google_business_url: string | null
          headline: string | null
          hero_image_url: string | null
          hero_video_url: string | null
          id: string
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          tagline: string | null
          updated_at: string | null
          whatsapp_number: string | null
        }
        Insert: {
          about_text?: string | null
          active_sections?: Json | null
          booking_enabled?: boolean | null
          company_id: string
          custom_css?: string | null
          font_body?: string | null
          font_heading?: string | null
          google_business_url?: string | null
          headline?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          about_text?: string | null
          active_sections?: Json | null
          booking_enabled?: boolean | null
          company_id?: string
          custom_css?: string | null
          font_body?: string | null
          font_heading?: string | null
          google_business_url?: string | null
          headline?: string | null
          hero_image_url?: string | null
          hero_video_url?: string | null
          id?: string
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_site_config_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          auth_key: string
          created_at: string
          customer_phone: string | null
          endpoint: string
          id: string
          is_active: boolean
          p256dh: string
          restaurant_id: string
        }
        Insert: {
          auth_key: string
          created_at?: string
          customer_phone?: string | null
          endpoint: string
          id?: string
          is_active?: boolean
          p256dh: string
          restaurant_id: string
        }
        Update: {
          auth_key?: string
          created_at?: string
          customer_phone?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean
          p256dh?: string
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      pwa_orders_log: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_user_id: string | null
          fee_cents: number
          id: string
          metadata: Json | null
          order_id: string
          paid_at: string | null
          restaurant_id: string
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_user_id?: string | null
          fee_cents?: number
          id?: string
          metadata?: Json | null
          order_id: string
          paid_at?: string | null
          restaurant_id: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_user_id?: string | null
          fee_cents?: number
          id?: string
          metadata?: Json | null
          order_id?: string
          paid_at?: string | null
          restaurant_id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          item_id: string
          notes: string | null
          quantity: number
          recipe_id: string
          unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          notes?: string | null
          quantity: number
          recipe_id: string
          unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          notes?: string | null
          quantity?: number
          recipe_id?: string
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "restock_suggestions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          menu_item_id: string | null
          name: string
          notes: string | null
          restaurant_id: string
          updated_at: string
          yield_qty: number
          yield_unit: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          menu_item_id?: string | null
          name: string
          notes?: string | null
          restaurant_id: string
          updated_at?: string
          yield_qty?: number
          yield_unit?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          menu_item_id?: string | null
          name?: string
          notes?: string | null
          restaurant_id?: string
          updated_at?: string
          yield_qty?: number
          yield_unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_menu_item_id_fkey"
            columns: ["menu_item_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          created_at: string
          customer_name: string
          customer_phone: string
          guests: number
          id: string
          notes: string | null
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_name: string
          customer_phone: string
          guests?: number
          id?: string
          notes?: string | null
          reservation_date: string
          reservation_time: string
          restaurant_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_name?: string
          customer_phone?: string
          guests?: number
          id?: string
          notes?: string | null
          reservation_date?: string
          reservation_time?: string
          restaurant_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_memberships: {
        Row: {
          created_at: string
          id: string
          restaurant_id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          restaurant_id: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          restaurant_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_memberships_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_payments: {
        Row: {
          amount_paid: number
          block_notice_sent_at: string | null
          blocked_at: string | null
          created_at: string
          grace_period_days: number
          id: string
          installment_amount: number
          installments_paid: number
          installments_total: number
          is_overdue: boolean
          next_due_date: string | null
          partner_commission: number
          partner_id: string | null
          partner_paid: boolean
          plan_type: string
          reactivation_sent_at: string | null
          restaurant_id: string
          stripe_payment_intent_id: string | null
          stripe_transfer_group: string | null
          total_amount: number
          updated_at: string
          warning_sent_at: string | null
        }
        Insert: {
          amount_paid?: number
          block_notice_sent_at?: string | null
          blocked_at?: string | null
          created_at?: string
          grace_period_days?: number
          id?: string
          installment_amount?: number
          installments_paid?: number
          installments_total?: number
          is_overdue?: boolean
          next_due_date?: string | null
          partner_commission?: number
          partner_id?: string | null
          partner_paid?: boolean
          plan_type?: string
          reactivation_sent_at?: string | null
          restaurant_id: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_group?: string | null
          total_amount?: number
          updated_at?: string
          warning_sent_at?: string | null
        }
        Update: {
          amount_paid?: number
          block_notice_sent_at?: string | null
          blocked_at?: string | null
          created_at?: string
          grace_period_days?: number
          id?: string
          installment_amount?: number
          installments_paid?: number
          installments_total?: number
          is_overdue?: boolean
          next_due_date?: string | null
          partner_commission?: number
          partner_id?: string | null
          partner_paid?: boolean
          plan_type?: string
          reactivation_sent_at?: string | null
          restaurant_id?: string
          stripe_payment_intent_id?: string | null
          stripe_transfer_group?: string | null
          total_amount?: number
          updated_at?: string
          warning_sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_payments_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_plates: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          is_active: boolean | null
          name: string
          restaurant_id: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          is_active?: boolean | null
          name?: string
          restaurant_id: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          is_active?: boolean | null
          name?: string
          restaurant_id?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_plates_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          restaurant_id: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_end: string
          trial_start: string
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          restaurant_id: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string
          trial_start?: string
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          restaurant_id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_end?: string
          trial_start?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_subscriptions_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: true
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurant_tables: {
        Row: {
          created_at: string
          id: string
          label: string | null
          pos_x: number | null
          pos_y: number | null
          restaurant_id: string
          seats: number | null
          status: string
          table_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          label?: string | null
          pos_x?: number | null
          pos_y?: number | null
          restaurant_id: string
          seats?: number | null
          status?: string
          table_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string | null
          pos_x?: number | null
          pos_y?: number | null
          restaurant_id?: string
          seats?: number | null
          status?: string
          table_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "restaurant_tables_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      restaurants: {
        Row: {
          acquired_by_partner_id: string | null
          acquired_by_sub_partner_id: string | null
          address: string | null
          blocked_keywords: string[] | null
          blocked_reason: string | null
          business_type: Database["public"]["Enums"]["business_type"]
          city: string | null
          created_at: string
          delivery_enabled: boolean
          email: string | null
          id: string
          is_active: boolean
          is_blocked: boolean
          languages: string[] | null
          logo_url: string | null
          menu_pdf_url: string | null
          min_order_amount: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          policy_accepted: boolean | null
          policy_accepted_at: string | null
          primary_color: string | null
          selected_installments: number | null
          selected_plan: string | null
          setup_paid: boolean
          setup_paid_at: string | null
          slug: string
          stripe_account_id: string | null
          stripe_connect_account_id: string | null
          stripe_onboarding_complete: boolean
          stripe_setup_session_id: string | null
          table_orders_enabled: boolean
          tagline: string | null
          takeaway_enabled: boolean
          theme_config: Json | null
          updated_at: string
        }
        Insert: {
          acquired_by_partner_id?: string | null
          acquired_by_sub_partner_id?: string | null
          address?: string | null
          blocked_keywords?: string[] | null
          blocked_reason?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          city?: string | null
          created_at?: string
          delivery_enabled?: boolean
          email?: string | null
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          languages?: string[] | null
          logo_url?: string | null
          menu_pdf_url?: string | null
          min_order_amount?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          policy_accepted?: boolean | null
          policy_accepted_at?: string | null
          primary_color?: string | null
          selected_installments?: number | null
          selected_plan?: string | null
          setup_paid?: boolean
          setup_paid_at?: string | null
          slug: string
          stripe_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_complete?: boolean
          stripe_setup_session_id?: string | null
          table_orders_enabled?: boolean
          tagline?: string | null
          takeaway_enabled?: boolean
          theme_config?: Json | null
          updated_at?: string
        }
        Update: {
          acquired_by_partner_id?: string | null
          acquired_by_sub_partner_id?: string | null
          address?: string | null
          blocked_keywords?: string[] | null
          blocked_reason?: string | null
          business_type?: Database["public"]["Enums"]["business_type"]
          city?: string | null
          created_at?: string
          delivery_enabled?: boolean
          email?: string | null
          id?: string
          is_active?: boolean
          is_blocked?: boolean
          languages?: string[] | null
          logo_url?: string | null
          menu_pdf_url?: string | null
          min_order_amount?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          policy_accepted?: boolean | null
          policy_accepted_at?: string | null
          primary_color?: string | null
          selected_installments?: number | null
          selected_plan?: string | null
          setup_paid?: boolean
          setup_paid_at?: string | null
          slug?: string
          stripe_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_complete?: boolean
          stripe_setup_session_id?: string | null
          table_orders_enabled?: boolean
          tagline?: string | null
          takeaway_enabled?: boolean
          theme_config?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          customer_id: string | null
          customer_name: string | null
          id: string
          is_public: boolean
          rating: number
          restaurant_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_public?: boolean
          rating: number
          restaurant_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_public?: boolean
          rating?: number
          restaurant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      roi_calculations: {
        Row: {
          ai_narrative: string | null
          assumptions: Json
          category_breakdown: Json
          created_at: string
          empire_monthly_value_eur: number
          id: string
          lead_id: string | null
          monthly_loss_eur: number
          owner_id: string
          pain_scan_id: string | null
          payback_months: number | null
          roi_percentage: number
          scenario: string
          updated_at: string
          yearly_loss_eur: number
        }
        Insert: {
          ai_narrative?: string | null
          assumptions?: Json
          category_breakdown?: Json
          created_at?: string
          empire_monthly_value_eur?: number
          id?: string
          lead_id?: string | null
          monthly_loss_eur?: number
          owner_id: string
          pain_scan_id?: string | null
          payback_months?: number | null
          roi_percentage?: number
          scenario?: string
          updated_at?: string
          yearly_loss_eur?: number
        }
        Update: {
          ai_narrative?: string | null
          assumptions?: Json
          category_breakdown?: Json
          created_at?: string
          empire_monthly_value_eur?: number
          id?: string
          lead_id?: string | null
          monthly_loss_eur?: number
          owner_id?: string
          pain_scan_id?: string | null
          payback_months?: number | null
          roi_percentage?: number
          scenario?: string
          updated_at?: string
          yearly_loss_eur?: number
        }
        Relationships: [
          {
            foreignKeyName: "roi_calculations_pain_scan_id_fkey"
            columns: ["pain_scan_id"]
            isOneToOne: false
            referencedRelation: "pain_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          company_id: string
          created_at: string
          floor: number | null
          id: string
          notes: string | null
          price_per_night: number | null
          room_number: string
          room_type: string | null
          status: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          floor?: number | null
          id?: string
          notes?: string | null
          price_per_night?: number | null
          room_number: string
          room_type?: string | null
          status?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          floor?: number | null
          id?: string
          notes?: string | null
          price_per_night?: number | null
          room_number?: string
          room_type?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      route_prices: {
        Row: {
          base_price: number
          created_at: string
          id: string
          route_id: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          base_price?: number
          created_at?: string
          id?: string
          route_id: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          base_price?: number
          created_at?: string
          id?: string
          route_id?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "route_prices_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "ncc_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "route_prices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_agent_actions: {
        Row: {
          action_type: string
          channel: string | null
          created_at: string
          deliverability_score: number | null
          description: string | null
          duration_ms: number | null
          id: string
          job_id: string | null
          lead_id: string | null
          owner_id: string
          payload: Json | null
          result: Json | null
          status: string
          template_id: string | null
          title: string
        }
        Insert: {
          action_type: string
          channel?: string | null
          created_at?: string
          deliverability_score?: number | null
          description?: string | null
          duration_ms?: number | null
          id?: string
          job_id?: string | null
          lead_id?: string | null
          owner_id: string
          payload?: Json | null
          result?: Json | null
          status?: string
          template_id?: string | null
          title: string
        }
        Update: {
          action_type?: string
          channel?: string | null
          created_at?: string
          deliverability_score?: number | null
          description?: string | null
          duration_ms?: number | null
          id?: string
          job_id?: string | null
          lead_id?: string | null
          owner_id?: string
          payload?: Json | null
          result?: Json | null
          status?: string
          template_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_agent_actions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "sales_agent_jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_agent_approvals: {
        Row: {
          action_id: string | null
          approved_at: string | null
          approved_by: string | null
          body_html: string | null
          channel: string
          created_at: string
          deliverability_score: number | null
          deliverability_warnings: Json | null
          draft_body: string
          draft_subject: string | null
          edited_body: string | null
          expires_at: string
          id: string
          lead_id: string | null
          owner_id: string
          reasoning: string | null
          recipient: string | null
          status: string
          template_id: string | null
          template_metadata: Json | null
        }
        Insert: {
          action_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          body_html?: string | null
          channel: string
          created_at?: string
          deliverability_score?: number | null
          deliverability_warnings?: Json | null
          draft_body: string
          draft_subject?: string | null
          edited_body?: string | null
          expires_at?: string
          id?: string
          lead_id?: string | null
          owner_id: string
          reasoning?: string | null
          recipient?: string | null
          status?: string
          template_id?: string | null
          template_metadata?: Json | null
        }
        Update: {
          action_id?: string | null
          approved_at?: string | null
          approved_by?: string | null
          body_html?: string | null
          channel?: string
          created_at?: string
          deliverability_score?: number | null
          deliverability_warnings?: Json | null
          draft_body?: string
          draft_subject?: string | null
          edited_body?: string | null
          expires_at?: string
          id?: string
          lead_id?: string | null
          owner_id?: string
          reasoning?: string | null
          recipient?: string | null
          status?: string
          template_id?: string | null
          template_metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_agent_approvals_action_id_fkey"
            columns: ["action_id"]
            isOneToOne: false
            referencedRelation: "sales_agent_actions"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_agent_config: {
        Row: {
          auto_send_email: boolean
          auto_send_facebook: boolean
          auto_send_instagram: boolean
          auto_send_whatsapp: boolean
          autonomy_mode: string
          channels_enabled: Json
          continuous_mode: boolean
          created_at: string
          daily_limits: Json
          email_from: string | null
          id: string
          is_active: boolean
          last_auto_run_at: string | null
          max_touches_per_lead: number
          min_hours_between_touches: number
          operating_hours: Json
          outreach_strategy: string
          preferred_email_template_id: string | null
          signature: string | null
          target_cities: string[] | null
          target_sectors: string[] | null
          total_conversions: number
          total_jobs_run: number
          total_meetings_booked: number
          total_messages_sent: number
          updated_at: string
          user_id: string
          voice_tone: string
          whatsapp_from: string | null
        }
        Insert: {
          auto_send_email?: boolean
          auto_send_facebook?: boolean
          auto_send_instagram?: boolean
          auto_send_whatsapp?: boolean
          autonomy_mode?: string
          channels_enabled?: Json
          continuous_mode?: boolean
          created_at?: string
          daily_limits?: Json
          email_from?: string | null
          id?: string
          is_active?: boolean
          last_auto_run_at?: string | null
          max_touches_per_lead?: number
          min_hours_between_touches?: number
          operating_hours?: Json
          outreach_strategy?: string
          preferred_email_template_id?: string | null
          signature?: string | null
          target_cities?: string[] | null
          target_sectors?: string[] | null
          total_conversions?: number
          total_jobs_run?: number
          total_meetings_booked?: number
          total_messages_sent?: number
          updated_at?: string
          user_id: string
          voice_tone?: string
          whatsapp_from?: string | null
        }
        Update: {
          auto_send_email?: boolean
          auto_send_facebook?: boolean
          auto_send_instagram?: boolean
          auto_send_whatsapp?: boolean
          autonomy_mode?: string
          channels_enabled?: Json
          continuous_mode?: boolean
          created_at?: string
          daily_limits?: Json
          email_from?: string | null
          id?: string
          is_active?: boolean
          last_auto_run_at?: string | null
          max_touches_per_lead?: number
          min_hours_between_touches?: number
          operating_hours?: Json
          outreach_strategy?: string
          preferred_email_template_id?: string | null
          signature?: string | null
          target_cities?: string[] | null
          target_sectors?: string[] | null
          total_conversions?: number
          total_jobs_run?: number
          total_meetings_booked?: number
          total_messages_sent?: number
          updated_at?: string
          user_id?: string
          voice_tone?: string
          whatsapp_from?: string | null
        }
        Relationships: []
      }
      sales_agent_conversations: {
        Row: {
          body: string
          channel: string
          created_at: string
          delivered_at: string | null
          direction: string
          id: string
          lead_id: string
          metadata: Json | null
          owner_id: string
          read_at: string | null
          replied_at: string | null
          sent_by_agent: boolean
          subject: string | null
        }
        Insert: {
          body: string
          channel: string
          created_at?: string
          delivered_at?: string | null
          direction: string
          id?: string
          lead_id: string
          metadata?: Json | null
          owner_id: string
          read_at?: string | null
          replied_at?: string | null
          sent_by_agent?: boolean
          subject?: string | null
        }
        Update: {
          body?: string
          channel?: string
          created_at?: string
          delivered_at?: string | null
          direction?: string
          id?: string
          lead_id?: string
          metadata?: Json | null
          owner_id?: string
          read_at?: string | null
          replied_at?: string | null
          sent_by_agent?: boolean
          subject?: string | null
        }
        Relationships: []
      }
      sales_agent_jobs: {
        Row: {
          completed_at: string | null
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          input_payload: Json
          job_type: string
          lead_id: string | null
          output_payload: Json | null
          owner_id: string
          priority: number
          started_at: string | null
          status: string
          trigger_source: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          job_type: string
          lead_id?: string | null
          output_payload?: Json | null
          owner_id: string
          priority?: number
          started_at?: string | null
          status?: string
          trigger_source?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          input_payload?: Json
          job_type?: string
          lead_id?: string | null
          output_payload?: Json | null
          owner_id?: string
          priority?: number
          started_at?: string | null
          status?: string
          trigger_source?: string
        }
        Relationships: []
      }
      sales_agent_knowledge: {
        Row: {
          confidence: number | null
          content: Json
          created_at: string
          id: string
          knowledge_type: string
          last_used_at: string | null
          lead_id: string | null
          owner_id: string
          title: string
          used_count: number
        }
        Insert: {
          confidence?: number | null
          content: Json
          created_at?: string
          id?: string
          knowledge_type: string
          last_used_at?: string | null
          lead_id?: string | null
          owner_id: string
          title: string
          used_count?: number
        }
        Update: {
          confidence?: number | null
          content?: Json
          created_at?: string
          id?: string
          knowledge_type?: string
          last_used_at?: string | null
          lead_id?: string | null
          owner_id?: string
          title?: string
          used_count?: number
        }
        Relationships: []
      }
      sales_coach_insights: {
        Row: {
          action_label: string | null
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          insight_type: string
          is_dismissed: boolean
          is_read: boolean
          message: string
          priority: string
          supporting_data: Json | null
          title: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean
          is_read?: boolean
          message: string
          priority?: string
          supporting_data?: Json | null
          title: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          insight_type?: string
          is_dismissed?: boolean
          is_read?: boolean
          message?: string
          priority?: string
          supporting_data?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      sales_leaderboard: {
        Row: {
          avatar_url: string | null
          badges: Json
          created_at: string
          deals_closed_month: number
          deals_closed_total: number
          display_name: string | null
          global_rank: number | null
          id: string
          last_activity_at: string | null
          level: number
          revenue_month_eur: number
          revenue_total_eur: number
          sector: string | null
          sector_rank: number | null
          streak_days: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badges?: Json
          created_at?: string
          deals_closed_month?: number
          deals_closed_total?: number
          display_name?: string | null
          global_rank?: number | null
          id?: string
          last_activity_at?: string | null
          level?: number
          revenue_month_eur?: number
          revenue_total_eur?: number
          sector?: string | null
          sector_rank?: number | null
          streak_days?: number
          total_xp?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badges?: Json
          created_at?: string
          deals_closed_month?: number
          deals_closed_total?: number
          display_name?: string | null
          global_rank?: number | null
          id?: string
          last_activity_at?: string | null
          level?: number
          revenue_month_eur?: number
          revenue_total_eur?: number
          sector?: string | null
          sector_rank?: number | null
          streak_days?: number
          total_xp?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seasonal_prices: {
        Row: {
          created_at: string
          id: string
          month: number
          price: number
          route_id: string
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          month: number
          price?: number
          route_id: string
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          month?: number
          price?: number
          route_id?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_prices_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "ncc_routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seasonal_prices_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "fleet_vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      sector_system_prompts: {
        Row: {
          allowed_actions: Json | null
          blocked_actions: Json | null
          created_at: string
          id: string
          is_active: boolean | null
          sector: string
          system_prompt: string
          updated_at: string
          welcome_template: string
        }
        Insert: {
          allowed_actions?: Json | null
          blocked_actions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          sector: string
          system_prompt: string
          updated_at?: string
          welcome_template: string
        }
        Update: {
          allowed_actions?: Json | null
          blocked_actions?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          sector?: string
          system_prompt?: string
          updated_at?: string
          welcome_template?: string
        }
        Relationships: []
      }
      seller_action_costs: {
        Row: {
          action: string
          category: string
          cost_eur_estimate: number | null
          created_at: string | null
          credit_cost: number
          description: string | null
          id: string
          is_active: boolean | null
          label: string
          updated_at: string | null
        }
        Insert: {
          action: string
          category?: string
          cost_eur_estimate?: number | null
          created_at?: string | null
          credit_cost?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          category?: string
          cost_eur_estimate?: number | null
          created_at?: string | null
          credit_cost?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      seller_credit_alerts: {
        Row: {
          alert_type: string
          created_at: string
          credits_used_month: number
          id: string
          is_read: boolean
          message: string | null
          monthly_cap: number | null
          threshold_pct: number | null
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          credits_used_month?: number
          id?: string
          is_read?: boolean
          message?: string | null
          monthly_cap?: number | null
          threshold_pct?: number | null
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          credits_used_month?: number
          id?: string
          is_read?: boolean
          message?: string | null
          monthly_cap?: number | null
          threshold_pct?: number | null
          user_id?: string
        }
        Relationships: []
      }
      seller_custom_previews: {
        Row: {
          ai_generated_content: Json | null
          created_at: string | null
          features: Json | null
          gallery_images: Json | null
          generated_at: string | null
          generation_error: string | null
          generation_status: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          id: string
          is_favorite: boolean
          is_published: boolean | null
          last_viewed_at: string | null
          lead_address: string | null
          lead_city: string | null
          lead_email: string | null
          lead_id: string | null
          lead_intelligence_id: string | null
          lead_name: string | null
          lead_phone: string | null
          lead_rating: number | null
          lead_reviews_count: number | null
          lead_website: string | null
          logo_url: string | null
          mockup_engine: string | null
          mockup_generated_at: string | null
          mockup_screens: Json
          owner_id: string
          portfolio_label: string | null
          portfolio_notes: string | null
          preview_html: string | null
          preview_url: string | null
          primary_color: string | null
          public_slug: string | null
          reuse_count: number | null
          saved_to_portfolio: boolean
          saved_to_portfolio_at: string | null
          scraped_data: Json | null
          sector_label: string
          sector_slug: string
          template_style: string
          updated_at: string | null
          view_count: number | null
          whatsapp_message: string | null
        }
        Insert: {
          ai_generated_content?: Json | null
          created_at?: string | null
          features?: Json | null
          gallery_images?: Json | null
          generated_at?: string | null
          generation_error?: string | null
          generation_status?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_favorite?: boolean
          is_published?: boolean | null
          last_viewed_at?: string | null
          lead_address?: string | null
          lead_city?: string | null
          lead_email?: string | null
          lead_id?: string | null
          lead_intelligence_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_rating?: number | null
          lead_reviews_count?: number | null
          lead_website?: string | null
          logo_url?: string | null
          mockup_engine?: string | null
          mockup_generated_at?: string | null
          mockup_screens?: Json
          owner_id: string
          portfolio_label?: string | null
          portfolio_notes?: string | null
          preview_html?: string | null
          preview_url?: string | null
          primary_color?: string | null
          public_slug?: string | null
          reuse_count?: number | null
          saved_to_portfolio?: boolean
          saved_to_portfolio_at?: string | null
          scraped_data?: Json | null
          sector_label: string
          sector_slug: string
          template_style?: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp_message?: string | null
        }
        Update: {
          ai_generated_content?: Json | null
          created_at?: string | null
          features?: Json | null
          gallery_images?: Json | null
          generated_at?: string | null
          generation_error?: string | null
          generation_status?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          id?: string
          is_favorite?: boolean
          is_published?: boolean | null
          last_viewed_at?: string | null
          lead_address?: string | null
          lead_city?: string | null
          lead_email?: string | null
          lead_id?: string | null
          lead_intelligence_id?: string | null
          lead_name?: string | null
          lead_phone?: string | null
          lead_rating?: number | null
          lead_reviews_count?: number | null
          lead_website?: string | null
          logo_url?: string | null
          mockup_engine?: string | null
          mockup_generated_at?: string | null
          mockup_screens?: Json
          owner_id?: string
          portfolio_label?: string | null
          portfolio_notes?: string | null
          preview_html?: string | null
          preview_url?: string | null
          primary_color?: string | null
          public_slug?: string | null
          reuse_count?: number | null
          saved_to_portfolio?: boolean
          saved_to_portfolio_at?: string | null
          scraped_data?: Json | null
          sector_label?: string
          sector_slug?: string
          template_style?: string
          updated_at?: string | null
          view_count?: number | null
          whatsapp_message?: string | null
        }
        Relationships: []
      }
      seller_demo_vault: {
        Row: {
          admin_email: string | null
          admin_password: string | null
          admin_url: string
          brand_payload: Json
          created_at: string
          display_name: string
          full_result: Json | null
          generation_engine: string
          id: string
          images_payload: Json | null
          is_archived: boolean
          is_favorite: boolean
          last_reused_at: string | null
          last_reused_for_lead: string | null
          lead_snapshot: Json
          magic_link: string | null
          notes: string | null
          original_lead_name: string
          outreach_payload: Json | null
          owner_id: string
          preview_url: string
          reuse_count: number
          sector: string
          sector_label: string | null
          sub_sector: string | null
          tags: string[] | null
          template_variant: string
          tenant_id: string | null
          tenant_kind: string | null
          tenant_slug: string | null
          theme_hint: string | null
          updated_at: string
        }
        Insert: {
          admin_email?: string | null
          admin_password?: string | null
          admin_url: string
          brand_payload?: Json
          created_at?: string
          display_name: string
          full_result?: Json | null
          generation_engine?: string
          id?: string
          images_payload?: Json | null
          is_archived?: boolean
          is_favorite?: boolean
          last_reused_at?: string | null
          last_reused_for_lead?: string | null
          lead_snapshot?: Json
          magic_link?: string | null
          notes?: string | null
          original_lead_name: string
          outreach_payload?: Json | null
          owner_id: string
          preview_url: string
          reuse_count?: number
          sector: string
          sector_label?: string | null
          sub_sector?: string | null
          tags?: string[] | null
          template_variant: string
          tenant_id?: string | null
          tenant_kind?: string | null
          tenant_slug?: string | null
          theme_hint?: string | null
          updated_at?: string
        }
        Update: {
          admin_email?: string | null
          admin_password?: string | null
          admin_url?: string
          brand_payload?: Json
          created_at?: string
          display_name?: string
          full_result?: Json | null
          generation_engine?: string
          id?: string
          images_payload?: Json | null
          is_archived?: boolean
          is_favorite?: boolean
          last_reused_at?: string | null
          last_reused_for_lead?: string | null
          lead_snapshot?: Json
          magic_link?: string | null
          notes?: string | null
          original_lead_name?: string
          outreach_payload?: Json | null
          owner_id?: string
          preview_url?: string
          reuse_count?: number
          sector?: string
          sector_label?: string | null
          sub_sector?: string | null
          tags?: string[] | null
          template_variant?: string
          tenant_id?: string | null
          tenant_kind?: string | null
          tenant_slug?: string | null
          theme_hint?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seller_mockup_suites: {
        Row: {
          business_city: string | null
          business_name: string
          business_sector: string | null
          created_at: string
          credits_spent: number | null
          engine: string
          error_message: string | null
          generated_at: string | null
          generation_engine: string
          id: string
          is_favorite: boolean
          lead_id: string | null
          owner_id: string
          preview_id: string | null
          primary_color: string | null
          screens: Json
          share_slug: string | null
          status: string
          template_variant: string | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          business_city?: string | null
          business_name: string
          business_sector?: string | null
          created_at?: string
          credits_spent?: number | null
          engine?: string
          error_message?: string | null
          generated_at?: string | null
          generation_engine?: string
          id?: string
          is_favorite?: boolean
          lead_id?: string | null
          owner_id: string
          preview_id?: string | null
          primary_color?: string | null
          screens?: Json
          share_slug?: string | null
          status?: string
          template_variant?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          business_city?: string | null
          business_name?: string
          business_sector?: string | null
          created_at?: string
          credits_spent?: number | null
          engine?: string
          error_message?: string | null
          generated_at?: string | null
          generation_engine?: string
          id?: string
          is_favorite?: boolean
          lead_id?: string | null
          owner_id?: string
          preview_id?: string | null
          primary_color?: string | null
          screens?: Json
          share_slug?: string | null
          status?: string
          template_variant?: string | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      seo_settings: {
        Row: {
          company_id: string
          created_at: string
          id: string
          keywords: string | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          keywords?: string | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          category: string | null
          color: string | null
          company_id: string
          duration_minutes: number | null
          id: string
          is_active: boolean | null
          name: string
          price: number | null
        }
        Insert: {
          category?: string | null
          color?: string | null
          company_id: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
        }
        Update: {
          category?: string | null
          color?: string | null
          company_id?: string
          duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      setup_payment_log: {
        Row: {
          amount_cents: number | null
          created_at: string
          currency: string | null
          entity_id: string
          entity_type: string
          id: string
          installments: number | null
          metadata: Json | null
          paid_at: string | null
          plan: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          entity_id: string
          entity_type: string
          id?: string
          installments?: number | null
          metadata?: Json | null
          paid_at?: string | null
          plan?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          currency?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          installments?: number | null
          metadata?: Json | null
          paid_at?: string | null
          plan?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      shifts: {
        Row: {
          break_minutes: number | null
          company_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          shift_date: string
          staff_id: string
          start_time: string
        }
        Insert: {
          break_minutes?: number | null
          company_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          shift_date: string
          staff_id: string
          start_time: string
        }
        Update: {
          break_minutes?: number | null
          company_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          shift_date?: string
          staff_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shifts_staff_id_fkey"
            columns: ["staff_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      shootings: {
        Row: {
          client_name: string
          client_phone: string | null
          company_id: string
          created_at: string | null
          duration_hours: number | null
          gallery_link: string | null
          id: string
          location: string | null
          notes: string | null
          price: number | null
          shoot_date: string | null
          shooting_type: string | null
          status: string | null
        }
        Insert: {
          client_name: string
          client_phone?: string | null
          company_id: string
          created_at?: string | null
          duration_hours?: number | null
          gallery_link?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          price?: number | null
          shoot_date?: string | null
          shooting_type?: string | null
          status?: string | null
        }
        Update: {
          client_name?: string
          client_phone?: string | null
          company_id?: string
          created_at?: string | null
          duration_hours?: number | null
          gallery_link?: string | null
          id?: string
          location?: string | null
          notes?: string | null
          price?: number | null
          shoot_date?: string | null
          shooting_type?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shootings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      site_assets: {
        Row: {
          asset_type: string
          default_file: string | null
          id: string
          label: string
          section: string
          slot_key: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          asset_type?: string
          default_file?: string | null
          id?: string
          label: string
          section?: string
          slot_key: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          asset_type?: string
          default_file?: string | null
          id?: string
          label?: string
          section?: string
          slot_key?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      social_posts: {
        Row: {
          company_id: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          platform: string
          published_at: string | null
          scheduled_at: string | null
          status: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          platform?: string
          published_at?: string | null
          scheduled_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      staff: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          full_name: string
          hourly_rate: number | null
          id: string
          is_active: boolean
          monthly_salary: number | null
          phone: string | null
          role: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          full_name: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          monthly_salary?: number | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          hourly_rate?: number | null
          id?: string
          is_active?: boolean
          monthly_salary?: number | null
          phone?: string | null
          role?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      staff_shifts: {
        Row: {
          company_id: string
          end_time: string
          id: string
          notes: string | null
          shift_date: string
          staff_name: string
          start_time: string
          user_id: string | null
        }
        Insert: {
          company_id: string
          end_time: string
          id?: string
          notes?: string | null
          shift_date: string
          staff_name: string
          start_time: string
          user_id?: string | null
        }
        Update: {
          company_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          shift_date?: string
          staff_name?: string
          start_time?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_shifts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          error_message: string | null
          event_id: string
          event_type: string
          livemode: boolean
          payload_summary: Json | null
          processed_at: string | null
          received_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          event_id: string
          event_type: string
          livemode?: boolean
          payload_summary?: Json | null
          processed_at?: string | null
          received_at?: string
          status?: string
        }
        Update: {
          error_message?: string | null
          event_id?: string
          event_type?: string
          livemode?: boolean
          payload_summary?: Json | null
          processed_at?: string | null
          received_at?: string
          status?: string
        }
        Relationships: []
      }
      sub_partner_invites: {
        Row: {
          accepted_at: string | null
          accepted_by: string | null
          commission_pct: number
          created_at: string
          email: string
          expires_at: string
          id: string
          status: string
          team_leader_id: string
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          accepted_by?: string | null
          commission_pct?: number
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          status?: string
          team_leader_id: string
          token?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          accepted_by?: string | null
          commission_pct?: number
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          status?: string
          team_leader_id?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscription_modules: {
        Row: {
          compatible_sectors: string[] | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_base_feature: boolean | null
          name: string
          price_monthly: number | null
          stripe_price_id: string | null
        }
        Insert: {
          compatible_sectors?: string[] | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_base_feature?: boolean | null
          name: string
          price_monthly?: number | null
          stripe_price_id?: string | null
        }
        Update: {
          compatible_sectors?: string[] | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_base_feature?: boolean | null
          name?: string
          price_monthly?: number | null
          stripe_price_id?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          ai_tokens: number | null
          base_features: Json | null
          created_at: string | null
          custom_domain: boolean | null
          display_name: string
          id: string
          max_team_members: number | null
          name: string
          price_monthly: number
          price_yearly: number
          priority_support: boolean | null
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
        }
        Insert: {
          ai_tokens?: number | null
          base_features?: Json | null
          created_at?: string | null
          custom_domain?: boolean | null
          display_name: string
          id?: string
          max_team_members?: number | null
          name: string
          price_monthly?: number
          price_yearly?: number
          priority_support?: boolean | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Update: {
          ai_tokens?: number | null
          base_features?: Json | null
          created_at?: string | null
          custom_domain?: boolean | null
          display_name?: string
          id?: string
          max_team_members?: number | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          priority_support?: boolean | null
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          contact_name: string | null
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          lead_time_days: number
          name: string
          notes: string | null
          phone: string | null
          restaurant_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number
          name: string
          notes?: string | null
          phone?: string | null
          restaurant_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_name?: string | null
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          lead_time_days?: number
          name?: string
          notes?: string | null
          phone?: string | null
          restaurant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_login_audit: {
        Row: {
          created_at: string
          email: string | null
          id: string
          ip_address: string | null
          metadata: Json
          outcome: string
          restaurant_id: string | null
          slug: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          outcome: string
          restaurant_id?: string | null
          slug: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json
          outcome?: string
          restaurant_id?: string | null
          slug?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_login_audit_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_login_unlock_tokens: {
        Row: {
          consumed_at: string | null
          created_at: string
          email_lower: string
          expires_at: string
          id: string
          ip_hash: string | null
          restaurant_id: string
          slug: string
          token_hash: string
          user_agent_hash: string | null
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string
          email_lower: string
          expires_at?: string
          id?: string
          ip_hash?: string | null
          restaurant_id: string
          slug: string
          token_hash: string
          user_agent_hash?: string | null
        }
        Update: {
          consumed_at?: string | null
          created_at?: string
          email_lower?: string
          expires_at?: string
          id?: string
          ip_hash?: string | null
          restaurant_id?: string
          slug?: string
          token_hash?: string
          user_agent_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_login_unlock_tokens_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_subscriptions: {
        Row: {
          active_modules: string[] | null
          billing_cycle: string | null
          company_id: string
          created_at: string | null
          id: string
          plan_id: string
          renews_at: string | null
          started_at: string | null
          status: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string | null
        }
        Insert: {
          active_modules?: string[] | null
          billing_cycle?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          plan_id: string
          renews_at?: string | null
          started_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Update: {
          active_modules?: string[] | null
          billing_cycle?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          plan_id?: string
          renews_at?: string | null
          started_at?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_subscriptions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_branding_kit_settings: {
        Row: {
          brand_locked: boolean
          created_at: string
          extra: Json
          font_body: string | null
          font_head: string | null
          font_pair_key: string
          google_fonts_href: string | null
          id: string
          primary_color: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_locked?: boolean
          created_at?: string
          extra?: Json
          font_body?: string | null
          font_head?: string | null
          font_pair_key?: string
          google_fonts_href?: string | null
          id?: string
          primary_color?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_locked?: boolean
          created_at?: string
          extra?: Json
          font_body?: string | null
          font_head?: string | null
          font_pair_key?: string
          google_fonts_href?: string | null
          id?: string
          primary_color?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      voice_command_log: {
        Row: {
          actions_executed: Json
          actions_planned: Json
          confirmation_required: boolean
          confirmed: boolean
          created_at: string
          duration_ms: number | null
          error_message: string | null
          id: string
          intent: Json
          reply_text: string | null
          status: string
          transcript: string
          user_id: string
        }
        Insert: {
          actions_executed?: Json
          actions_planned?: Json
          confirmation_required?: boolean
          confirmed?: boolean
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          intent?: Json
          reply_text?: string | null
          status?: string
          transcript: string
          user_id: string
        }
        Update: {
          actions_executed?: Json
          actions_planned?: Json
          confirmation_required?: boolean
          confirmed?: boolean
          created_at?: string
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          intent?: Json
          reply_text?: string | null
          status?: string
          transcript?: string
          user_id?: string
        }
        Relationships: []
      }
      wallet_passes: {
        Row: {
          created_at: string
          customer_phone: string
          discount_percent: number
          expires_at: string
          id: string
          pass_type: string
          redeemed: boolean
          redeemed_at: string | null
          restaurant_id: string
          serial_number: string
        }
        Insert: {
          created_at?: string
          customer_phone: string
          discount_percent?: number
          expires_at?: string
          id?: string
          pass_type?: string
          redeemed?: boolean
          redeemed_at?: string | null
          restaurant_id: string
          serial_number?: string
        }
        Update: {
          created_at?: string
          customer_phone?: string
          discount_percent?: number
          expires_at?: string
          id?: string
          pass_type?: string
          redeemed?: boolean
          redeemed_at?: string | null
          restaurant_id?: string
          serial_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_passes_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_config: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          is_active: boolean | null
          phone_number_id: string | null
          tenant_id: string
          updated_at: string
          webhook_verify_token: string | null
          whatsapp_business_account_id: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          phone_number_id?: string | null
          tenant_id: string
          updated_at?: string
          webhook_verify_token?: string | null
          whatsapp_business_account_id?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          phone_number_id?: string | null
          tenant_id?: string
          updated_at?: string
          webhook_verify_token?: string | null
          whatsapp_business_account_id?: string | null
        }
        Relationships: []
      }
      whatsapp_conversations: {
        Row: {
          contact_name: string | null
          contact_phone: string
          context: Json | null
          created_at: string
          id: string
          last_message_at: string | null
          sector: string
          status: string
          tenant_id: string
        }
        Insert: {
          contact_name?: string | null
          contact_phone: string
          context?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          sector: string
          status?: string
          tenant_id: string
        }
        Update: {
          contact_name?: string | null
          contact_phone?: string
          context?: Json | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          sector?: string
          status?: string
          tenant_id?: string
        }
        Relationships: []
      }
      whatsapp_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          direction: string
          id: string
          message_type: string
          metadata: Json | null
          status: string
          tenant_id: string
          whatsapp_message_id: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          direction: string
          id?: string
          message_type?: string
          metadata?: Json | null
          status?: string
          tenant_id: string
          whatsapp_message_id?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          direction?: string
          id?: string
          message_type?: string
          metadata?: Json | null
          status?: string
          tenant_id?: string
          whatsapp_message_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_notifications: {
        Row: {
          created_at: string
          id: string
          notification_type: string
          recipient_phone: string
          scheduled_at: string | null
          sent_at: string | null
          status: string
          template_name: string | null
          template_params: Json | null
          tenant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notification_type: string
          recipient_phone: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
          template_params?: Json | null
          tenant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notification_type?: string
          recipient_phone?: string
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string
          template_name?: string | null
          template_params?: Json | null
          tenant_id?: string
        }
        Relationships: []
      }
      whatsapp_templates: {
        Row: {
          body_text: string
          buttons: Json | null
          category: string | null
          created_at: string | null
          footer_text: string | null
          header_text: string | null
          id: string
          language: string | null
          meta_template_id: string | null
          status: string | null
          template_name: string | null
          tenant_id: string
        }
        Insert: {
          body_text: string
          buttons?: Json | null
          category?: string | null
          created_at?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          language?: string | null
          meta_template_id?: string | null
          status?: string | null
          template_name?: string | null
          tenant_id: string
        }
        Update: {
          body_text?: string
          buttons?: Json | null
          category?: string | null
          created_at?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          language?: string | null
          meta_template_id?: string | null
          status?: string | null
          template_name?: string | null
          tenant_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      restock_suggestions: {
        Row: {
          category: string | null
          cost_per_unit: number | null
          item_id: string | null
          last_restocked_at: string | null
          lead_time_days: number | null
          min_qty: number | null
          name: string | null
          par_qty: number | null
          restaurant_id: string | null
          sku: string | null
          stock_qty: number | null
          suggested_order_cost: number | null
          suggested_order_qty: number | null
          supplier_email: string | null
          supplier_id: string | null
          supplier_name: string | null
          supplier_phone: string | null
          unit: string | null
          urgency: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_restaurant_id_fkey"
            columns: ["restaurant_id"]
            isOneToOne: false
            referencedRelation: "restaurants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      accept_sub_partner_invite: { Args: { p_token: string }; Returns: Json }
      award_xp: {
        Args: { _amount: number; _reason?: string; _user_id: string }
        Returns: {
          avatar_url: string | null
          badges: Json
          created_at: string
          deals_closed_month: number
          deals_closed_total: number
          display_name: string | null
          global_rank: number | null
          id: string
          last_activity_at: string | null
          level: number
          revenue_month_eur: number
          revenue_total_eur: number
          sector: string | null
          sector_rank: number | null
          streak_days: number
          total_xp: number
          updated_at: string
          user_id: string
        }
        SetofOptions: {
          from: "*"
          to: "sales_leaderboard"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      calculate_monthly_bonus: {
        Args: { p_month: string; p_partner_id: string }
        Returns: number
      }
      check_autopilot_daily_cap: {
        Args: { _owner_id: string }
        Returns: boolean
      }
      check_outreach_health: {
        Args: {
          p_critical_rate?: number
          p_deploy_version?: string
          p_min_attempts?: number
          p_warn_rate?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      check_overdue_payments: { Args: never; Returns: undefined }
      check_team_leader_promotion: {
        Args: { p_partner_id: string }
        Returns: boolean
      }
      claim_stripe_event: {
        Args: {
          p_event_id: string
          p_event_type: string
          p_livemode?: boolean
          p_summary?: Json
        }
        Returns: boolean
      }
      compute_cost_reconciliation: {
        Args: { p_period_days?: number }
        Returns: Json
      }
      consume_seller_credits: {
        Args: { p_action: string; p_metadata?: Json }
        Returns: Json
      }
      consume_seller_credits_dedup: {
        Args: {
          p_action: string
          p_fingerprint: string
          p_metadata?: Json
          p_ttl_minutes?: number
          p_user_id: string
        }
        Returns: Json
      }
      consume_seller_credits_for: {
        Args: { p_action: string; p_metadata?: Json; p_user_id: string }
        Returns: Json
      }
      create_sub_partner_invite: {
        Args: { p_commission_pct?: number; p_email: string }
        Returns: Json
      }
      delete_push_subscription: {
        Args: { p_endpoint: string; p_p256dh: string }
        Returns: boolean
      }
      enqueue_autopilot_retry: {
        Args: {
          p_error?: string
          p_error_code?: string
          p_max_attempts?: number
          p_owner_id: string
          p_payload?: Json
          p_priority?: number
          p_source?: string
          p_step_type: string
          p_target_id: string
          p_target_table: string
        }
        Returns: string
      }
      get_my_leaderboard_row: {
        Args: never
        Returns: {
          avatar_url: string | null
          badges: Json
          created_at: string
          deals_closed_month: number
          deals_closed_total: number
          display_name: string | null
          global_rank: number | null
          id: string
          last_activity_at: string | null
          level: number
          revenue_month_eur: number
          revenue_total_eur: number
          sector: string | null
          sector_rank: number | null
          streak_days: number
          total_xp: number
          updated_at: string
          user_id: string
        }[]
        SetofOptions: {
          from: "*"
          to: "sales_leaderboard"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_pain_scan_cached: {
        Args: { _domain_hash: string; _owner_id: string }
        Returns: {
          ai_model: string
          ai_summary: string | null
          competitive_signals: Json
          cost_cents: number | null
          created_at: string
          domain: string
          domain_hash: string
          duration_ms: number | null
          error_message: string | null
          expires_at: string
          id: string
          lead_id: string | null
          owner_id: string
          pain_points: Json
          pain_score: number
          sector: string | null
          source_url: string
          status: string
          technical_metrics: Json
          updated_at: string
        }[]
        SetofOptions: {
          from: "*"
          to: "pain_scans"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_partner_stripe_account: {
        Args: { partner_user_id: string }
        Returns: {
          onboarding_complete: boolean
          stripe_account_id: string
        }[]
      }
      get_public_company_settings: {
        Args: { p_company_id: string }
        Returns: {
          confirmation_message: string
          email_template: string
          facebook_url: string
          hours: string
          instagram_url: string
          whatsapp: string
        }[]
      }
      get_public_custom_preview: {
        Args: { p_slug: string }
        Returns: {
          generation_status: string
          lead_name: string
          preview_html: string
        }[]
      }
      get_seller_credit_balance: {
        Args: { p_user_id?: string }
        Returns: number
      }
      get_user_company: { Args: { p_user_id: string }; Returns: string }
      get_user_monthly_credits_used: {
        Args: { p_user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_autopilot_scan: {
        Args: { _owner_id: string }
        Returns: undefined
      }
      increment_custom_preview_view: {
        Args: { p_slug: string }
        Returns: undefined
      }
      is_autopilot_sector_paused: {
        Args: { _owner_id: string; _sector: string }
        Returns: boolean
      }
      is_autopilot_super_admin: { Args: { _user_id: string }; Returns: boolean }
      is_company_member: {
        Args: { _company_id: string; _user_id?: string }
        Returns: boolean
      }
      is_company_owner: {
        Args: { _company_id: string; _user_id?: string }
        Returns: boolean
      }
      is_outreach_suppressed: {
        Args: { p_channel: string; p_identifier: string; p_owner_id: string }
        Returns: boolean
      }
      is_restaurant_member: {
        Args: { _restaurant_id: string }
        Returns: boolean
      }
      is_restaurant_owner: {
        Args: { _restaurant_id: string }
        Returns: boolean
      }
      is_setup_paid: { Args: { _user_id?: string }; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
      lead_search_cache_get: {
        Args: { p_action?: string; p_fingerprint: string; p_user_id: string }
        Returns: Json
      }
      lead_search_cache_put: {
        Args: {
          p_action: string
          p_fingerprint: string
          p_meta?: Json
          p_results: Json
          p_ttl_minutes?: number
          p_user_id: string
        }
        Returns: string
      }
      list_my_sub_partners: { Args: never; Returns: Json }
      list_my_tenants: {
        Args: never
        Returns: {
          is_blocked: boolean
          name: string
          restaurant_id: string
          role: string
          slug: string
        }[]
      }
      log_outreach_failure: {
        Args: {
          p_channel: string
          p_deploy_version?: string
          p_error_code?: string
          p_error_message: string
          p_http_status?: number
          p_lead_id?: string
          p_owner_id?: string
          p_payload?: Json
          p_provider?: string
          p_recipient?: string
          p_sequence_id?: string
          p_severity?: string
          p_source_function: string
          p_touch_id?: string
        }
        Returns: string
      }
      log_tenant_login_event: {
        Args: {
          p_email?: string
          p_metadata?: Json
          p_outcome: string
          p_slug: string
        }
        Returns: string
      }
      mark_autopilot_retry_success: {
        Args: { p_id: string }
        Returns: undefined
      }
      mark_stripe_event_processed: {
        Args: { p_error?: string; p_event_id: string; p_status?: string }
        Returns: undefined
      }
      mark_wa_ab_reply: {
        Args: { p_test_id: string; p_variant: string }
        Returns: Json
      }
      snapshot_cost_reconciliation: {
        Args: { p_period_days?: number }
        Returns: Json
      }
      super_admin_grant_credits: {
        Args: {
          p_amount: number
          p_mode?: string
          p_note?: string
          p_target_user_id: string
        }
        Returns: Json
      }
      super_admin_network_overview: { Args: never; Returns: Json }
      super_admin_set_credit_limits: {
        Args: {
          p_alert_threshold_pct?: number
          p_auto_block?: boolean
          p_monthly_cap?: number
          p_notes?: string
          p_target_user_id: string
        }
        Returns: Json
      }
      tick_arianna_continuous: { Args: never; Returns: undefined }
      toggle_autopilot_sector_pause: {
        Args: { _sector: string }
        Returns: Json
      }
      touch_demo_vault_reuse: {
        Args: { p_lead_name: string; p_vault_id: string }
        Returns: undefined
      }
      track_wa_ab_click: { Args: { p_short_id: string }; Returns: Json }
      verify_kitchen_pin: {
        Args: { p_pin: string }
        Returns: {
          label: string
          pin_id: string
          restaurant_id: string
        }[]
      }
      verify_tenant_access: { Args: { p_slug: string }; Returns: Json }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "staff"
        | "restaurant_admin"
        | "customer"
        | "partner"
        | "team_leader"
      business_type: "restaurant" | "pizzeria" | "bar" | "bakery" | "sushi"
      privacy_level: "strict" | "standard" | "minimal"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "staff",
        "restaurant_admin",
        "customer",
        "partner",
        "team_leader",
      ],
      business_type: ["restaurant", "pizzeria", "bar", "bakery", "sushi"],
      privacy_level: ["strict", "standard", "minimal"],
    },
  },
} as const
