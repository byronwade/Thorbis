import { create } from "zustand";

/**
 * Dialer Store - Manages phone dialer state
 *
 * Allows programmatic control of the phone dropdown:
 * - Open dialer with pre-filled phone number
 * - Pre-select customer
 * - Keyboard shortcuts support
 */

interface DialerState {
	isOpen: boolean;
	phoneNumber: string;
	customerId: string | null;
	customerName: string | null;
}

interface DialerActions {
	openDialer: (
		phoneNumber?: string,
		customerId?: string,
		customerName?: string,
	) => void;
	closeDialer: () => void;
	setPhoneNumber: (phoneNumber: string) => void;
	reset: () => void;
}

export type DialerStore = DialerState & DialerActions;

const initialState: DialerState = {
	isOpen: false,
	phoneNumber: "",
	customerId: null,
	customerName: null,
};

export const useDialerStore = create<DialerStore>((set) => ({
	...initialState,

	openDialer: (phoneNumber = "", customerId = null, customerName = null) =>
		set({
			isOpen: true,
			phoneNumber,
			customerId,
			customerName,
		}),

	closeDialer: () =>
		set({
			isOpen: false,
		}),

	setPhoneNumber: (phoneNumber) =>
		set({
			phoneNumber,
		}),

	reset: () => set(initialState),
}));
