import { create } from "zustand"

import type { PlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import { createPlaybackRateStore } from "@/registry/default/hooks/use-playback-rate"
import type { PlayerStore } from "@/registry/default/hooks/use-player"
import { createPlayerStore } from "@/registry/default/hooks/use-player"

export type TypeMediaStore = PlayerStore & PlaybackRateStore

export interface CreateMediaStoreProps {
  debug?: boolean
}

export function createMediaStore(initProps?: Partial<CreateMediaStoreProps>) {
  const mediaStore = create<TypeMediaStore>()((...etc) => ({
    ...createPlayerStore(...etc),
    ...createPlaybackRateStore(...etc),
    ...initProps,
  }))
  return mediaStore
}

