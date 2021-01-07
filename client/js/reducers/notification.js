import {
  RENEWING_SESSION,
  AUTHENTICATED,
  RENEWED_SESSION
} from '../actions/user';

const initialState = {
  content: ''
};

export default function app(state = initialState, action) {
  switch (action.type) {
    case RENEWING_SESSION:
      return {
        title: 'Authentication',
        content: 'Renewing session...'
      };
    case AUTHENTICATED:
    case RENEWED_SESSION:
      return {
        title: '',
        content: ''
      };
    default:
      return state;
  }
}
