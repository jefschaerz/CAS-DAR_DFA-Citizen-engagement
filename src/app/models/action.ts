export type Type = "start" | "reject " | "resolve";

export class Action {
    readonly createdAt: Date;
    readonly id: string;
    readonly href: string;
    readonly issueHref : string ;
    reason? : string;
    type : Type[];
    readonly userHref: string;    
  }