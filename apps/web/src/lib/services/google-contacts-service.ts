/**
 * Google People (Contacts) API Service
 *
 * Contact management and directory services.
 * Requires OAuth 2.0 for user-specific operations.
 *
 * Features:
 * - Read contacts
 * - Create and update contacts
 * - Contact groups management
 * - Directory search
 * - Sync contacts
 *
 * @see https://developers.google.com/people/api/rest
 */

// Types
export interface Person {
	resourceName: string;
	etag?: string;
	metadata?: PersonMetadata;
	names?: Name[];
	nicknames?: Nickname[];
	photos?: Photo[];
	birthdays?: Birthday[];
	addresses?: Address[];
	emailAddresses?: EmailAddress[];
	phoneNumbers?: PhoneNumber[];
	organizations?: Organization[];
	occupations?: Occupation[];
	urls?: Url[];
	biographies?: Biography[];
	relations?: Relation[];
	events?: Event[];
	memberships?: Membership[];
	userDefined?: UserDefined[];
}

export interface PersonMetadata {
	sources: Source[];
	previousResourceNames?: string[];
	deleted?: boolean;
	linkedPeopleResourceNames?: string[];
	objectType?: "OBJECT_TYPE_UNSPECIFIED" | "PERSON" | "PAGE";
}

export interface Source {
	type:
		| "SOURCE_TYPE_UNSPECIFIED"
		| "ACCOUNT"
		| "PROFILE"
		| "DOMAIN_PROFILE"
		| "CONTACT"
		| "OTHER_CONTACT"
		| "DOMAIN_CONTACT";
	id: string;
	etag?: string;
	updateTime?: string;
}

export interface Name {
	metadata?: FieldMetadata;
	displayName?: string;
	displayNameLastFirst?: string;
	familyName?: string;
	givenName?: string;
	middleName?: string;
	honorificPrefix?: string;
	honorificSuffix?: string;
	phoneticFullName?: string;
	phoneticFamilyName?: string;
	phoneticGivenName?: string;
	phoneticMiddleName?: string;
	phoneticHonorificPrefix?: string;
	phoneticHonorificSuffix?: string;
	unstructuredName?: string;
}

export interface FieldMetadata {
	primary?: boolean;
	verified?: boolean;
	source?: Source;
	sourcePrimary?: boolean;
}

export interface Nickname {
	metadata?: FieldMetadata;
	value?: string;
	type?:
		| "DEFAULT"
		| "MAIDEN_NAME"
		| "INITIALS"
		| "GPLUS"
		| "OTHER_NAME"
		| "ALTERNATE_NAME"
		| "SHORT_NAME";
}

export interface Photo {
	metadata?: FieldMetadata;
	url?: string;
	default?: boolean;
}

export interface Birthday {
	metadata?: FieldMetadata;
	date?: Date;
	text?: string;
}

export interface Date {
	year?: number;
	month?: number;
	day?: number;
}

export interface Address {
	metadata?: FieldMetadata;
	formattedValue?: string;
	type?: string;
	formattedType?: string;
	poBox?: string;
	streetAddress?: string;
	extendedAddress?: string;
	city?: string;
	region?: string;
	postalCode?: string;
	country?: string;
	countryCode?: string;
}

export interface EmailAddress {
	metadata?: FieldMetadata;
	value?: string;
	type?: string;
	formattedType?: string;
	displayName?: string;
}

export interface PhoneNumber {
	metadata?: FieldMetadata;
	value?: string;
	canonicalForm?: string;
	type?: string;
	formattedType?: string;
}

export interface Organization {
	metadata?: FieldMetadata;
	type?: string;
	formattedType?: string;
	startDate?: Date;
	endDate?: Date;
	current?: boolean;
	name?: string;
	phoneticName?: string;
	department?: string;
	title?: string;
	jobDescription?: string;
	symbol?: string;
	domain?: string;
	location?: string;
	costCenter?: string;
	fullTimeEquivalentMillipercent?: number;
}

