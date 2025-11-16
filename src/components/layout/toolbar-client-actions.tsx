"use client";

import { useEffect } from "react";
import { useToolbarActionsStore } from "@/lib/stores/toolbar-actions-store";

type ToolbarClientActionsProps = {
  pathname: string;
};

export function ToolbarClientActions({ pathname }: ToolbarClientActionsProps) {
  const actions = useToolbarActionsStore((state) => state.actions[pathname]);

  useEffect(() => {
    if (actions) {
      document
        .querySelector(
          `[data-toolbar-default-actions="${CSS.escape(pathname)}"]`
        )
        ?.setAttribute("hidden", "true");
    }
  }, [pathname, actions]);

  if (!actions) {
    return null;
  }

  return <>{actions}</>;
}
