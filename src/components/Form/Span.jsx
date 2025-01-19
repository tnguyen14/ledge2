import React from 'https://esm.sh/react@18.3.1';
import { useSelector } from 'https://esm.sh/react-redux@9.2.0';

function Span() {
  const span = useSelector((state) => state.form.values.budgetSpan);
  return <>{span}</>;
}

export default Span;
