import { initBotId } from "botid/client/core";
import { botIdProtectedRoutes } from "@/lib/security/botid-routes";

initBotId({
  protect: botIdProtectedRoutes,
});
