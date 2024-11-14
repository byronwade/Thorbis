"use client";

import { createContext, useContext, ReactNode } from "react";

interface EdgeStoreContextType {
	store: {
		get: (key: string) => Promise<unknown>;
		set: (key: string, value: unknown) => Promise<void>;
	};
}

const defaultStore = {
	get: async () => null,
	set: async () => undefined,
};

const EdgeStoreContext = createContext<EdgeStoreContextType>({
	store: defaultStore,
});

export function EdgeStoreProvider({ children }: { children: ReactNode }) {
	return (
		<EdgeStoreContext.Provider
			value={{
				store: defaultStore,
			}}
		>
			{children}
		</EdgeStoreContext.Provider>
	);
}

export function useEdgeStore() {
	const context = useContext(EdgeStoreContext);
	if (!context) {
		throw new Error("useEdgeStore must be used within an EdgeStoreProvider");
	}
	return context;
}
