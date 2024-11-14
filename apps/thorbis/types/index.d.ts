interface Website {
	id: string;
	name: string;
	url: string;
	status: "active" | "inactive";
	createdAt: Date;
}

interface Deployment {
	id: string;
	name: string;
	status: "success" | "failed" | "pending";
	createdAt: Date;
	websiteId: string;
}

interface ToasterProps {
	className?: string;
	toastOptions?: Record<string, unknown>;
}
