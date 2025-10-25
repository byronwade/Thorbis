export default function CommunicationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Communication</h1>
        <p className="text-muted-foreground">
          Manage all your customer communications in one place
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Unified Inbox</h3>
          <p className="text-muted-foreground text-sm">
            All messages in one place
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Phone Calls</h3>
          <p className="text-muted-foreground text-sm">
            Manage incoming and outgoing calls
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Text Messages</h3>
          <p className="text-muted-foreground text-sm">
            SMS communication with customers
          </p>
        </div>

        <div className="rounded-lg border p-6">
          <h3 className="font-semibold text-lg">Email Management</h3>
          <p className="text-muted-foreground text-sm">
            Professional email communications
          </p>
        </div>
      </div>
    </div>
  );
}
