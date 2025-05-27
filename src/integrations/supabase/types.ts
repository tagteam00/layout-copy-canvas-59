export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      interests: {
        Row: {
          category: Database["public"]["Enums"]["interest_category"]
          created_at: string
          id: string
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["interest_category"]
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["interest_category"]
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          metadata: Json | null
          read: boolean
          related_id: string | null
          related_to: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          read?: boolean
          related_id?: string | null
          related_to: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          read?: boolean
          related_id?: string | null
          related_to?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          commitment_level: string | null
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          gender: string | null
          id: string
          interests: string[] | null
          occupation: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commitment_level?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          interests?: string[] | null
          occupation?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          commitment_level?: string | null
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          occupation?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      team_activities: {
        Row: {
          created_at: string
          cycle_end: string | null
          cycle_start: string
          id: string
          logged_by_user_id: string
          status: string
          team_id: string
          verified_user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end?: string | null
          cycle_start?: string
          id?: string
          logged_by_user_id: string
          status: string
          team_id: string
          verified_user_id: string
        }
        Update: {
          created_at?: string
          cycle_end?: string | null
          cycle_start?: string
          id?: string
          logged_by_user_id?: string
          status?: string
          team_id?: string
          verified_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_activities_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_goals: {
        Row: {
          created_at: string
          cycle_end: string | null
          cycle_start: string
          goal: string
          id: string
          team_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end?: string | null
          cycle_start?: string
          goal: string
          id?: string
          team_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_end?: string | null
          cycle_start?: string
          goal?: string
          id?: string
          team_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_goals_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      team_requests: {
        Row: {
          category: string
          created_at: string
          frequency: string
          id: string
          name: string
          receiver_id: string
          sender_id: string
          status: string
        }
        Insert: {
          category: string
          created_at?: string
          frequency: string
          id?: string
          name: string
          receiver_id: string
          sender_id: string
          status?: string
        }
        Update: {
          category?: string
          created_at?: string
          frequency?: string
          id?: string
          name?: string
          receiver_id?: string
          sender_id?: string
          status?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          category: string
          created_at: string
          ended_at: string | null
          ended_by: string | null
          frequency: string
          id: string
          members: string[]
          name: string
        }
        Insert: {
          category: string
          created_at?: string
          ended_at?: string | null
          ended_by?: string | null
          frequency: string
          id?: string
          members: string[]
          name: string
        }
        Update: {
          category?: string
          created_at?: string
          ended_at?: string | null
          ended_by?: string | null
          frequency?: string
          id?: string
          members?: string[]
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      close_expired_activity_cycles: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      close_team_activity_cycle: {
        Args: { team_id_param: string }
        Returns: number
      }
    }
    Enums: {
      interest_category: "fitness" | "arts"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      interest_category: ["fitness", "arts"],
    },
  },
} as const
