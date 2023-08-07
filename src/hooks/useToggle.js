import { useState } from 'https://esm.sh/react@18';

export default function useToggle(defaultValue = false) {
  var [state, setState] = useState(defaultValue);
  var toggleFunction = function () {
    setState(!state);
  };
  return [state, toggleFunction];
}
