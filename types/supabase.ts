export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          quantity: number
          unit_price: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number
          unit_price: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string | null
          id: string
          notes: string | null
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          tracking_code: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string | null
          id?: string
          notes?: string | null
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          tracking_code?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          images: Json | null
          metadata: Json | null
          name: string
          price: number
          stock: number
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          name: string
          price: number
          stock?: number
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          images?: Json | null
          metadata?: Json | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_product: {
        Args: {
          p_category: string
          p_description: string
          p_images: Json
          p_metadata: Json
          p_name: string
          p_price: number
          p_stock: number
        }
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json
          metadata: Json
          name: string
          price: number
          stock: number
          updated_at: string
        }[]
      }
      delete_product: { Args: { p_id: string }; Returns: boolean }
      get_product_by_id: {
        Args: { p_id: string }
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json
          metadata: Json
          name: string
          price: number
          stock: number
          updated_at: string
        }[]
      }
      get_products: {
        Args: { p_category: string; p_limit: number; p_offset: number }
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json
          metadata: Json
          name: string
          price: number
          stock: number
          updated_at: string
        }[]
      }
      get_products_simple: {
        Args: never
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json
          metadata: Json
          name: string
          price: number
          stock: number
          updated_at: string
        }[]
      }
      update_product: {
        Args: {
          p_category: string
          p_description: string
          p_id: string
          p_images: Json
          p_metadata: Json
          p_name: string
          p_price: number
          p_stock: number
        }
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          images: Json
          metadata: Json
          name: string
          price: number
          stock: number
          updated_at: string
        }[]
      }
    }
    Enums: {
      order_status: "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled"
      user_role: "admin" | "customer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]

export type UserRole = Database["public"]["Enums"]["user_role"]
export type OrderStatus = Database["public"]["Enums"]["order_status"]