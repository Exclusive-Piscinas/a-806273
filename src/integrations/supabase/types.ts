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
      cities: {
        Row: {
          country_id: number | null
          id: number
          name: string
        }
        Insert: {
          country_id?: number | null
          id?: never
          name: string
        }
        Update: {
          country_id?: number | null
          id?: never
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes_piscinas: {
        Row: {
          cep: string | null
          cidade: string | null
          created_at: string
          documento: string | null
          email: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          tipo_cliente: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          tipo_cliente?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          created_at?: string
          documento?: string | null
          email?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          tipo_cliente?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      countries: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: never
          name: string
        }
        Update: {
          id?: never
          name?: string
        }
        Relationships: []
      }
      estoque_piscinas: {
        Row: {
          categoria: string
          codigo_produto: string | null
          created_at: string
          data_validade: string | null
          fornecedor: string | null
          id: string
          localizacao: string | null
          nome: string
          observacoes: string | null
          preco_unitario: number
          quantidade: number
          quantidade_minima: number
          subcategoria: string | null
          unidade: string
          updated_at: string
          user_id: string
        }
        Insert: {
          categoria: string
          codigo_produto?: string | null
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          nome: string
          observacoes?: string | null
          preco_unitario?: number
          quantidade?: number
          quantidade_minima?: number
          subcategoria?: string | null
          unidade?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          categoria?: string
          codigo_produto?: string | null
          created_at?: string
          data_validade?: string | null
          fornecedor?: string | null
          id?: string
          localizacao?: string | null
          nome?: string
          observacoes?: string | null
          preco_unitario?: number
          quantidade?: number
          quantidade_minima?: number
          subcategoria?: string | null
          unidade?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      financeiro_piscinas: {
        Row: {
          categoria: string
          created_at: string
          data_transacao: string
          descricao: string
          forma_pagamento: string | null
          id: string
          observacoes: string | null
          projeto_id: string | null
          status: string
          tipo: string
          updated_at: string
          user_id: string
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string
          data_transacao?: string
          descricao: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string
          data_transacao?: string
          descricao?: string
          forma_pagamento?: string | null
          id?: string
          observacoes?: string | null
          projeto_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "financeiro_piscinas_projeto_id_fkey"
            columns: ["projeto_id"]
            isOneToOne: false
            referencedRelation: "projetos_piscinas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome_completo: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          nome_completo?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome_completo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      projetos_piscinas: {
        Row: {
          created_at: string
          data_finalizacao: string | null
          data_inicio: string | null
          data_previsao_fim: string | null
          email_cliente: string | null
          endereco: string | null
          id: string
          nome_cliente: string
          observacoes: string | null
          orcamento_total: number | null
          profundidade: number | null
          status: string
          tamanho_metros: string | null
          telefone_cliente: string | null
          tipo_piscina: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_finalizacao?: string | null
          data_inicio?: string | null
          data_previsao_fim?: string | null
          email_cliente?: string | null
          endereco?: string | null
          id?: string
          nome_cliente: string
          observacoes?: string | null
          orcamento_total?: number | null
          profundidade?: number | null
          status?: string
          tamanho_metros?: string | null
          telefone_cliente?: string | null
          tipo_piscina: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_finalizacao?: string | null
          data_inicio?: string | null
          data_previsao_fim?: string | null
          email_cliente?: string | null
          endereco?: string | null
          id?: string
          nome_cliente?: string
          observacoes?: string | null
          orcamento_total?: number | null
          profundidade?: number | null
          status?: string
          tamanho_metros?: string | null
          telefone_cliente?: string | null
          tipo_piscina?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      your_table_name: {
        Row: {
          created_at: string | null
          data: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: string | null
          id?: never
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string | null
          id?: never
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_total_users: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_user_details: {
        Args: Record<PropertyKey, never> | { user_id: number }
        Returns: {
          id: number
          username: string
          email: string
        }[]
      }
      get_user_profile: {
        Args: Record<PropertyKey, never> | { user_id: number }
        Returns: {
          id: number
          username: string
          email: string
        }[]
      }
      update_updated_at_column: {
        Args: { record_id: number; new_timestamp: string }
        Returns: undefined
      }
      update_user_profile: {
        Args:
          | Record<PropertyKey, never>
          | { user_id: number; new_username: string; new_email: string }
          | { user_id: number; profile_data: Json }
          | { user_id: number; username: string; email: string; bio: string }
        Returns: undefined
      }
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
