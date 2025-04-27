import { Moment } from "moment";

export interface IAuditable {
  createdAt?: Moment;
  createdBy?: string;
  updatedAt?: Moment;
  updatedById?: string;
}
