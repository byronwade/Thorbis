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
          logo_url: string | null
          lon: number | null
          name: string
          onboarding_completed_at: string | null
          onboarding_data: Json | null
          onboarding_progress: Json | null
          onboarding_step: number | null
          owner_id: string
          permanent_delete_scheduled_at: string | null
          phone: string | null
          portal_settings: Json | null
          refund_settings: Json | null
          slug: string
          state: string | null
          stripe_subscription_id: string | null
          stripe_subscription_status: string | null
          subscription_cancel_at_period_end: boolean | null
          subscription_current_period_end: string | null
          subscription_current_period_start: string | null
          support_email: string | null
          support_phone: string | null
          tax_id: string | null
          trial_ends_at: string | null
          updated_at: string
          website: string | null
          website_url: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          archived_at?: string | null
          brand_color?: string | null
          city?: string | null
          company_size?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          doing_business_as?: string | null
          ein?: string | null
          email?: string | null
          email_settings?: Json | null
          id?: string
          industry?: string | null
          lat?: number | null
          legal_name?: string | null
          license_number?: string | null
          logo?: string | null
          logo_url?: string | null
          lon?: number | null
          name: string
          onboarding_completed_at?: string | null
          onboarding_data?: Json | null
          onboarding_progress?: Json | null
          onboarding_step?: number | null
          owner_id: string
          permanent_delete_scheduled_at?: string | null
          phone?: string | null
          portal_settings?: Json | null
          refund_settings?: Json | null
          slug: string
          state?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          subscription_cancel_at_period_end?: boolean | null
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          support_email?: string | null
          support_phone?: string | null
          tax_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          archived_at?: string | null
          brand_color?: string | null
          city?: string | null
          company_size?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          doing_business_as?: string | null
          ein?: string | null
          email?: string | null
          email_settings?: Json | null
          id?: string
          industry?: string | null
          lat?: number | null
          legal_name?: string | null
          license_number?: string | null
          logo?: string | null
          logo_url?: string | null
          lon?: number | null
          name?: string
          onboarding_completed_at?: string | null
          onboarding_data?: Json | null
          onboarding_progress?: Json | null
          onboarding_step?: number | null
          owner_id?: string
          permanent_delete_scheduled_at?: string | null
          phone?: string | null
          portal_settings?: Json | null
          refund_settings?: Json | null
          slug?: string
          state?: string | null
          stripe_subscription_id?: string | null
          stripe_subscription_status?: string | null
          subscription_cancel_at_period_end?: boolean | null
          subscription_current_period_end?: string | null
          subscription_current_period_start?: string | null
          support_email?: string | null
          support_phone?: string | null
          tax_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          website?: string | null
          website_url?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      company_holidays: {
        Row: {
          company_id: string
          created_at: string | null
          enabled: boolean | null
          holiday_date: string
          id: string
          is_recurring: boolean | null
          name: string
          recurrence_type: string | null
          routing_rule_id: string | null
          special_greeting_message: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          enabled?: boolean | null
          holiday_date: string
          id?: string
          is_recurring?: boolean | null
          name: string
          recurrence_type?: string | null
          routing_rule_id?: string | null
          special_greeting_message?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          enabled?: boolean | null
          holiday_date?: string
          id?: string
          is_recurring?: boolean | null
          name?: string
          recurrence_type?: string | null
          routing_rule_id?: string | null
          special_greeting_message?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_holidays_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_holidays_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "company_holidays_routing_rule_id_fkey"
            columns: ["routing_rule_id"]
            isOneToOne: false
            referencedRelation: "call_routing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          address: string | null
          address2: string | null
          city: string | null
          company_feed_enabled: boolean | null
          company_id: string
          country: string | null
          created_at: string
          feed_visibility: string | null
          hours_of_operation: Json
          id: string
          service_area_type: string
          service_areas: Json | null
          service_radius: number | null
          state: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          city?: string | null
          company_feed_enabled?: boolean | null
          company_id: string
          country?: string | null
          created_at?: string
          feed_visibility?: string | null
          hours_of_operation: Json
          id?: string
          service_area_type?: string
          service_areas?: Json | null
          service_radius?: number | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          city?: string | null
          company_feed_enabled?: boolean | null
          company_id?: string
          country?: string | null
          created_at?: string
          feed_visibility?: string | null
          hours_of_operation?: Json
          id?: string
          service_area_type?: string
          service_areas?: Json | null
          service_radius?: number | null
          state?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_settings_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      content_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          archived_at: string | null
          company_id: string
          content: string
          contract_number: string
          contract_type: string
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          estimate_id: string | null
          id: string
          invoice_id: string | null
          ip_address: string | null
          job_id: string | null
          metadata: Json | null
          notes: string | null
          permanent_delete_scheduled_at: string | null
          search_vector: unknown
          sent_at: string | null
          signature: string | null
          signed_at: string | null
          signer_company: string | null
          signer_email: string | null
          signer_name: string | null
          signer_title: string | null
          status: string
          template_id: string | null
          terms: string | null
          title: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          archived_at?: string | null
          company_id: string
          content: string
          contract_number: string
          contract_type?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          permanent_delete_scheduled_at?: string | null
          search_vector?: unknown
          sent_at?: string | null
          signature?: string | null
          signed_at?: string | null
          signer_company?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_title?: string | null
          status?: string
          template_id?: string | null
          terms?: string | null
          title: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          archived_at?: string | null
          company_id?: string
          content?: string
          contract_number?: string
          contract_type?: string
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          estimate_id?: string | null
          id?: string
          invoice_id?: string | null
          ip_address?: string | null
          job_id?: string | null
          metadata?: Json | null
          notes?: string | null
          permanent_delete_scheduled_at?: string | null
          search_vector?: unknown
          sent_at?: string | null
          signature?: string | null
          signed_at?: string | null
          signer_company?: string | null
          signer_email?: string | null
          signer_name?: string | null
          signer_title?: string | null
          status?: string
          template_id?: string | null
          terms?: string | null
          title?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "contracts_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_estimate_id_estimates_id_fk"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_invoice_id_invoices_id_fk"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_roles: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_system: boolean
          name: string
          permissions: Json
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name: string
          permissions: Json
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_system?: boolean
          name?: string
          permissions?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_roles_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_addresses: {
        Row: {
          access_notes: string | null
          address_line1: string
          address_line2: string | null
          address_type: string
          city: string
          company_id: string
          country: string | null
          created_at: string
          customer_id: string
          deleted_at: string | null
          directions: string | null
          gate_code: string | null
          id: string
          is_default: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          parking_instructions: string | null
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          access_notes?: string | null
          address_line1: string
          address_line2?: string | null
          address_type: string
          city: string
          company_id: string
          country?: string | null
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          directions?: string | null
          gate_code?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          parking_instructions?: string | null
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          access_notes?: string | null
          address_line1?: string
          address_line2?: string | null
          address_type?: string
          city?: string
          company_id?: string
          country?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          directions?: string | null
          gate_code?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          parking_instructions?: string | null
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_badges: {
        Row: {
          auto_generated_key: string | null
          badge_type: string
          company_id: string
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          label: string
          metadata: Json | null
          updated_at: string | null
          variant: string | null
        }
        Insert: {
          auto_generated_key?: string | null
          badge_type: string
          company_id: string
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          metadata?: Json | null
          updated_at?: string | null
          variant?: string | null
        }
        Update: {
          auto_generated_key?: string | null
          badge_type?: string
          company_id?: string
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          metadata?: Json | null
          updated_at?: string | null
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_badges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "customer_badges_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_contacts: {
        Row: {
          company_id: string
          created_at: string
          customer_id: string
          deleted_at: string | null
          email: string
          first_name: string
          id: string
          is_billing_contact: boolean | null
          is_emergency_contact: boolean | null
          is_primary: boolean | null
          last_name: string
          notes: string | null
          phone: string
          preferred_contact_method: string | null
          secondary_phone: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          email: string
          first_name: string
          id?: string
          is_billing_contact?: boolean | null
          is_emergency_contact?: boolean | null
          is_primary?: boolean | null
          last_name: string
          notes?: string | null
          phone: string
          preferred_contact_method?: string | null
          secondary_phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          email?: string
          first_name?: string
          id?: string
          is_billing_contact?: boolean | null
          is_emergency_contact?: boolean | null
          is_primary?: boolean | null
          last_name?: string
          notes?: string | null
          phone?: string
          preferred_contact_method?: string | null
          secondary_phone?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_custom_fields: {
        Row: {
          company_id: string
          created_at: string | null
          display_order: number | null
          field_key: string
          field_name: string
          field_options: Json | null
          field_type: string
          id: string
          is_active: boolean | null
          is_required: boolean | null
          show_in_list: boolean | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          display_order?: number | null
          field_key: string
          field_name: string
          field_options?: Json | null
          field_type: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          show_in_list?: boolean | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          display_order?: number | null
          field_key?: string
          field_name?: string
          field_options?: Json | null
          field_type?: string
          id?: string
          is_active?: boolean | null
          is_required?: boolean | null
          show_in_list?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_custom_fields_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_custom_fields_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_intake_settings: {
        Row: {
          auto_assign_technician: boolean | null
          auto_create_job: boolean | null
          company_id: string
          created_at: string | null
          custom_questions: Json | null
          id: string
          require_address: boolean | null
          require_email: boolean | null
          require_lead_source: boolean | null
          require_phone: boolean | null
          require_property_type: boolean | null
          send_welcome_email: boolean | null
          track_lead_source: boolean | null
          updated_at: string | null
          welcome_email_template_id: string | null
        }
        Insert: {
          auto_assign_technician?: boolean | null
          auto_create_job?: boolean | null
          company_id: string
          created_at?: string | null
          custom_questions?: Json | null
          id?: string
          require_address?: boolean | null
          require_email?: boolean | null
          require_lead_source?: boolean | null
          require_phone?: boolean | null
          require_property_type?: boolean | null
          send_welcome_email?: boolean | null
          track_lead_source?: boolean | null
          updated_at?: string | null
          welcome_email_template_id?: string | null
        }
        Update: {
          auto_assign_technician?: boolean | null
          auto_create_job?: boolean | null
          company_id?: string
          created_at?: string | null
          custom_questions?: Json | null
          id?: string
          require_address?: boolean | null
          require_email?: boolean | null
          require_lead_source?: boolean | null
          require_phone?: boolean | null
          require_property_type?: boolean | null
          send_welcome_email?: boolean | null
          track_lead_source?: boolean | null
          updated_at?: string | null
          welcome_email_template_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_intake_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_intake_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_loyalty_settings: {
        Row: {
          auto_apply_rewards: boolean | null
          company_id: string
          created_at: string | null
          id: string
          loyalty_enabled: boolean | null
          notify_on_points_earned: boolean | null
          points_expiry_days: number | null
          points_per_dollar_spent: number | null
          points_per_referral: number | null
          program_name: string | null
          reward_tiers: Json | null
          updated_at: string | null
        }
        Insert: {
          auto_apply_rewards?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          loyalty_enabled?: boolean | null
          notify_on_points_earned?: boolean | null
          points_expiry_days?: number | null
          points_per_dollar_spent?: number | null
          points_per_referral?: number | null
          program_name?: string | null
          reward_tiers?: Json | null
          updated_at?: string | null
        }
        Update: {
          auto_apply_rewards?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          loyalty_enabled?: boolean | null
          notify_on_points_earned?: boolean | null
          points_expiry_days?: number | null
          points_per_dollar_spent?: number | null
          points_per_referral?: number | null
          program_name?: string | null
          reward_tiers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_loyalty_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_notes: {
        Row: {
          company_id: string
          content: string
          created_at: string | null
          customer_id: string
          deleted_at: string | null
          id: string
          is_pinned: boolean | null
          note_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_id: string
          content: string
          created_at?: string | null
          customer_id: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          note_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string
          content?: string
          created_at?: string | null
          customer_id?: string
          deleted_at?: string | null
          id?: string
          is_pinned?: boolean | null
          note_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "customer_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_portal_settings: {
        Row: {
          allow_booking: boolean | null
          allow_estimate_approval: boolean | null
          allow_invoice_payment: boolean | null
          allow_messaging: boolean | null
          company_id: string
          created_at: string | null
          id: string
          notify_on_appointment: boolean | null
          notify_on_new_estimate: boolean | null
          notify_on_new_invoice: boolean | null
          portal_enabled: boolean | null
          portal_logo_url: string | null
          primary_color: string | null
          require_account_approval: boolean | null
          show_estimates: boolean | null
          show_invoices: boolean | null
          show_service_history: boolean | null
          updated_at: string | null
          welcome_message: string | null
        }
        Insert: {
          allow_booking?: boolean | null
          allow_estimate_approval?: boolean | null
          allow_invoice_payment?: boolean | null
          allow_messaging?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          notify_on_appointment?: boolean | null
          notify_on_new_estimate?: boolean | null
          notify_on_new_invoice?: boolean | null
          portal_enabled?: boolean | null
          portal_logo_url?: string | null
          primary_color?: string | null
          require_account_approval?: boolean | null
          show_estimates?: boolean | null
          show_invoices?: boolean | null
          show_service_history?: boolean | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Update: {
          allow_booking?: boolean | null
          allow_estimate_approval?: boolean | null
          allow_invoice_payment?: boolean | null
          allow_messaging?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          notify_on_appointment?: boolean | null
          notify_on_new_estimate?: boolean | null
          notify_on_new_invoice?: boolean | null
          portal_enabled?: boolean | null
          portal_logo_url?: string | null
          primary_color?: string | null
          require_account_approval?: boolean | null
          show_estimates?: boolean | null
          show_invoices?: boolean | null
          show_service_history?: boolean | null
          updated_at?: string | null
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_portal_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_portal_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_preference_settings: {
        Row: {
          allow_marketing_emails: boolean | null
          allow_marketing_sms: boolean | null
          auto_tag_customers: boolean | null
          company_id: string
          created_at: string | null
          default_contact_method: string | null
          feedback_delay_hours: number | null
          id: string
          reminder_hours_before: number | null
          request_feedback: boolean | null
          require_service_address: boolean | null
          send_appointment_reminders: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_marketing_emails?: boolean | null
          allow_marketing_sms?: boolean | null
          auto_tag_customers?: boolean | null
          company_id: string
          created_at?: string | null
          default_contact_method?: string | null
          feedback_delay_hours?: number | null
          id?: string
          reminder_hours_before?: number | null
          request_feedback?: boolean | null
          require_service_address?: boolean | null
          send_appointment_reminders?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_marketing_emails?: boolean | null
          allow_marketing_sms?: boolean | null
          auto_tag_customers?: boolean | null
          company_id?: string
          created_at?: string | null
          default_contact_method?: string | null
          feedback_delay_hours?: number | null
          id?: string
          reminder_hours_before?: number | null
          request_feedback?: boolean | null
          require_service_address?: boolean | null
          send_appointment_reminders?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_preference_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_preference_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_privacy_settings: {
        Row: {
          auto_delete_inactive_customers: boolean | null
          company_id: string
          created_at: string | null
          data_retention_years: number | null
          enable_data_export: boolean | null
          enable_right_to_deletion: boolean | null
          id: string
          inactive_threshold_years: number | null
          privacy_policy_url: string | null
          require_data_processing_consent: boolean | null
          require_marketing_consent: boolean | null
          terms_of_service_url: string | null
          updated_at: string | null
        }
        Insert: {
          auto_delete_inactive_customers?: boolean | null
          company_id: string
          created_at?: string | null
          data_retention_years?: number | null
          enable_data_export?: boolean | null
          enable_right_to_deletion?: boolean | null
          id?: string
          inactive_threshold_years?: number | null
          privacy_policy_url?: string | null
          require_data_processing_consent?: boolean | null
          require_marketing_consent?: boolean | null
          terms_of_service_url?: string | null
          updated_at?: string | null
        }
        Update: {
          auto_delete_inactive_customers?: boolean | null
          company_id?: string
          created_at?: string | null
          data_retention_years?: number | null
          enable_data_export?: boolean | null
          enable_right_to_deletion?: boolean | null
          id?: string
          inactive_threshold_years?: number | null
          privacy_policy_url?: string | null
          require_data_processing_consent?: boolean | null
          require_marketing_consent?: boolean | null
          terms_of_service_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_privacy_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_privacy_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_service_flags: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          display_order: number | null
          flag_description: string | null
          flag_name: string
          flag_type: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          display_order?: number | null
          flag_description?: string | null
          flag_name: string
          flag_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          display_order?: number | null
          flag_description?: string | null
          flag_name?: string
          flag_type?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_service_flags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_service_flags_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      customer_tags: {
        Row: {
          added_at: string
          added_by: string | null
          customer_id: string
          tag_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          customer_id: string
          tag_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          customer_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_tags_added_by_users_id_fk"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_tags_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_tags_tag_id_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          address2: string | null
          archived_at: string | null
          average_job_value: number | null
          billing_email: string | null
          city: string | null
          communication_preferences: Json | null
          company_id: string
          company_name: string | null
          content_updated_at: string | null
          content_updated_by: string | null
          content_version: number | null
          country: string | null
          created_at: string
          credit_limit: number | null
          default_address_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          directions: string | null
          display_name: string
          email: string
          first_name: string
          id: string
          internal_notes: string | null
          is_business: boolean | null
          last_invoice_date: string | null
          last_job_date: string | null
          last_name: string
          last_payment_date: string | null
          metadata: Json | null
          notes: string | null
          outstanding_balance: number | null
          page_content: Json | null
          page_layout: Json | null
          payment_terms: string | null
          phone: string
          portal_enabled: boolean
          portal_invited_at: string | null
          portal_last_login_at: string | null
          preferred_contact_method: string | null
          preferred_payment_method: string | null
          preferred_technician: string | null
          primary_contact_id: string | null
          referred_by: string | null
          sales_context: string | null
          search_vector: unknown
          secondary_phone: string | null
          service_flags: Json | null
          source: string | null
          state: string | null
          status: string
          stripe_customer_id: string | null
          tags: Json | null
          tax_exempt: boolean
          tax_exempt_number: string | null
          total_invoices: number | null
          total_jobs: number | null
          total_revenue: number | null
          type: string
          updated_at: string
          user_id: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          archived_at?: string | null
          average_job_value?: number | null
          billing_email?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company_id: string
          company_name?: string | null
          content_updated_at?: string | null
          content_updated_by?: string | null
          content_version?: number | null
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          default_address_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          directions?: string | null
          display_name: string
          email: string
          first_name: string
          id?: string
          internal_notes?: string | null
          is_business?: boolean | null
          last_invoice_date?: string | null
          last_job_date?: string | null
          last_name: string
          last_payment_date?: string | null
          metadata?: Json | null
          notes?: string | null
          outstanding_balance?: number | null
          page_content?: Json | null
          page_layout?: Json | null
          payment_terms?: string | null
          phone: string
          portal_enabled?: boolean
          portal_invited_at?: string | null
          portal_last_login_at?: string | null
          preferred_contact_method?: string | null
          preferred_payment_method?: string | null
          preferred_technician?: string | null
          primary_contact_id?: string | null
          referred_by?: string | null
          sales_context?: string | null
          search_vector?: unknown
          secondary_phone?: string | null
          service_flags?: Json | null
          source?: string | null
          state?: string | null
          status?: string
          stripe_customer_id?: string | null
          tags?: Json | null
          tax_exempt?: boolean
          tax_exempt_number?: string | null
          total_invoices?: number | null
          total_jobs?: number | null
          total_revenue?: number | null
          type?: string
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          archived_at?: string | null
          average_job_value?: number | null
          billing_email?: string | null
          city?: string | null
          communication_preferences?: Json | null
          company_id?: string
          company_name?: string | null
          content_updated_at?: string | null
          content_updated_by?: string | null
          content_version?: number | null
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          default_address_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          directions?: string | null
          display_name?: string
          email?: string
          first_name?: string
          id?: string
          internal_notes?: string | null
          is_business?: boolean | null
          last_invoice_date?: string | null
          last_job_date?: string | null
          last_name?: string
          last_payment_date?: string | null
          metadata?: Json | null
          notes?: string | null
          outstanding_balance?: number | null
          page_content?: Json | null
          page_layout?: Json | null
          payment_terms?: string | null
          phone?: string
          portal_enabled?: boolean
          portal_invited_at?: string | null
          portal_last_login_at?: string | null
          preferred_contact_method?: string | null
          preferred_payment_method?: string | null
          preferred_technician?: string | null
          primary_contact_id?: string | null
          referred_by?: string | null
          sales_context?: string | null
          search_vector?: unknown
          secondary_phone?: string | null
          service_flags?: Json | null
          source?: string | null
          state?: string | null
          status?: string
          stripe_customer_id?: string | null
          tags?: Json | null
          tax_exempt?: boolean
          tax_exempt_number?: string | null
          total_invoices?: number | null
          total_jobs?: number | null
          total_revenue?: number | null
          type?: string
          updated_at?: string
          user_id?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "customers_content_updated_by_fkey"
            columns: ["content_updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_preferred_technician_users_id_fk"
            columns: ["preferred_technician"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_referred_by_customers_id_fk"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_customers_default_address"
            columns: ["default_address_id"]
            isOneToOne: false
            referencedRelation: "customer_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      data_exports: {
        Row: {
          company_id: string | null
          created_at: string | null
          data_type: string
          expires_at: string | null
          file_url: string | null
          filters: Json | null
          format: string
          id: string
          record_count: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          data_type: string
          expires_at?: string | null
          file_url?: string | null
          filters?: Json | null
          format: string
          id?: string
          record_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          data_type?: string
          expires_at?: string | null
          file_url?: string | null
          filters?: Json | null
          format?: string
          id?: string
          record_count?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_exports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_exports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      data_import_export_settings: {
        Row: {
          allow_bulk_import: boolean | null
          auto_deduplicate: boolean | null
          auto_export_email: string | null
          auto_export_enabled: boolean | null
          auto_export_frequency: string | null
          company_id: string
          created_at: string | null
          default_export_format: string | null
          id: string
          include_metadata: boolean | null
          require_import_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_bulk_import?: boolean | null
          auto_deduplicate?: boolean | null
          auto_export_email?: string | null
          auto_export_enabled?: boolean | null
          auto_export_frequency?: string | null
          company_id: string
          created_at?: string | null
          default_export_format?: string | null
          id?: string
          include_metadata?: boolean | null
          require_import_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_bulk_import?: boolean | null
          auto_deduplicate?: boolean | null
          auto_export_email?: string | null
          auto_export_enabled?: boolean | null
          auto_export_frequency?: string | null
          company_id?: string
          created_at?: string | null
          default_export_format?: string | null
          id?: string
          include_metadata?: boolean | null
          require_import_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_import_export_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_import_export_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      data_imports: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          backup_data: Json | null
          company_id: string | null
          completed_at: string | null
          created_at: string | null
          data_type: string
          dry_run: boolean | null
          errors: Json | null
          failed_rows: number | null
          file_name: string | null
          id: string
          requires_approval: boolean | null
          status: string
          successful_rows: number | null
          total_rows: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          backup_data?: Json | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          data_type: string
          dry_run?: boolean | null
          errors?: Json | null
          failed_rows?: number | null
          file_name?: string | null
          id?: string
          requires_approval?: boolean | null
          status?: string
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          backup_data?: Json | null
          company_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          data_type?: string
          dry_run?: boolean | null
          errors?: Json | null
          failed_rows?: number | null
          file_name?: string | null
          id?: string
          requires_approval?: boolean | null
          status?: string
          successful_rows?: number | null
          total_rows?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "data_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "data_imports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      departments: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "departments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      document_folders: {
        Row: {
          allowed_roles: string[] | null
          color: string | null
          company_id: string
          context_id: string | null
          context_type: string | null
          created_at: string
          created_by: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          file_count: number | null
          icon: string | null
          id: string
          is_private: boolean | null
          is_system: boolean | null
          name: string
          parent_id: string | null
          path: string
          permissions: Json | null
          slug: string
          sort_order: number | null
          total_size: number | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          allowed_roles?: string[] | null
          color?: string | null
          company_id: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          created_by: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          file_count?: number | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          is_system?: boolean | null
          name: string
          parent_id?: string | null
          path: string
          permissions?: Json | null
          slug: string
          sort_order?: number | null
          total_size?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          allowed_roles?: string[] | null
          color?: string | null
          company_id?: string
          context_id?: string | null
          context_type?: string | null
          created_at?: string
          created_by?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          file_count?: number | null
          icon?: string | null
          id?: string
          is_private?: boolean | null
          is_system?: boolean | null
          name?: string
          parent_id?: string | null
          path?: string
          permissions?: Json | null
          slug?: string
          sort_order?: number | null
          total_size?: number | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_folders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "document_folders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "document_folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_folders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          id: string
          kind: string
          title: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id: string
          kind?: string
          title: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          kind?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          bounced_at: string | null
          clicked_at: string | null
          created_at: string
          customer_id: string | null
          delivered_at: string | null
          error: string | null
          from: string
          id: string
          invoice_id: string | null
          job_id: string | null
          max_retries: number | null
          metadata: Json | null
          next_retry_at: string | null
          opened_at: string | null
          resend_id: string | null
          retry_count: number | null
          sent_at: string | null
          status: string
          subject: string
          tags: Json | null
          template_data: Json | null
          template_type: string
          to: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          error?: string | null
          from: string
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          max_retries?: number | null
          metadata?: Json | null
          next_retry_at?: string | null
          opened_at?: string | null
          resend_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject: string
          tags?: Json | null
          template_data?: Json | null
          template_type: string
          to: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bounced_at?: string | null
          clicked_at?: string | null
          created_at?: string
          customer_id?: string | null
          delivered_at?: string | null
          error?: string | null
          from?: string
          id?: string
          invoice_id?: string | null
          job_id?: string | null
          max_retries?: number | null
          metadata?: Json | null
          next_retry_at?: string | null
          opened_at?: string | null
          resend_id?: string | null
          retry_count?: number | null
          sent_at?: string | null
          status?: string
          subject?: string
          tags?: Json | null
          template_data?: Json | null
          template_type?: string
          to?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      equipment: {
        Row: {
          archived_at: string | null
          asset_category: string | null
          asset_subcategory: string | null
          average_service_cost: number | null
          capacity: string | null
          category: string | null
          classification: Database["public"]["Enums"]["equipment_classification"]
          company_id: string
          condition: string
          created_at: string
          customer_id: string
          customer_notes: string | null
          deleted_at: string | null
          deleted_by: string | null
          documents: Json | null
          efficiency: string | null
          equipment_number: string
          fuel_type: string | null
          id: string
          install_date: string | null
          install_job_id: string | null
          installed_by: string | null
          is_under_warranty: boolean
          last_service_date: string | null
          last_service_job_id: string | null
          location: string | null
          manufacturer: string | null
          metadata: Json | null
          model: string | null
          model_year: number | null
          name: string
          next_service_due: string | null
          notes: string | null
          photos: Json | null
          property_id: string
          replaced_by_equipment_id: string | null
          replaced_date: string | null
          search_vector: unknown
          serial_number: string | null
          service_interval_days: number | null
          service_plan_id: string | null
          status: string
          tool_calibration_due: string | null
          tool_serial: string | null
          total_service_cost: number | null
          total_service_count: number | null
          type: string
          updated_at: string
          vehicle_fuel_type: string | null
          vehicle_inspection_due: string | null
          vehicle_last_service_mileage: number | null
          vehicle_license_plate: string | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_next_service_mileage: number | null
          vehicle_odometer: number | null
          vehicle_registration_expiration: string | null
          vehicle_vin: string | null
          vehicle_year: number | null
          warranty_expiration: string | null
          warranty_notes: string | null
          warranty_provider: string | null
        }
        Insert: {
          archived_at?: string | null
          asset_category?: string | null
          asset_subcategory?: string | null
          average_service_cost?: number | null
          capacity?: string | null
          category?: string | null
          classification?: Database["public"]["Enums"]["equipment_classification"]
          company_id: string
          condition?: string
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          documents?: Json | null
          efficiency?: string | null
          equipment_number: string
          fuel_type?: string | null
          id?: string
          install_date?: string | null
          install_job_id?: string | null
          installed_by?: string | null
          is_under_warranty?: boolean
          last_service_date?: string | null
          last_service_job_id?: string | null
          location?: string | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          model_year?: number | null
          name: string
          next_service_due?: string | null
          notes?: string | null
          photos?: Json | null
          property_id: string
          replaced_by_equipment_id?: string | null
          replaced_date?: string | null
          search_vector?: unknown
          serial_number?: string | null
          service_interval_days?: number | null
          service_plan_id?: string | null
          status?: string
          tool_calibration_due?: string | null
          tool_serial?: string | null
          total_service_cost?: number | null
          total_service_count?: number | null
          type: string
          updated_at?: string
          vehicle_fuel_type?: string | null
          vehicle_inspection_due?: string | null
          vehicle_last_service_mileage?: number | null
          vehicle_license_plate?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_next_service_mileage?: number | null
          vehicle_odometer?: number | null
          vehicle_registration_expiration?: string | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
          warranty_expiration?: string | null
          warranty_notes?: string | null
          warranty_provider?: string | null
        }
        Update: {
          archived_at?: string | null
          asset_category?: string | null
          asset_subcategory?: string | null
          average_service_cost?: number | null
          capacity?: string | null
          category?: string | null
          classification?: Database["public"]["Enums"]["equipment_classification"]
          company_id?: string
          condition?: string
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          documents?: Json | null
          efficiency?: string | null
          equipment_number?: string
          fuel_type?: string | null
          id?: string
          install_date?: string | null
          install_job_id?: string | null
          installed_by?: string | null
          is_under_warranty?: boolean
          last_service_date?: string | null
          last_service_job_id?: string | null
          location?: string | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          model_year?: number | null
          name?: string
          next_service_due?: string | null
          notes?: string | null
          photos?: Json | null
          property_id?: string
          replaced_by_equipment_id?: string | null
          replaced_date?: string | null
          search_vector?: unknown
          serial_number?: string | null
          service_interval_days?: number | null
          service_plan_id?: string | null
          status?: string
          tool_calibration_due?: string | null
          tool_serial?: string | null
          total_service_cost?: number | null
          total_service_count?: number | null
          type?: string
          updated_at?: string
          vehicle_fuel_type?: string | null
          vehicle_inspection_due?: string | null
          vehicle_last_service_mileage?: number | null
          vehicle_license_plate?: string | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_next_service_mileage?: number | null
          vehicle_odometer?: number | null
          vehicle_registration_expiration?: string | null
          vehicle_vin?: string | null
          vehicle_year?: number | null
          warranty_expiration?: string | null
          warranty_notes?: string | null
          warranty_provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_install_job_id_jobs_id_fk"
            columns: ["install_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_installed_by_users_id_fk"
            columns: ["installed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_last_service_job_id_jobs_id_fk"
            columns: ["last_service_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_replaced_by_equipment_id_equipment_id_fk"
            columns: ["replaced_by_equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_service_plan_id_service_plans_id_fk"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_custom_fields: {
        Row: {
          company_id: string
          created_at: string
          display_order: number | null
          equipment_id: string
          field_group: string | null
          field_name: string
          field_type: string | null
          field_value: string | null
          id: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          display_order?: number | null
          equipment_id: string
          field_group?: string | null
          field_name: string
          field_type?: string | null
          field_value?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          display_order?: number | null
          equipment_id?: string
          field_group?: string | null
          field_name?: string
          field_type?: string | null
          field_value?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_custom_fields_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_custom_fields_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_custom_fields_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_parts: {
        Row: {
          company_id: string
          condition: string | null
          created_at: string
          deleted_at: string | null
          equipment_id: string
          id: string
          installed_by: string | null
          installed_date: string | null
          is_active: boolean | null
          job_id: string | null
          labor_cost: number | null
          manufacturer: string | null
          notes: string | null
          part_cost: number | null
          part_name: string
          part_number: string | null
          replacement_due_date: string | null
          sku: string | null
          updated_at: string
          warranty_expires_at: string | null
          warranty_months: number | null
          warranty_provider: string | null
        }
        Insert: {
          company_id: string
          condition?: string | null
          created_at?: string
          deleted_at?: string | null
          equipment_id: string
          id?: string
          installed_by?: string | null
          installed_date?: string | null
          is_active?: boolean | null
          job_id?: string | null
          labor_cost?: number | null
          manufacturer?: string | null
          notes?: string | null
          part_cost?: number | null
          part_name: string
          part_number?: string | null
          replacement_due_date?: string | null
          sku?: string | null
          updated_at?: string
          warranty_expires_at?: string | null
          warranty_months?: number | null
          warranty_provider?: string | null
        }
        Update: {
          company_id?: string
          condition?: string | null
          created_at?: string
          deleted_at?: string | null
          equipment_id?: string
          id?: string
          installed_by?: string | null
          installed_date?: string | null
          is_active?: boolean | null
          job_id?: string | null
          labor_cost?: number | null
          manufacturer?: string | null
          notes?: string | null
          part_cost?: number | null
          part_name?: string
          part_number?: string | null
          replacement_due_date?: string | null
          sku?: string | null
          updated_at?: string
          warranty_expires_at?: string | null
          warranty_months?: number | null
          warranty_provider?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_parts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_parts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_parts_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_parts_installed_by_fkey"
            columns: ["installed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_parts_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_service_history: {
        Row: {
          company_id: string
          created_at: string
          customer_notes: string | null
          deleted_at: string | null
          equipment_condition: string | null
          equipment_id: string
          hours_spent: number | null
          id: string
          issues_found: string[] | null
          job_id: string | null
          labor_cost: number | null
          next_service_due_date: string | null
          parts_cost: number | null
          parts_replaced: string[] | null
          readings: Json | null
          recommendations: string[] | null
          service_date: string
          service_description: string
          service_type: string
          technician_id: string | null
          technician_notes: string | null
          total_cost: number | null
          updated_at: string
          warranty_claim_number: string | null
          warranty_work: boolean | null
        }
        Insert: {
          company_id: string
          created_at?: string
          customer_notes?: string | null
          deleted_at?: string | null
          equipment_condition?: string | null
          equipment_id: string
          hours_spent?: number | null
          id?: string
          issues_found?: string[] | null
          job_id?: string | null
          labor_cost?: number | null
          next_service_due_date?: string | null
          parts_cost?: number | null
          parts_replaced?: string[] | null
          readings?: Json | null
          recommendations?: string[] | null
          service_date: string
          service_description: string
          service_type: string
          technician_id?: string | null
          technician_notes?: string | null
          total_cost?: number | null
          updated_at?: string
          warranty_claim_number?: string | null
          warranty_work?: boolean | null
        }
        Update: {
          company_id?: string
          created_at?: string
          customer_notes?: string | null
          deleted_at?: string | null
          equipment_condition?: string | null
          equipment_id?: string
          hours_spent?: number | null
          id?: string
          issues_found?: string[] | null
          job_id?: string | null
          labor_cost?: number | null
          next_service_due_date?: string | null
          parts_cost?: number | null
          parts_replaced?: string[] | null
          readings?: Json | null
          recommendations?: string[] | null
          service_date?: string
          service_description?: string
          service_type?: string
          technician_id?: string | null
          technician_notes?: string | null
          total_cost?: number | null
          updated_at?: string
          warranty_claim_number?: string | null
          warranty_work?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "equipment_service_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_service_history_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "equipment_service_history_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_service_history_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_service_history_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment_tags: {
        Row: {
          added_at: string
          added_by: string | null
          equipment_id: string
          tag_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          equipment_id: string
          tag_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          equipment_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_tags_added_by_users_id_fk"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_tags_equipment_id_equipment_id_fk"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "equipment_tags_tag_id_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_jobs: {
        Row: {
          amount_from_job: number
          company_id: string
          created_at: string
          description: string | null
          estimate_id: string
          id: string
          job_id: string
        }
        Insert: {
          amount_from_job: number
          company_id: string
          created_at?: string
          description?: string | null
          estimate_id: string
          id?: string
          job_id: string
        }
        Update: {
          amount_from_job?: number
          company_id?: string
          created_at?: string
          description?: string | null
          estimate_id?: string
          id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "estimate_jobs_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_settings: {
        Row: {
          allow_discounts: boolean | null
          approval_thank_you_message: string | null
          auto_convert_to_job: boolean | null
          company_id: string
          created_at: string | null
          default_estimate_email_body: string | null
          default_estimate_email_subject: string | null
          default_estimate_footer: string | null
          default_terms: string | null
          default_valid_for_days: number | null
          estimate_number_format: string | null
          estimate_number_prefix: string | null
          id: string
          include_terms_and_conditions: boolean | null
          next_estimate_number: number | null
          reminder_days_before_expiry: number | null
          require_approval: boolean | null
          send_reminder_enabled: boolean | null
          show_expiry_date: boolean | null
          show_individual_prices: boolean | null
          show_payment_terms: boolean | null
          show_subtotals: boolean | null
          show_tax_breakdown: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_discounts?: boolean | null
          approval_thank_you_message?: string | null
          auto_convert_to_job?: boolean | null
          company_id: string
          created_at?: string | null
          default_estimate_email_body?: string | null
          default_estimate_email_subject?: string | null
          default_estimate_footer?: string | null
          default_terms?: string | null
          default_valid_for_days?: number | null
          estimate_number_format?: string | null
          estimate_number_prefix?: string | null
          id?: string
          include_terms_and_conditions?: boolean | null
          next_estimate_number?: number | null
          reminder_days_before_expiry?: number | null
          require_approval?: boolean | null
          send_reminder_enabled?: boolean | null
          show_expiry_date?: boolean | null
          show_individual_prices?: boolean | null
          show_payment_terms?: boolean | null
          show_subtotals?: boolean | null
          show_tax_breakdown?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_discounts?: boolean | null
          approval_thank_you_message?: string | null
          auto_convert_to_job?: boolean | null
          company_id?: string
          created_at?: string | null
          default_estimate_email_body?: string | null
          default_estimate_email_subject?: string | null
          default_estimate_footer?: string | null
          default_terms?: string | null
          default_valid_for_days?: number | null
          estimate_number_format?: string | null
          estimate_number_prefix?: string | null
          id?: string
          include_terms_and_conditions?: boolean | null
          next_estimate_number?: number | null
          reminder_days_before_expiry?: number | null
          require_approval?: boolean | null
          send_reminder_enabled?: boolean | null
          show_expiry_date?: boolean | null
          show_individual_prices?: boolean | null
          show_payment_terms?: boolean | null
          show_subtotals?: boolean | null
          show_tax_breakdown?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimate_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimate_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      estimates: {
        Row: {
          acceptance_token: string | null
          acceptance_token_expires_at: string | null
          archived_at: string | null
          company_id: string
          converted_at: string | null
          converted_to_invoice_id: string | null
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          discount_amount: number
          estimate_number: string
          expires_at: string | null
          id: string
          job_id: string | null
          line_items: Json
          notes: string | null
          permanent_delete_scheduled_at: string | null
          property_id: string | null
          responded_at: string | null
          search_vector: unknown
          sent_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          title: string
          total_amount: number
          updated_at: string
          valid_until: string | null
          viewed_at: string | null
        }
        Insert: {
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          archived_at?: string | null
          company_id: string
          converted_at?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discount_amount?: number
          estimate_number: string
          expires_at?: string | null
          id?: string
          job_id?: string | null
          line_items: Json
          notes?: string | null
          permanent_delete_scheduled_at?: string | null
          property_id?: string | null
          responded_at?: string | null
          search_vector?: unknown
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          title: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Update: {
          acceptance_token?: string | null
          acceptance_token_expires_at?: string | null
          archived_at?: string | null
          company_id?: string
          converted_at?: string | null
          converted_to_invoice_id?: string | null
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discount_amount?: number
          estimate_number?: string
          expires_at?: string | null
          id?: string
          job_id?: string | null
          line_items?: Json
          notes?: string | null
          permanent_delete_scheduled_at?: string | null
          property_id?: string | null
          responded_at?: string | null
          search_vector?: unknown
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          title?: string
          total_amount?: number
          updated_at?: string
          valid_until?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "estimates_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "estimates_converted_to_invoice_id_fkey"
            columns: ["converted_to_invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estimates_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_accounting_settings: {
        Row: {
          api_key_encrypted: string | null
          api_secret_encrypted: string | null
          asset_account: string | null
          auto_sync_enabled: boolean | null
          company_id: string
          created_at: string | null
          expense_account: string | null
          id: string
          income_account: string | null
          last_sync_at: string | null
          liability_account: string | null
          provider: string | null
          provider_enabled: boolean | null
          refresh_token_encrypted: string | null
          sync_customers: boolean | null
          sync_expenses: boolean | null
          sync_frequency: string | null
          sync_invoices: boolean | null
          sync_payments: boolean | null
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          asset_account?: string | null
          auto_sync_enabled?: boolean | null
          company_id: string
          created_at?: string | null
          expense_account?: string | null
          id?: string
          income_account?: string | null
          last_sync_at?: string | null
          liability_account?: string | null
          provider?: string | null
          provider_enabled?: boolean | null
          refresh_token_encrypted?: string | null
          sync_customers?: boolean | null
          sync_expenses?: boolean | null
          sync_frequency?: string | null
          sync_invoices?: boolean | null
          sync_payments?: boolean | null
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string | null
          api_secret_encrypted?: string | null
          asset_account?: string | null
          auto_sync_enabled?: boolean | null
          company_id?: string
          created_at?: string | null
          expense_account?: string | null
          id?: string
          income_account?: string | null
          last_sync_at?: string | null
          liability_account?: string | null
          provider?: string | null
          provider_enabled?: boolean | null
          refresh_token_encrypted?: string | null
          sync_customers?: boolean | null
          sync_expenses?: boolean | null
          sync_frequency?: string | null
          sync_invoices?: boolean | null
          sync_payments?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_accounting_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_accounting_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_bank_accounts: {
        Row: {
          account_name: string
          account_number_last4: string | null
          account_type: string | null
          auto_import_transactions: boolean | null
          available_balance: number | null
          bank_name: string
          company_id: string
          created_at: string | null
          current_balance: number | null
          id: string
          is_active: boolean | null
          is_primary: boolean | null
          last_synced_at: string | null
          plaid_access_token_encrypted: string | null
          plaid_account_id: string | null
          plaid_item_id: string | null
          routing_number_encrypted: string | null
          updated_at: string | null
        }
        Insert: {
          account_name: string
          account_number_last4?: string | null
          account_type?: string | null
          auto_import_transactions?: boolean | null
          available_balance?: number | null
          bank_name: string
          company_id: string
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          last_synced_at?: string | null
          plaid_access_token_encrypted?: string | null
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          routing_number_encrypted?: string | null
          updated_at?: string | null
        }
        Update: {
          account_name?: string
          account_number_last4?: string | null
          account_type?: string | null
          auto_import_transactions?: boolean | null
          available_balance?: number | null
          bank_name?: string
          company_id?: string
          created_at?: string | null
          current_balance?: number | null
          id?: string
          is_active?: boolean | null
          is_primary?: boolean | null
          last_synced_at?: string | null
          plaid_access_token_encrypted?: string | null
          plaid_account_id?: string | null
          plaid_item_id?: string | null
          routing_number_encrypted?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bank_accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_bank_statements: {
        Row: {
          bank_account_id: string
          company_id: string
          created_at: string | null
          end_date: string | null
          file_size_bytes: number | null
          file_url: string | null
          id: string
          start_date: string | null
          statement_date: string
        }
        Insert: {
          bank_account_id: string
          company_id: string
          created_at?: string | null
          end_date?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          start_date?: string | null
          statement_date: string
        }
        Update: {
          bank_account_id?: string
          company_id?: string
          created_at?: string | null
          end_date?: string | null
          file_size_bytes?: number | null
          file_url?: string | null
          id?: string
          start_date?: string | null
          statement_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_bank_statements_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "finance_bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bank_statements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bank_statements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_bank_transactions: {
        Row: {
          amount: number
          bank_account_id: string
          category_id: string | null
          category_name: string | null
          company_id: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          iso_currency_code: string | null
          merchant_name: string | null
          pending: boolean | null
          plaid_transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_id: string
          category_id?: string | null
          category_name?: string | null
          company_id: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          iso_currency_code?: string | null
          merchant_name?: string | null
          pending?: boolean | null
          plaid_transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string
          category_id?: string | null
          category_name?: string | null
          company_id?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          iso_currency_code?: string | null
          merchant_name?: string | null
          pending?: boolean | null
          plaid_transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_bank_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "finance_bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bank_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bank_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_bookkeeping_settings: {
        Row: {
          allow_manual_journal_entries: boolean | null
          auto_categorize_transactions: boolean | null
          auto_generate_reports: boolean | null
          auto_reconcile_payments: boolean | null
          company_id: string
          created_at: string | null
          default_expense_category: string | null
          default_income_category: string | null
          default_tax_category: string | null
          email_reports: boolean | null
          fiscal_year_start_day: number | null
          fiscal_year_start_month: number | null
          id: string
          report_frequency: string | null
          report_recipients: string[] | null
          require_receipt_attachment: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_manual_journal_entries?: boolean | null
          auto_categorize_transactions?: boolean | null
          auto_generate_reports?: boolean | null
          auto_reconcile_payments?: boolean | null
          company_id: string
          created_at?: string | null
          default_expense_category?: string | null
          default_income_category?: string | null
          default_tax_category?: string | null
          email_reports?: boolean | null
          fiscal_year_start_day?: number | null
          fiscal_year_start_month?: number | null
          id?: string
          report_frequency?: string | null
          report_recipients?: string[] | null
          require_receipt_attachment?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_manual_journal_entries?: boolean | null
          auto_categorize_transactions?: boolean | null
          auto_generate_reports?: boolean | null
          auto_reconcile_payments?: boolean | null
          company_id?: string
          created_at?: string | null
          default_expense_category?: string | null
          default_income_category?: string | null
          default_tax_category?: string | null
          email_reports?: boolean | null
          fiscal_year_start_day?: number | null
          fiscal_year_start_month?: number | null
          id?: string
          report_frequency?: string | null
          report_recipients?: string[] | null
          require_receipt_attachment?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_bookkeeping_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_bookkeeping_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_business_financing_settings: {
        Row: {
          annual_revenue: number | null
          auto_calculate_eligibility: boolean | null
          business_credit_score: number | null
          company_id: string
          created_at: string | null
          enable_business_loans: boolean | null
          enable_equipment_financing: boolean | null
          enable_line_of_credit: boolean | null
          financing_provider: string | null
          id: string
          max_acceptable_apr: number | null
          preferred_loan_amount: number | null
          preferred_term_months: number | null
          provider_api_key_encrypted: string | null
          show_offers_in_dashboard: boolean | null
          updated_at: string | null
          years_in_business: number | null
        }
        Insert: {
          annual_revenue?: number | null
          auto_calculate_eligibility?: boolean | null
          business_credit_score?: number | null
          company_id: string
          created_at?: string | null
          enable_business_loans?: boolean | null
          enable_equipment_financing?: boolean | null
          enable_line_of_credit?: boolean | null
          financing_provider?: string | null
          id?: string
          max_acceptable_apr?: number | null
          preferred_loan_amount?: number | null
          preferred_term_months?: number | null
          provider_api_key_encrypted?: string | null
          show_offers_in_dashboard?: boolean | null
          updated_at?: string | null
          years_in_business?: number | null
        }
        Update: {
          annual_revenue?: number | null
          auto_calculate_eligibility?: boolean | null
          business_credit_score?: number | null
          company_id?: string
          created_at?: string | null
          enable_business_loans?: boolean | null
          enable_equipment_financing?: boolean | null
          enable_line_of_credit?: boolean | null
          financing_provider?: string | null
          id?: string
          max_acceptable_apr?: number | null
          preferred_loan_amount?: number | null
          preferred_term_months?: number | null
          provider_api_key_encrypted?: string | null
          show_offers_in_dashboard?: boolean | null
          updated_at?: string | null
          years_in_business?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_business_financing_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_business_financing_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_consumer_financing_settings: {
        Row: {
          allow_instant_approval: boolean | null
          available_terms: number[] | null
          collect_ssn: boolean | null
          company_id: string
          created_at: string | null
          financing_enabled: boolean | null
          id: string
          marketing_message: string | null
          max_amount: number | null
          min_amount: number | null
          promote_financing: boolean | null
          provider: string | null
          provider_api_key_encrypted: string | null
          provider_merchant_id: string | null
          require_credit_check: boolean | null
          show_in_estimates: boolean | null
          show_in_invoices: boolean | null
          show_monthly_payment: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_instant_approval?: boolean | null
          available_terms?: number[] | null
          collect_ssn?: boolean | null
          company_id: string
          created_at?: string | null
          financing_enabled?: boolean | null
          id?: string
          marketing_message?: string | null
          max_amount?: number | null
          min_amount?: number | null
          promote_financing?: boolean | null
          provider?: string | null
          provider_api_key_encrypted?: string | null
          provider_merchant_id?: string | null
          require_credit_check?: boolean | null
          show_in_estimates?: boolean | null
          show_in_invoices?: boolean | null
          show_monthly_payment?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_instant_approval?: boolean | null
          available_terms?: number[] | null
          collect_ssn?: boolean | null
          company_id?: string
          created_at?: string | null
          financing_enabled?: boolean | null
          id?: string
          marketing_message?: string | null
          max_amount?: number | null
          min_amount?: number | null
          promote_financing?: boolean | null
          provider?: string | null
          provider_api_key_encrypted?: string | null
          provider_merchant_id?: string | null
          require_credit_check?: boolean | null
          show_in_estimates?: boolean | null
          show_in_invoices?: boolean | null
          show_monthly_payment?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_consumer_financing_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_consumer_financing_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_debit_cards: {
        Row: {
          allowed_categories: string[] | null
          allowed_merchants: string[] | null
          blocked_categories: string[] | null
          card_name: string
          card_number_last4: string
          card_provider: string | null
          company_id: string
          created_at: string | null
          daily_limit: number | null
          daily_spent: number | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          is_virtual: boolean | null
          last_reset_date: string | null
          monthly_limit: number | null
          monthly_spent: number | null
          team_member_id: string | null
          transaction_limit: number | null
          updated_at: string | null
        }
        Insert: {
          allowed_categories?: string[] | null
          allowed_merchants?: string[] | null
          blocked_categories?: string[] | null
          card_name: string
          card_number_last4: string
          card_provider?: string | null
          company_id: string
          created_at?: string | null
          daily_limit?: number | null
          daily_spent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_virtual?: boolean | null
          last_reset_date?: string | null
          monthly_limit?: number | null
          monthly_spent?: number | null
          team_member_id?: string | null
          transaction_limit?: number | null
          updated_at?: string | null
        }
        Update: {
          allowed_categories?: string[] | null
          allowed_merchants?: string[] | null
          blocked_categories?: string[] | null
          card_name?: string
          card_number_last4?: string
          card_provider?: string | null
          company_id?: string
          created_at?: string | null
          daily_limit?: number | null
          daily_spent?: number | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          is_virtual?: boolean | null
          last_reset_date?: string | null
          monthly_limit?: number | null
          monthly_spent?: number | null
          team_member_id?: string | null
          transaction_limit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_debit_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_debit_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "finance_debit_cards_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_gas_cards: {
        Row: {
          allowed_fuel_types: string[] | null
          allowed_locations: string[] | null
          card_name: string
          card_number_last4: string
          card_provider: string | null
          company_id: string
          created_at: string | null
          daily_amount_limit: number | null
          daily_gallon_limit: number | null
          id: string
          is_active: boolean | null
          last_odometer_reading: number | null
          monthly_amount_limit: number | null
          monthly_gallons: number | null
          monthly_spent: number | null
          purchase_restrictions: string[] | null
          require_odometer: boolean | null
          team_member_id: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          allowed_fuel_types?: string[] | null
          allowed_locations?: string[] | null
          card_name: string
          card_number_last4: string
          card_provider?: string | null
          company_id: string
          created_at?: string | null
          daily_amount_limit?: number | null
          daily_gallon_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_odometer_reading?: number | null
          monthly_amount_limit?: number | null
          monthly_gallons?: number | null
          monthly_spent?: number | null
          purchase_restrictions?: string[] | null
          require_odometer?: boolean | null
          team_member_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          allowed_fuel_types?: string[] | null
          allowed_locations?: string[] | null
          card_name?: string
          card_number_last4?: string
          card_provider?: string | null
          company_id?: string
          created_at?: string | null
          daily_amount_limit?: number | null
          daily_gallon_limit?: number | null
          id?: string
          is_active?: boolean | null
          last_odometer_reading?: number | null
          monthly_amount_limit?: number | null
          monthly_gallons?: number | null
          monthly_spent?: number | null
          purchase_restrictions?: string[] | null
          require_odometer?: boolean | null
          team_member_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_gas_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_gas_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "finance_gas_cards_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_gift_card_settings: {
        Row: {
          allow_custom_message: boolean | null
          allow_in_person_purchase: boolean | null
          allow_multiple_cards_per_transaction: boolean | null
          allow_online_purchase: boolean | null
          allow_partial_redemption: boolean | null
          available_amounts: number[] | null
          cards_expire: boolean | null
          combine_with_other_discounts: boolean | null
          company_id: string
          created_at: string | null
          default_design_url: string | null
          expiration_months: number | null
          fixed_denominations: boolean | null
          gift_cards_enabled: boolean | null
          id: string
          max_custom_amount: number | null
          max_message_length: number | null
          min_custom_amount: number | null
          program_name: string | null
          reminder_days_before: number | null
          require_recipient_email: boolean | null
          send_expiration_reminder: boolean | null
          track_redemption_analytics: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_custom_message?: boolean | null
          allow_in_person_purchase?: boolean | null
          allow_multiple_cards_per_transaction?: boolean | null
          allow_online_purchase?: boolean | null
          allow_partial_redemption?: boolean | null
          available_amounts?: number[] | null
          cards_expire?: boolean | null
          combine_with_other_discounts?: boolean | null
          company_id: string
          created_at?: string | null
          default_design_url?: string | null
          expiration_months?: number | null
          fixed_denominations?: boolean | null
          gift_cards_enabled?: boolean | null
          id?: string
          max_custom_amount?: number | null
          max_message_length?: number | null
          min_custom_amount?: number | null
          program_name?: string | null
          reminder_days_before?: number | null
          require_recipient_email?: boolean | null
          send_expiration_reminder?: boolean | null
          track_redemption_analytics?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_custom_message?: boolean | null
          allow_in_person_purchase?: boolean | null
          allow_multiple_cards_per_transaction?: boolean | null
          allow_online_purchase?: boolean | null
          allow_partial_redemption?: boolean | null
          available_amounts?: number[] | null
          cards_expire?: boolean | null
          combine_with_other_discounts?: boolean | null
          company_id?: string
          created_at?: string | null
          default_design_url?: string | null
          expiration_months?: number | null
          fixed_denominations?: boolean | null
          gift_cards_enabled?: boolean | null
          id?: string
          max_custom_amount?: number | null
          max_message_length?: number | null
          min_custom_amount?: number | null
          program_name?: string | null
          reminder_days_before?: number | null
          require_recipient_email?: boolean | null
          send_expiration_reminder?: boolean | null
          track_redemption_analytics?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_gift_card_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_gift_card_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_gift_cards: {
        Row: {
          activated_at: string | null
          card_code: string
          card_pin: string | null
          company_id: string
          created_at: string | null
          current_balance: number
          custom_message: string | null
          design_url: string | null
          expires_at: string | null
          id: string
          initial_amount: number
          last_used_at: string | null
          purchased_at: string | null
          purchaser_email: string | null
          purchaser_name: string | null
          recipient_email: string | null
          recipient_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          activated_at?: string | null
          card_code: string
          card_pin?: string | null
          company_id: string
          created_at?: string | null
          current_balance: number
          custom_message?: string | null
          design_url?: string | null
          expires_at?: string | null
          id?: string
          initial_amount: number
          last_used_at?: string | null
          purchased_at?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          activated_at?: string | null
          card_code?: string
          card_pin?: string | null
          company_id?: string
          created_at?: string | null
          current_balance?: number
          custom_message?: string | null
          design_url?: string | null
          expires_at?: string | null
          id?: string
          initial_amount?: number
          last_used_at?: string | null
          purchased_at?: string | null
          purchaser_email?: string | null
          purchaser_name?: string | null
          recipient_email?: string | null
          recipient_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_gift_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_gift_cards_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_providers: {
        Row: {
          api_credentials: Json | null
          company_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          default_interest_rate: number | null
          default_term_months: number | null
          deleted_at: string | null
          id: string
          is_active: boolean | null
          max_finance_amount: number | null
          min_finance_amount: number | null
          notes: string | null
          processing_fee_percent: number | null
          provider_code: string | null
          provider_name: string
          setup_fee: number | null
          updated_at: string
        }
        Insert: {
          api_credentials?: Json | null
          company_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          default_interest_rate?: number | null
          default_term_months?: number | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          max_finance_amount?: number | null
          min_finance_amount?: number | null
          notes?: string | null
          processing_fee_percent?: number | null
          provider_code?: string | null
          provider_name: string
          setup_fee?: number | null
          updated_at?: string
        }
        Update: {
          api_credentials?: Json | null
          company_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          default_interest_rate?: number | null
          default_term_months?: number | null
          deleted_at?: string | null
          id?: string
          is_active?: boolean | null
          max_finance_amount?: number | null
          min_finance_amount?: number | null
          notes?: string | null
          processing_fee_percent?: number | null
          provider_code?: string | null
          provider_name?: string
          setup_fee?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "finance_providers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_providers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_virtual_bucket_settings: {
        Row: {
          allocation_frequency: string | null
          auto_allocate_funds: boolean | null
          company_id: string
          created_at: string | null
          emergency_fund_percentage: number | null
          emergency_fund_target: number | null
          id: string
          low_balance_threshold: number | null
          min_operating_balance: number | null
          notify_bucket_goals_met: boolean | null
          notify_low_balance: boolean | null
          operating_expenses_percentage: number | null
          profit_percentage: number | null
          tax_reserve_percentage: number | null
          updated_at: string | null
          virtual_buckets_enabled: boolean | null
        }
        Insert: {
          allocation_frequency?: string | null
          auto_allocate_funds?: boolean | null
          company_id: string
          created_at?: string | null
          emergency_fund_percentage?: number | null
          emergency_fund_target?: number | null
          id?: string
          low_balance_threshold?: number | null
          min_operating_balance?: number | null
          notify_bucket_goals_met?: boolean | null
          notify_low_balance?: boolean | null
          operating_expenses_percentage?: number | null
          profit_percentage?: number | null
          tax_reserve_percentage?: number | null
          updated_at?: string | null
          virtual_buckets_enabled?: boolean | null
        }
        Update: {
          allocation_frequency?: string | null
          auto_allocate_funds?: boolean | null
          company_id?: string
          created_at?: string | null
          emergency_fund_percentage?: number | null
          emergency_fund_target?: number | null
          id?: string
          low_balance_threshold?: number | null
          min_operating_balance?: number | null
          notify_bucket_goals_met?: boolean | null
          notify_low_balance?: boolean | null
          operating_expenses_percentage?: number | null
          profit_percentage?: number | null
          tax_reserve_percentage?: number | null
          updated_at?: string | null
          virtual_buckets_enabled?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_virtual_bucket_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_virtual_bucket_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      finance_virtual_buckets: {
        Row: {
          allocation_percentage: number | null
          auto_transfer_enabled: boolean | null
          bucket_name: string
          bucket_type: string | null
          color: string | null
          company_id: string
          created_at: string | null
          current_balance: number | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          max_balance: number | null
          min_balance: number | null
          target_balance: number | null
          updated_at: string | null
        }
        Insert: {
          allocation_percentage?: number | null
          auto_transfer_enabled?: boolean | null
          bucket_name: string
          bucket_type?: string | null
          color?: string | null
          company_id: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_balance?: number | null
          min_balance?: number | null
          target_balance?: number | null
          updated_at?: string | null
        }
        Update: {
          allocation_percentage?: number | null
          auto_transfer_enabled?: boolean | null
          bucket_name?: string
          bucket_type?: string | null
          color?: string | null
          company_id?: string
          created_at?: string | null
          current_balance?: number | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          max_balance?: number | null
          min_balance?: number | null
          target_balance?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_virtual_buckets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_virtual_buckets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      inventory: {
        Row: {
          company_id: string
          cost_per_unit: number | null
          created_at: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_low_stock: boolean
          last_purchase_cost: number | null
          last_restock_date: string | null
          last_restock_purchase_order_id: string | null
          last_restock_quantity: number | null
          last_stock_check_date: string | null
          last_used_date: string | null
          last_used_job_id: string | null
          low_stock_alert_sent: boolean
          low_stock_alert_sent_at: string | null
          maximum_quantity: number | null
          minimum_quantity: number | null
          notes: string | null
          price_book_item_id: string
          primary_location: string | null
          quantity_available: number
          quantity_on_hand: number
          quantity_reserved: number
          reorder_point: number | null
          reorder_quantity: number | null
          secondary_locations: Json | null
          status: string
          total_cost_value: number | null
          updated_at: string
          warehouse_location: string | null
        }
        Insert: {
          company_id: string
          cost_per_unit?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_low_stock?: boolean
          last_purchase_cost?: number | null
          last_restock_date?: string | null
          last_restock_purchase_order_id?: string | null
          last_restock_quantity?: number | null
          last_stock_check_date?: string | null
          last_used_date?: string | null
          last_used_job_id?: string | null
          low_stock_alert_sent?: boolean
          low_stock_alert_sent_at?: string | null
          maximum_quantity?: number | null
          minimum_quantity?: number | null
          notes?: string | null
          price_book_item_id: string
          primary_location?: string | null
          quantity_available?: number
          quantity_on_hand?: number
          quantity_reserved?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          secondary_locations?: Json | null
          status?: string
          total_cost_value?: number | null
          updated_at?: string
          warehouse_location?: string | null
        }
        Update: {
          company_id?: string
          cost_per_unit?: number | null
          created_at?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_low_stock?: boolean
          last_purchase_cost?: number | null
          last_restock_date?: string | null
          last_restock_purchase_order_id?: string | null
          last_restock_quantity?: number | null
          last_stock_check_date?: string | null
          last_used_date?: string | null
          last_used_job_id?: string | null
          low_stock_alert_sent?: boolean
          low_stock_alert_sent_at?: string | null
          maximum_quantity?: number | null
          minimum_quantity?: number | null
          notes?: string | null
          price_book_item_id?: string
          primary_location?: string | null
          quantity_available?: number
          quantity_on_hand?: number
          quantity_reserved?: number
          reorder_point?: number | null
          reorder_quantity?: number | null
          secondary_locations?: Json | null
          status?: string
          total_cost_value?: number | null
          updated_at?: string
          warehouse_location?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "inventory_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_last_restock_purchase_order_id_purchase_orders_id_fk"
            columns: ["last_restock_purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_last_used_job_id_jobs_id_fk"
            columns: ["last_used_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_price_book_item_id_price_book_items_id_fk"
            columns: ["price_book_item_id"]
            isOneToOne: false
            referencedRelation: "price_book_items"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_jobs: {
        Row: {
          amount_from_job: number
          company_id: string
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          job_id: string
        }
        Insert: {
          amount_from_job: number
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          job_id: string
        }
        Update: {
          amount_from_job?: number
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          job_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "invoice_jobs_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_jobs_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payment_tokens: {
        Row: {
          created_at: string | null
          created_by_ip: string | null
          expires_at: string
          id: string
          invoice_id: string
          is_active: boolean | null
          max_uses: number | null
          metadata: Json | null
          token: string
          use_count: number | null
          used_at: string | null
          used_by_ip: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_ip?: string | null
          expires_at: string
          id?: string
          invoice_id: string
          is_active?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          token: string
          use_count?: number | null
          used_at?: string | null
          used_by_ip?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_ip?: string | null
          expires_at?: string
          id?: string
          invoice_id?: string
          is_active?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          token?: string
          use_count?: number | null
          used_at?: string | null
          used_by_ip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payment_tokens_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount_applied: number
          applied_at: string
          applied_by: string | null
          company_id: string
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_id: string
        }
        Insert: {
          amount_applied: number
          applied_at?: string
          applied_by?: string | null
          company_id: string
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_id: string
        }
        Update: {
          amount_applied?: number
          applied_at?: string
          applied_by?: string | null
          company_id?: string
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_applied_by_fkey"
            columns: ["applied_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_payments_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_settings: {
        Row: {
          company_id: string
          created_at: string | null
          default_invoice_email_body: string | null
          default_invoice_email_subject: string | null
          default_invoice_footer: string | null
          default_payment_terms: number | null
          default_tax_rate: number | null
          default_terms: string | null
          id: string
          include_terms_and_conditions: boolean | null
          invoice_number_format: string | null
          invoice_number_prefix: string | null
          late_fee_amount: number | null
          late_fee_enabled: boolean | null
          late_fee_grace_period_days: number | null
          late_fee_type: string | null
          next_invoice_number: number | null
          payment_instructions: string | null
          payment_terms_options: number[] | null
          reminder_schedule: number[] | null
          send_reminders: boolean | null
          show_payment_instructions: boolean | null
          tax_enabled: boolean | null
          tax_label: string | null
          thank_you_message: string | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          default_invoice_email_body?: string | null
          default_invoice_email_subject?: string | null
          default_invoice_footer?: string | null
          default_payment_terms?: number | null
          default_tax_rate?: number | null
          default_terms?: string | null
          id?: string
          include_terms_and_conditions?: boolean | null
          invoice_number_format?: string | null
          invoice_number_prefix?: string | null
          late_fee_amount?: number | null
          late_fee_enabled?: boolean | null
          late_fee_grace_period_days?: number | null
          late_fee_type?: string | null
          next_invoice_number?: number | null
          payment_instructions?: string | null
          payment_terms_options?: number[] | null
          reminder_schedule?: number[] | null
          send_reminders?: boolean | null
          show_payment_instructions?: boolean | null
          tax_enabled?: boolean | null
          tax_label?: string | null
          thank_you_message?: string | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          default_invoice_email_body?: string | null
          default_invoice_email_subject?: string | null
          default_invoice_footer?: string | null
          default_payment_terms?: number | null
          default_tax_rate?: number | null
          default_terms?: string | null
          id?: string
          include_terms_and_conditions?: boolean | null
          invoice_number_format?: string | null
          invoice_number_prefix?: string | null
          late_fee_amount?: number | null
          late_fee_enabled?: boolean | null
          late_fee_grace_period_days?: number | null
          late_fee_type?: string | null
          next_invoice_number?: number | null
          payment_instructions?: string | null
          payment_terms_options?: number[] | null
          reminder_schedule?: number[] | null
          send_reminders?: boolean | null
          show_payment_instructions?: boolean | null
          tax_enabled?: boolean | null
          tax_label?: string | null
          thank_you_message?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      invoice_templates: {
        Row: {
          apply_tax: boolean | null
          company_id: string
          created_at: string
          default_discount_amount: number | null
          default_discount_percent: number | null
          default_due_days: number | null
          default_line_items: Json | null
          default_payment_terms: string | null
          deleted_at: string | null
          description: string | null
          footer_text: string | null
          header_text: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          last_used_at: string | null
          logo_url: string | null
          notes_template: string | null
          primary_color: string | null
          tax_rate: number | null
          template_code: string | null
          template_name: string
          terms_and_conditions: string | null
          times_used: number | null
          updated_at: string
        }
        Insert: {
          apply_tax?: boolean | null
          company_id: string
          created_at?: string
          default_discount_amount?: number | null
          default_discount_percent?: number | null
          default_due_days?: number | null
          default_line_items?: Json | null
          default_payment_terms?: string | null
          deleted_at?: string | null
          description?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          logo_url?: string | null
          notes_template?: string | null
          primary_color?: string | null
          tax_rate?: number | null
          template_code?: string | null
          template_name: string
          terms_and_conditions?: string | null
          times_used?: number | null
          updated_at?: string
        }
        Update: {
          apply_tax?: boolean | null
          company_id?: string
          created_at?: string
          default_discount_amount?: number | null
          default_discount_percent?: number | null
          default_due_days?: number | null
          default_line_items?: Json | null
          default_payment_terms?: string | null
          deleted_at?: string | null
          description?: string | null
          footer_text?: string | null
          header_text?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          last_used_at?: string | null
          logo_url?: string | null
          notes_template?: string | null
          primary_color?: string | null
          tax_rate?: number | null
          template_code?: string | null
          template_name?: string
          terms_and_conditions?: string | null
          times_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      invoices: {
        Row: {
          archived_at: string | null
          balance_amount: number
          company_id: string
          created_at: string
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          discount_amount: number
          due_date: string | null
          has_payment_plan: boolean | null
          id: string
          invoice_number: string
          is_recurring: boolean | null
          job_id: string | null
          line_items: Json
          next_invoice_date: string | null
          notes: string | null
          page_content: Json | null
          paid_amount: number
          paid_at: string | null
          payment_plan_id: string | null
          payment_token: string | null
          payment_token_expires_at: string | null
          permanent_delete_scheduled_at: string | null
          recurrence_frequency: string | null
          recurring_invoice_id: string | null
          search_vector: unknown
          sent_at: string | null
          status: string
          subtotal: number
          tax_amount: number
          terms: string | null
          title: string
          total_amount: number
          updated_at: string
          viewed_at: string | null
        }
        Insert: {
          archived_at?: string | null
          balance_amount?: number
          company_id: string
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discount_amount?: number
          due_date?: string | null
          has_payment_plan?: boolean | null
          id?: string
          invoice_number: string
          is_recurring?: boolean | null
          job_id?: string | null
          line_items: Json
          next_invoice_date?: string | null
          notes?: string | null
          page_content?: Json | null
          paid_amount?: number
          paid_at?: string | null
          payment_plan_id?: string | null
          payment_token?: string | null
          payment_token_expires_at?: string | null
          permanent_delete_scheduled_at?: string | null
          recurrence_frequency?: string | null
          recurring_invoice_id?: string | null
          search_vector?: unknown
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          title: string
          total_amount?: number
          updated_at?: string
          viewed_at?: string | null
        }
        Update: {
          archived_at?: string | null
          balance_amount?: number
          company_id?: string
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          discount_amount?: number
          due_date?: string | null
          has_payment_plan?: boolean | null
          id?: string
          invoice_number?: string
          is_recurring?: boolean | null
          job_id?: string | null
          line_items?: Json
          next_invoice_date?: string | null
          notes?: string | null
          page_content?: Json | null
          paid_amount?: number
          paid_at?: string | null
          payment_plan_id?: string | null
          payment_token?: string | null
          payment_token_expires_at?: string | null
          permanent_delete_scheduled_at?: string | null
          recurrence_frequency?: string | null
          recurring_invoice_id?: string | null
          search_vector?: unknown
          sent_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number
          terms?: string | null
          title?: string
          total_amount?: number
          updated_at?: string
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_invoices_payment_plan"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_invoices_recurring_invoice"
            columns: ["recurring_invoice_id"]
            isOneToOne: false
            referencedRelation: "recurring_invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "invoices_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      ivr_menus: {
        Row: {
          call_routing_rule_id: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          deleted_at: string | null
          description: string | null
          greeting_audio_url: string | null
          greeting_text: string | null
          id: string
          invalid_option_message: string | null
          is_active: boolean | null
          language: string | null
          max_retries: number | null
          name: string
          options: Json
          parent_menu_id: string | null
          retry_message: string | null
          timeout_action: string | null
          timeout_seconds: number | null
          updated_at: string | null
          use_text_to_speech: boolean | null
          voice: string | null
        }
        Insert: {
          call_routing_rule_id?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          greeting_audio_url?: string | null
          greeting_text?: string | null
          id?: string
          invalid_option_message?: string | null
          is_active?: boolean | null
          language?: string | null
          max_retries?: number | null
          name: string
          options?: Json
          parent_menu_id?: string | null
          retry_message?: string | null
          timeout_action?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          use_text_to_speech?: boolean | null
          voice?: string | null
        }
        Update: {
          call_routing_rule_id?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          greeting_audio_url?: string | null
          greeting_text?: string | null
          id?: string
          invalid_option_message?: string | null
          is_active?: boolean | null
          language?: string | null
          max_retries?: number | null
          name?: string
          options?: Json
          parent_menu_id?: string | null
          retry_message?: string | null
          timeout_action?: string | null
          timeout_seconds?: number | null
          updated_at?: string | null
          use_text_to_speech?: boolean | null
          voice?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ivr_menus_call_routing_rule_id_fkey"
            columns: ["call_routing_rule_id"]
            isOneToOne: false
            referencedRelation: "call_routing_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ivr_menus_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ivr_menus_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "ivr_menus_parent_menu_id_fkey"
            columns: ["parent_menu_id"]
            isOneToOne: false
            referencedRelation: "ivr_menus"
            referencedColumns: ["id"]
          },
        ]
      }
      job_customers: {
        Row: {
          billing_percentage: number | null
          company_id: string
          created_at: string
          customer_id: string
          id: string
          is_billing_contact: boolean | null
          is_primary: boolean | null
          job_id: string
          role: string
          updated_at: string
        }
        Insert: {
          billing_percentage?: number | null
          company_id: string
          created_at?: string
          customer_id: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          job_id: string
          role?: string
          updated_at?: string
        }
        Update: {
          billing_percentage?: number | null
          company_id?: string
          created_at?: string
          customer_id?: string
          id?: string
          is_billing_contact?: boolean | null
          is_primary?: boolean | null
          job_id?: string
          role?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_customers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_customers_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_equipment: {
        Row: {
          company_id: string
          created_at: string
          equipment_id: string
          hours_spent: number | null
          id: string
          job_id: string
          labor_cost: number | null
          parts_cost: number | null
          service_description: string | null
          service_type: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          equipment_id: string
          hours_spent?: number | null
          id?: string
          job_id: string
          labor_cost?: number | null
          parts_cost?: number | null
          service_description?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          equipment_id?: string
          hours_spent?: number | null
          id?: string
          job_id?: string
          labor_cost?: number | null
          parts_cost?: number | null
          service_description?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_equipment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_equipment_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_equipment_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_equipment_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_photos: {
        Row: {
          annotations: Json | null
          category: string
          company_id: string
          created_at: string | null
          description: string | null
          device_info: Json | null
          display_order: number | null
          exif_data: Json | null
          file_name: string
          file_size: number | null
          id: string
          is_customer_visible: boolean | null
          is_required_photo: boolean | null
          job_id: string
          metadata: Json | null
          mime_type: string | null
          photo_location: Json | null
          storage_path: string
          subcategory: string | null
          tags: Json | null
          taken_at: string | null
          thumbnail_path: string | null
          title: string | null
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          annotations?: Json | null
          category: string
          company_id: string
          created_at?: string | null
          description?: string | null
          device_info?: Json | null
          display_order?: number | null
          exif_data?: Json | null
          file_name: string
          file_size?: number | null
          id?: string
          is_customer_visible?: boolean | null
          is_required_photo?: boolean | null
          job_id: string
          metadata?: Json | null
          mime_type?: string | null
          photo_location?: Json | null
          storage_path: string
          subcategory?: string | null
          tags?: Json | null
          taken_at?: string | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          annotations?: Json | null
          category?: string
          company_id?: string
          created_at?: string | null
          description?: string | null
          device_info?: Json | null
          display_order?: number | null
          exif_data?: Json | null
          file_name?: string
          file_size?: number | null
          id?: string
          is_customer_visible?: boolean | null
          is_required_photo?: boolean | null
          job_id?: string
          metadata?: Json | null
          mime_type?: string | null
          photo_location?: Json | null
          storage_path?: string
          subcategory?: string | null
          tags?: Json | null
          taken_at?: string | null
          thumbnail_path?: string | null
          title?: string | null
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_photos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_photos_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_photos_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_properties: {
        Row: {
          company_id: string
          created_at: string
          estimated_hours: number | null
          id: string
          is_primary: boolean | null
          job_id: string
          property_id: string
          role: string
          updated_at: string
          work_description: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          estimated_hours?: number | null
          id?: string
          is_primary?: boolean | null
          job_id: string
          property_id: string
          role?: string
          updated_at?: string
          work_description?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          estimated_hours?: number | null
          id?: string
          is_primary?: boolean | null
          job_id?: string
          property_id?: string
          role?: string
          updated_at?: string
          work_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_properties_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      job_settings: {
        Row: {
          auto_invoice_on_completion: boolean | null
          auto_send_completion_email: boolean | null
          company_id: string
          created_at: string | null
          default_job_status: string | null
          default_priority: string | null
          id: string
          job_number_format: string | null
          job_number_prefix: string | null
          next_job_number: number | null
          require_arrival_confirmation: boolean | null
          require_completion_notes: boolean | null
          require_customer_signature: boolean | null
          require_photo_completion: boolean | null
          send_review_link_on_completion: boolean | null
          track_technician_time: boolean | null
          updated_at: string | null
        }
        Insert: {
          auto_invoice_on_completion?: boolean | null
          auto_send_completion_email?: boolean | null
          company_id: string
          created_at?: string | null
          default_job_status?: string | null
          default_priority?: string | null
          id?: string
          job_number_format?: string | null
          job_number_prefix?: string | null
          next_job_number?: number | null
          require_arrival_confirmation?: boolean | null
          require_completion_notes?: boolean | null
          require_customer_signature?: boolean | null
          require_photo_completion?: boolean | null
          send_review_link_on_completion?: boolean | null
          track_technician_time?: boolean | null
          updated_at?: string | null
        }
        Update: {
          auto_invoice_on_completion?: boolean | null
          auto_send_completion_email?: boolean | null
          company_id?: string
          created_at?: string | null
          default_job_status?: string | null
          default_priority?: string | null
          id?: string
          job_number_format?: string | null
          job_number_prefix?: string | null
          next_job_number?: number | null
          require_arrival_confirmation?: boolean | null
          require_completion_notes?: boolean | null
          require_customer_signature?: boolean | null
          require_photo_completion?: boolean | null
          send_review_link_on_completion?: boolean | null
          track_technician_time?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      job_signatures: {
        Row: {
          agreement_text: string | null
          company_id: string
          created_at: string | null
          device_info: Json | null
          document_content: Json | null
          document_type: string | null
          id: string
          ip_address: string | null
          is_verified: boolean | null
          job_id: string
          metadata: Json | null
          signature_data_url: string
          signature_hash: string | null
          signature_type: string
          signed_at: string
          signed_location: Json | null
          signer_email: string | null
          signer_name: string
          signer_phone: string | null
          signer_role: string | null
          user_agent: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          agreement_text?: string | null
          company_id: string
          created_at?: string | null
          device_info?: Json | null
          document_content?: Json | null
          document_type?: string | null
          id?: string
          ip_address?: string | null
          is_verified?: boolean | null
          job_id: string
          metadata?: Json | null
          signature_data_url: string
          signature_hash?: string | null
          signature_type: string
          signed_at?: string
          signed_location?: Json | null
          signer_email?: string | null
          signer_name: string
          signer_phone?: string | null
          signer_role?: string | null
          user_agent?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          agreement_text?: string | null
          company_id?: string
          created_at?: string | null
          device_info?: Json | null
          document_content?: Json | null
          document_type?: string | null
          id?: string
          ip_address?: string | null
          is_verified?: boolean | null
          job_id?: string
          metadata?: Json | null
          signature_data_url?: string
          signature_hash?: string | null
          signature_type?: string
          signed_at?: string
          signed_location?: Json | null
          signer_email?: string | null
          signer_name?: string
          signer_phone?: string | null
          signer_role?: string | null
          user_agent?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_signatures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_signatures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_signatures_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_tags: {
        Row: {
          added_at: string
          added_by: string | null
          job_id: string
          tag_id: string
        }
        Insert: {
          added_at?: string
          added_by?: string | null
          job_id: string
          tag_id: string
        }
        Update: {
          added_at?: string
          added_by?: string | null
          job_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_tags_added_by_users_id_fk"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_tags_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_tags_tag_id_tags_id_fk"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      job_tasks: {
        Row: {
          assigned_to: string | null
          attachments: Json | null
          category: string | null
          company_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          due_date: string | null
          id: string
          is_completed: boolean | null
          is_required: boolean | null
          job_id: string
          metadata: Json | null
          notes: string | null
          template_category: string | null
          template_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          company_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_required?: boolean | null
          job_id: string
          metadata?: Json | null
          notes?: string | null
          template_category?: string | null
          template_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          attachments?: Json | null
          category?: string | null
          company_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          due_date?: string | null
          id?: string
          is_completed?: boolean | null
          is_required?: boolean | null
          job_id?: string
          metadata?: Json | null
          notes?: string | null
          template_category?: string | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_tasks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_tasks_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_team_assignments: {
        Row: {
          assigned_at: string
          assigned_by: string | null
          created_at: string
          id: string
          job_id: string
          metadata: Json | null
          notes: string | null
          removed_at: string | null
          removed_by: string | null
          role: string
          team_member_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          job_id: string
          metadata?: Json | null
          notes?: string | null
          removed_at?: string | null
          removed_by?: string | null
          role?: string
          team_member_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string | null
          created_at?: string
          id?: string
          job_id?: string
          metadata?: Json | null
          notes?: string | null
          removed_at?: string | null
          removed_by?: string | null
          role?: string
          team_member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_team_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_team_assignments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_team_assignments_removed_by_fkey"
            columns: ["removed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_team_assignments_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      job_templates: {
        Row: {
          company_id: string
          created_at: string
          created_by: string | null
          custom_fields: Json | null
          default_duration: number | null
          default_notes: string | null
          default_priority: string
          deleted_at: string | null
          description: string | null
          description_template: string | null
          id: string
          is_active: boolean
          job_type: string | null
          last_used_at: string | null
          name: string
          pricing: Json | null
          required_fields: Json | null
          title_template: string | null
          updated_at: string
          usage_count: number
        }
        Insert: {
          company_id: string
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          default_duration?: number | null
          default_notes?: string | null
          default_priority?: string
          deleted_at?: string | null
          description?: string | null
          description_template?: string | null
          id?: string
          is_active?: boolean
          job_type?: string | null
          last_used_at?: string | null
          name: string
          pricing?: Json | null
          required_fields?: Json | null
          title_template?: string | null
          updated_at?: string
          usage_count?: number
        }
        Update: {
          company_id?: string
          created_at?: string
          created_by?: string | null
          custom_fields?: Json | null
          default_duration?: number | null
          default_notes?: string | null
          default_priority?: string
          deleted_at?: string | null
          description?: string | null
          description_template?: string | null
          id?: string
          is_active?: boolean
          job_type?: string | null
          last_used_at?: string | null
          name?: string
          pricing?: Json | null
          required_fields?: Json | null
          title_template?: string | null
          updated_at?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_templates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      job_time_entries: {
        Row: {
          break_minutes: number | null
          clock_in: string
          clock_in_location: Json | null
          clock_out: string | null
          clock_out_location: Json | null
          company_id: string
          created_at: string | null
          entry_type: string | null
          gps_verified: boolean | null
          hourly_rate: number | null
          id: string
          is_billable: boolean | null
          is_overtime: boolean | null
          job_id: string
          metadata: Json | null
          notes: string | null
          total_hours: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          break_minutes?: number | null
          clock_in: string
          clock_in_location?: Json | null
          clock_out?: string | null
          clock_out_location?: Json | null
          company_id: string
          created_at?: string | null
          entry_type?: string | null
          gps_verified?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          is_overtime?: boolean | null
          job_id: string
          metadata?: Json | null
          notes?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          break_minutes?: number | null
          clock_in?: string
          clock_in_location?: Json | null
          clock_out?: string | null
          clock_out_location?: Json | null
          company_id?: string
          created_at?: string | null
          entry_type?: string | null
          gps_verified?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_billable?: boolean | null
          is_overtime?: boolean | null
          job_id?: string
          metadata?: Json | null
          notes?: string | null
          total_hours?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_time_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_time_entries_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "job_time_entries_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_workflow_stages: {
        Row: {
          allowed_next_stages: Json | null
          approval_roles: Json | null
          auto_create_invoice: boolean | null
          auto_send_email: boolean | null
          auto_send_sms: boolean | null
          company_id: string
          created_at: string | null
          display_order: number
          email_template_id: string | null
          id: string
          industry_type: string | null
          is_active: boolean | null
          is_end_stage: boolean | null
          is_start_stage: boolean | null
          metadata: Json | null
          required_fields: Json | null
          required_photos_count: number | null
          required_time_entry: boolean | null
          requires_approval: boolean | null
          sms_template_id: string | null
          stage_color: string | null
          stage_icon: string | null
          stage_key: string
          stage_name: string
          updated_at: string | null
        }
        Insert: {
          allowed_next_stages?: Json | null
          approval_roles?: Json | null
          auto_create_invoice?: boolean | null
          auto_send_email?: boolean | null
          auto_send_sms?: boolean | null
          company_id: string
          created_at?: string | null
          display_order?: number
          email_template_id?: string | null
          id?: string
          industry_type?: string | null
          is_active?: boolean | null
          is_end_stage?: boolean | null
          is_start_stage?: boolean | null
          metadata?: Json | null
          required_fields?: Json | null
          required_photos_count?: number | null
          required_time_entry?: boolean | null
          requires_approval?: boolean | null
          sms_template_id?: string | null
          stage_color?: string | null
          stage_icon?: string | null
          stage_key: string
          stage_name: string
          updated_at?: string | null
        }
        Update: {
          allowed_next_stages?: Json | null
          approval_roles?: Json | null
          auto_create_invoice?: boolean | null
          auto_send_email?: boolean | null
          auto_send_sms?: boolean | null
          company_id?: string
          created_at?: string | null
          display_order?: number
          email_template_id?: string | null
          id?: string
          industry_type?: string | null
          is_active?: boolean | null
          is_end_stage?: boolean | null
          is_start_stage?: boolean | null
          metadata?: Json | null
          required_fields?: Json | null
          required_photos_count?: number | null
          required_time_entry?: boolean | null
          requires_approval?: boolean | null
          sms_template_id?: string | null
          stage_color?: string | null
          stage_icon?: string | null
          stage_key?: string
          stage_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_workflow_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_workflow_stages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      jobs: {
        Row: {
          actual_end: string | null
          actual_start: string | null
          after_photos: Json | null
          ai_categories: Json | null
          ai_equipment: Json | null
          ai_priority_score: number | null
          ai_processed_at: string | null
          ai_service_type: string | null
          ai_tags: Json | null
          archived_at: string | null
          assigned_to: string | null
          before_photos: Json | null
          break_time_minutes: number | null
          company_id: string
          completion_photos_count: number | null
          completion_photos_required: boolean | null
          created_at: string
          customer_approval_status: string | null
          customer_approval_timestamp: string | null
          customer_id: string | null
          customer_notes: string | null
          customer_satisfaction_rating: number | null
          customer_signature: Json | null
          deleted_at: string | null
          deleted_by: string | null
          deposit_amount: number | null
          deposit_paid_at: string | null
          description: string | null
          dispatch_zone: string | null
          during_photos: Json | null
          equipment_service_history: Json | null
          equipment_serviced: Json | null
          estimated_labor_hours: number | null
          hazards_identified: string | null
          id: string
          inspection_completed_at: string | null
          inspection_required: boolean | null
          internal_priority_score: number | null
          invoice_generated_at: string | null
          job_number: string
          job_recurrence_id: string | null
          job_service_agreement_id: string | null
          job_type: string | null
          job_warranty_info: Json | null
          metadata: Json | null
          next_job_id: string | null
          notes: string | null
          paid_amount: number | null
          payment_due_date: string | null
          payment_terms: string | null
          permanent_delete_scheduled_at: string | null
          permit_obtained_at: string | null
          previous_job_id: string | null
          primary_customer_id: string | null
          primary_equipment_id: string | null
          primary_property_id: string | null
          priority: string
          property_id: string | null
          quality_notes: string | null
          quality_score: number | null
          requires_multiple_customers: boolean | null
          requires_multiple_properties: boolean | null
          requires_permit: boolean | null
          route_order: number | null
          safety_notes: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          search_vector: unknown
          service_type: string | null
          status: string
          technician_clock_in: string | null
          technician_clock_out: string | null
          template_id: string | null
          title: string
          total_amount: number | null
          total_labor_hours: number | null
          travel_time_minutes: number | null
          updated_at: string
          workflow_completed_stages: Json | null
          workflow_stage: string | null
          workflow_stage_changed_at: string | null
        }
        Insert: {
          actual_end?: string | null
          actual_start?: string | null
          after_photos?: Json | null
          ai_categories?: Json | null
          ai_equipment?: Json | null
          ai_priority_score?: number | null
          ai_processed_at?: string | null
          ai_service_type?: string | null
          ai_tags?: Json | null
          archived_at?: string | null
          assigned_to?: string | null
          before_photos?: Json | null
          break_time_minutes?: number | null
          company_id: string
          completion_photos_count?: number | null
          completion_photos_required?: boolean | null
          created_at?: string
          customer_approval_status?: string | null
          customer_approval_timestamp?: string | null
          customer_id?: string | null
          customer_notes?: string | null
          customer_satisfaction_rating?: number | null
          customer_signature?: Json | null
          deleted_at?: string | null
          deleted_by?: string | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          description?: string | null
          dispatch_zone?: string | null
          during_photos?: Json | null
          equipment_service_history?: Json | null
          equipment_serviced?: Json | null
          estimated_labor_hours?: number | null
          hazards_identified?: string | null
          id?: string
          inspection_completed_at?: string | null
          inspection_required?: boolean | null
          internal_priority_score?: number | null
          invoice_generated_at?: string | null
          job_number: string
          job_recurrence_id?: string | null
          job_service_agreement_id?: string | null
          job_type?: string | null
          job_warranty_info?: Json | null
          metadata?: Json | null
          next_job_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_due_date?: string | null
          payment_terms?: string | null
          permanent_delete_scheduled_at?: string | null
          permit_obtained_at?: string | null
          previous_job_id?: string | null
          primary_customer_id?: string | null
          primary_equipment_id?: string | null
          primary_property_id?: string | null
          priority?: string
          property_id?: string | null
          quality_notes?: string | null
          quality_score?: number | null
          requires_multiple_customers?: boolean | null
          requires_multiple_properties?: boolean | null
          requires_permit?: boolean | null
          route_order?: number | null
          safety_notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          search_vector?: unknown
          service_type?: string | null
          status?: string
          technician_clock_in?: string | null
          technician_clock_out?: string | null
          template_id?: string | null
          title: string
          total_amount?: number | null
          total_labor_hours?: number | null
          travel_time_minutes?: number | null
          updated_at?: string
          workflow_completed_stages?: Json | null
          workflow_stage?: string | null
          workflow_stage_changed_at?: string | null
        }
        Update: {
          actual_end?: string | null
          actual_start?: string | null
          after_photos?: Json | null
          ai_categories?: Json | null
          ai_equipment?: Json | null
          ai_priority_score?: number | null
          ai_processed_at?: string | null
          ai_service_type?: string | null
          ai_tags?: Json | null
          archived_at?: string | null
          assigned_to?: string | null
          before_photos?: Json | null
          break_time_minutes?: number | null
          company_id?: string
          completion_photos_count?: number | null
          completion_photos_required?: boolean | null
          created_at?: string
          customer_approval_status?: string | null
          customer_approval_timestamp?: string | null
          customer_id?: string | null
          customer_notes?: string | null
          customer_satisfaction_rating?: number | null
          customer_signature?: Json | null
          deleted_at?: string | null
          deleted_by?: string | null
          deposit_amount?: number | null
          deposit_paid_at?: string | null
          description?: string | null
          dispatch_zone?: string | null
          during_photos?: Json | null
          equipment_service_history?: Json | null
          equipment_serviced?: Json | null
          estimated_labor_hours?: number | null
          hazards_identified?: string | null
          id?: string
          inspection_completed_at?: string | null
          inspection_required?: boolean | null
          internal_priority_score?: number | null
          invoice_generated_at?: string | null
          job_number?: string
          job_recurrence_id?: string | null
          job_service_agreement_id?: string | null
          job_type?: string | null
          job_warranty_info?: Json | null
          metadata?: Json | null
          next_job_id?: string | null
          notes?: string | null
          paid_amount?: number | null
          payment_due_date?: string | null
          payment_terms?: string | null
          permanent_delete_scheduled_at?: string | null
          permit_obtained_at?: string | null
          previous_job_id?: string | null
          primary_customer_id?: string | null
          primary_equipment_id?: string | null
          primary_property_id?: string | null
          priority?: string
          property_id?: string | null
          quality_notes?: string | null
          quality_score?: number | null
          requires_multiple_customers?: boolean | null
          requires_multiple_properties?: boolean | null
          requires_permit?: boolean | null
          route_order?: number | null
          safety_notes?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          search_vector?: unknown
          service_type?: string | null
          status?: string
          technician_clock_in?: string | null
          technician_clock_out?: string | null
          template_id?: string | null
          title?: string
          total_amount?: number | null
          total_labor_hours?: number | null
          travel_time_minutes?: number | null
          updated_at?: string
          workflow_completed_stages?: Json | null
          workflow_stage?: string | null
          workflow_stage_changed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_assigned_to_users_id_fk"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "jobs_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_primary_customer_id_fkey"
            columns: ["primary_customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_primary_property_id_fkey"
            columns: ["primary_property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "job_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_article_related: {
        Row: {
          article_id: string
          created_at: string
          order: number
          related_article_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          order?: number
          related_article_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          order?: number
          related_article_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_article_related_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "kb_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_article_related_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "kb_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_article_tags: {
        Row: {
          article_id: string
          created_at: string
          tag_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          tag_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_article_tags_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "kb_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kb_article_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "kb_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_articles: {
        Row: {
          author: string | null
          category_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured: boolean
          featured_image: string | null
          helpful_count: number
          html_content: string | null
          id: string
          keywords: Json | null
          meta_description: string | null
          meta_title: string | null
          not_helpful_count: number
          published: boolean
          published_at: string | null
          search_vector: unknown
          slug: string
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          author?: string | null
          category_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          helpful_count?: number
          html_content?: string | null
          id?: string
          keywords?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          not_helpful_count?: number
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug: string
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          author?: string | null
          category_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          featured_image?: string | null
          helpful_count?: number
          html_content?: string | null
          id?: string
          keywords?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          not_helpful_count?: number
          published?: boolean
          published_at?: string | null
          search_vector?: unknown
          slug?: string
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "kb_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "kb_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          order: number
          parent_id: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          order?: number
          parent_id?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          order?: number
          parent_id?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "kb_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "kb_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_feedback: {
        Row: {
          article_id: string
          comment: string | null
          created_at: string
          helpful: boolean | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_email: string | null
        }
        Insert: {
          article_id: string
          comment?: string | null
          created_at?: string
          helpful?: boolean | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
        }
        Update: {
          article_id?: string
          comment?: string | null
          created_at?: string
          helpful?: boolean | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kb_feedback_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "kb_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      kb_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      labor_rates: {
        Row: {
          applies_to: string
          company_id: string
          created_at: string
          description: string | null
          emergency_multiplier: number | null
          holiday_multiplier: number | null
          id: string
          is_active: boolean
          is_default: boolean
          metadata: Json | null
          minimum_charge: number | null
          minimum_hours: number | null
          name: string
          overtime_multiplier: number | null
          rate: number
          rate_type: string
          service_categories: Json | null
          technician_ids: Json | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
          weekend_multiplier: number | null
        }
        Insert: {
          applies_to?: string
          company_id: string
          created_at?: string
          description?: string | null
          emergency_multiplier?: number | null
          holiday_multiplier?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          minimum_charge?: number | null
          minimum_hours?: number | null
          name: string
          overtime_multiplier?: number | null
          rate: number
          rate_type: string
          service_categories?: Json | null
          technician_ids?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          weekend_multiplier?: number | null
        }
        Update: {
          applies_to?: string
          company_id?: string
          created_at?: string
          description?: string | null
          emergency_multiplier?: number | null
          holiday_multiplier?: number | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          metadata?: Json | null
          minimum_charge?: number | null
          minimum_hours?: number | null
          name?: string
          overtime_multiplier?: number | null
          rate?: number
          rate_type?: string
          service_categories?: Json | null
          technician_ids?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
          weekend_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "labor_rates_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "labor_rates_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          category: string | null
          company_id: string
          conversion_rate: number | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          total_leads: number | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          total_leads?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          conversion_rate?: number | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          total_leads?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_sources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_sources_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      maintenance_plans: {
        Row: {
          amount: number | null
          auto_renew: boolean | null
          billing_frequency: string | null
          company_id: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          custom_frequency_days: number | null
          customer_id: string
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          last_service_date: string | null
          name: string
          next_service_date: string | null
          notes: string | null
          plan_number: string
          property_id: string | null
          search_vector: unknown
          services_included: Json | null
          start_date: string
          status: string
          terms: string | null
          total_services_completed: number | null
          total_services_scheduled: number | null
          updated_at: string | null
        }
        Insert: {
          amount?: number | null
          auto_renew?: boolean | null
          billing_frequency?: string | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_frequency_days?: number | null
          customer_id: string
          description?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          last_service_date?: string | null
          name: string
          next_service_date?: string | null
          notes?: string | null
          plan_number: string
          property_id?: string | null
          search_vector?: unknown
          services_included?: Json | null
          start_date: string
          status?: string
          terms?: string | null
          total_services_completed?: number | null
          total_services_scheduled?: number | null
          updated_at?: string | null
        }
        Update: {
          amount?: number | null
          auto_renew?: boolean | null
          billing_frequency?: string | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          custom_frequency_days?: number | null
          customer_id?: string
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          last_service_date?: string | null
          name?: string
          next_service_date?: string | null
          notes?: string | null
          plan_number?: string
          property_id?: string | null
          search_vector?: unknown
          services_included?: Json | null
          start_date?: string
          status?: string
          terms?: string | null
          total_services_completed?: number | null
          total_services_scheduled?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "maintenance_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "maintenance_plans_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_v2: {
        Row: {
          attachments: Json
          chat_id: string
          created_at: string
          id: string
          parts: Json
          role: string
        }
        Insert: {
          attachments: Json
          chat_id: string
          created_at?: string
          id?: string
          parts: Json
          role: string
        }
        Update: {
          attachments?: Json
          chat_id?: string
          created_at?: string
          id?: string
          parts?: Json
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_v2_chat_id_chats_id_fk"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      messaging_brands: {
        Row: {
          address_line1: string
          address_line2: string | null
          brand_color: string | null
          city: string
          company_id: string
          country: string
          created_at: string
          doing_business_as: string | null
          ein: string
          id: string
          legal_name: string
          metadata: Json | null
          postal_code: string
          state: string
          status: string
          support_email: string | null
          support_phone: string | null
          telnyx_brand_id: string | null
          updated_at: string
          vertical: string
          website: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          brand_color?: string | null
          city: string
          company_id: string
          country?: string
          created_at?: string
          doing_business_as?: string | null
          ein: string
          id?: string
          legal_name: string
          metadata?: Json | null
          postal_code: string
          state: string
          status?: string
          support_email?: string | null
          support_phone?: string | null
          telnyx_brand_id?: string | null
          updated_at?: string
          vertical: string
          website?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          brand_color?: string | null
          city?: string
          company_id?: string
          country?: string
          created_at?: string
          doing_business_as?: string | null
          ein?: string
          id?: string
          legal_name?: string
          metadata?: Json | null
          postal_code?: string
          state?: string
          status?: string
          support_email?: string | null
          support_phone?: string | null
          telnyx_brand_id?: string | null
          updated_at?: string
          vertical?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messaging_brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messaging_brands_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      messaging_campaign_phone_numbers: {
        Row: {
          created_at: string
          id: string
          messaging_campaign_id: string
          phone_number_id: string
          status: string
          telnyx_relationship_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          messaging_campaign_id: string
          phone_number_id: string
          status?: string
          telnyx_relationship_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          messaging_campaign_id?: string
          phone_number_id?: string
          status?: string
          telnyx_relationship_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messaging_campaign_phone_numbers_messaging_campaign_id_fkey"
            columns: ["messaging_campaign_id"]
            isOneToOne: false
            referencedRelation: "messaging_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messaging_campaign_phone_numbers_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      messaging_campaigns: {
        Row: {
          created_at: string
          description: string | null
          help_message: string | null
          id: string
          messaging_brand_id: string
          messaging_profile_id: string | null
          metadata: Json | null
          sample_messages: string[] | null
          status: string
          telnyx_campaign_id: string | null
          terms_and_conditions_url: string | null
          updated_at: string
          usecase: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          help_message?: string | null
          id?: string
          messaging_brand_id: string
          messaging_profile_id?: string | null
          metadata?: Json | null
          sample_messages?: string[] | null
          status?: string
          telnyx_campaign_id?: string | null
          terms_and_conditions_url?: string | null
          updated_at?: string
          usecase: string
        }
        Update: {
          created_at?: string
          description?: string | null
          help_message?: string | null
          id?: string
          messaging_brand_id?: string
          messaging_profile_id?: string | null
          metadata?: Json | null
          sample_messages?: string[] | null
          status?: string
          telnyx_campaign_id?: string | null
          terms_and_conditions_url?: string | null
          updated_at?: string
          usecase?: string
        }
        Relationships: [
          {
            foreignKeyName: "messaging_campaigns_messaging_brand_id_fkey"
            columns: ["messaging_brand_id"]
            isOneToOne: false
            referencedRelation: "messaging_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_queue: {
        Row: {
          attempts: number
          body: string
          channel: string
          company_id: string
          created_at: string
          error_message: string | null
          id: string
          max_attempts: number
          recipient: string
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string | null
          template_data: Json | null
          template_id: string | null
          user_id: string
        }
        Insert: {
          attempts?: number
          body: string
          channel: string
          company_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          recipient: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_data?: Json | null
          template_id?: string | null
          user_id: string
        }
        Update: {
          attempts?: number
          body?: string
          channel?: string
          company_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          max_attempts?: number
          recipient?: string
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string | null
          template_data?: Json | null
          template_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_queue_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "notification_queue_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_label: string | null
          action_url: string | null
          company_id: string
          created_at: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          read: boolean
          read_at: string | null
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          company_id: string
          created_at?: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read?: boolean
          read_at?: string | null
          title: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          company_id?: string
          created_at?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read?: boolean
          read_at?: string | null
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ownership_transfers: {
        Row: {
          company_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          initiated_by: string
          ip_address: unknown
          new_owner_id: string
          password_verified: boolean | null
          previous_owner_id: string
          reason: string | null
          user_agent: string | null
        }
        Insert: {
          company_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          initiated_by: string
          ip_address?: unknown
          new_owner_id: string
          password_verified?: boolean | null
          previous_owner_id: string
          reason?: string | null
          user_agent?: string | null
        }
        Update: {
          company_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          initiated_by?: string
          ip_address?: unknown
          new_owner_id?: string
          password_verified?: boolean | null
          previous_owner_id?: string
          reason?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ownership_transfers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_transfers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "ownership_transfers_initiated_by_fkey"
            columns: ["initiated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_transfers_new_owner_id_fkey"
            columns: ["new_owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ownership_transfers_previous_owner_id_fkey"
            columns: ["previous_owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          billing_address_line1: string | null
          billing_address_line2: string | null
          billing_city: string | null
          billing_country: string | null
          billing_email: string | null
          billing_name: string | null
          billing_phone: string | null
          billing_postal_code: string | null
          billing_state: string | null
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          card_fingerprint: string | null
          card_last4: string
          company_id: string
          created_at: string
          created_by: string | null
          customer_id: string
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_verified: boolean | null
          last_used_at: string | null
          metadata: Json | null
          nickname: string | null
          stripe_customer_id: string | null
          stripe_payment_method_id: string
          updated_at: string
        }
        Insert: {
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          card_brand: string
          card_exp_month: number
          card_exp_year: number
          card_fingerprint?: string | null
          card_last4: string
          company_id: string
          created_at?: string
          created_by?: string | null
          customer_id: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          nickname?: string | null
          stripe_customer_id?: string | null
          stripe_payment_method_id: string
          updated_at?: string
        }
        Update: {
          billing_address_line1?: string | null
          billing_address_line2?: string | null
          billing_city?: string | null
          billing_country?: string | null
          billing_email?: string | null
          billing_name?: string | null
          billing_phone?: string | null
          billing_postal_code?: string | null
          billing_state?: string | null
          card_brand?: string
          card_exp_month?: number
          card_exp_year?: number
          card_fingerprint?: string | null
          card_last4?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          customer_id?: string
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_verified?: boolean | null
          last_used_at?: string | null
          metadata?: Json | null
          nickname?: string | null
          stripe_customer_id?: string | null
          stripe_payment_method_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payment_methods_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_methods_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plan_schedules: {
        Row: {
          amount_due: number
          amount_paid: number | null
          created_at: string
          due_date: string
          id: string
          is_late: boolean | null
          last_reminder_sent_at: string | null
          late_fee_applied: number | null
          late_fee_waived: boolean | null
          late_fee_waived_reason: string | null
          late_since_date: string | null
          notes: string | null
          paid_at: string | null
          payment_id: string | null
          payment_number: number
          payment_plan_id: string
          reminder_count: number | null
          reminder_sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount_due: number
          amount_paid?: number | null
          created_at?: string
          due_date: string
          id?: string
          is_late?: boolean | null
          last_reminder_sent_at?: string | null
          late_fee_applied?: number | null
          late_fee_waived?: boolean | null
          late_fee_waived_reason?: string | null
          late_since_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          payment_number: number
          payment_plan_id: string
          reminder_count?: number | null
          reminder_sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount_due?: number
          amount_paid?: number | null
          created_at?: string
          due_date?: string
          id?: string
          is_late?: boolean | null
          last_reminder_sent_at?: string | null
          late_fee_applied?: number | null
          late_fee_waived?: boolean | null
          late_fee_waived_reason?: string | null
          late_since_date?: string | null
          notes?: string | null
          paid_at?: string | null
          payment_id?: string | null
          payment_number?: number
          payment_plan_id?: string
          reminder_count?: number | null
          reminder_sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plan_schedules_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plan_schedules_payment_plan_id_fkey"
            columns: ["payment_plan_id"]
            isOneToOne: false
            referencedRelation: "payment_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_plans: {
        Row: {
          amount_paid: number | null
          amount_remaining: number
          auto_pay_card_last4: string | null
          auto_pay_enabled: boolean | null
          auto_pay_payment_method: string | null
          auto_pay_stripe_payment_method_id: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          deleted_at: string | null
          down_payment_amount: number | null
          final_payment_date: string
          finance_provider_id: string | null
          financed_amount: number
          financing_approval_number: string | null
          financing_approved_at: string | null
          first_payment_date: string
          grace_period_days: number | null
          has_interest: boolean | null
          id: string
          interest_rate: number | null
          invoice_id: string | null
          last_payment_date: string | null
          late_fee: number | null
          missed_payments: number | null
          next_payment_due_date: string | null
          notes: string | null
          number_of_payments: number
          payment_amount: number
          payment_frequency: string
          payments_made: number | null
          plan_name: string | null
          plan_number: string
          setup_fee: number | null
          start_date: string
          status: string
          terms: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          amount_paid?: number | null
          amount_remaining: number
          auto_pay_card_last4?: string | null
          auto_pay_enabled?: boolean | null
          auto_pay_payment_method?: string | null
          auto_pay_stripe_payment_method_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          down_payment_amount?: number | null
          final_payment_date: string
          finance_provider_id?: string | null
          financed_amount: number
          financing_approval_number?: string | null
          financing_approved_at?: string | null
          first_payment_date: string
          grace_period_days?: number | null
          has_interest?: boolean | null
          id?: string
          interest_rate?: number | null
          invoice_id?: string | null
          last_payment_date?: string | null
          late_fee?: number | null
          missed_payments?: number | null
          next_payment_due_date?: string | null
          notes?: string | null
          number_of_payments: number
          payment_amount: number
          payment_frequency: string
          payments_made?: number | null
          plan_name?: string | null
          plan_number: string
          setup_fee?: number | null
          start_date: string
          status?: string
          terms?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          amount_paid?: number | null
          amount_remaining?: number
          auto_pay_card_last4?: string | null
          auto_pay_enabled?: boolean | null
          auto_pay_payment_method?: string | null
          auto_pay_stripe_payment_method_id?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          down_payment_amount?: number | null
          final_payment_date?: string
          finance_provider_id?: string | null
          financed_amount?: number
          financing_approval_number?: string | null
          financing_approved_at?: string | null
          first_payment_date?: string
          grace_period_days?: number | null
          has_interest?: boolean | null
          id?: string
          interest_rate?: number | null
          invoice_id?: string | null
          last_payment_date?: string | null
          late_fee?: number | null
          missed_payments?: number | null
          next_payment_due_date?: string | null
          notes?: string | null
          number_of_payments?: number
          payment_amount?: number
          payment_frequency?: string
          payments_made?: number | null
          plan_name?: string | null
          plan_number?: string
          setup_fee?: number | null
          start_date?: string
          status?: string
          terms?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payment_plans_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_finance_provider_id_fkey"
            columns: ["finance_provider_id"]
            isOneToOne: false
            referencedRelation: "finance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_plans_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          approved_by: string | null
          archived_at: string | null
          bank_deposit_date: string | null
          bank_name: string | null
          card_brand: string | null
          card_exp_month: number | null
          card_exp_year: number | null
          card_last4: string | null
          check_number: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          customer_notes: string | null
          deleted_at: string | null
          deleted_by: string | null
          failure_code: string | null
          failure_message: string | null
          financing_provider_id: string | null
          financing_terms: Json | null
          id: string
          invoice_id: string | null
          is_down_payment: boolean | null
          is_payment_plan_payment: boolean | null
          is_reconciled: boolean
          job_id: string | null
          metadata: Json | null
          net_amount: number | null
          notes: string | null
          original_payment_id: string | null
          payment_method: string
          payment_number: string
          payment_plan_schedule_id: string | null
          payment_type: string
          processed_at: string | null
          processed_by: string | null
          processor_fee: number | null
          processor_metadata: Json | null
          processor_name: string | null
          processor_transaction_id: string | null
          receipt_emailed: boolean
          receipt_emailed_at: string | null
          receipt_number: string | null
          receipt_url: string | null
          reconciled_at: string | null
          reconciled_by: string | null
          reference_number: string | null
          refund_reason: string | null
          refunded_amount: number | null
          refunded_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          approved_by?: string | null
          archived_at?: string | null
          bank_deposit_date?: string | null
          bank_name?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          check_number?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          failure_code?: string | null
          failure_message?: string | null
          financing_provider_id?: string | null
          financing_terms?: Json | null
          id?: string
          invoice_id?: string | null
          is_down_payment?: boolean | null
          is_payment_plan_payment?: boolean | null
          is_reconciled?: boolean
          job_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          notes?: string | null
          original_payment_id?: string | null
          payment_method: string
          payment_number: string
          payment_plan_schedule_id?: string | null
          payment_type?: string
          processed_at?: string | null
          processed_by?: string | null
          processor_fee?: number | null
          processor_metadata?: Json | null
          processor_name?: string | null
          processor_transaction_id?: string | null
          receipt_emailed?: boolean
          receipt_emailed_at?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          approved_by?: string | null
          archived_at?: string | null
          bank_deposit_date?: string | null
          bank_name?: string | null
          card_brand?: string | null
          card_exp_month?: number | null
          card_exp_year?: number | null
          card_last4?: string | null
          check_number?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          failure_code?: string | null
          failure_message?: string | null
          financing_provider_id?: string | null
          financing_terms?: Json | null
          id?: string
          invoice_id?: string | null
          is_down_payment?: boolean | null
          is_payment_plan_payment?: boolean | null
          is_reconciled?: boolean
          job_id?: string | null
          metadata?: Json | null
          net_amount?: number | null
          notes?: string | null
          original_payment_id?: string | null
          payment_method?: string
          payment_number?: string
          payment_plan_schedule_id?: string | null
          payment_type?: string
          processed_at?: string | null
          processed_by?: string | null
          processor_fee?: number | null
          processor_metadata?: Json | null
          processor_name?: string | null
          processor_transaction_id?: string | null
          receipt_emailed?: boolean
          receipt_emailed_at?: string | null
          receipt_number?: string | null
          receipt_url?: string | null
          reconciled_at?: string | null
          reconciled_by?: string | null
          reference_number?: string | null
          refund_reason?: string | null
          refunded_amount?: number | null
          refunded_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_payments_financing_provider"
            columns: ["financing_provider_id"]
            isOneToOne: false
            referencedRelation: "finance_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_payments_payment_plan_schedule"
            columns: ["payment_plan_schedule_id"]
            isOneToOne: false
            referencedRelation: "payment_plan_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_approved_by_users_id_fk"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payments_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_invoices_id_fk"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_original_payment_id_payments_id_fk"
            columns: ["original_payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_processed_by_users_id_fk"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reconciled_by_users_id_fk"
            columns: ["reconciled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_bonus_rules: {
        Row: {
          amount_type: string
          bonus_name: string
          bonus_type: string
          company_id: string
          conditions: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          effective_end_date: string | null
          effective_start_date: string | null
          eligible_departments: Json | null
          eligible_roles: Json | null
          fixed_amount: number | null
          id: string
          is_active: boolean | null
          min_customer_rating: number | null
          min_jobs_completed: number | null
          min_revenue_generated: number | null
          payout_delay_days: number | null
          payout_frequency: string | null
          percentage_of: string | null
          percentage_value: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount_type: string
          bonus_name: string
          bonus_type: string
          company_id: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_end_date?: string | null
          effective_start_date?: string | null
          eligible_departments?: Json | null
          eligible_roles?: Json | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          min_customer_rating?: number | null
          min_jobs_completed?: number | null
          min_revenue_generated?: number | null
          payout_delay_days?: number | null
          payout_frequency?: string | null
          percentage_of?: string | null
          percentage_value?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount_type?: string
          bonus_name?: string
          bonus_type?: string
          company_id?: string
          conditions?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          effective_end_date?: string | null
          effective_start_date?: string | null
          eligible_departments?: Json | null
          eligible_roles?: Json | null
          fixed_amount?: number | null
          id?: string
          is_active?: boolean | null
          min_customer_rating?: number | null
          min_jobs_completed?: number | null
          min_revenue_generated?: number | null
          payout_delay_days?: number | null
          payout_frequency?: string | null
          percentage_of?: string | null
          percentage_value?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_bonus_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_bonus_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payroll_bonus_rules_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_bonus_rules_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_bonus_tiers: {
        Row: {
          bonus_amount: number
          bonus_rule_id: string
          created_at: string | null
          id: string
          max_value: number | null
          min_value: number
          tier_level: number
        }
        Insert: {
          bonus_amount: number
          bonus_rule_id: string
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value: number
          tier_level: number
        }
        Update: {
          bonus_amount?: number
          bonus_rule_id?: string
          created_at?: string | null
          id?: string
          max_value?: number | null
          min_value?: number
          tier_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_bonus_tiers_bonus_rule_id_fkey"
            columns: ["bonus_rule_id"]
            isOneToOne: false
            referencedRelation: "payroll_bonus_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_callback_settings: {
        Row: {
          after_hours_multiplier: number | null
          auto_detect_callbacks: boolean | null
          callback_window_end: string | null
          callback_window_start: string | null
          callbacks_enabled: boolean | null
          company_id: string
          created_at: string | null
          created_by: string | null
          emergency_multiplier: number | null
          fixed_callback_rate: number | null
          holiday_multiplier: number | null
          hourly_callback_rate: number | null
          id: string
          include_holidays: boolean | null
          include_weekends: boolean | null
          minimum_callback_hours: number | null
          minimum_callback_pay: number | null
          rate_type: string | null
          require_callback_approval: boolean | null
          require_customer_confirmation: boolean | null
          response_time_bonus_amount: number | null
          response_time_bonus_enabled: boolean | null
          response_time_threshold_minutes: number | null
          track_response_time: boolean | null
          updated_at: string | null
          updated_by: string | null
          weekend_multiplier: number | null
        }
        Insert: {
          after_hours_multiplier?: number | null
          auto_detect_callbacks?: boolean | null
          callback_window_end?: string | null
          callback_window_start?: string | null
          callbacks_enabled?: boolean | null
          company_id: string
          created_at?: string | null
          created_by?: string | null
          emergency_multiplier?: number | null
          fixed_callback_rate?: number | null
          holiday_multiplier?: number | null
          hourly_callback_rate?: number | null
          id?: string
          include_holidays?: boolean | null
          include_weekends?: boolean | null
          minimum_callback_hours?: number | null
          minimum_callback_pay?: number | null
          rate_type?: string | null
          require_callback_approval?: boolean | null
          require_customer_confirmation?: boolean | null
          response_time_bonus_amount?: number | null
          response_time_bonus_enabled?: boolean | null
          response_time_threshold_minutes?: number | null
          track_response_time?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          weekend_multiplier?: number | null
        }
        Update: {
          after_hours_multiplier?: number | null
          auto_detect_callbacks?: boolean | null
          callback_window_end?: string | null
          callback_window_start?: string | null
          callbacks_enabled?: boolean | null
          company_id?: string
          created_at?: string | null
          created_by?: string | null
          emergency_multiplier?: number | null
          fixed_callback_rate?: number | null
          holiday_multiplier?: number | null
          hourly_callback_rate?: number | null
          id?: string
          include_holidays?: boolean | null
          include_weekends?: boolean | null
          minimum_callback_hours?: number | null
          minimum_callback_pay?: number | null
          rate_type?: string | null
          require_callback_approval?: boolean | null
          require_customer_confirmation?: boolean | null
          response_time_bonus_amount?: number | null
          response_time_bonus_enabled?: boolean | null
          response_time_threshold_minutes?: number | null
          track_response_time?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          weekend_multiplier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_callback_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_callback_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payroll_callback_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_callback_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_overtime_settings: {
        Row: {
          auto_calculate_overtime: boolean | null
          company_id: string
          consecutive_days_threshold: number | null
          created_at: string | null
          created_by: string | null
          daily_overtime_multiplier: number | null
          daily_threshold_hours: number | null
          double_time_after_hours: number | null
          double_time_enabled: boolean | null
          double_time_multiplier: number | null
          double_time_on_seventh_day: boolean | null
          holiday_multiplier: number | null
          id: string
          notify_approaching_overtime: boolean | null
          notify_managers_on_overtime: boolean | null
          overtime_enabled: boolean | null
          overtime_threshold_notification_hours: number | null
          require_overtime_approval: boolean | null
          saturday_multiplier: number | null
          sunday_multiplier: number | null
          track_by_day: boolean | null
          track_by_job: boolean | null
          updated_at: string | null
          updated_by: string | null
          weekend_overtime_enabled: boolean | null
          weekly_overtime_multiplier: number | null
          weekly_threshold_hours: number | null
        }
        Insert: {
          auto_calculate_overtime?: boolean | null
          company_id: string
          consecutive_days_threshold?: number | null
          created_at?: string | null
          created_by?: string | null
          daily_overtime_multiplier?: number | null
          daily_threshold_hours?: number | null
          double_time_after_hours?: number | null
          double_time_enabled?: boolean | null
          double_time_multiplier?: number | null
          double_time_on_seventh_day?: boolean | null
          holiday_multiplier?: number | null
          id?: string
          notify_approaching_overtime?: boolean | null
          notify_managers_on_overtime?: boolean | null
          overtime_enabled?: boolean | null
          overtime_threshold_notification_hours?: number | null
          require_overtime_approval?: boolean | null
          saturday_multiplier?: number | null
          sunday_multiplier?: number | null
          track_by_day?: boolean | null
          track_by_job?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          weekend_overtime_enabled?: boolean | null
          weekly_overtime_multiplier?: number | null
          weekly_threshold_hours?: number | null
        }
        Update: {
          auto_calculate_overtime?: boolean | null
          company_id?: string
          consecutive_days_threshold?: number | null
          created_at?: string | null
          created_by?: string | null
          daily_overtime_multiplier?: number | null
          daily_threshold_hours?: number | null
          double_time_after_hours?: number | null
          double_time_enabled?: boolean | null
          double_time_multiplier?: number | null
          double_time_on_seventh_day?: boolean | null
          holiday_multiplier?: number | null
          id?: string
          notify_approaching_overtime?: boolean | null
          notify_managers_on_overtime?: boolean | null
          overtime_enabled?: boolean | null
          overtime_threshold_notification_hours?: number | null
          require_overtime_approval?: boolean | null
          saturday_multiplier?: number | null
          sunday_multiplier?: number | null
          track_by_day?: boolean | null
          track_by_job?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          weekend_overtime_enabled?: boolean | null
          weekly_overtime_multiplier?: number | null
          weekly_threshold_hours?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_overtime_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_overtime_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "payroll_overtime_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_overtime_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_numbers: {
        Row: {
          area_code: string | null
          billing_group_id: string | null
          call_routing_rule_id: string | null
          company_id: string
          country_code: string
          created_at: string | null
          customer_reference: string | null
          deleted_at: string | null
          deleted_by: string | null
          features: Json | null
          formatted_number: string
          forward_to_number: string | null
          id: string
          incoming_calls_count: number | null
          metadata: Json | null
          monthly_cost: number | null
          number_type: string | null
          outgoing_calls_count: number | null
          phone_number: string
          ported_at: string | null
          ported_from: string | null
          porting_request_id: string | null
          setup_cost: number | null
          sms_received_count: number | null
          sms_sent_count: number | null
          status: string
          tags: string[] | null
          telnyx_connection_id: string | null
          telnyx_messaging_profile_id: string | null
          telnyx_phone_number_id: string | null
          updated_at: string | null
          voicemail_enabled: boolean | null
          voicemail_greeting_url: string | null
        }
        Insert: {
          area_code?: string | null
          billing_group_id?: string | null
          call_routing_rule_id?: string | null
          company_id: string
          country_code?: string
          created_at?: string | null
          customer_reference?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          features?: Json | null
          formatted_number: string
          forward_to_number?: string | null
          id?: string
          incoming_calls_count?: number | null
          metadata?: Json | null
          monthly_cost?: number | null
          number_type?: string | null
          outgoing_calls_count?: number | null
          phone_number: string
          ported_at?: string | null
          ported_from?: string | null
          porting_request_id?: string | null
          setup_cost?: number | null
          sms_received_count?: number | null
          sms_sent_count?: number | null
          status?: string
          tags?: string[] | null
          telnyx_connection_id?: string | null
          telnyx_messaging_profile_id?: string | null
          telnyx_phone_number_id?: string | null
          updated_at?: string | null
          voicemail_enabled?: boolean | null
          voicemail_greeting_url?: string | null
        }
        Update: {
          area_code?: string | null
          billing_group_id?: string | null
          call_routing_rule_id?: string | null
          company_id?: string
          country_code?: string
          created_at?: string | null
          customer_reference?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          features?: Json | null
          formatted_number?: string
          forward_to_number?: string | null
          id?: string
          incoming_calls_count?: number | null
          metadata?: Json | null
          monthly_cost?: number | null
          number_type?: string | null
          outgoing_calls_count?: number | null
          phone_number?: string
          ported_at?: string | null
          ported_from?: string | null
          porting_request_id?: string | null
          setup_cost?: number | null
          sms_received_count?: number | null
          sms_sent_count?: number | null
          status?: string
          tags?: string[] | null
          telnyx_connection_id?: string | null
          telnyx_messaging_profile_id?: string | null
          telnyx_phone_number_id?: string | null
          updated_at?: string | null
          voicemail_enabled?: boolean | null
          voicemail_greeting_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_phone_numbers_routing_rule"
            columns: ["call_routing_rule_id"]
            isOneToOne: false
            referencedRelation: "call_routing_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_numbers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "phone_numbers_porting_request_id_fkey"
            columns: ["porting_request_id"]
            isOneToOne: false
            referencedRelation: "phone_porting_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_porting_requests: {
        Row: {
          account_number: string | null
          account_pin: string | null
          account_type: string | null
          actual_port_date: string | null
          additional_documents: Json | null
          authorized_name: string | null
          bill_document_url: string | null
          billing_address: Json | null
          billing_phone_number: string | null
          billing_zip_code: string | null
          cancelled_at: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          current_carrier: string | null
          current_phone_number: string
          error_message: string | null
          estimated_completion_date: string | null
          foc_date: string | null
          id: string
          last_four_ssn_or_tax: string | null
          loa_document_url: string | null
          metadata: Json | null
          number_of_lines: number | null
          porting_type: string
          requested_port_date: string | null
          retry_count: number | null
          service_address: Json | null
          status: string
          status_history: Json | null
          telnyx_order_id: string | null
          telnyx_response: Json | null
          telnyx_status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_number?: string | null
          account_pin?: string | null
          account_type?: string | null
          actual_port_date?: string | null
          additional_documents?: Json | null
          authorized_name?: string | null
          bill_document_url?: string | null
          billing_address?: Json | null
          billing_phone_number?: string | null
          billing_zip_code?: string | null
          cancelled_at?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          current_carrier?: string | null
          current_phone_number: string
          error_message?: string | null
          estimated_completion_date?: string | null
          foc_date?: string | null
          id?: string
          last_four_ssn_or_tax?: string | null
          loa_document_url?: string | null
          metadata?: Json | null
          number_of_lines?: number | null
          porting_type: string
          requested_port_date?: string | null
          retry_count?: number | null
          service_address?: Json | null
          status?: string
          status_history?: Json | null
          telnyx_order_id?: string | null
          telnyx_response?: Json | null
          telnyx_status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_number?: string | null
          account_pin?: string | null
          account_type?: string | null
          actual_port_date?: string | null
          additional_documents?: Json | null
          authorized_name?: string | null
          bill_document_url?: string | null
          billing_address?: Json | null
          billing_phone_number?: string | null
          billing_zip_code?: string | null
          cancelled_at?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          current_carrier?: string | null
          current_phone_number?: string
          error_message?: string | null
          estimated_completion_date?: string | null
          foc_date?: string | null
          id?: string
          last_four_ssn_or_tax?: string | null
          loa_document_url?: string | null
          metadata?: Json | null
          number_of_lines?: number | null
          porting_type?: string
          requested_port_date?: string | null
          retry_count?: number | null
          service_address?: Json | null
          status?: string
          status_history?: Json | null
          telnyx_order_id?: string | null
          telnyx_response?: Json | null
          telnyx_status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "phone_porting_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phone_porting_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      po_settings: {
        Row: {
          approval_threshold: number | null
          approvers: Json | null
          auto_generate_enabled: boolean
          auto_generate_threshold: number | null
          company_id: string
          created_at: string
          default_vendors: Json | null
          enabled: boolean
          id: string
          notification_emails: Json | null
          require_approval: boolean
          updated_at: string
        }
        Insert: {
          approval_threshold?: number | null
          approvers?: Json | null
          auto_generate_enabled?: boolean
          auto_generate_threshold?: number | null
          company_id: string
          created_at?: string
          default_vendors?: Json | null
          enabled?: boolean
          id?: string
          notification_emails?: Json | null
          require_approval?: boolean
          updated_at?: string
        }
        Update: {
          approval_threshold?: number | null
          approvers?: Json | null
          auto_generate_enabled?: boolean
          auto_generate_threshold?: number | null
          company_id?: string
          created_at?: string
          default_vendors?: Json | null
          enabled?: boolean
          id?: string
          notification_emails?: Json | null
          require_approval?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_settings_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_settings_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          id: string
          published: string
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          id?: string
          published?: string
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          id?: string
          published?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_users_id_fk"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      price_book_categories: {
        Row: {
          color: string | null
          company_id: string
          created_at: string
          descendant_item_count: number
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          item_count: number
          level: number
          name: string
          parent_id: string | null
          path: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color?: string | null
          company_id: string
          created_at?: string
          descendant_item_count?: number
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          item_count?: number
          level?: number
          name: string
          parent_id?: string | null
          path: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color?: string | null
          company_id?: string
          created_at?: string
          descendant_item_count?: number
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          item_count?: number
          level?: number
          name?: string
          parent_id?: string | null
          path?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_book_categories_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_book_categories_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "price_book_categories_parent_id_price_book_categories_id_fk"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "price_book_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      price_book_items: {
        Row: {
          category: string | null
          category_id: string
          company_id: string
          cost: number | null
          created_at: string
          description: string | null
          documents: Json | null
          id: string
          image_url: string | null
          images: Json | null
          is_active: boolean
          is_taxable: boolean
          item_type: string
          markup_percent: number | null
          metadata: Json | null
          minimum_quantity: number | null
          name: string
          notes: string | null
          price: number
          search_vector: unknown
          sku: string | null
          subcategory: string | null
          supplier_id: string | null
          supplier_last_sync_at: string | null
          supplier_sku: string | null
          tags: Json | null
          unit: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          category_id: string
          company_id: string
          cost?: number | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean
          is_taxable?: boolean
          item_type: string
          markup_percent?: number | null
          metadata?: Json | null
          minimum_quantity?: number | null
          name: string
          notes?: string | null
          price?: number
          search_vector?: unknown
          sku?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          supplier_last_sync_at?: string | null
          supplier_sku?: string | null
          tags?: Json | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          category_id?: string
          company_id?: string
          cost?: number | null
          created_at?: string
          description?: string | null
          documents?: Json | null
          id?: string
          image_url?: string | null
          images?: Json | null
          is_active?: boolean
          is_taxable?: boolean
          item_type?: string
          markup_percent?: number | null
          metadata?: Json | null
          minimum_quantity?: number | null
          name?: string
          notes?: string | null
          price?: number
          search_vector?: unknown
          sku?: string | null
          subcategory?: string | null
          supplier_id?: string | null
          supplier_last_sync_at?: string | null
          supplier_sku?: string | null
          tags?: Json | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_book_items_category_id_price_book_categories_id_fk"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "price_book_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_book_items_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_book_items_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "price_book_items_supplier_id_supplier_integrations_id_fk"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "supplier_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      price_history: {
        Row: {
          change_reason: string | null
          change_type: string
          changed_by: string | null
          company_id: string
          created_at: string
          effective_date: string
          id: string
          item_id: string
          new_cost: number | null
          new_markup_percent: number | null
          new_price: number | null
          old_cost: number | null
          old_markup_percent: number | null
          old_price: number | null
        }
        Insert: {
          change_reason?: string | null
          change_type: string
          changed_by?: string | null
          company_id: string
          created_at?: string
          effective_date?: string
          id?: string
          item_id: string
          new_cost?: number | null
          new_markup_percent?: number | null
          new_price?: number | null
          old_cost?: number | null
          old_markup_percent?: number | null
          old_price?: number | null
        }
        Update: {
          change_reason?: string | null
          change_type?: string
          changed_by?: string | null
          company_id?: string
          created_at?: string
          effective_date?: string
          id?: string
          item_id?: string
          new_cost?: number | null
          new_markup_percent?: number | null
          new_price?: number | null
          old_cost?: number | null
          old_markup_percent?: number | null
          old_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_changed_by_users_id_fk"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_history_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "price_history_item_id_price_book_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "price_book_items"
            referencedColumns: ["id"]
          },
        ]
      }
      pricebook_settings: {
        Row: {
          allow_custom_items: boolean | null
          company_id: string
          created_at: string | null
          id: string
          markup_default_percentage: number | null
          require_approval_for_custom: boolean | null
          require_categories: boolean | null
          show_cost_prices: boolean | null
          show_item_codes: boolean | null
          show_item_descriptions: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_custom_items?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          markup_default_percentage?: number | null
          require_approval_for_custom?: boolean | null
          require_categories?: boolean | null
          show_cost_prices?: boolean | null
          show_item_codes?: boolean | null
          show_item_descriptions?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_custom_items?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          markup_default_percentage?: number | null
          require_approval_for_custom?: boolean | null
          require_categories?: boolean | null
          show_cost_prices?: boolean | null
          show_item_codes?: boolean | null
          show_item_descriptions?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricebook_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricebook_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          adjustment_type: string
          adjustment_value: number
          applies_to: string
          category_filter: Json | null
          company_id: string
          created_at: string
          days_of_week: Json | null
          description: string | null
          id: string
          is_active: boolean
          item_filter: Json | null
          metadata: Json | null
          name: string
          priority: number
          rule_type: string
          time_ranges: Json | null
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          adjustment_type: string
          adjustment_value: number
          applies_to: string
          category_filter?: Json | null
          company_id: string
          created_at?: string
          days_of_week?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean
          item_filter?: Json | null
          metadata?: Json | null
          name: string
          priority?: number
          rule_type: string
          time_ranges?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          adjustment_type?: string
          adjustment_value?: number
          applies_to?: string
          category_filter?: Json | null
          company_id?: string
          created_at?: string
          days_of_week?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean
          item_filter?: Json | null
          metadata?: Json | null
          name?: string
          priority?: number
          rule_type?: string
          time_ranges?: Json | null
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_rules_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      profiles: {
        Row: {
          active_company_id: string | null
          created_at: string | null
          id: string
          onboarding_completed: boolean | null
          updated_at: string | null
        }
        Insert: {
          active_company_id?: string | null
          created_at?: string | null
          id: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          active_company_id?: string | null
          created_at?: string | null
          id?: string
          onboarding_completed?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_active_company_id_fkey"
            columns: ["active_company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_active_company_id_fkey"
            columns: ["active_company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      properties: {
        Row: {
          address: string
          address2: string | null
          archived_at: string | null
          best_access_time: string | null
          city: string
          company_id: string
          country: string
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          directions: string | null
          id: string
          lat: number | null
          lon: number | null
          metadata: Json | null
          name: string
          notes: string | null
          parking_instructions: string | null
          permanent_delete_scheduled_at: string | null
          primary_contact_id: string | null
          property_type: string | null
          requires_appointment: boolean | null
          search_vector: unknown
          service_entrance_notes: string | null
          square_footage: number | null
          state: string
          updated_at: string
          year_built: number | null
          zip_code: string
        }
        Insert: {
          address: string
          address2?: string | null
          archived_at?: string | null
          best_access_time?: string | null
          city: string
          company_id: string
          country?: string
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          directions?: string | null
          id?: string
          lat?: number | null
          lon?: number | null
          metadata?: Json | null
          name: string
          notes?: string | null
          parking_instructions?: string | null
          permanent_delete_scheduled_at?: string | null
          primary_contact_id?: string | null
          property_type?: string | null
          requires_appointment?: boolean | null
          search_vector?: unknown
          service_entrance_notes?: string | null
          square_footage?: number | null
          state: string
          updated_at?: string
          year_built?: number | null
          zip_code: string
        }
        Update: {
          address?: string
          address2?: string | null
          archived_at?: string | null
          best_access_time?: string | null
          city?: string
          company_id?: string
          country?: string
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          directions?: string | null
          id?: string
          lat?: number | null
          lon?: number | null
          metadata?: Json | null
          name?: string
          notes?: string | null
          parking_instructions?: string | null
          permanent_delete_scheduled_at?: string | null
          primary_contact_id?: string | null
          property_type?: string | null
          requires_appointment?: boolean | null
          search_vector?: unknown
          service_entrance_notes?: string | null
          square_footage?: number | null
          state?: string
          updated_at?: string
          year_built?: number | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "properties_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_primary_contact_id_fkey"
            columns: ["primary_contact_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery: string | null
          approved_at: string | null
          approved_by: string | null
          archived_at: string | null
          auto_generated: boolean
          company_id: string
          created_at: string
          delivery_address: string | null
          description: string | null
          estimate_id: string | null
          expected_delivery: string | null
          id: string
          internal_notes: string | null
          invoice_id: string | null
          job_id: string | null
          line_items: Json
          notes: string | null
          ordered_at: string | null
          po_number: string
          priority: string
          received_at: string | null
          requested_by: string
          shipping_amount: number
          status: string
          subtotal: number
          tax_amount: number
          title: string
          total_amount: number
          updated_at: string
          vendor: string
          vendor_email: string | null
          vendor_id: string | null
          vendor_phone: string | null
        }
        Insert: {
          actual_delivery?: string | null
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          auto_generated?: boolean
          company_id: string
          created_at?: string
          delivery_address?: string | null
          description?: string | null
          estimate_id?: string | null
          expected_delivery?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          job_id?: string | null
          line_items: Json
          notes?: string | null
          ordered_at?: string | null
          po_number: string
          priority?: string
          received_at?: string | null
          requested_by: string
          shipping_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          title: string
          total_amount?: number
          updated_at?: string
          vendor: string
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_phone?: string | null
        }
        Update: {
          actual_delivery?: string | null
          approved_at?: string | null
          approved_by?: string | null
          archived_at?: string | null
          auto_generated?: boolean
          company_id?: string
          created_at?: string
          delivery_address?: string | null
          description?: string | null
          estimate_id?: string | null
          expected_delivery?: string | null
          id?: string
          internal_notes?: string | null
          invoice_id?: string | null
          job_id?: string | null
          line_items?: Json
          notes?: string | null
          ordered_at?: string | null
          po_number?: string
          priority?: string
          received_at?: string | null
          requested_by?: string
          shipping_amount?: number
          status?: string
          subtotal?: number
          tax_amount?: number
          title?: string
          total_amount?: number
          updated_at?: string
          vendor?: string
          vendor_email?: string | null
          vendor_id?: string | null
          vendor_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_users_id_fk"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "purchase_orders_estimate_id_estimates_id_fk"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_invoice_id_invoices_id_fk"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_requested_by_users_id_fk"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      recurring_invoices: {
        Row: {
          auto_send: boolean | null
          auto_send_days_before: number | null
          cancellation_reason: string | null
          cancelled_at: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          deleted_at: string | null
          due_days_offset: number | null
          end_date: string | null
          failed_generations: number | null
          id: string
          invoice_template_id: string | null
          last_error: string | null
          last_invoice_date: string | null
          line_items: Json | null
          max_occurrences: number | null
          next_invoice_date: string
          notes: string | null
          occurrences_created: number | null
          pause_reason: string | null
          paused_at: string | null
          payment_terms: string | null
          recurrence_frequency: string
          recurrence_name: string
          recurring_amount: number
          service_plan_id: string | null
          start_date: string
          status: string
          total_amount_billed: number | null
          total_invoices_created: number | null
          updated_at: string
        }
        Insert: {
          auto_send?: boolean | null
          auto_send_days_before?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          deleted_at?: string | null
          due_days_offset?: number | null
          end_date?: string | null
          failed_generations?: number | null
          id?: string
          invoice_template_id?: string | null
          last_error?: string | null
          last_invoice_date?: string | null
          line_items?: Json | null
          max_occurrences?: number | null
          next_invoice_date: string
          notes?: string | null
          occurrences_created?: number | null
          pause_reason?: string | null
          paused_at?: string | null
          payment_terms?: string | null
          recurrence_frequency: string
          recurrence_name: string
          recurring_amount: number
          service_plan_id?: string | null
          start_date: string
          status?: string
          total_amount_billed?: number | null
          total_invoices_created?: number | null
          updated_at?: string
        }
        Update: {
          auto_send?: boolean | null
          auto_send_days_before?: number | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          deleted_at?: string | null
          due_days_offset?: number | null
          end_date?: string | null
          failed_generations?: number | null
          id?: string
          invoice_template_id?: string | null
          last_error?: string | null
          last_invoice_date?: string | null
          line_items?: Json | null
          max_occurrences?: number | null
          next_invoice_date?: string
          notes?: string | null
          occurrences_created?: number | null
          pause_reason?: string | null
          paused_at?: string | null
          payment_terms?: string | null
          recurrence_frequency?: string
          recurrence_name?: string
          recurring_amount?: number
          service_plan_id?: string | null
          start_date?: string
          status?: string
          total_amount_billed?: number | null
          total_invoices_created?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "recurring_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_invoice_template_id_fkey"
            columns: ["invoice_template_id"]
            isOneToOne: false
            referencedRelation: "invoice_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_invoices_service_plan_id_fkey"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_item_tags: {
        Row: {
          resource_item_id: string
          tag_id: string
        }
        Insert: {
          resource_item_id: string
          tag_id: string
        }
        Update: {
          resource_item_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_item_tags_resource_item_id_fkey"
            columns: ["resource_item_id"]
            isOneToOne: false
            referencedRelation: "resource_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_item_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "content_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_items: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string
          cta_label: string | null
          cta_url: string | null
          description: string | null
          download_url: string | null
          event_end_at: string | null
          event_start_at: string | null
          excerpt: string | null
          featured: boolean
          hero_image_url: string | null
          id: string
          metadata: Json
          published_at: string | null
          registration_url: string | null
          search_vector: unknown
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          download_url?: string | null
          event_end_at?: string | null
          event_start_at?: string | null
          excerpt?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          metadata?: Json
          published_at?: string | null
          registration_url?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          type: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string
          cta_label?: string | null
          cta_url?: string | null
          description?: string | null
          download_url?: string | null
          event_end_at?: string | null
          event_start_at?: string | null
          excerpt?: string | null
          featured?: boolean
          hero_image_url?: string | null
          id?: string
          metadata?: Json
          published_at?: string | null
          registration_url?: string | null
          search_vector?: unknown
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          type?: Database["public"]["Enums"]["resource_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resource_items_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_log: {
        Row: {
          changed_by: string
          created_at: string | null
          id: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role: Database["public"]["Enums"]["user_role"] | null
          reason: string | null
          team_member_id: string
        }
        Insert: {
          changed_by: string
          created_at?: string | null
          id?: string
          new_role: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          team_member_id: string
        }
        Update: {
          changed_by?: string
          created_at?: string | null
          id?: string
          new_role?: Database["public"]["Enums"]["user_role"]
          old_role?: Database["public"]["Enums"]["user_role"] | null
          reason?: string | null
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_change_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_change_log_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      role_view_preferences: {
        Row: {
          company_id: string
          created_at: string | null
          default_view: string | null
          id: string
          role_id: string
          tab_order: Json | null
          updated_at: string | null
          view_density: string | null
          visible_tabs: Json | null
          work_section_order: Json | null
          work_sections: Json | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          default_view?: string | null
          id?: string
          role_id: string
          tab_order?: Json | null
          updated_at?: string | null
          view_density?: string | null
          visible_tabs?: Json | null
          work_section_order?: Json | null
          work_sections?: Json | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          default_view?: string | null
          id?: string
          role_id?: string
          tab_order?: Json | null
          updated_at?: string | null
          view_density?: string | null
          visible_tabs?: Json | null
          work_section_order?: Json | null
          work_sections?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "role_view_preferences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_view_preferences_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "role_view_preferences_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "company_role_stats"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "role_view_preferences_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_availability_settings: {
        Row: {
          buffer_time_minutes: number | null
          company_id: string
          created_at: string | null
          default_appointment_duration_minutes: number | null
          default_work_hours: Json
          id: string
          lunch_break_duration_minutes: number | null
          lunch_break_enabled: boolean | null
          lunch_break_start: string | null
          max_booking_advance_days: number | null
          min_booking_notice_hours: number | null
          updated_at: string | null
        }
        Insert: {
          buffer_time_minutes?: number | null
          company_id: string
          created_at?: string | null
          default_appointment_duration_minutes?: number | null
          default_work_hours?: Json
          id?: string
          lunch_break_duration_minutes?: number | null
          lunch_break_enabled?: boolean | null
          lunch_break_start?: string | null
          max_booking_advance_days?: number | null
          min_booking_notice_hours?: number | null
          updated_at?: string | null
        }
        Update: {
          buffer_time_minutes?: number | null
          company_id?: string
          created_at?: string | null
          default_appointment_duration_minutes?: number | null
          default_work_hours?: Json
          id?: string
          lunch_break_duration_minutes?: number | null
          lunch_break_enabled?: boolean | null
          lunch_break_start?: string | null
          max_booking_advance_days?: number | null
          min_booking_notice_hours?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_availability_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_availability_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      schedule_calendar_settings: {
        Row: {
          company_id: string
          created_at: string | null
          default_view: string | null
          id: string
          show_customer_name: boolean | null
          show_job_status_colors: boolean | null
          show_job_type: boolean | null
          show_technician_colors: boolean | null
          show_travel_time: boolean | null
          start_day_of_week: number | null
          sync_with_google_calendar: boolean | null
          sync_with_outlook: boolean | null
          time_slot_duration_minutes: number | null
          updated_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string | null
          default_view?: string | null
          id?: string
          show_customer_name?: boolean | null
          show_job_status_colors?: boolean | null
          show_job_type?: boolean | null
          show_technician_colors?: boolean | null
          show_travel_time?: boolean | null
          start_day_of_week?: number | null
          sync_with_google_calendar?: boolean | null
          sync_with_outlook?: boolean | null
          time_slot_duration_minutes?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string | null
          default_view?: string | null
          id?: string
          show_customer_name?: boolean | null
          show_job_status_colors?: boolean | null
          show_job_type?: boolean | null
          show_technician_colors?: boolean | null
          show_travel_time?: boolean | null
          start_day_of_week?: number | null
          sync_with_google_calendar?: boolean | null
          sync_with_outlook?: boolean | null
          time_slot_duration_minutes?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_calendar_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_calendar_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      schedule_dispatch_rules: {
        Row: {
          actions: Json | null
          assignment_method: string | null
          company_id: string
          conditions: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          priority: number | null
          rule_name: string
          updated_at: string | null
        }
        Insert: {
          actions?: Json | null
          assignment_method?: string | null
          company_id: string
          conditions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name: string
          updated_at?: string | null
        }
        Update: {
          actions?: Json | null
          assignment_method?: string | null
          company_id?: string
          conditions?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_dispatch_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_dispatch_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      schedule_service_areas: {
        Row: {
          area_name: string
          area_type: string | null
          center_lat: number | null
          center_lng: number | null
          company_id: string
          created_at: string | null
          estimated_travel_time_minutes: number | null
          id: string
          is_active: boolean | null
          minimum_job_amount: number | null
          polygon_coordinates: Json | null
          radius_miles: number | null
          service_fee: number | null
          updated_at: string | null
          zip_codes: string[] | null
        }
        Insert: {
          area_name: string
          area_type?: string | null
          center_lat?: number | null
          center_lng?: number | null
          company_id: string
          created_at?: string | null
          estimated_travel_time_minutes?: number | null
          id?: string
          is_active?: boolean | null
          minimum_job_amount?: number | null
          polygon_coordinates?: Json | null
          radius_miles?: number | null
          service_fee?: number | null
          updated_at?: string | null
          zip_codes?: string[] | null
        }
        Update: {
          area_name?: string
          area_type?: string | null
          center_lat?: number | null
          center_lng?: number | null
          company_id?: string
          created_at?: string | null
          estimated_travel_time_minutes?: number | null
          id?: string
          is_active?: boolean | null
          minimum_job_amount?: number | null
          polygon_coordinates?: Json | null
          radius_miles?: number | null
          service_fee?: number | null
          updated_at?: string | null
          zip_codes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_service_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_service_areas_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      schedule_team_rules: {
        Row: {
          allow_overtime: boolean | null
          balance_workload: boolean | null
          break_after_hours: number | null
          break_duration_minutes: number | null
          company_id: string
          created_at: string | null
          id: string
          max_jobs_per_day: number | null
          max_jobs_per_week: number | null
          max_travel_time_minutes: number | null
          optimize_for_travel_time: boolean | null
          prefer_same_technician: boolean | null
          require_breaks: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_overtime?: boolean | null
          balance_workload?: boolean | null
          break_after_hours?: number | null
          break_duration_minutes?: number | null
          company_id: string
          created_at?: string | null
          id?: string
          max_jobs_per_day?: number | null
          max_jobs_per_week?: number | null
          max_travel_time_minutes?: number | null
          optimize_for_travel_time?: boolean | null
          prefer_same_technician?: boolean | null
          require_breaks?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_overtime?: boolean | null
          balance_workload?: boolean | null
          break_after_hours?: number | null
          break_duration_minutes?: number | null
          company_id?: string
          created_at?: string | null
          id?: string
          max_jobs_per_day?: number | null
          max_jobs_per_week?: number | null
          max_travel_time_minutes?: number | null
          optimize_for_travel_time?: boolean | null
          prefer_same_technician?: boolean | null
          require_breaks?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_team_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedule_team_rules_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      scheduled_emails: {
        Row: {
          attempt_count: number
          body: string | null
          company_id: string
          created_at: string
          email_type: string
          entity_id: string
          entity_type: string
          error_message: string | null
          id: string
          last_error_at: string | null
          max_attempts: number
          metadata: Json | null
          recipient_email: string
          recipient_name: string | null
          scheduled_at: string
          sent_at: string | null
          status: string
          subject: string | null
          updated_at: string
        }
        Insert: {
          attempt_count?: number
          body?: string | null
          company_id: string
          created_at?: string
          email_type: string
          entity_id: string
          entity_type: string
          error_message?: string | null
          id?: string
          last_error_at?: string | null
          max_attempts?: number
          metadata?: Json | null
          recipient_email: string
          recipient_name?: string | null
          scheduled_at: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Update: {
          attempt_count?: number
          body?: string | null
          company_id?: string
          created_at?: string
          email_type?: string
          entity_id?: string
          entity_type?: string
          error_message?: string | null
          id?: string
          last_error_at?: string | null
          max_attempts?: number
          metadata?: Json | null
          recipient_email?: string
          recipient_name?: string | null
          scheduled_at?: string
          sent_at?: string | null
          status?: string
          subject?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_emails_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_emails_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      scheduled_exports: {
        Row: {
          active: boolean | null
          company_id: string | null
          created_at: string | null
          data_type: string
          email_to: string[] | null
          filters: Json | null
          format: string
          id: string
          last_run_at: string | null
          next_run_at: string | null
          schedule: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          data_type: string
          email_to?: string[] | null
          filters?: Json | null
          format: string
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          schedule: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          company_id?: string | null
          created_at?: string | null
          data_type?: string
          email_to?: string[] | null
          filters?: Json | null
          format?: string
          id?: string
          last_run_at?: string | null
          next_run_at?: string | null
          schedule?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_exports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "scheduled_exports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      schedules: {
        Row: {
          access_instructions: string | null
          actual_duration: number | null
          actual_end_time: string | null
          actual_start_time: string | null
          all_day: boolean
          archived_at: string | null
          assigned_to: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          color: string | null
          company_id: string
          completed_by: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string
          customer_id: string
          customer_notes: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          duration: number
          end_time: string
          estimated_cost: number | null
          id: string
          is_recurring: boolean
          job_id: string | null
          location: string | null
          metadata: Json | null
          notes: string | null
          parent_schedule_id: string | null
          property_id: string
          recurrence_end_date: string | null
          recurrence_rule: Json | null
          reminder_hours_before: number | null
          reminder_method: string | null
          reminder_sent: boolean
          reminder_sent_at: string | null
          rescheduled_from_id: string | null
          rescheduled_to_id: string | null
          service_plan_id: string | null
          service_types: Json | null
          start_time: string
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          access_instructions?: string | null
          actual_duration?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          all_day?: boolean
          archived_at?: string | null
          assigned_to?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          color?: string | null
          company_id: string
          completed_by?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration: number
          end_time: string
          estimated_cost?: number | null
          id?: string
          is_recurring?: boolean
          job_id?: string | null
          location?: string | null
          metadata?: Json | null
          notes?: string | null
          parent_schedule_id?: string | null
          property_id: string
          recurrence_end_date?: string | null
          recurrence_rule?: Json | null
          reminder_hours_before?: number | null
          reminder_method?: string | null
          reminder_sent?: boolean
          reminder_sent_at?: string | null
          rescheduled_from_id?: string | null
          rescheduled_to_id?: string | null
          service_plan_id?: string | null
          service_types?: Json | null
          start_time: string
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          access_instructions?: string | null
          actual_duration?: number | null
          actual_end_time?: string | null
          actual_start_time?: string | null
          all_day?: boolean
          archived_at?: string | null
          assigned_to?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          color?: string | null
          company_id?: string
          completed_by?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          duration?: number
          end_time?: string
          estimated_cost?: number | null
          id?: string
          is_recurring?: boolean
          job_id?: string | null
          location?: string | null
          metadata?: Json | null
          notes?: string | null
          parent_schedule_id?: string | null
          property_id?: string
          recurrence_end_date?: string | null
          recurrence_rule?: Json | null
          reminder_hours_before?: number | null
          reminder_method?: string | null
          reminder_sent?: boolean
          reminder_sent_at?: string | null
          rescheduled_from_id?: string | null
          rescheduled_to_id?: string | null
          service_plan_id?: string | null
          service_types?: Json | null
          start_time?: string
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_assigned_to_users_id_fk"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_cancelled_by_users_id_fk"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "schedules_completed_by_users_id_fk"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_job_id_jobs_id_fk"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_parent_schedule_id_schedules_id_fk"
            columns: ["parent_schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_rescheduled_from_id_schedules_id_fk"
            columns: ["rescheduled_from_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_rescheduled_to_id_schedules_id_fk"
            columns: ["rescheduled_to_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_service_plan_id_service_plans_id_fk"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      service_agreements: {
        Row: {
          agreement_number: string
          auto_renew: boolean | null
          availability_percentage: number | null
          cancellation_reason: string | null
          company_id: string
          contract_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          customer_id: string
          deliverables: Json | null
          description: string | null
          end_date: string
          expiration_reminder_sent: boolean | null
          id: string
          monthly_amount: number | null
          notes: string | null
          payment_schedule: string | null
          penalty_terms: string | null
          performance_metrics: Json | null
          property_id: string | null
          renewal_reminder_sent: boolean | null
          renewal_term_months: number | null
          resolution_time_hours: number | null
          response_time_hours: number | null
          scope_of_work: string | null
          search_vector: unknown
          signed_at: string | null
          signed_by_company_name: string | null
          signed_by_customer_name: string | null
          signed_document_url: string | null
          start_date: string
          status: string
          term_months: number | null
          termination_date: string | null
          terms: string | null
          title: string
          total_value: number | null
          updated_at: string | null
        }
        Insert: {
          agreement_number: string
          auto_renew?: boolean | null
          availability_percentage?: number | null
          cancellation_reason?: string | null
          company_id: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id: string
          deliverables?: Json | null
          description?: string | null
          end_date: string
          expiration_reminder_sent?: boolean | null
          id?: string
          monthly_amount?: number | null
          notes?: string | null
          payment_schedule?: string | null
          penalty_terms?: string | null
          performance_metrics?: Json | null
          property_id?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_term_months?: number | null
          resolution_time_hours?: number | null
          response_time_hours?: number | null
          scope_of_work?: string | null
          search_vector?: unknown
          signed_at?: string | null
          signed_by_company_name?: string | null
          signed_by_customer_name?: string | null
          signed_document_url?: string | null
          start_date: string
          status?: string
          term_months?: number | null
          termination_date?: string | null
          terms?: string | null
          title: string
          total_value?: number | null
          updated_at?: string | null
        }
        Update: {
          agreement_number?: string
          auto_renew?: boolean | null
          availability_percentage?: number | null
          cancellation_reason?: string | null
          company_id?: string
          contract_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          customer_id?: string
          deliverables?: Json | null
          description?: string | null
          end_date?: string
          expiration_reminder_sent?: boolean | null
          id?: string
          monthly_amount?: number | null
          notes?: string | null
          payment_schedule?: string | null
          penalty_terms?: string | null
          performance_metrics?: Json | null
          property_id?: string | null
          renewal_reminder_sent?: boolean | null
          renewal_term_months?: number | null
          resolution_time_hours?: number | null
          response_time_hours?: number | null
          scope_of_work?: string | null
          search_vector?: unknown
          signed_at?: string | null
          signed_by_company_name?: string | null
          signed_by_customer_name?: string | null
          signed_document_url?: string | null
          start_date?: string
          status?: string
          term_months?: number | null
          termination_date?: string | null
          terms?: string | null
          title?: string
          total_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_agreements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_agreements_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_agreements_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      service_level_agreements: {
        Row: {
          actual_performance_avg: number | null
          company_id: string
          created_at: string
          customer_id: string | null
          deleted_at: string | null
          description: string | null
          effective_date: string
          expiration_date: string | null
          has_penalties: boolean | null
          has_rewards: boolean | null
          high_target_minutes: number | null
          id: string
          is_active: boolean | null
          low_target_minutes: number | null
          medium_target_minutes: number | null
          notes: string | null
          penalty_amount: number | null
          reward_amount: number | null
          service_plan_id: string | null
          sla_compliance_percent: number | null
          sla_met_count: number | null
          sla_missed_count: number | null
          sla_name: string
          sla_type: string
          target_unit: string
          target_value: number
          updated_at: string
          urgent_target_minutes: number | null
        }
        Insert: {
          actual_performance_avg?: number | null
          company_id: string
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          description?: string | null
          effective_date: string
          expiration_date?: string | null
          has_penalties?: boolean | null
          has_rewards?: boolean | null
          high_target_minutes?: number | null
          id?: string
          is_active?: boolean | null
          low_target_minutes?: number | null
          medium_target_minutes?: number | null
          notes?: string | null
          penalty_amount?: number | null
          reward_amount?: number | null
          service_plan_id?: string | null
          sla_compliance_percent?: number | null
          sla_met_count?: number | null
          sla_missed_count?: number | null
          sla_name: string
          sla_type: string
          target_unit: string
          target_value: number
          updated_at?: string
          urgent_target_minutes?: number | null
        }
        Update: {
          actual_performance_avg?: number | null
          company_id?: string
          created_at?: string
          customer_id?: string | null
          deleted_at?: string | null
          description?: string | null
          effective_date?: string
          expiration_date?: string | null
          has_penalties?: boolean | null
          has_rewards?: boolean | null
          high_target_minutes?: number | null
          id?: string
          is_active?: boolean | null
          low_target_minutes?: number | null
          medium_target_minutes?: number | null
          notes?: string | null
          penalty_amount?: number | null
          reward_amount?: number | null
          service_plan_id?: string | null
          sla_compliance_percent?: number | null
          sla_met_count?: number | null
          sla_missed_count?: number | null
          sla_name?: string
          sla_type?: string
          target_unit?: string
          target_value?: number
          updated_at?: string
          urgent_target_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_level_agreements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_level_agreements_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_level_agreements_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_level_agreements_service_plan_id_fkey"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          included_items: Json
          is_active: boolean
          labor_hours: number | null
          name: string
          notes: string | null
          package_price: number
          package_type: string
          price_book_item_id: string
          total_cost: number | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          included_items: Json
          is_active?: boolean
          labor_hours?: number | null
          name: string
          notes?: string | null
          package_price?: number
          package_type?: string
          price_book_item_id: string
          total_cost?: number | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          included_items?: Json
          is_active?: boolean
          labor_hours?: number | null
          name?: string
          notes?: string | null
          package_price?: number
          package_type?: string
          price_book_item_id?: string
          total_cost?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_packages_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_packages_price_book_item_id_price_book_items_id_fk"
            columns: ["price_book_item_id"]
            isOneToOne: false
            referencedRelation: "price_book_items"
            referencedColumns: ["id"]
          },
        ]
      }
      service_plan_milestones: {
        Row: {
          assigned_to: string | null
          company_id: string
          completed_date: string | null
          completed_deliverables: string[] | null
          completion_notes: string | null
          created_at: string
          deliverables: string[] | null
          due_date: string | null
          id: string
          milestone_description: string | null
          milestone_name: string
          milestone_type: string | null
          notes: string | null
          service_plan_id: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          company_id: string
          completed_date?: string | null
          completed_deliverables?: string[] | null
          completion_notes?: string | null
          created_at?: string
          deliverables?: string[] | null
          due_date?: string | null
          id?: string
          milestone_description?: string | null
          milestone_name: string
          milestone_type?: string | null
          notes?: string | null
          service_plan_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          company_id?: string
          completed_date?: string | null
          completed_deliverables?: string[] | null
          completion_notes?: string | null
          created_at?: string
          deliverables?: string[] | null
          due_date?: string | null
          id?: string
          milestone_description?: string | null
          milestone_name?: string
          milestone_type?: string | null
          notes?: string | null
          service_plan_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_plan_milestones_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plan_milestones_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plan_milestones_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_plan_milestones_service_plan_id_fkey"
            columns: ["service_plan_id"]
            isOneToOne: false
            referencedRelation: "service_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      service_plan_settings: {
        Row: {
          allow_multiple_plans_per_customer: boolean | null
          auto_invoice_on_renewal: boolean | null
          auto_renew_enabled: boolean | null
          auto_schedule_services: boolean | null
          company_id: string
          created_at: string | null
          id: string
          reminder_days: number | null
          renewal_notice_days: number | null
          require_contract_signature: boolean | null
          schedule_advance_days: number | null
          send_reminder_before_service: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_multiple_plans_per_customer?: boolean | null
          auto_invoice_on_renewal?: boolean | null
          auto_renew_enabled?: boolean | null
          auto_schedule_services?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          reminder_days?: number | null
          renewal_notice_days?: number | null
          require_contract_signature?: boolean | null
          schedule_advance_days?: number | null
          send_reminder_before_service?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_multiple_plans_per_customer?: boolean | null
          auto_invoice_on_renewal?: boolean | null
          auto_renew_enabled?: boolean | null
          auto_schedule_services?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          reminder_days?: number | null
          renewal_notice_days?: number | null
          require_contract_signature?: boolean | null
          schedule_advance_days?: number | null
          send_reminder_before_service?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_plan_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plan_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      service_plans: {
        Row: {
          archived_at: string | null
          assigned_technician: string | null
          auto_generate_jobs: boolean
          billing_frequency: string | null
          cancelled_at: string | null
          cancelled_reason: string | null
          company_id: string
          completed_at: string | null
          created_at: string
          customer_id: string
          customer_notes: string | null
          customer_signature: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          included_equipment_types: Json | null
          included_services: Json
          last_service_date: string | null
          metadata: Json | null
          name: string
          next_service_due: string
          notes: string | null
          paused_at: string | null
          paused_reason: string | null
          plan_number: string
          price: number
          price_book_item_ids: Json | null
          property_id: string | null
          renewal_notice_days: number | null
          renewal_type: string | null
          signed_at: string | null
          signed_by_name: string | null
          start_date: string
          status: string
          taxable: boolean
          terms: string | null
          total_revenue: number | null
          total_visits_completed: number | null
          type: string
          updated_at: string
          visits_per_term: number
        }
        Insert: {
          archived_at?: string | null
          assigned_technician?: string | null
          auto_generate_jobs?: boolean
          billing_frequency?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          company_id: string
          completed_at?: string | null
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          included_equipment_types?: Json | null
          included_services: Json
          last_service_date?: string | null
          metadata?: Json | null
          name: string
          next_service_due: string
          notes?: string | null
          paused_at?: string | null
          paused_reason?: string | null
          plan_number: string
          price?: number
          price_book_item_ids?: Json | null
          property_id?: string | null
          renewal_notice_days?: number | null
          renewal_type?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date: string
          status?: string
          taxable?: boolean
          terms?: string | null
          total_revenue?: number | null
          total_visits_completed?: number | null
          type?: string
          updated_at?: string
          visits_per_term?: number
        }
        Update: {
          archived_at?: string | null
          assigned_technician?: string | null
          auto_generate_jobs?: boolean
          billing_frequency?: string | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          company_id?: string
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          customer_signature?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          included_equipment_types?: Json | null
          included_services?: Json
          last_service_date?: string | null
          metadata?: Json | null
          name?: string
          next_service_due?: string
          notes?: string | null
          paused_at?: string | null
          paused_reason?: string | null
          plan_number?: string
          price?: number
          price_book_item_ids?: Json | null
          property_id?: string | null
          renewal_notice_days?: number | null
          renewal_type?: string | null
          signed_at?: string | null
          signed_by_name?: string | null
          start_date?: string
          status?: string
          taxable?: boolean
          terms?: string | null
          total_revenue?: number | null
          total_visits_completed?: number | null
          type?: string
          updated_at?: string
          visits_per_term?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_plans_assigned_technician_users_id_fk"
            columns: ["assigned_technician"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plans_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plans_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "service_plans_customer_id_customers_id_fk"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plans_deleted_by_users_id_fk"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_plans_property_id_properties_id_fk"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          chat_id: string
          created_at: string
          id: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "streams_chat_id_chats_id_fk"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chats"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          created_at: string
          description: string | null
          document_id: string
          id: string
          is_resolved: boolean
          original_text: string
          suggested_text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          document_id: string
          id?: string
          is_resolved?: boolean
          original_text: string
          suggested_text: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          document_id?: string
          id?: string
          is_resolved?: boolean
          original_text?: string
          suggested_text?: string
          user_id?: string
        }
        Relationships: []
      }
      supplier_integrations: {
        Row: {
          account_number: string | null
          api_enabled: boolean
          api_endpoint: string | null
          api_key: string | null
          api_secret: string | null
          auto_import_new_items: boolean | null
          auto_update_prices: boolean | null
          category_mappings: Json | null
          company_id: string
          created_at: string
          default_markup_percent: number | null
          display_name: string
          id: string
          last_sync_at: string | null
          last_sync_error: string | null
          last_sync_status: string | null
          metadata: Json | null
          next_sync_at: string | null
          notes: string | null
          status: string
          supplier_name: string
          sync_enabled: boolean
          sync_frequency: string | null
          total_items_failed: number | null
          total_items_imported: number | null
          total_items_updated: number | null
          updated_at: string
          webhook_enabled: boolean
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          account_number?: string | null
          api_enabled?: boolean
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          auto_import_new_items?: boolean | null
          auto_update_prices?: boolean | null
          category_mappings?: Json | null
          company_id: string
          created_at?: string
          default_markup_percent?: number | null
          display_name: string
          id?: string
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          metadata?: Json | null
          next_sync_at?: string | null
          notes?: string | null
          status?: string
          supplier_name: string
          sync_enabled?: boolean
          sync_frequency?: string | null
          total_items_failed?: number | null
          total_items_imported?: number | null
          total_items_updated?: number | null
          updated_at?: string
          webhook_enabled?: boolean
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          account_number?: string | null
          api_enabled?: boolean
          api_endpoint?: string | null
          api_key?: string | null
          api_secret?: string | null
          auto_import_new_items?: boolean | null
          auto_update_prices?: boolean | null
          category_mappings?: Json | null
          company_id?: string
          created_at?: string
          default_markup_percent?: number | null
          display_name?: string
          id?: string
          last_sync_at?: string | null
          last_sync_error?: string | null
          last_sync_status?: string | null
          metadata?: Json | null
          next_sync_at?: string | null
          notes?: string | null
          status?: string
          supplier_name?: string
          sync_enabled?: boolean
          sync_frequency?: string | null
          total_items_failed?: number | null
          total_items_imported?: number | null
          total_items_updated?: number | null
          updated_at?: string
          webhook_enabled?: boolean
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      tag_settings: {
        Row: {
          allow_custom_tags: boolean | null
          auto_assign_colors: boolean | null
          company_id: string
          created_at: string | null
          id: string
          max_tags_per_item: number | null
          require_tag_approval: boolean | null
          updated_at: string | null
          use_color_coding: boolean | null
        }
        Insert: {
          allow_custom_tags?: boolean | null
          auto_assign_colors?: boolean | null
          company_id: string
          created_at?: string | null
          id?: string
          max_tags_per_item?: number | null
          require_tag_approval?: boolean | null
          updated_at?: string | null
          use_color_coding?: boolean | null
        }
        Update: {
          allow_custom_tags?: boolean | null
          auto_assign_colors?: boolean | null
          company_id?: string
          created_at?: string | null
          id?: string
          max_tags_per_item?: number | null
          require_tag_approval?: boolean | null
          updated_at?: string | null
          use_color_coding?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tag_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tag_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      tags: {
        Row: {
          category: string | null
          color: string | null
          company_id: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_system: boolean
          last_used_at: string | null
          name: string
          slug: string
          updated_at: string
          usage_count: number
        }
        Insert: {
          category?: string | null
          color?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          last_used_at?: string | null
          name: string
          slug: string
          updated_at?: string
          usage_count?: number
        }
        Update: {
          category?: string | null
          color?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_system?: boolean
          last_used_at?: string | null
          name?: string
          slug?: string
          updated_at?: string
          usage_count?: number
        }
        Relationships: []
      }
      team_availability: {
        Row: {
          auto_reply_enabled: boolean | null
          can_receive_calls: boolean | null
          company_id: string
          created_at: string | null
          current_calls_count: number | null
          do_not_disturb_until: string | null
          id: string
          last_call_at: string | null
          max_concurrent_calls: number | null
          out_of_office_message: string | null
          schedule: Json | null
          status: string
          status_changed_at: string | null
          updated_at: string | null
          user_id: string
          vacation_end_date: string | null
          vacation_message: string | null
          vacation_mode_enabled: boolean | null
          vacation_start_date: string | null
        }
        Insert: {
          auto_reply_enabled?: boolean | null
          can_receive_calls?: boolean | null
          company_id: string
          created_at?: string | null
          current_calls_count?: number | null
          do_not_disturb_until?: string | null
          id?: string
          last_call_at?: string | null
          max_concurrent_calls?: number | null
          out_of_office_message?: string | null
          schedule?: Json | null
          status?: string
          status_changed_at?: string | null
          updated_at?: string | null
          user_id: string
          vacation_end_date?: string | null
          vacation_message?: string | null
          vacation_mode_enabled?: boolean | null
          vacation_start_date?: string | null
        }
        Update: {
          auto_reply_enabled?: boolean | null
          can_receive_calls?: boolean | null
          company_id?: string
          created_at?: string | null
          current_calls_count?: number | null
          do_not_disturb_until?: string | null
          id?: string
          last_call_at?: string | null
          max_concurrent_calls?: number | null
          out_of_office_message?: string | null
          schedule?: Json | null
          status?: string
          status_changed_at?: string | null
          updated_at?: string | null
          user_id?: string
          vacation_end_date?: string | null
          vacation_message?: string | null
          vacation_mode_enabled?: boolean | null
          vacation_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_availability_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_availability_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      team_department_settings: {
        Row: {
          allow_multiple_departments: boolean | null
          company_id: string
          created_at: string | null
          enable_department_hierarchy: boolean | null
          id: string
          require_department_assignment: boolean | null
          require_department_head: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_multiple_departments?: boolean | null
          company_id: string
          created_at?: string | null
          enable_department_hierarchy?: boolean | null
          id?: string
          require_department_assignment?: boolean | null
          require_department_head?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_multiple_departments?: boolean | null
          company_id?: string
          created_at?: string | null
          enable_department_hierarchy?: boolean | null
          id?: string
          require_department_assignment?: boolean | null
          require_department_head?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_department_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_department_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
      team_invitations: {
        Row: {
          company_id: string
          created_at: string
          email: string
          expires_at: string
          first_name: string
          id: string
          invited_by: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
          used_at: string | null
        }
        Insert: {
          company_id: string
          created_at?: string
          email: string
          expires_at: string
          first_name: string
          id?: string
          invited_by: string
          last_name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          token: string
          used_at?: string | null
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string
          expires_at?: string
          first_name?: string
          id?: string
          invited_by?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          token?: string
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "team_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          archived_at: string | null
          call_forwarding_enabled: boolean | null
          call_forwarding_number: string | null
          company_id: string
          created_at: string
          department: string | null
          department_id: string | null
          direct_inward_dial: string | null
          email: string | null
          extension_enabled: boolean | null
          id: string
          invited_at: string | null
          invited_by: string | null
          invited_email: string | null
          invited_name: string | null
          job_title: string | null
          joined_at: string | null
          last_active_at: string | null
          permissions: Json | null
          phone: string | null
          phone_extension: string | null
          ring_timeout_seconds: number | null
          role: Database["public"]["Enums"]["user_role"]
          role_id: string | null
          simultaneous_ring_enabled: boolean | null
          status: string
          updated_at: string
          user_id: string | null
          voicemail_greeting_url: string | null
          voicemail_pin: string | null
        }
        Insert: {
          archived_at?: string | null
          call_forwarding_enabled?: boolean | null
          call_forwarding_number?: string | null
          company_id: string
          created_at?: string
          department?: string | null
          department_id?: string | null
          direct_inward_dial?: string | null
          email?: string | null
          extension_enabled?: boolean | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_name?: string | null
          job_title?: string | null
          joined_at?: string | null
          last_active_at?: string | null
          permissions?: Json | null
          phone?: string | null
          phone_extension?: string | null
          ring_timeout_seconds?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          role_id?: string | null
          simultaneous_ring_enabled?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string | null
          voicemail_greeting_url?: string | null
          voicemail_pin?: string | null
        }
        Update: {
          archived_at?: string | null
          call_forwarding_enabled?: boolean | null
          call_forwarding_number?: string | null
          company_id?: string
          created_at?: string
          department?: string | null
          department_id?: string | null
          direct_inward_dial?: string | null
          email?: string | null
          extension_enabled?: boolean | null
          id?: string
          invited_at?: string | null
          invited_by?: string | null
          invited_email?: string | null
          invited_name?: string | null
          job_title?: string | null
          joined_at?: string | null
          last_active_at?: string | null
          permissions?: Json | null
          phone?: string | null
          phone_extension?: string | null
          ring_timeout_seconds?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          role_id?: string | null
          simultaneous_ring_enabled?: boolean | null
          status?: string
          updated_at?: string
          user_id?: string | null
          voicemail_greeting_url?: string | null
          voicemail_pin?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "team_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "company_role_stats"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "team_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "custom_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          created_at: string | null
          digest_enabled: boolean | null
          digest_frequency: string | null
          email_job_updates: boolean | null
          email_mentions: boolean | null
          email_messages: boolean | null
          email_new_jobs: boolean | null
          id: string
          in_app_all: boolean | null
          push_job_updates: boolean | null
          push_mentions: boolean | null
          push_messages: boolean | null
          push_new_jobs: boolean | null
          sms_schedule_changes: boolean | null
          sms_urgent_jobs: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          digest_enabled?: boolean | null
          digest_frequency?: string | null
          email_job_updates?: boolean | null
          email_mentions?: boolean | null
          email_messages?: boolean | null
          email_new_jobs?: boolean | null
          id?: string
          in_app_all?: boolean | null
          push_job_updates?: boolean | null
          push_mentions?: boolean | null
          push_messages?: boolean | null
          push_new_jobs?: boolean | null
          sms_schedule_changes?: boolean | null
          sms_urgent_jobs?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          digest_enabled?: boolean | null
          digest_frequency?: string | null
          email_job_updates?: boolean | null
          email_mentions?: boolean | null
          email_messages?: boolean | null
          email_new_jobs?: boolean | null
          id?: string
          in_app_all?: boolean | null
          push_job_updates?: boolean | null
          push_mentions?: boolean | null
          push_messages?: boolean | null
          push_new_jobs?: boolean | null
          sms_schedule_changes?: boolean | null
          sms_urgent_jobs?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          calendar_start_day: number | null
          calendar_view: string | null
          created_at: string | null
          date_format: string | null
          default_dashboard_view: string | null
          default_page_size: number | null
          id: string
          language: string | null
          show_welcome_banner: boolean | null
          theme: string | null
          time_format: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calendar_start_day?: number | null
          calendar_view?: string | null
          created_at?: string | null
          date_format?: string | null
          default_dashboard_view?: string | null
          default_page_size?: number | null
          id?: string
          language?: string | null
          show_welcome_banner?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calendar_start_day?: number | null
          calendar_view?: string | null
          created_at?: string | null
          date_format?: string | null
          default_dashboard_view?: string | null
          default_page_size?: number | null
          id?: string
          language?: string | null
          show_welcome_banner?: boolean | null
          theme?: string | null
          time_format?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          bio: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          id: string
          is_active: boolean
          last_login_at: string | null
          name: string
          phone: string | null
          status: Database["public"]["Enums"]["user_status"]
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          name?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          address2: string | null
          category: string | null
          city: string | null
          company_id: string
          country: string | null
          created_at: string
          credit_limit: number | null
          custom_fields: Json | null
          deleted_at: string | null
          deleted_by: string | null
          display_name: string
          email: string | null
          id: string
          internal_notes: string | null
          name: string
          notes: string | null
          payment_terms: string | null
          phone: string | null
          preferred_payment_method: string | null
          secondary_phone: string | null
          state: string | null
          status: string
          tags: Json | null
          tax_id: string | null
          updated_at: string
          vendor_number: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address2?: string | null
          category?: string | null
          city?: string | null
          company_id: string
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          name: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_payment_method?: string | null
          secondary_phone?: string | null
          state?: string | null
          status?: string
          tags?: Json | null
          tax_id?: string | null
          updated_at?: string
          vendor_number: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address2?: string | null
          category?: string | null
          city?: string | null
          company_id?: string
          country?: string | null
          created_at?: string
          credit_limit?: number | null
          custom_fields?: Json | null
          deleted_at?: string | null
          deleted_by?: string | null
          display_name?: string
          email?: string | null
          id?: string
          internal_notes?: string | null
          name?: string
          notes?: string | null
          payment_terms?: string | null
          phone?: string | null
          preferred_payment_method?: string | null
          secondary_phone?: string | null
          state?: string | null
          status?: string
          tags?: Json | null
          tax_id?: string | null
          updated_at?: string
          vendor_number?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "vendors_deleted_by_fkey"
            columns: ["deleted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_tokens: {
        Row: {
          created_at: string
          email: string
          expires_at: string
          id: string
          metadata: Json | null
          token: string
          type: string
          used: boolean
          used_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          expires_at: string
          id?: string
          metadata?: Json | null
          token: string
          type?: string
          used?: boolean
          used_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          metadata?: Json | null
          token?: string
          type?: string
          used?: boolean
          used_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      voicemails: {
        Row: {
          audio_format: string | null
          audio_url: string | null
          communication_id: string | null
          company_id: string
          created_at: string | null
          customer_id: string | null
          deleted_at: string | null
          deleted_by: string | null
          duration: number | null
          email_sent: boolean | null
          from_number: string
          id: string
          is_read: boolean | null
          is_urgent: boolean | null
          metadata: Json | null
          notification_sent_at: string | null
          phone_number_id: string | null
          read_at: string | null
          read_by: string | null
          received_at: string | null
          sms_sent: boolean | null
          telnyx_call_control_id: string | null
          telnyx_recording_id: string | null
          to_number: string
          transcription: string | null
          transcription_confidence: number | null
          updated_at: string | null
        }
        Insert: {
          audio_format?: string | null
          audio_url?: string | null
          communication_id?: string | null
          company_id: string
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          duration?: number | null
          email_sent?: boolean | null
          from_number: string
          id?: string
          is_read?: boolean | null
          is_urgent?: boolean | null
          metadata?: Json | null
          notification_sent_at?: string | null
          phone_number_id?: string | null
          read_at?: string | null
          read_by?: string | null
          received_at?: string | null
          sms_sent?: boolean | null
          telnyx_call_control_id?: string | null
          telnyx_recording_id?: string | null
          to_number: string
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string | null
        }
        Update: {
          audio_format?: string | null
          audio_url?: string | null
          communication_id?: string | null
          company_id?: string
          created_at?: string | null
          customer_id?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          duration?: number | null
          email_sent?: boolean | null
          from_number?: string
          id?: string
          is_read?: boolean | null
          is_urgent?: boolean | null
          metadata?: Json | null
          notification_sent_at?: string | null
          phone_number_id?: string | null
          read_at?: string | null
          read_by?: string | null
          received_at?: string | null
          sms_sent?: boolean | null
          telnyx_call_control_id?: string | null
          telnyx_recording_id?: string | null
          to_number?: string
          transcription?: string | null
          transcription_confidence?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voicemails_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voicemails_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "voicemails_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voicemails_phone_number_id_fkey"
            columns: ["phone_number_id"]
            isOneToOne: false
            referencedRelation: "phone_numbers"
            referencedColumns: ["id"]
          },
        ]
      }
      votes_v2: {
        Row: {
          chat_id: string
          is_upvoted: boolean
          message_id: string
        }
        Insert: {
          chat_id: string
          is_upvoted: boolean
          message_id: string
        }
        Update: {
          chat_id?: string
          is_upvoted?: boolean
          message_id?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempts: number
          created_at: string
          delivered_at: string | null
          event: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          webhook_id: string
        }
        Insert: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          event: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id: string
        }
        Update: {
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          event?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          webhook_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_webhook_id_fkey"
            columns: ["webhook_id"]
            isOneToOne: false
            referencedRelation: "webhooks"
            referencedColumns: ["id"]
          },
        ]
      }
      webhooks: {
        Row: {
          active: boolean
          company_id: string
          created_at: string
          created_by: string | null
          description: string | null
          events: string[]
          id: string
          secret: string
          updated_at: string
          url: string
        }
        Insert: {
          active?: boolean
          company_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          events: string[]
          id?: string
          secret: string
          updated_at?: string
          url: string
        }
        Update: {
          active?: boolean
          company_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          events?: string[]
          id?: string
          secret?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhooks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhooks_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
          {
            foreignKeyName: "webhooks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      company_owners: {
        Row: {
          company_id: string | null
          company_name: string | null
          owner_profile_id: string | null
          owner_user_id: string | null
        }
        Relationships: []
      }
      company_role_stats: {
        Row: {
          active_count: number | null
          company_id: string | null
          inactive_count: number | null
          member_count: number | null
          pending_count: number | null
          role_id: string | null
          role_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_roles_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "custom_roles_company_id_companies_id_fk"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "company_owners"
            referencedColumns: ["company_id"]
          },
        ]
      }
    }
    Functions: {
      calculate_agreement_term_months: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: number
      }
      calculate_next_service_date: {
        Args: {
          p_custom_frequency_days?: number
          p_frequency: string
          p_last_service_date: string
        }
        Returns: string
      }
      check_payment_token: {
        Args: { p_token: string }
        Returns: {
          invoice_id: string
          is_valid: boolean
          message: string
        }[]
      }
      cleanup_expired_attachments: { Args: never; Returns: number }
      cleanup_expired_payment_tokens: { Args: never; Returns: number }
      cleanup_old_notifications: { Args: never; Returns: number }
      create_phone_porting_notification: {
        Args: {
          p_company_id: string
          p_phone_number: string
          p_porting_request_id: string
          p_status: string
          p_user_id: string
        }
        Returns: string
      }
      ensure_owner_team_member: { Args: never; Returns: undefined }
      generate_appointment_number: {
        Args: { p_company_id: string }
        Returns: string
      }
      generate_default_invoice_content: {
        Args: {
          p_company_id: string
          p_customer_id: string
          p_invoice_id: string
        }
        Returns: Json
      }
      generate_invoice_payment_token: {
        Args: {
          p_expiry_hours?: number
          p_invoice_id: string
          p_max_uses?: number
        }
        Returns: {
          expires_at: string
          token: string
        }[]
      }
      generate_maintenance_plan_number: {
        Args: { p_company_id: string }
        Returns: string
      }
      generate_service_agreement_number: {
        Args: { p_company_id: string }
        Returns: string
      }
      get_available_team_members: {
        Args: { p_company_id: string; p_routing_rule_id?: string }
        Returns: {
          availability_score: number
          current_calls: number
          max_calls: number
          phone_extension: string
          team_member_id: string
        }[]
      }
      get_customers_last_jobs: {
        Args: { company_id_param: string }
        Returns: {
          customer_id: string
          job_date: string
        }[]
      }
      get_customers_next_jobs: {
        Args: { company_id_param: string }
        Returns: {
          customer_id: string
          scheduled_start: string
        }[]
      }
      get_folder_breadcrumbs: {
        Args: { p_folder_id: string }
        Returns: {
          id: string
          level: number
          name: string
          path: string
        }[]
      }
      get_unread_notification_count: {
        Args: { p_user_id: string }
        Returns: number
      }
      get_user_company_id: { Args: { input_user_id?: string }; Returns: string }
      get_user_role:
        | { Args: { check_company_id: string }; Returns: string }
        | {
            Args: { company_uuid: string; user_uuid: string }
            Returns: Database["public"]["Enums"]["user_role"]
          }
      has_any_role:
        | {
            Args: {
              company_uuid: string
              required_roles: Database["public"]["Enums"]["user_role"][]
              user_uuid: string
            }
            Returns: boolean
          }
        | {
            Args: { check_company_id: string; required_roles: string[] }
            Returns: boolean
          }
      has_company_access: {
        Args: { company_uuid: string; user_uuid: string }
        Returns: boolean
      }
      has_permission:
        | {
            Args: { check_company_id: string; required_permission: string }
            Returns: boolean
          }
        | {
            Args: {
              company_uuid: string
              permission_key: string
              user_uuid: string
            }
            Returns: boolean
          }
      has_role:
        | {
            Args: {
              company_uuid: string
              required_role: Database["public"]["Enums"]["user_role"]
              user_uuid: string
            }
            Returns: boolean
          }
        | {
            Args: { check_company_id: string; required_role: string }
            Returns: boolean
          }
      is_company_admin: {
        Args: { check_company_id: string; check_user_id: string }
        Returns: boolean
      }
      is_company_member: { Args: { company_uuid: string }; Returns: boolean }
      is_company_owner:
        | { Args: { company_uuid: string }; Returns: boolean }
        | {
            Args: { company_uuid: string; user_uuid: string }
            Returns: boolean
          }
      is_owner_of_company:
        | { Args: { check_company_id: string }; Returns: boolean }
        | {
            Args: { company_uuid: string; user_uuid: string }
            Returns: boolean
          }
      mark_all_notifications_read: {
        Args: { p_user_id: string }
        Returns: number
      }
      mark_payment_token_used: {
        Args: { p_ip_address?: string; p_token: string }
        Returns: boolean
      }
      search_all_entities: {
        Args: {
          company_id_param: string
          per_entity_limit?: number
          search_query: string
        }
        Returns: Json
      }
      search_appointments_ranked: {
        Args: {
          p_company_id: string
          p_limit?: number
          p_offset?: number
          p_search_query: string
        }
        Returns: {
          appointment_number: string
          assigned_to: string
          customer_id: string
          description: string
          id: string
          job_id: string
          rank: number
          scheduled_end: string
          scheduled_start: string
          status: string
          title: string
          type: string
        }[]
      }
      search_customers_ranked: {
        Args: {
          company_id_param: string
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          address: string
          city: string
          company_id: string
          company_name: string
          created_at: string
          customer_type: string
          deleted_at: string
          deleted_by: string
          display_name: string
          email: string
          first_name: string
          id: string
          last_name: string
          metadata: Json
          notes: string
          phone: string
          search_rank: number
          secondary_phone: string
          state: string
          status: string
          tags: Json
          updated_at: string
          zip_code: string
        }[]
      }
      search_equipment_ranked: {
        Args: {
          company_id_param: string
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          average_service_cost: number
          capacity: string
          category: string
          company_id: string
          condition: string
          created_at: string
          customer_id: string
          customer_notes: string
          deleted_at: string
          deleted_by: string
          documents: Json
          efficiency: string
          equipment_number: string
          fuel_type: string
          id: string
          install_date: string
          install_job_id: string
          installed_by: string
          is_under_warranty: boolean
          last_service_date: string
          last_service_job_id: string
          location: string
          manufacturer: string
          metadata: Json
          model: string
          model_year: number
          name: string
          next_service_due: string
          notes: string
          photos: Json
          property_id: string
          replaced_by_equipment_id: string
          replaced_date: string
          search_rank: number
          serial_number: string
          service_interval_days: number
          service_plan_id: string
          status: string
          total_service_cost: number
          total_service_count: number
          type: string
          updated_at: string
          warranty_expiration: string
          warranty_notes: string
          warranty_provider: string
        }[]
      }
      search_jobs_ranked: {
        Args: {
          company_id_param: string
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          actual_end: string
          actual_start: string
          ai_categories: Json
          ai_equipment: Json
          ai_priority_score: number
          ai_processed_at: string
          ai_service_type: string
          ai_tags: Json
          assigned_to: string
          company_id: string
          created_at: string
          customer_id: string
          deleted_at: string
          description: string
          id: string
          job_number: string
          job_type: string
          metadata: Json
          notes: string
          paid_amount: number
          priority: string
          property_id: string
          scheduled_end: string
          scheduled_start: string
          search_rank: number
          status: string
          title: string
          total_amount: number
          updated_at: string
        }[]
      }
      search_maintenance_plans_ranked: {
        Args: {
          p_company_id: string
          p_limit?: number
          p_offset?: number
          p_search_query: string
        }
        Returns: {
          amount: number
          customer_id: string
          description: string
          frequency: string
          id: string
          name: string
          next_service_date: string
          plan_number: string
          rank: number
          status: string
        }[]
      }
      search_price_book_items_ranked: {
        Args: {
          company_id_param: string
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          category: string
          category_id: string
          company_id: string
          cost: number
          created_at: string
          description: string
          documents: Json
          id: string
          image_url: string
          images: Json
          is_active: boolean
          is_taxable: boolean
          item_type: string
          markup_percent: number
          metadata: Json
          minimum_quantity: number
          name: string
          notes: string
          price: number
          search_rank: number
          sku: string
          subcategory: string
          supplier_id: string
          supplier_last_sync_at: string
          supplier_sku: string
          tags: Json
          unit: string
          updated_at: string
        }[]
      }
      search_properties_ranked: {
        Args: {
          company_id_param: string
          result_limit?: number
          result_offset?: number
          search_query: string
        }
        Returns: {
          address: string
          address2: string
          city: string
          company_id: string
          country: string
          created_at: string
          customer_id: string
          id: string
          metadata: Json
          name: string
          notes: string
          search_rank: number
          square_footage: number
          state: string
          type: string
          updated_at: string
          year_built: number
          zip_code: string
        }[]
      }
      search_service_agreements_ranked: {
        Args: {
          p_company_id: string
          p_limit?: number
          p_offset?: number
          p_search_query: string
        }
        Returns: {
          agreement_number: string
          customer_id: string
          description: string
          end_date: string
          id: string
          rank: number
          start_date: string
          status: string
          title: string
          total_value: number
        }[]
      }
      track_file_access: {
        Args: { p_attachment_id: string; p_user_id?: string }
        Returns: undefined
      }
      track_file_download: {
        Args: { p_attachment_id: string }
        Returns: undefined
      }
      transfer_company_ownership:
        | {
            Args: {
              p_company_id: string
              p_current_owner_id: string
              p_ip_address?: unknown
              p_new_owner_id: string
              p_reason?: string
              p_user_agent?: string
            }
            Returns: string
          }
        | {
            Args: { company_uuid: string; new_owner_user_id: string }
            Returns: undefined
          }
      user_has_company_access: {
        Args: { company_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      content_status: "draft" | "scheduled" | "published" | "archived"
      equipment_classification: "equipment" | "tool" | "vehicle"
      resource_type:
        | "case_study"
        | "webinar"
        | "template"
        | "guide"
        | "community"
        | "status_update"
      user_role:
        | "owner"
        | "admin"
        | "manager"
        | "dispatcher"
        | "technician"
        | "csr"
      user_status: "online" | "available" | "busy"
      virus_scan_status:
        | "pending"
        | "scanning"
        | "clean"
        | "infected"
        | "failed"
        | "skipped"
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
      content_status: ["draft", "scheduled", "published", "archived"],
      equipment_classification: ["equipment", "tool", "vehicle"],
      resource_type: [
        "case_study",
        "webinar",
        "template",
        "guide",
        "community",
        "status_update",
      ],
      user_role: [
        "owner",
        "admin",
        "manager",
        "dispatcher",
        "technician",
        "csr",
      ],
      user_status: ["online", "available", "busy"],
      virus_scan_status: [
        "pending",
        "scanning",
        "clean",
        "infected",
        "failed",
        "skipped",
      ],
    },
  },
} as const
