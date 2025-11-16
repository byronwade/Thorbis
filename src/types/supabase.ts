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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          action: string
          activity_type: string
          actor_id: string | null
          actor_name: string | null
          actor_type: string
          ai_model: string | null
          attachment_name: string | null
          attachment_type: string | null
          attachment_url: string | null
          automation_workflow_id: string | null
          automation_workflow_name: string | null
          category: string
          company_id: string
          created_at: string
          description: string | null
          entity_id: string
          entity_type: string
          field_name: string | null
          id: string
          is_important: boolean
          is_system_generated: boolean
          is_visible: boolean
          metadata: Json | null
          new_value: string | null
          occurred_at: string
          old_value: string | null
          related_entity_id: string | null
          related_entity_type: string | null
        }
        Insert: {
          action: string
          activity_type: string
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string
          ai_model?: string | null
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          automation_workflow_id?: string | null
          automation_workflow_name?: string | null
          category: string
          company_id: string
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: string
          field_name?: string | null
          id?: string
          is_important?: boolean
          is_system_generated?: boolean
          is_visible?: boolean
          metadata?: Json | null
          new_value?: string | null
          occurred_at?: string
          old_value?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
        }
        Update: {
          action?: string
          activity_type?: string
          actor_id?: string | null
          actor_name?: string | null
          actor_type?: string
          ai_model?: string | null
          attachment_name?: string | null
          attachment_type?: string | null
          attachment_url?: string | null
          automation_workflow_id?: string | null
          automation_workflow_name?: string | null
          category?: string
          company_id?: string
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: string
          field_name?: string | null
          id?: string
          is_important?: boolean
          is_system_generated?: boolean
          is_visible?: boolean
          metadata?: Json | null
          new_value?: string | null
          occurred_at?: string
          old_value?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_actor_id_users_id_fk"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      api_keys: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          id: string
          key_hash: string
          key_prefix: string
          last_used_at: string | null
          name: string
          permissions: Json
          rate_limit: number
          revoked_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash: string
          key_prefix: string
          last_used_at?: string | null
          name: string
          permissions?: Json
          rate_limit?: number
          revoked_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          id?: string
          key_hash?: string
          key_prefix?: string
          last_used_at?: string | null
          name?: string
          permissions?: Json
          rate_limit?: number
          revoked_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "api_keys_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "api_keys_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          appointment_number: string
          assigned_to: string | null
          cancellation_reason: string | null
          company_id: string
          confirmation_sent: boolean | null
          created_at: string | null
          created_by: string | null
          customer_id: string
          description: string | null
          duration_minutes: number | null
          id: string
          job_id: string | null
          notes: string | null
          priority: string | null
          property_id: string | null
          reminder_sent: boolean | null
          scheduled_end: string
          scheduled_start: string
          search_vector: unknown
          status: string
          title: string
          travel_time_minutes: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_number: string
          assigned_to?: string | null
          cancellation_reason?: string | null
          company_id: string
          confirmation_sent?: boolean | null
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          job_id?: string | null
          notes?: string | null
          priority?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          scheduled_end: string
          scheduled_start: string
          search_vector?: unknown
          status?: string
          title: string
          travel_time_minutes?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          appointment_number?: string
          assigned_to?: string | null
          cancellation_reason?: string | null
          company_id?: string
          confirmation_sent?: boolean | null
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          job_id?: string | null
          notes?: string | null
          priority?: string | null
          property_id?: string | null
          reminder_sent?: boolean | null
          scheduled_end?: string
          scheduled_start?: string
          search_vector?: unknown
          status?: string
          title?: string
          travel_time_minutes?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          access_count: number | null
          category: string | null
          checksum: string | null
          company_id: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          download_count: number | null
          duration: number | null
          entity_id: string
          entity_type: string
          expiry_date: string | null
          file_extension: string | null
          file_name: string
          file_size: number
          folder_path: string | null
          height: number | null
          id: string
          is_document: boolean
          is_favorite: boolean | null
          is_image: boolean
          is_internal: boolean
          is_public: boolean
          is_video: boolean
          last_accessed_at: string | null
          last_accessed_by: string | null
          last_downloaded_at: string | null
          metadata: Json | null
          mime_type: string
          original_file_name: string
          parent_id: string | null
          storage_bucket: string | null
          storage_path: string
          storage_provider: string
          storage_url: string
          tags: Json | null
          thumbnail_url: string | null
          updated_at: string
          uploaded_at: string
          uploaded_by: string
          version: number | null
          virus_scan_result: Json | null
          virus_scan_status:
            | Database["public"]["Enums"]["virus_scan_status"]
            | null
          virus_scanned_at: string | null
          width: number | null
        }
        Insert: {
          access_count?: number | null
          category?: string | null
          checksum?: string | null
          company_id: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          download_count?: number | null
          duration?: number | null
          entity_id: string
          entity_type: string
          expiry_date?: string | null
          file_extension?: string | null
          file_name: string
          file_size: number
          folder_path?: string | null
          height?: number | null
          id?: string
          is_document?: boolean
          is_favorite?: boolean | null
          is_image?: boolean
          is_internal?: boolean
          is_public?: boolean
          is_video?: boolean
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          last_downloaded_at?: string | null
          metadata?: Json | null
          mime_type: string
          original_file_name: string
          parent_id?: string | null
          storage_bucket?: string | null
          storage_path: string
          storage_provider?: string
          storage_url: string
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by: string
          version?: number | null
          virus_scan_result?: Json | null
          virus_scan_status?:
            | Database["public"]["Enums"]["virus_scan_status"]
            | null
          virus_scanned_at?: string | null
          width?: number | null
        }
        Update: {
          access_count?: number | null
          category?: string | null
          checksum?: string | null
          company_id?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          download_count?: number | null
          duration?: number | null
          entity_id?: string
          entity_type?: string
          expiry_date?: string | null
          file_extension?: string | null
          file_name?: string
          file_size?: number
          folder_path?: string | null
          height?: number | null
          id?: string
          is_document?: boolean
          is_favorite?: boolean | null
          is_image?: boolean
          is_internal?: boolean
          is_public?: boolean
          is_video?: boolean
          last_accessed_at?: string | null
          last_accessed_by?: string | null
          last_downloaded_at?: string | null
          metadata?: Json | null
          mime_type?: string
          original_file_name?: string
          parent_id?: string | null
          storage_bucket?: string | null
          storage_path?: string
          storage_provider?: string
          storage_url?: string
          tags?: Json | null
          thumbnail_url?: string | null
          updated_at?: string
          uploaded_at?: string
          uploaded_by?: string
          version?: number | null
          virus_scan_result?: Json | null
          virus_scan_status?:
            | Database["public"]["Enums"]["virus_scan_status"]
            | null
          virus_scanned_at?: string | null
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "attachments_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_last_accessed_by_fkey"
            columns: ["last_accessed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_users_id_fk"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          company_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          company_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          company_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      background_jobs: {
        Row: {
          attempts: number
          company_id: string | null
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          job_type: string
          max_attempts: number
          payload: Json
          priority: number
          scheduled_for: string
          started_at: string | null
          status: string
        }
        Insert: {
          attempts?: number
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type: string
          max_attempts?: number
          payload: Json
          priority?: number
          scheduled_for?: string
          started_at?: string | null
          status?: string
        }
        Update: {
          attempts?: number
          company_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          job_type?: string
          max_attempts?: number
          payload?: Json
          priority?: number
          scheduled_for?: string
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "background_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "background_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      blog_authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          slug: string
          title: string | null
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          slug: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          slug?: string
          title?: string | null
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "content_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean
          author_id: string | null
          canonical_url: string | null
          category_id: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          metadata: Json
          pinned: boolean
          published_at: string | null
          reading_time: number
          search_vector: unknown
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
        }
        Insert: {
          allow_comments?: boolean
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          metadata?: Json
          pinned?: boolean
          published_at?: string | null
          reading_time?: number
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
        }
        Update: {
          allow_comments?: boolean
          author_id?: string | null
          canonical_url?: string | null
          category_id?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          metadata?: Json
          pinned?: boolean
          published_at?: string | null
          reading_time?: number
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_settings: {
        Row: {
          allow_time_preferences: boolean | null
          available_services: Json | null
          company_id: string
          created_at: string | null
          id: string
          max_bookings_per_day: number | null
          min_booking_notice_hours: number | null
          online_booking_enabled: boolean | null
          require_account: boolean | null
          require_immediate_payment: boolean | null
          require_service_selection: boolean | null
          send_confirmation_email: boolean | null
          send_confirmation_sms: boolean | null
          show_pricing: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_time_preferences?: boolean | null
          available_services?: Json | null
          company_id: string
          created_at?: string | null
          id?: string
          max_bookings_per_day?: number | null
          min_booking_notice_hours?: number | null
          online_booking_enabled?: boolean | null
          require_account?: boolean | null
          require_immediate_payment?: boolean | null
          require_service_selection?: boolean | null
          send_confirmation_email?: boolean | null
          send_confirmation_sms?: boolean | null
          show_pricing?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_time_preferences?: boolean | null
          available_services?: Json | null
          company_id?: string
          created_at?: string | null
          id?: string
          max_bookings_per_day?: number | null
          min_booking_notice_hours?: number | null
          online_booking_enabled?: boolean | null
          require_account?: boolean | null
          require_immediate_payment?: boolean | null
          require_service_selection?: boolean | null
          send_confirmation_email?: boolean | null
          send_confirmation_sms?: boolean | null
          show_pricing?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      call_logs: {
        Row: {
          answered_at: string | null
          billable_seconds: number | null
          call_sid: string
          call_status: string | null
          caller_name: string | null
          company_id: string
          cost_cents: number | null
          created_at: string | null
          customer_id: string | null
          direction: string
          duration_seconds: number | null
          ended_at: string | null
          from_number: string
          id: string
          job_id: string | null
          metadata: Json | null
          notes: string | null
          phone_number_id: string | null
          queue_time_seconds: number | null
          recording_duration: number | null
          recording_url: string | null
          routing_rule_id: string | null
          started_at: string | null
          tags: string[] | null
          team_member_id: string | null
          to_number: string
          transfer_type: string | null
          transferred_from_team_member_id: string | null
          updated_at: string | null
          voicemail_id: string | null
        }
        Insert: {
          answered_at?: string | null
          billable_seconds?: number | null
          call_sid: string
          call_status?: string | null
          caller_name?: string | null
          company_id: string
          cost_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          direction: string
          duration_seconds?: number | null
          ended_at?: string | null
          from_number: string
          id?: string
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          phone_number_id?: string | null
          queue_time_seconds?: number | null
          recording_duration?: number | null
          recording_url?: string | null
          routing_rule_id?: string | null
          started_at?: string | null
          tags?: string[] | null
          team_member_id?: string | null
          to_number: string
          transfer_type?: string | null
          transferred_from_team_member_id?: string | null
          updated_at?: string | null
          voicemail_id?: string | null
        }
        Update: {
          answered_at?: string | null
          billable_seconds?: number | null
          call_sid?: string
          call_status?: string | null
          caller_name?: string | null
          company_id?: string
          cost_cents?: number | null
          created_at?: string | null
          customer_id?: string | null
          direction?: string
          duration_seconds?: number | null
          ended_at?: string | null
          from_number?: string
          id?: string
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          phone_number_id?: string | null
          queue_time_seconds?: number | null
          recording_duration?: number | null
          recording_url?: string | null
          routing_rule_id?: string | null
          started_at?: string | null
          tags?: string[] | null
          team_member_id?: string | null
          to_number?: string
          transfer_type?: string | null
          transferred_from_team_member_id?: string | null
          updated_at?: string | null
          voicemail_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "call_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_routing_rule_id_fkey"
            columns: ["routing_rule_id"]
            isOneToOne: false
            referencedRelation: "call_routing_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_transferred_from_team_member_id_fkey"
            columns: ["transferred_from_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_logs_voicemail_id_fkey"
            columns: ["voicemail_id"]
            isOneToOne: false
            referencedRelation: "voicemails"
            referencedColumns: ["id"]
          },
        ]
      }
      call_queue: {
        Row: {
          assigned_team_member_id: string | null
          call_sid: string
          caller_name: string | null
          caller_phone_number: string
          company_id: string
          connected_at: string | null
          created_at: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          phone_number_id: string | null
          queue_position: number
          queued_at: string | null
          routing_rule_id: string | null
          status: string | null
          updated_at: string | null
          wait_time_seconds: number | null
        }
        Insert: {
          assigned_team_member_id?: string | null
          call_sid: string
          caller_name?: string | null
          caller_phone_number: string
          company_id: string
          connected_at?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          phone_number_id?: string | null
          queue_position?: number
          queued_at?: string | null
          routing_rule_id?: string | null
          status?: string | null
          updated_at?: string | null
          wait_time_seconds?: number | null
        }
        Update: {
          assigned_team_member_id?: string | null
          call_sid?: string
          caller_name?: string | null
          caller_phone_number?: string
          company_id?: string
          connected_at?: string | null
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          phone_number_id?: string | null
          queue_position?: number
          queued_at?: string | null
          routing_rule_id?: string | null
          status?: string | null
          updated_at?: string | null
          wait_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "call_queue_assigned_team_member_id_fkey"
            columns: ["assigned_team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "call_queue_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_queue_routing_rule_id_fkey"
            columns: ["routing_rule_id"]
            isOneToOne: false
            referencedRelation: "call_routing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      call_routing_rules: {
        Row: {
          after_hours_action: string | null
          after_hours_forward_to: string | null
          business_hours: Json | null
          company_id: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          current_index: number | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          enable_voicemail: boolean | null
          forward_to_number: string | null
          forward_to_user_id: string | null
          id: string
          is_active: boolean | null
          ivr_greeting_url: string | null
          ivr_invalid_retry_count: number | null
          ivr_menu: Json | null
          ivr_timeout: number | null
          name: string
          priority: number | null
          record_calls: boolean | null
          recording_channels: string | null
          ring_timeout: number | null
          routing_type: string
          team_members: string[] | null
          timezone: string | null
          updated_at: string | null
          voicemail_email_notifications: boolean | null
          voicemail_greeting_url: string | null
          voicemail_notification_recipients: string[] | null
          voicemail_sms_notifications: boolean | null
          voicemail_transcription_enabled: boolean | null
        }
        Insert: {
          after_hours_action?: string | null
          after_hours_forward_to?: string | null
          business_hours?: Json | null
          company_id: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_index?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          enable_voicemail?: boolean | null
          forward_to_number?: string | null
          forward_to_user_id?: string | null
          id?: string
          is_active?: boolean | null
          ivr_greeting_url?: string | null
          ivr_invalid_retry_count?: number | null
          ivr_menu?: Json | null
          ivr_timeout?: number | null
          name: string
          priority?: number | null
          record_calls?: boolean | null
          recording_channels?: string | null
          ring_timeout?: number | null
          routing_type: string
          team_members?: string[] | null
          timezone?: string | null
          updated_at?: string | null
          voicemail_email_notifications?: boolean | null
          voicemail_greeting_url?: string | null
          voicemail_notification_recipients?: string[] | null
          voicemail_sms_notifications?: boolean | null
          voicemail_transcription_enabled?: boolean | null
        }
        Update: {
          after_hours_action?: string | null
          after_hours_forward_to?: string | null
          business_hours?: Json | null
          company_id?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          current_index?: number | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          enable_voicemail?: boolean | null
          forward_to_number?: string | null
          forward_to_user_id?: string | null
          id?: string
          is_active?: boolean | null
          ivr_greeting_url?: string | null
          ivr_invalid_retry_count?: number | null
          ivr_menu?: Json | null
          ivr_timeout?: number | null
          name?: string
          priority?: number | null
          record_calls?: boolean | null
          recording_channels?: string | null
          ring_timeout?: number | null
          routing_type?: string
          team_members?: string[] | null
          timezone?: string | null
          updated_at?: string | null
          voicemail_email_notifications?: boolean | null
          voicemail_greeting_url?: string | null
          voicemail_notification_recipients?: string[] | null
          voicemail_sms_notifications?: boolean | null
          voicemail_transcription_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "call_routing_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "call_routing_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: string
          title: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_settings: {
        Row: {
          allow_skip_items: boolean | null
          auto_assign_by_job_type: boolean | null
          company_id: string
          created_at: string | null
          default_template_id: string | null
          id: string
          require_checklist_completion: boolean | null
          require_photos_for_checklist: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_skip_items?: boolean | null
          auto_assign_by_job_type?: boolean | null
          company_id: string
          created_at?: string | null
          default_template_id?: string | null
          id?: string
          require_checklist_completion?: boolean | null
          require_photos_for_checklist?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_skip_items?: boolean | null
          auto_assign_by_job_type?: boolean | null
          company_id?: string
          created_at?: string | null
          default_template_id?: string | null
          id?: string
          require_checklist_completion?: boolean | null
          require_photos_for_checklist?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checklist_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communication_email_settings: {
        Row: {
          auto_cc_email: string | null
          auto_cc_enabled: boolean | null
          company_id: string
          created_at: string | null
          default_signature: string | null
          email_logo_url: string | null
          id: string
          primary_color: string | null
          smtp_enabled: boolean | null
          smtp_from_email: string | null
          smtp_from_name: string | null
          smtp_host: string | null
          smtp_password_encrypted: string | null
          smtp_port: number | null
          smtp_use_tls: boolean | null
          smtp_username: string | null
          track_clicks: boolean | null
          track_opens: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_cc_email?: string | null
          auto_cc_enabled?: boolean | null
          company_id: string
          created_at?: string | null
          default_signature?: string | null
          email_logo_url?: string | null
          id?: string
          primary_color?: string | null
          smtp_enabled?: boolean | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password_encrypted?: string | null
          smtp_port?: number | null
          smtp_use_tls?: boolean | null
          smtp_username?: string | null
          track_clicks?: boolean | null
          track_opens?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_cc_email?: string | null
          auto_cc_enabled?: boolean | null
          company_id?: string
          created_at?: string | null
          default_signature?: string | null
          email_logo_url?: string | null
          id?: string
          primary_color?: string | null
          smtp_enabled?: boolean | null
          smtp_from_email?: string | null
          smtp_from_name?: string | null
          smtp_host?: string | null
          smtp_password_encrypted?: string | null
          smtp_port?: number | null
          smtp_use_tls?: boolean | null
          smtp_username?: string | null
          track_clicks?: boolean | null
          track_opens?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_email_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_email_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communication_notification_settings: {
        Row: {
          company_id: string
          created_at: string | null
          email_notifications: boolean | null
          id: string
          in_app_notifications: boolean | null
          notify_customer_updates: boolean | null
          notify_estimate_approved: boolean | null
          notify_estimate_declined: boolean | null
          notify_estimate_sent: boolean | null
          notify_invoice_overdue: boolean | null
          notify_invoice_paid: boolean | null
          notify_invoice_sent: boolean | null
          notify_job_completions: boolean | null
          notify_job_updates: boolean | null
          notify_new_customers: boolean | null
          notify_new_jobs: boolean | null
          notify_schedule_changes: boolean | null
          notify_technician_assigned: boolean | null
          push_notifications: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          notify_customer_updates?: boolean | null
          notify_estimate_approved?: boolean | null
          notify_estimate_declined?: boolean | null
          notify_estimate_sent?: boolean | null
          notify_invoice_overdue?: boolean | null
          notify_invoice_paid?: boolean | null
          notify_invoice_sent?: boolean | null
          notify_job_completions?: boolean | null
          notify_job_updates?: boolean | null
          notify_new_customers?: boolean | null
          notify_new_jobs?: boolean | null
          notify_schedule_changes?: boolean | null
          notify_technician_assigned?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          in_app_notifications?: boolean | null
          notify_customer_updates?: boolean | null
          notify_estimate_approved?: boolean | null
          notify_estimate_declined?: boolean | null
          notify_estimate_sent?: boolean | null
          notify_invoice_overdue?: boolean | null
          notify_invoice_paid?: boolean | null
          notify_invoice_sent?: boolean | null
          notify_job_completions?: boolean | null
          notify_job_updates?: boolean | null
          notify_new_customers?: boolean | null
          notify_new_jobs?: boolean | null
          notify_schedule_changes?: boolean | null
          notify_technician_assigned?: boolean | null
          push_notifications?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_notification_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_notification_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communication_phone_settings: {
        Row: {
          branding_payload: Json | null
          business_hours_only: boolean | null
          caller_id_label: string | null
          company_id: string
          created_at: string | null
          fallback_number: string | null
          id: string
          ivr_enabled: boolean | null
          ivr_menu: Json | null
          recording_announcement: string | null
          recording_consent_required: boolean | null
          recording_enabled: boolean | null
          routing_strategy: string | null
          sms_sender_name: string | null
          sms_signature: string | null
          updated_at: string | null
          voicemail_email_notifications: boolean | null
          voicemail_enabled: boolean | null
          voicemail_greeting_url: string | null
          voicemail_transcription_enabled: boolean | null
        }
        Insert: {
          branding_payload?: Json | null
          business_hours_only?: boolean | null
          caller_id_label?: string | null
          company_id: string
          created_at?: string | null
          fallback_number?: string | null
          id?: string
          ivr_enabled?: boolean | null
          ivr_menu?: Json | null
          recording_announcement?: string | null
          recording_consent_required?: boolean | null
          recording_enabled?: boolean | null
          routing_strategy?: string | null
          sms_sender_name?: string | null
          sms_signature?: string | null
          updated_at?: string | null
          voicemail_email_notifications?: boolean | null
          voicemail_enabled?: boolean | null
          voicemail_greeting_url?: string | null
          voicemail_transcription_enabled?: boolean | null
        }
        Update: {
          branding_payload?: Json | null
          business_hours_only?: boolean | null
          caller_id_label?: string | null
          company_id?: string
          created_at?: string | null
          fallback_number?: string | null
          id?: string
          ivr_enabled?: boolean | null
          ivr_menu?: Json | null
          recording_announcement?: string | null
          recording_consent_required?: boolean | null
          recording_enabled?: boolean | null
          routing_strategy?: string | null
          sms_sender_name?: string | null
          sms_signature?: string | null
          updated_at?: string | null
          voicemail_email_notifications?: boolean | null
          voicemail_enabled?: boolean | null
          voicemail_greeting_url?: string | null
          voicemail_transcription_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_phone_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_phone_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communication_sms_settings: {
        Row: {
          auto_reply_enabled: boolean | null
          auto_reply_message: string | null
          company_id: string
          consent_required: boolean | null
          created_at: string | null
          id: string
          include_opt_out: boolean | null
          opt_out_message: string | null
          provider: string | null
          provider_api_key_encrypted: string | null
          sender_number: string | null
          updated_at: string | null
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          company_id: string
          consent_required?: boolean | null
          created_at?: string | null
          id?: string
          include_opt_out?: boolean | null
          opt_out_message?: string | null
          provider?: string | null
          provider_api_key_encrypted?: string | null
          sender_number?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_reply_enabled?: boolean | null
          auto_reply_message?: string | null
          company_id?: string
          consent_required?: boolean | null
          created_at?: string | null
          id?: string
          include_opt_out?: boolean | null
          opt_out_message?: string | null
          provider?: string | null
          provider_api_key_encrypted?: string | null
          sender_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_sms_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_sms_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communication_templates: {
        Row: {
          body: string
          category: string | null
          company_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          name: string
          subject: string | null
          type: string
          updated_at: string | null
          use_count: number | null
          variables: Json | null
        }
        Insert: {
          body: string
          category?: string | null
          company_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name: string
          subject?: string | null
          type: string
          updated_at?: string | null
          use_count?: number | null
          variables?: Json | null
        }
        Update: {
          body?: string
          category?: string | null
          company_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          name?: string
          subject?: string | null
          type?: string
          updated_at?: string | null
          use_count?: number | null
          variables?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "communication_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communication_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      communications: {
        Row: {
          answering_machine_detected: boolean | null
          assigned_to: string | null
          attachment_count: number | null
          attachments: Json | null
          automation_workflow_id: string | null
          bcc_addresses: Json | null
          body: string
          body_html: string | null
          body_plain: string | null
          call_answered_at: string | null
          call_duration: number | null
          call_ended_at: string | null
          call_recording_url: string | null
          call_sentiment: string | null
          call_transcript: string | null
          category: string | null
          cc_addresses: Json | null
          channel: string | null
          click_count: number | null
          clicked_at: string | null
          company_id: string
          cost: number | null
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          delivered_at: string | null
          direction: string
          estimate_id: string | null
          failure_reason: string | null
          from_address: string | null
          from_name: string | null
          hangup_cause: string | null
          hangup_source: string | null
          id: string
          invoice_id: string | null
          is_archived: boolean
          is_automated: boolean
          is_internal: boolean
          is_thread_starter: boolean
          job_id: string | null
          open_count: number | null
          opened_at: string | null
          parent_id: string | null
          phone_number_id: string | null
          priority: string
          provider_message_id: string | null
          provider_metadata: Json | null
          provider_status: string | null
          read_at: string | null
          recording_channels: string | null
          retry_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          sent_by: string | null
          status: string
          subject: string | null
          tags: Json | null
          telnyx_call_control_id: string | null
          telnyx_call_session_id: string | null
          telnyx_message_id: string | null
          template_id: string | null
          thread_id: string | null
          to_address: string
          to_name: string | null
          type: string
          updated_at: string
        }
        Insert: {
          answering_machine_detected?: boolean | null
          assigned_to?: string | null
          attachment_count?: number | null
          attachments?: Json | null
          automation_workflow_id?: string | null
          bcc_addresses?: Json | null
          body: string
          body_html?: string | null
          body_plain?: string | null
          call_answered_at?: string | null
          call_duration?: number | null
          call_ended_at?: string | null
          call_recording_url?: string | null
          call_sentiment?: string | null
          call_transcript?: string | null
          category?: string | null
          cc_addresses?: Json | null
          channel?: string | null
          click_count?: number | null
          clicked_at?: string | null
          company_id: string
          cost?: number | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivered_at?: string | null
          direction: string
          estimate_id?: string | null
          failure_reason?: string | null
          from_address?: string | null
          from_name?: string | null
          hangup_cause?: string | null
          hangup_source?: string | null
          id?: string
          invoice_id?: string | null
          is_archived?: boolean
          is_automated?: boolean
          is_internal?: boolean
          is_thread_starter?: boolean
          job_id?: string | null
          open_count?: number | null
          opened_at?: string | null
          parent_id?: string | null
          phone_number_id?: string | null
          priority?: string
          provider_message_id?: string | null
          provider_metadata?: Json | null
          provider_status?: string | null
          read_at?: string | null
          recording_channels?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string | null
          tags?: Json | null
          telnyx_call_control_id?: string | null
          telnyx_call_session_id?: string | null
          telnyx_message_id?: string | null
          template_id?: string | null
          thread_id?: string | null
          to_address: string
          to_name?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          answering_machine_detected?: boolean | null
          assigned_to?: string | null
          attachment_count?: number | null
          attachments?: Json | null
          automation_workflow_id?: string | null
          bcc_addresses?: Json | null
          body?: string
          body_html?: string | null
          body_plain?: string | null
          call_answered_at?: string | null
          call_duration?: number | null
          call_ended_at?: string | null
          call_recording_url?: string | null
          call_sentiment?: string | null
          call_transcript?: string | null
          category?: string | null
          cc_addresses?: Json | null
          channel?: string | null
          click_count?: number | null
          clicked_at?: string | null
          company_id?: string
          cost?: number | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          delivered_at?: string | null
          direction?: string
          estimate_id?: string | null
          failure_reason?: string | null
          from_address?: string | null
          from_name?: string | null
          hangup_cause?: string | null
          hangup_source?: string | null
          id?: string
          invoice_id?: string | null
          is_archived?: boolean
          is_automated?: boolean
          is_internal?: boolean
          is_thread_starter?: boolean
          job_id?: string | null
          open_count?: number | null
          opened_at?: string | null
          parent_id?: string | null
          phone_number_id?: string | null
          priority?: string
          provider_message_id?: string | null
          provider_metadata?: Json | null
          provider_status?: string | null
          read_at?: string | null
          recording_channels?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          sent_by?: string | null
          status?: string
          subject?: string | null
          tags?: Json | null
          telnyx_call_control_id?: string | null
          telnyx_call_session_id?: string | null
          telnyx_message_id?: string | null
          template_id?: string | null
          thread_id?: string | null
          to_address?: string
          to_name?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "communications_assigned_to_users_id_fk"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "communications_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_estimate_id_estimates_id_fk"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_invoice_id_invoices_id_fk"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_parent_id_communications_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "communications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "communications_sent_by_users_id_fk"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          archived_at: string | null
          brand_color: string | null
          city: string | null
          company_size: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          doing_business_as: string | null
          ein: string | null
          email: string | null
          email_settings: Json | null
          id: string
          industry: string | null
          lat: number | null
          legal_name: string | null
          license_number: string | null
          logo: string | null
          logo