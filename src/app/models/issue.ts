import { Location } from "./location";

export type ImageProtocol = "http://" | "https://";
export type ImageExtension = ".gif" | ".jpg" | ".png";
export type State = "new" | "inProgress" | "rejected" | "resolved";

export class Issue {
  readonly assigneeHref: string;
  readonly createdAt: Date;
  readonly creatorHref: string;
  description?: string;
  readonly href: string;
  readonly id: string;
  //TODO : Must contain protocol and extension
  imageUrl?: string
  //TODO : Must contain protocol and extension How to validate (Enums, start with)
  additionalImageUrls?: string[];
  issueTypeHref: string;
  //TODO GeoJSON Point type 
  location: Location;
  state: State; //readonly in API
  reason?: string;
  tags?: string[];
  readonly updatedAt: Date;
}