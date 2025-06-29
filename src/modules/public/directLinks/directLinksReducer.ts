import { DirectLinksState, DirectLinksAction, DirectLinksActionTypes } from './types';

const initialState: DirectLinksState = {
  items: [],
  loading: false,
  error: null
};

export const directLinksReducer = (
  state = initialState,
  action: DirectLinksAction
): DirectLinksState => {
  switch (action.type) {
    case DirectLinksActionTypes.FETCH_LINKS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case DirectLinksActionTypes.FETCH_LINKS_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload
      };
    case DirectLinksActionTypes.FETCH_LINKS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};
