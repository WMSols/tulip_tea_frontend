import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActiveTab } from "../types";
import { TAB_OPTIONS } from "../utils/constants";

interface ZoneOption {
  id: number;
  name: string;
}

interface RouteOption {
  id: number;
  name: string;
}

interface VisitsFiltersProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  filterZone: string;
  onZoneChange: (zone: string) => void;
  zoneOptions: ZoneOption[];
  filterRoute: string;
  onRouteChange: (route: string) => void;
  routeOptions: RouteOption[];
}

export function VisitsFilters({
  activeTab,
  onTabChange,
  filterZone,
  onZoneChange,
  zoneOptions,
  filterRoute,
  onRouteChange,
  routeOptions,
}: VisitsFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as ActiveTab)}
      >
        <TabsList className="bg-muted/50">
          {TAB_OPTIONS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-card"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Select value={filterZone} onValueChange={onZoneChange}>
        <SelectTrigger className="w-44 bg-card border-border">
          <SelectValue placeholder="Filter by Zone" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Zones</SelectItem>
          {zoneOptions.map((z) => (
            <SelectItem key={z.id} value={String(z.id)}>
              {z.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filterRoute}
        onValueChange={onRouteChange}
        disabled={routeOptions.length === 0}
      >
        <SelectTrigger className="w-44 bg-card border-border">
          <SelectValue
            placeholder={
              routeOptions.length === 0
                ? "No routes available"
                : "Filter by Route"
            }
          />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Routes</SelectItem>
          {routeOptions.map((r) => (
            <SelectItem key={r.id} value={r.name}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
