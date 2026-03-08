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
      bill_reminders: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          frequency: string | null
          id: string
          is_paid: boolean
          is_recurring: boolean
          notification_days: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          due_date: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          frequency?: string | null
          id?: string
          is_paid?: boolean
          is_recurring?: boolean
          notification_days?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      couple_links: {
        Row: {
          created_at: string
          id: string
          invite_code: string
          status: string
          updated_at: string
          user_id_1: string
          user_id_2: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          invite_code?: string
          status?: string
          updated_at?: string
          user_id_1: string
          user_id_2?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          invite_code?: string
          status?: string
          updated_at?: string
          user_id_1?: string
          user_id_2?: string | null
        }
        Relationships: []
      }
      couple_messages: {
        Row: {
          couple_link_id: string
          created_at: string
          id: string
          message: string
          sender_id: string
        }
        Insert: {
          couple_link_id: string
          created_at?: string
          id?: string
          message: string
          sender_id: string
        }
        Update: {
          couple_link_id?: string
          created_at?: string
          id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_messages_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_shared_expenses: {
        Row: {
          added_by: string
          amount: number
          category: string
          couple_link_id: string
          created_at: string
          date: string
          description: string
          id: string
          split_percentage: number
          split_type: string
        }
        Insert: {
          added_by: string
          amount: number
          category?: string
          couple_link_id: string
          created_at?: string
          date?: string
          description: string
          id?: string
          split_percentage?: number
          split_type?: string
        }
        Update: {
          added_by?: string
          amount?: number
          category?: string
          couple_link_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          split_percentage?: number
          split_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_shared_expenses_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_shared_goals: {
        Row: {
          couple_link_id: string
          created_at: string
          current_amount: number
          deadline: string | null
          icon: string
          id: string
          target_amount: number
          title: string
          updated_at: string
        }
        Insert: {
          couple_link_id: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string
          id?: string
          target_amount?: number
          title: string
          updated_at?: string
        }
        Update: {
          couple_link_id?: string
          created_at?: string
          current_amount?: number
          deadline?: string | null
          icon?: string
          id?: string
          target_amount?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_shared_goals_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_wishlists: {
        Row: {
          added_by: string
          couple_link_id: string
          created_at: string
          estimated_cost: number
          id: string
          is_purchased: boolean
          priority: string
          title: string
          url: string | null
        }
        Insert: {
          added_by: string
          couple_link_id: string
          created_at?: string
          estimated_cost?: number
          id?: string
          is_purchased?: boolean
          priority?: string
          title: string
          url?: string | null
        }
        Update: {
          added_by?: string
          couple_link_id?: string
          created_at?: string
          estimated_cost?: number
          id?: string
          is_purchased?: boolean
          priority?: string
          title?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "couple_wishlists_couple_link_id_fkey"
            columns: ["couple_link_id"]
            isOneToOne: false
            referencedRelation: "couple_links"
            referencedColumns: ["id"]
          },
        ]
      }
      iou_splits: {
        Row: {
          created_at: string
          date: string
          id: string
          participants: Json
          title: string
          total_amount: number
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          participants?: Json
          title: string
          total_amount: number
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          participants?: Json
          title?: string
          total_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      ious: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          description: string
          due_date: string | null
          id: string
          is_owed_to_me: boolean
          notes: string[]
          paid_amount: number
          person: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string
          created_at?: string
          date?: string
          description: string
          due_date?: string | null
          id?: string
          is_owed_to_me?: boolean
          notes?: string[]
          paid_amount?: number
          person: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          description?: string
          due_date?: string | null
          id?: string
          is_owed_to_me?: boolean
          notes?: string[]
          paid_amount?: number
          person?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          description: string
          icon_type: string
          id: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          icon_type?: string
          id?: string
          read?: boolean
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          icon_type?: string
          id?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          is_blocked: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_blocked?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          is_blocked?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_blocked: { Args: { _user_id: string }; Returns: boolean }
      is_couple_member: {
        Args: { _couple_link_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
