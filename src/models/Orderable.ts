import { SortDirection } from "@mui/material";

export interface IOrderable<T> {
  orderBy: T;
  orderDirection?: SortDirection;
}
