import React from 'https://cdn.skypack.dev/react@17';
import { useSelector } from 'https://cdn.skypack.dev/react-redux@7';

function Span() {
  const span = useSelector((state) => state.form.values.budgetSpan);
  return <>{span}</>;
}

export default Span;
