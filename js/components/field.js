import React from 'https://cdn.skypack.dev/react@16';
import { InfoIcon } from 'https://cdn.skypack.dev/@primer/octicons-react@11';
import OverlayTrigger from 'https://cdn.skypack.dev/react-bootstrap@1/OverlayTrigger';
import Tooltip from 'https://cdn.skypack.dev/react-bootstrap@1/Tooltip';
import classnames from 'https://cdn.skypack.dev/classnames@2';
import reactResponsive from 'https://cdn.skypack.dev/react-responsive@8';
const { useMediaQuery } = reactResponsive;

const inputTypes = ['text', 'date', 'time', 'number', 'hidden'];
function Field(props) {
  const {
    type,
    label,
    name,
    hint,
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
  const isSmallScreen = useMediaQuery({
    query: '(max-width: 42.5em)'
  });
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
      />
    );
  }
  // no wrapper for hidden element
  if (type === 'hidden') {
    return inputEl;
  }
  return (
    <div className="form-group" data-form-name={name}>
      <label
        className={classnames('control-label', {
          'sr-only': isSmallScreen
        })}
      >
        {label}
      </label>
      <div className="input-group">
        {hint && (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip id={`${name}-hint`}>{hint}</Tooltip>}
          >
            <div className="input-group-prepend hint">
              <div className="input-group-text">
                <InfoIcon />
              </div>
            </div>
          </OverlayTrigger>
        )}
        {inputEl}
        {afterButton && (
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              tabIndex={tabindex}
              onClick={() => {
                if (afterButtonAction) {
                  afterButtonAction();
                }
              }}
            >
              {afterButton}
            </button>
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