export interface Occupation {
	metadata?: FieldMetadata;
	value?: string;
}

export interface Url {
	metadata?: FieldMetadata;
	value?: string;
	type?: string;
	formattedType?: string;
}

export interface Biography {
	metadata?: FieldMetadata;
	value?: string;
	contentType?: "CONTENT_TYPE_UNSPECIFIED" | "TEXT_PLAIN" | "TEXT_HTML";
}

export interface Relation {
	metadata?: FieldMetadata;
	person?: string;
	type?: string;
	formattedType?: string;
}

export interface Event {
	metadata?: FieldMetadata;
	date?: Date;
	type?: string;
	formattedType?: string;
}

export interface Membership {
	metadata?: FieldMetadata;
	contactGroupMembership?: {
		contactGroupId?: string;
		contactGroupResourceName?: string;
	};
	domainMembership?: {
		inViewerDomain?: boolean;
	};
}

export interface UserDefined {
	metadata?: FieldMetadata;
	key?: string;
	value?: string;
}

export interface ContactGroup {
	resourceName: string;
	etag?: string;
	metadata?: {
		updateTime?: string;
		deleted?: boolean;
	};
	groupType?:
		| "GROUP_TYPE_UNSPECIFIED"
		| "USER_CONTACT_GROUP"
		| "SYSTEM_CONTACT_GROUP";
	name?: string;
	formattedName?: string;
	memberResourceNames?: string[];
	memberCount?: number;
	clientData?: { key: string; value: string }[];
}

export interface ListConnectionsResponse {
	connections?: Person[];
	nextPageToken?: string;
	nextSyncToken?: string;
	totalPeople?: number;
	totalItems?: number;
}

export interface SearchResponse {
	results?: { person: Person }[];
}

export interface BatchGetResponse {
	responses: { person?: Person; requestedResourceName?: string }[];
}

// Service implementation
class GoogleContactsService {
	private readonly baseUrl = "https://people.googleapis.com/v1";

	/**
	 * Check if service is configured
	 */
	isConfigured(): boolean {
		return true; // Requires OAuth at runtime
	}

