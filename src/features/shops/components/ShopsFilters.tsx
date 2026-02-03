import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActiveTab, Zone } from "../types";
import { TAB_OPTIONS } from "../utils/constants";

interface ShopsFiltersProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  filterZone: string;
  onZoneChange: (zone: string) => void;
  zoneOptions: Zone[];
}

export function ShopsFilters({
  activeTab,
  onTabChange,
  filterZone,
  onZoneChange,
  zoneOptions,
}: ShopsFiltersProps) {
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
        <SelectTrigger className="w-40 bg-card border-border">
          <SelectValue placeholder="Filter by Zone" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Zones</SelectItem>
          {zoneOptions.map((z) => (
            <SelectItem key={z.id} value={z.name}>
              {z.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
