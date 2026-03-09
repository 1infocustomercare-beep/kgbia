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
          created_at: string
          credits_used: number
          expires_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          action?: string
          created_at?: string
          credits_used?: number
          expires_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          credits_used?: number
          expires_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
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
      partner_demo_credits: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
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
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          min_order_amount: number | null
          name: string
          opening_hours: Json | null
          owner_id: string | null
          phone: string | null
          policy_accepted: boolean | null
          policy_accepted_at: string | null
          primary_color: string | null
          setup_paid: boolean
          slug: string
          stripe_account_id: string | null
          stripe_connect_account_id: string | null
          stripe_onboarding_complete: boolean
          table_orders_enabled: boolean
          tagline: string | null
          takeaway_enabled: boolean
          updated_at: string
        }
        Insert: {
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
          min_order_amount?: number | null
          name: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          policy_accepted?: boolean | null
          policy_accepted_at?: string | null
          primary_color?: string | null
          setup_paid?: boolean
          slug: string
          stripe_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_complete?: boolean
          table_orders_enabled?: boolean
          tagline?: string | null
          takeaway_enabled?: boolean
          updated_at?: string
        }
        Update: {
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
          min_order_amount?: number | null
          name?: string
          opening_hours?: Json | null
          owner_id?: string | null
          phone?: string | null
          policy_accepted?: boolean | null
          policy_accepted_at?: string | null
          primary_color?: string | null
          setup_paid?: boolean
          slug?: string
          stripe_account_id?: string | null
          stripe_connect_account_id?: string | null
          stripe_onboarding_complete?: boolean
          table_orders_enabled?: boolean
          tagline?: string | null
          takeaway_enabled?: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_monthly_bonus: {
        Args: { p_month: string; p_partner_id: string }
        Returns: number
      }
      check_overdue_payments: { Args: never; Returns: undefined }
      check_team_leader_promotion: {
        Args: { p_partner_id: string }
        Returns: boolean
      }
      get_partner_stripe_account: {
        Args: { partner_user_id: string }
        Returns: {
          onboarding_complete: boolean
          stripe_account_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
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
      is_staff: { Args: never; Returns: boolean }
      is_super_admin: { Args: never; Returns: boolean }
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
    },
  },
} as const
