import { DirectLinksActionTypes, DirectLink, ClickLinkPayload } from './types';

export const fetchDirectLinks = () => ({
  type: DirectLinksActionTypes.FETCH_LINKS_REQUEST,
});

export const fetchDirectLinksSuccess = (links: DirectLink[]) => ({
  type: DirectLinksActionTypes.FETCH_LINKS_SUCCESS,
  payload: links,
});

export const fetchDirectLinksFailure = (error: string) => ({
  type: DirectLinksActionTypes.FETCH_LINKS_FAILURE,
  payload: error,
});

export const clickLink = (payload: ClickLinkPayload) => ({
  type: DirectLinksActionTypes.CLICK_LINK_REQUEST,
  payload,
});

export const clickLinkSuccess = () => ({
  type: DirectLinksActionTypes.CLICK_LINK_SUCCESS,
});

export const clickLinkFailure = (error: string) => ({
  type: DirectLinksActionTypes.CLICK_LINK_FAILURE,
  payload: error,
});
