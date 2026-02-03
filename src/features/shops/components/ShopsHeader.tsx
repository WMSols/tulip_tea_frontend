export function ShopsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Shops Management</h1>
        <p className="text-muted-foreground">
          Manage registered shops and pending approvals
        </p>
      </div>
    </div>
  );
}
