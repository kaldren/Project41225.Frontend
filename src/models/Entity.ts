import { IAuditable } from "./Auditable";

export interface IEntity extends IAuditable {
  id: string;
  isDeleted: boolean;
}
