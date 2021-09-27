import React, {
  useEffect,
  useRef,
  useState,
  useCallback
} from 'https://cdn.skypack.dev/react@17';
import {
  useSelector,
  useDispatch
} from 'https://cdn.skypack.dev/react-redux@7';
import Button from 'https://cdn.skypack.dev/react-bootstrap@1/Button';
import {
  FoldUpIcon,
  FoldDownIcon,
  SearchIcon
} from 'https://cdn.skypack.dev/@primer/octicons-react@15';
import Field from './Field.js';
import {
  submit,
  submitFailure,
  inputChange,
  resetForm,
  updateDefaultValue,
  setSearch
} from '../../actions/form.js';
import {
  addTransaction,
  updateTransaction
} from '../../actions/transactions.js';
import { setSearchMode } from '../../actions/app.js';

function calculateString(str) {
  return Function(`"use strict"; return(${str})`)();
}

function TypeSelector(props) {
  const { value, options } = props;
  const dispatch = useDispatch();
  return (
    <select
      placeholder="transaction"
      className="form-control type-selector"
      name="type"
      onChange={(event) => {
        dispatch(inputChange('type', event.target.value));
      }}
      value={value}
    >
      {options.map((option) => (
        <option key={option.slug} value={option.slug}>
          {option.value}
        </option>
      ))}
    </select>
  );
}

function Form(props) {
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const appReady = useSelector((state) => state.app.appReady);
  const datalists = useSelector((state) => ({
    'merchants-list': state.account.merchants
  }));
  const { fields, action, values, pending } = useSelector(
    (state) => state.form
  );
  const type = values.type;
  const fieldOptions = useSelector((state) => ({
    category: state.account.categories[type] || [],
    source: state.account.sources[type] || [],
    types: [...state.account.types.out].concat(state.account.types.in)
  }));

  useEffect(() => {
    if (appReady) {
      dispatch(updateDefaultValue('type', 'regular-expense'));
    }
  }, [appReady]);
  useEffect(() => {
    if (fieldOptions.category.length) {
      dispatch(updateDefaultValue('category', fieldOptions.category[0].slug));
    }
    if (fieldOptions.source.length) {
      dispatch(updateDefaultValue('source', fieldOptions.source[0].slug));
    }
  }, [type]);

  const prevMerchantRef = useRef();
  useEffect(() => {
    prevMerchantRef.current = values.merchant;
  }, [action]);

  let amountFieldRef = null;

  useEffect(() => {
    if (amountFieldRef) {
      amountFieldRef.focus();
    }
  }, [values.amount]);

  const buttonAttrs = {
    disabled: Boolean(pending)
  };

  const submitForm = useCallback(
    (event) => {
      event.preventDefault();
      try {
        if (action == 'search') {
          dispatch(setSearch(values));
        } else if (action == 'update') {
          dispatch(submit());
          dispatch(updateTransaction(values, prevMerchantRef.current));
        } else {
          dispatch(submit());
          dispatch(addTransaction(values));
        }
      } catch (err) {
        dispatch(submitFailure(err));
      }
    },
    [action, values]
  );

  return (
    <form className="new-transaction" method="POST">
      <div className="form-header">
        <div className="form-modes">
          <Button
            variant={action == 'search' ? 'info' : 'outline-info'}
            onClick={() => {
              dispatch(setSearchMode(action != 'search'));
            }}
          >
            <SearchIcon />
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            {collapsed ? <FoldDownIcon /> : <FoldUpIcon />}
          </Button>
        </div>
        {collapsed ? (
          ''
        ) : (
          <h2>
            <span className="title-action">{action}</span>{' '}
            <TypeSelector value={type} options={fieldOptions.types} />
          </h2>
        )}
      </div>
      {!collapsed && (
        <>
          {fields.map((field) => {
            if (field.attributes && field.attributes.list) {
              field.datalist = datalists[field.attributes.list];
            }
            if (fieldOptions[field.name]) {
              field.options = fieldOptions[field.name];
            }
            return (
              <Field
                inputRef={(input) => {
                  if (field.name == 'amount') {
                    amountFieldRef = input;
                  }
                }}
                key={field.name}
                handleChange={(event) => {
                  dispatch(inputChange(field.name, event.target.value));
                }}
                afterButtonAction={() => {
                  if (field.name == 'calculate') {
                    if (!values.calculate) {
                      return;
                    }
                    const newAmount = calculateString(values.calculate).toFixed(
                      2
                    );

                    dispatch(inputChange('amount', newAmount));
                  }
                }}
                disabled={!appReady}
                {...field}
              />
            );
          })}
          <div className="actions">
            <Button
              variant="primary"
              type="submit"
              onClick={submitForm}
              {...buttonAttrs}
            >
              {action}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={() => dispatch(resetForm())}
              {...buttonAttrs}
            >
              Reset
            </Button>
          </div>
        </>
      )}
    </form>
  );
}

export default Form;
