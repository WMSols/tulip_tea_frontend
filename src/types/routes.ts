// types/routes.ts

export interface Route {
  id: number;
  name: string;
  zone_id: number;
  order_booker_id: number | null;
  created_by_distributor: number;
  created_at: string;
}

export interface CreateRouteRequest {
  name: string;
  zone_id: number;
  order_booker_id?: number;
}

export interface UpdateRouteRequest {
  name: string;
  zone_id: number;
  order_booker_id?: number;
}

export interface AssignRouteRequest {
  route_id: number;
  order_booker_id: number;
}

export type RouteFilterType = "distributor" | "zone";

export interface GetRoutesArgs {
  filterType?: RouteFilterType;
  filterId?: number;
}
