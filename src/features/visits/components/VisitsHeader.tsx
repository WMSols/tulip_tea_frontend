export function VisitsHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Field Visits</h1>
        <p className="text-muted-foreground">
          Shop visits and deliveries (live)
        </p>
      </div>
    </div>
  );
}
