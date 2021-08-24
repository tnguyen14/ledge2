import React, { useRef, useEffect } from 'https://cdn.skypack.dev/react@17';
import { InfoIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import Tooltip from 'https://cdn.skypack.dev/@material-ui/core@4/Tooltip';

const inputTypes = ['text', 'date', 'time', 'number', 'hidden'];
function Field(props) {
  const {
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
        {options.map((option) => {
          return (
            <option key={option.slug} value={option.slug}>
              {option.value}
            </option>
          );
        })}
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
    <div className="form-group" data-form-name={name}>
      <label className="control-label">{label}</label>
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
