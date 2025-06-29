export interface DirectLink {
  _id: string;
  title: string;
  url: string;
  icon: string;
}

export interface DirectLinksState {
  items: DirectLink[];
  loading: boolean;
  error: string | null;
}

export enum DirectLinksActionTypes {
  FETCH_LINKS_REQUEST = 'FETCH_LINKS_REQUEST',
  FETCH_LINKS_SUCCESS = 'FETCH_LINKS_SUCCESS',
  FETCH_LINKS_FAILURE = 'FETCH_LINKS_FAILURE',
  CLICK_LINK_REQUEST = 'CLICK_LINK_REQUEST',
  CLICK_LINK_SUCCESS = 'CLICK_LINK_SUCCESS',
  CLICK_LINK_FAILURE = 'CLICK_LINK_FAILURE'
}

export interface ClickLinkPayload {
  id: string;
  userId: string;
  hash: string;
  timestamp: number;
}

export type DirectLinksAction =
  | { type: DirectLinksActionTypes.FETCH_LINKS_REQUEST }
  | { type: DirectLinksActionTypes.FETCH_LINKS_SUCCESS; payload: DirectLink[] }
  | { type: DirectLinksActionTypes.FETCH_LINKS_FAILURE; payload: string }
  | { type: DirectLinksActionTypes.CLICK_LINK_REQUEST; payload: ClickLinkPayload }
  | { type: DirectLinksActionTypes.CLICK_LINK_SUCCESS }
  | { type: DirectLinksActionTypes.CLICK_LINK_FAILURE; payload: string };
