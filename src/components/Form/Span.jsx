import React from 'react';
import { useSelector } from 'react-redux';

function Span() {
  const span = useSelector((state) => state.form.values.budgetSpan);
  return <>{span}</>;
}

export default Span;
