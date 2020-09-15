import { User } from './user';

export class IssueComment {
  // authorHref, createdAd and id are ReadOnly in API  
  authorHref: string;
  createdAt: Date;
  id: string;
  text: string;
  // With author object
  author: User;
}