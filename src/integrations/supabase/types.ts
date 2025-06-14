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
      accident_report_signatures: {
        Row: {
          created_at: string | null
          id: string
          party_a_signature: string | null
          party_a_signed_at: string | null
          party_b_signature: string | null
          party_b_signed_at: string | null
          pdf_generated: boolean | null
          pdf_url: string | null
          report_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          party_a_signature?: string | null
          party_a_signed_at?: string | null
          party_b_signature?: string | null
          party_b_signed_at?: string | null
          pdf_generated?: boolean | null
          pdf_url?: string | null
          report_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          party_a_signature?: string | null
          party_a_signed_at?: string | null
          party_b_signature?: string | null
          party_b_signed_at?: string | null
          pdf_generated?: boolean | null
          pdf_url?: string | null
          report_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accident_report_signatures_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "accident_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      accident_reports: {
        Row: {
          created_at: string
          damage_photos: string[] | null
          date: string
          description: string | null
          geolocation_address: string | null
          geolocation_lat: number | null
          geolocation_lng: number | null
          id: string
          location: string
          other_vehicle_id: string | null
          time: string
          user_id: string | null
          vehicle_id: string | null
          vehicle_photos: string[] | null
        }
        Insert: {
          created_at?: string
          damage_photos?: string[] | null
          date: string
          description?: string | null
          geolocation_address?: string | null
          geolocation_lat?: number | null
          geolocation_lng?: number | null
          id?: string
          location: string
          other_vehicle_id?: string | null
          time: string
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_photos?: string[] | null
        }
        Update: {
          created_at?: string
          damage_photos?: string[] | null
          date?: string
          description?: string | null
          geolocation_address?: string | null
          geolocation_lat?: number | null
          geolocation_lng?: number | null
          id?: string
          location?: string
          other_vehicle_id?: string | null
          time?: string
          user_id?: string | null
          vehicle_id?: string | null
          vehicle_photos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "accident_reports_other_vehicle_id_fkey"
            columns: ["other_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accident_reports_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_street: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          brand: string | null
          created_at: string
          id: string
          license_plate: string
          model: string | null
          updated_at: string
          user_id: string | null
          year: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string
          id?: string
          license_plate: string
          model?: string | null
          updated_at?: string
          user_id?: string | null
          year?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string
          id?: string
          license_plate?: string
          model?: string | null
          updated_at?: string
          user_id?: string | null
          year?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
