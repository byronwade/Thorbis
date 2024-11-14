import { useMemo, useCallback, DependencyList } from "react";
import { FormEvent } from "react";

type FormEventHandler = (e: FormEvent<HTMLFormElement>) => void;
type GenericFunction<T = unknown> = (...args: T[]) => unknown;

export function useMemoizedFunction<T extends FormEventHandler | GenericFunction>(fn: T, deps: DependencyList): T {
	return useCallback(fn, deps);
}

export function useMemoizedValue<T>(factory: () => T, deps: DependencyList): T {
	if (typeof factory !== "function") {
		throw new Error("Factory must be a function");
	}
	return useMemo(factory, deps);
}
