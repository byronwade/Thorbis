/**
 * React Hooks for Analytics
 *
 * Easy-to-use hooks for tracking events in React components.
 */

"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";
import { trackEvent, trackPageView } from "./client";
import type { AnalyticsEvent } from "./types";

/**
 * Hook for tracking analytics events
 *
 * @example
 * const { track } = useAnalytics();
 *
 * track({
 *   name: "job.created",
 *   properties: { jobId: "123" }
 * });
 */
export function useAnalytics() {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);

  return { track };
}

/**
 * Hook that automatically tracks page views
 *
 * @example
 * usePageView(); // Automatically tracks page views on route changes
 */
export function usePageView(): void {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      trackPageView(pathname, document.title);
    }
  }, [pathname]);
}

/**
 * Hook for tracking form events
 *
 * @example
 * const { trackFormStart, trackFormSubmit, trackFormAbandon } = useFormTracking("signup");
 *
 * useEffect(() => {
 *   trackFormStart();
 *   return () => trackFormAbandon();
 * }, []);
 *
 * const handleSubmit = () => {
 *   trackFormSubmit({ success: true });
 * };
 */
export function useFormTracking(formType: string) {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);

  const trackFormStart = useCallback(() => {
    track({
      name: "form.started",
      properties: { formType },
    });
  }, [formType, track]);

  const trackFormSubmit = useCallback(
    (properties?: { success?: boolean; errorCount?: number }) => {
      track({
        name: "form.submitted",
        properties: {
          formType,
          ...properties,
        },
      });
    },
    [formType, track]
  );

  const trackFormAbandon = useCallback(
    (properties?: { fieldsCompleted?: number; totalFields?: number }) => {
      track({
        name: "form.abandoned",
        properties: {
          formType,
          ...properties,
        },
      });
    },
    [formType, track]
  );

  const trackFieldFocus = useCallback(
    (fieldName: string) => {
      track({
        name: "form.field_focused",
        properties: {
          formType,
          fieldName,
        },
      });
    },
    [formType, track]
  );

  const trackValidationError = useCallback(
    (fieldName: string, errorType: string) => {
      track({
        name: "form.validation_error",
        properties: {
          formType,
          fieldName,
          errorType,
        },
      });
    },
    [formType, track]
  );

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormAbandon,
    trackFieldFocus,
    trackValidationError,
  };
}

/**
 * Hook for tracking feature usage
 *
 * @example
 * const { trackFeatureUse } = useFeatureTracking();
 *
 * trackFeatureUse("bulk_edit", { itemCount: 10 });
 */
export function useFeatureTracking() {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);

  const trackFeatureUse = useCallback(
    (
      featureName: string,
      properties?: {
        firstTime?: boolean;
        context?: string;
      }
    ) => {
      track({
        name: "feature.used",
        properties: {
          featureName,
          ...properties,
        },
      });
    },
    [track]
  );

  const trackFeatureDiscovery = useCallback(
    (
      featureName: string,
      source: "tooltip" | "tour" | "notification" | "search"
    ) => {
      track({
        name: "feature.discovered",
        properties: {
          featureName,
          source,
        },
      });
    },
    [track]
  );

  return {
    trackFeatureUse,
    trackFeatureDiscovery,
  };
}

/**
 * Hook for tracking UI interactions
 *
 * @example
 * const { trackModalOpen, trackModalClose } = useUITracking();
 *
 * trackModalOpen("job-details");
 */
export function useUITracking() {
  const track = useCallback((event: AnalyticsEvent) => {
    trackEvent(event);
  }, []);

  const trackModalOpen = useCallback(
    (modalType: string, trigger?: string) => {
      track({
        name: "ui.modal_opened",
        properties: {
          modalType,
          trigger,
        },
      });
    },
    [track]
  );

  const trackModalClose = useCallback(
    (
      modalType: string,
      action: "submit" | "cancel" | "dismiss",
      duration?: number
    ) => {
      track({
        name: "ui.modal_closed",
        properties: {
          modalType,
          action,
          duration,
        },
      });
    },
    [track]
  );

  const trackTabSwitch = useCallback(
    (tabName: string, section?: string) => {
      track({
        name: "ui.tab_switched",
        properties: {
          tabName,
          section,
        },
      });
    },
    [track]
  );

  return {
    trackModalOpen,
    trackModalClose,
    trackTabSwitch,
  };
}
