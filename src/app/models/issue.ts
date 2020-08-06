import { Location } from "./location";

export type ImageProtocol = "http://" | "https://";
export type ImageExtension = ".gif" | ".jpg" | ".png";
export type State = "new" | "inProgress" | "rejected" | "resolved";

export class Issue {
  //readonly in API
  assigneeHref: string;
  //readonly in API
  createdAt: Date;
  //readonly in API
  ceatorHref: string;
  description?: string;
  //readonly in API
  href: string;
  //readonly in API
  id: string;
  //TODO : Must contain protocol and extension
  imageUrl?: string
  //TODO : Must contain protocol and extension How to validate (Enums, start with)
  additionalImageUrls?: string[];
  issueTypeHref: string;
  //TODO GeoJSON Point type 
  location: Location;
  //readonly in API
  state: State;
  reason?: string;
  tags?: string[];
  //readonly in API
  updatedAt: Date;
}