import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ActiveTab } from "../types";
import { zoneLabel } from "../utils/helpers";
import { TAB_OPTIONS } from "../utils/constants";

interface VisitsFiltersProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  filterZone: string;
  onZoneChange: (zone: string) => void;
  zoneOptions: number[];
}

export function VisitsFilters({
  activeTab,
  onTabChange,
  filterZone,
  onZoneChange,
  zoneOptions,
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
        <SelectTrigger className="w-40 bg-card border-border">
          <SelectValue placeholder="Filter by Zone" />
        </SelectTrigger>
        <SelectContent className="bg-card border-border">
          <SelectItem value="all">All Zones</SelectItem>
          {zoneOptions.map((z) => (
            <SelectItem key={z} value={String(z)}>
              {zoneLabel(z)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
