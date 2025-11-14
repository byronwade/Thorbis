"use client";

import { useEffect } from "react";
import { initBotId } from "botid/client/core";
import { botIdProtectedRoutes } from "@/lib/security/botid-routes";

let hasInitializedBotId = false;

export function BotIdProvider() {
  useEffect(() => {
    if (hasInitializedBotId) return;

    initBotId({
      protect: botIdProtectedRoutes,
    });

    hasInitializedBotId = true;
  }, []);

  return null;
}

