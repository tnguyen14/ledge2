import React from 'react';
import classnames from 'https://esm.sh/classnames@2';
import { InfoIcon } from 'https://esm.sh/@primer/octicons-react@15';
import Button from 'react-bootstrap/Button';
import Tooltip from '@mui/material/Tooltip';

const inputTypes = ['text', 'date', 'time', 'number', 'hidden', 'range'];
function Field(props) {
  const {
    className,
    type,
    label,
    name,
    hint,
    disabled,
    attributes,
    value,
    options,
    placeholder,
    handleChange,
    datalist,
    inputRef,
    afterButton,
    afterButtonAction,
    tabindex = 0
  } = props;

  let inputEl;
  if (inputTypes.includes(type)) {
    inputEl = (
      <input
        className="form-control"
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        ref={inputRef}
        placeholder={placeholder}
        tabIndex={tabindex}
        disabled={disabled}
        {...attributes}
      />
    );
  } else if (type === 'select') {
    inputEl = (
      <select
        className="form-control"
        name={name}
        value={value}
        onChange={handleChange}
        ref={inputRef}
        tabIndex={tabindex}
        disabled={disabled}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.value}
          </option>
        ))}
      </select>
    );
  } else if (type === 'textarea') {
    inputEl = (
      <textarea
        className="form-control"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        ref={inputRef}
        tabIndex={tabindex}
        disabled={disabled}
      />
    );
  }
  // no wrapper for hidden element
  if (type === 'hidden') {
    return inputEl;
  }
  return (
    <div
      className={classnames('form-group', {
        [className]: className
      })}
      data-form-name={name}
    >
      {label && <label className="control-label">{label}</label>}
      <div className="input-group">
        {hint && (
          <Tooltip title={hint}>
            <div className="input-group-text hint">
              <InfoIcon />
            </div>
          </Tooltip>
        )}
        {inputEl}
        {afterButton && (
          <div className="input-group-append">
            <Button
              variant="outline-secondary"
              tabIndex={tabindex}
              onClick={() => {
                if (afterButtonAction) {
                  afterButtonAction();
                }
              }}
            >
              {afterButton}
            </Button>
          </div>
        )}
        {datalist && (
          <datalist id={attributes.list}>
            {datalist.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </datalist>
        )}
      </div>
    </div>
  );
}

export default Field;
