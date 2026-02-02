import { MapPin, ExternalLink } from "lucide-react";
import type { VisitRow } from "../../types";
import { mapsLink } from "../../utils/helpers";

interface LocationLinksProps {
  visit: VisitRow;
}

export function LocationLinks({ visit }: LocationLinksProps) {
  if (visit.kind === "shop_visit") {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> GPS
        </span>
        {mapsLink(visit.gps_lat, visit.gps_lng) ? (
          <a
            href={mapsLink(visit.gps_lat, visit.gps_lng)!}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline flex items-center gap-1"
          >
            View on Map <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Delivery GPS
        </span>
        {mapsLink(visit.delivery_gps_lat, visit.delivery_gps_lng) ? (
          <a
            href={mapsLink(visit.delivery_gps_lat, visit.delivery_gps_lng)!}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline flex items-center gap-1"
          >
            View on Map <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="w-3 h-3" /> Pickup GPS
        </span>
        {mapsLink(visit.pickup_gps_lat, visit.pickup_gps_lng) ? (
          <a
            href={mapsLink(visit.pickup_gps_lat, visit.pickup_gps_lng)!}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline flex items-center gap-1"
          >
            View on Map <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">N/A</span>
        )}
      </div>

      {visit.returned_at && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Return GPS
          </span>
          {mapsLink(visit.return_gps_lat, visit.return_gps_lng) ? (
            <a
              href={mapsLink(visit.return_gps_lat, visit.return_gps_lng)!}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline flex items-center gap-1"
            >
              View on Map <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          )}
        </div>
      )}
    </div>
  );
}
