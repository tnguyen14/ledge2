import { useState } from 'https://cdn.skypack.dev/react@17';

export default function useToggle(defaultValue = false) {
  var [state, setState] = useState(defaultValue);
  var toggleFunction = function () {
    setState(!state);
  };
  return [state, toggleFunction];
}