	/**
	 * Get the authenticated user's profile
	 */
	async getProfile(accessToken: string): Promise<Person | null> {
		try {
			const personFields = "names,emailAddresses,phoneNumbers,photos";
			const response = await fetch(
				`${this.baseUrl}/people/me?personFields=${personFields}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contacts get profile error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts get profile error:", error);
			return null;
		}
	}

	/**
	 * List user's contacts
	 */
	async listContacts(
		accessToken: string,
		options: {
			pageSize?: number;
			pageToken?: string;
			personFields?: string;
			sortOrder?:
				| "LAST_MODIFIED_ASCENDING"
				| "LAST_MODIFIED_DESCENDING"
				| "FIRST_NAME_ASCENDING"
				| "LAST_NAME_ASCENDING";
		} = {},
	): Promise<ListConnectionsResponse | null> {
		try {
			const params = new URLSearchParams();
			params.set(
				"personFields",
				options.personFields ||
					"names,emailAddresses,phoneNumbers,organizations,addresses",
			);
			params.set("pageSize", String(options.pageSize || 100));
			if (options.pageToken) params.set("pageToken", options.pageToken);
			if (options.sortOrder) params.set("sortOrder", options.sortOrder);

			const response = await fetch(
				`${this.baseUrl}/people/me/connections?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contacts list error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts list error:", error);
			return null;
		}
	}

	/**
	 * Get a specific contact
	 */
	async getContact(
		accessToken: string,
		resourceName: string,
		personFields?: string,
	): Promise<Person | null> {
		try {
			const fields =
				personFields ||
				"names,emailAddresses,phoneNumbers,organizations,addresses,photos,birthdays,biographies";
			const response = await fetch(
				`${this.baseUrl}/${resourceName}?personFields=${fields}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contacts get error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts get error:", error);
			return null;
		}
	}

	/**
	 * Create a new contact
	 */
	async createContact(
		accessToken: string,
		contact: Partial<Person>,
	): Promise<Person | null> {
		try {
			const response = await fetch(`${this.baseUrl}/people:createContact`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(contact),
			});

			if (!response.ok) {
				console.error("Contacts create error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts create error:", error);
			return null;
		}
	}

	/**
	 * Update a contact
	 */
	async updateContact(
		accessToken: string,
		resourceName: string,
		contact: Partial<Person>,
		updatePersonFields: string,
	): Promise<Person | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${resourceName}:updateContact?updatePersonFields=${updatePersonFields}`,
				{
					method: "PATCH",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(contact),
				},
			);

			if (!response.ok) {
				console.error("Contacts update error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts update error:", error);
			return null;
		}
	}

	/**
	 * Delete a contact
	 */
	async deleteContact(
		accessToken: string,
		resourceName: string,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${resourceName}:deleteContact`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Contacts delete error:", error);
			return false;
		}
	}

	/**
	 * Search contacts
	 */
	async searchContacts(
		accessToken: string,
		query: string,
		pageSize = 30,
	): Promise<SearchResponse | null> {
		try {
			const params = new URLSearchParams();
			params.set("query", query);
			params.set("pageSize", String(pageSize));
			params.set("readMask", "names,emailAddresses,phoneNumbers,organizations");

			const response = await fetch(
				`${this.baseUrl}/people:searchContacts?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contacts search error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts search error:", error);
			return null;
		}
	}

	/**
	 * Batch get contacts
	 */
	async batchGetContacts(
		accessToken: string,
		resourceNames: string[],
		personFields?: string,
	): Promise<BatchGetResponse | null> {
		try {
			const params = new URLSearchParams();
			resourceNames.forEach((name) => params.append("resourceNames", name));
			params.set(
				"personFields",
				personFields || "names,emailAddresses,phoneNumbers",
			);

			const response = await fetch(
				`${this.baseUrl}/people:batchGet?${params.toString()}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contacts batch get error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contacts batch get error:", error);
			return null;
		}
	}

	/**
	 * List contact groups
	 */
	async listContactGroups(
		accessToken: string,
		pageSize = 100,
	): Promise<{ contactGroups: ContactGroup[] } | null> {
		try {
			const response = await fetch(
				`${this.baseUrl}/contactGroups?pageSize=${pageSize}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			);

			if (!response.ok) {
				console.error("Contact groups list error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contact groups list error:", error);
			return null;
		}
	}

	/**
	 * Create a contact group
	 */
	async createContactGroup(
		accessToken: string,
		name: string,
	): Promise<ContactGroup | null> {
		try {
			const response = await fetch(`${this.baseUrl}/contactGroups`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					contactGroup: { name },
				}),
			});

			if (!response.ok) {
				console.error("Contact group create error:", await response.text());
				return null;
			}

			return await response.json();
		} catch (error) {
			console.error("Contact group create error:", error);
			return null;
		}
	}

	/**
	 * Add contact to group
	 */
	async addContactToGroup(
		accessToken: string,
		contactResourceName: string,
		groupResourceName: string,
	): Promise<boolean> {
		try {
			const response = await fetch(
				`${this.baseUrl}/${groupResourceName}/members:modify`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						resourceNamesToAdd: [contactResourceName],
					}),
				},
			);

			return response.ok;
		} catch (error) {
			console.error("Add to group error:", error);
			return false;
		}
	}

	// ============================================
	// Field Service Specific Methods
	// ============================================

	/**
	 * Create a customer contact
	 */
	async createCustomerContact(
		accessToken: string,
		customer: {
			firstName: string;
			lastName: string;
			email?: string;
			phone?: string;
			address?: {
				street: string;
				city: string;
				state: string;
				zip: string;
			};
			company?: string;
			notes?: string;
		},
	): Promise<Person | null> {
		const contact: Partial<Person> = {
			names: [
				{
					givenName: customer.firstName,
					familyName: customer.lastName,
				},
			],
		};

		if (customer.email) {
			contact.emailAddresses = [{ value: customer.email, type: "home" }];
		}

		if (customer.phone) {
			contact.phoneNumbers = [{ value: customer.phone, type: "mobile" }];
		}

		if (customer.address) {
			contact.addresses = [
				{
					streetAddress: customer.address.street,
					city: customer.address.city,
					region: customer.address.state,
					postalCode: customer.address.zip,
					country: "US",
					type: "home",
				},
			];
		}

		if (customer.company) {
			contact.organizations = [{ name: customer.company }];
		}

		if (customer.notes) {
			contact.biographies = [
				{ value: customer.notes, contentType: "TEXT_PLAIN" },
			];
		}

		return this.createContact(accessToken, contact);
	}

	/**
	 * Create a vendor contact
	 */
	async createVendorContact(
		accessToken: string,
		vendor: {
			companyName: string;
			contactName?: string;
			email?: string;
			phone?: string;
			address?: {
				street: string;
				city: string;
				state: string;
				zip: string;
			};
			website?: string;
			category?: string;
		},
	): Promise<Person | null> {
		const contact: Partial<Person> = {
			names: [
				{
					givenName: vendor.contactName || vendor.companyName,
				},
			],
			organizations: [{ name: vendor.companyName }],
		};

		if (vendor.email) {
			contact.emailAddresses = [{ value: vendor.email, type: "work" }];
		}

		if (vendor.phone) {
			contact.phoneNumbers = [{ value: vendor.phone, type: "work" }];
		}

		if (vendor.address) {
			contact.addresses = [
				{
					streetAddress: vendor.address.street,
					city: vendor.address.city,
					region: vendor.address.state,
					postalCode: vendor.address.zip,
					country: "US",
					type: "work",
				},
			];
		}

		if (vendor.website) {
			contact.urls = [{ value: vendor.website, type: "work" }];
		}

		if (vendor.category) {
			contact.userDefined = [
				{ key: "Vendor Category", value: vendor.category },
			];
		}

		return this.createContact(accessToken, contact);
	}

	/**
	 * Search for customer by phone or email
	 */
	async findCustomer(accessToken: string, query: string): Promise<Person[]> {
		const result = await this.searchContacts(accessToken, query);
		return result?.results?.map((r) => r.person) || [];
	}

	/**
	 * Sync contacts to CRM format
	 */
	async exportContactsForCRM(accessToken: string): Promise<
		{
			name: string;
			email: string | null;
			phone: string | null;
			company: string | null;
			address: string | null;
		}[]
	> {
		const result = await this.listContacts(accessToken, {
			pageSize: 1000,
			personFields: "names,emailAddresses,phoneNumbers,organizations,addresses",
		});

		if (!result?.connections) return [];

		return result.connections.map((contact) => ({
			name: contact.names?.[0]?.displayName || "Unknown",
			email: contact.emailAddresses?.[0]?.value || null,
			phone: contact.phoneNumbers?.[0]?.value || null,
			company: contact.organizations?.[0]?.name || null,
			address: contact.addresses?.[0]?.formattedValue || null,
		}));
	}

	/**
	 * Create groups for field service organization
	 */
	async setupFieldServiceGroups(accessToken: string): Promise<{
		customers?: ContactGroup;
		vendors?: ContactGroup;
		technicians?: ContactGroup;
	}> {
		const groups: {
			customers?: ContactGroup;
			vendors?: ContactGroup;
			technicians?: ContactGroup;
		} = {};

		groups.customers =
			(await this.createContactGroup(accessToken, "Customers")) || undefined;
		groups.vendors =
			(await this.createContactGroup(accessToken, "Vendors")) || undefined;
		groups.technicians =
			(await this.createContactGroup(accessToken, "Technicians")) || undefined;

		return groups;
	}
}

// Export singleton instance
export const googleContactsService = new GoogleContactsService();
