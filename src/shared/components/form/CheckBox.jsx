/* eslint-disable jsx-a11y/label-has-for */
import React, { PureComponent } from 'react';
import CheckIcon from 'mdi-react/CheckIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import classNames from 'classnames';


class CheckBoxField extends PureComponent {
  componentDidMount() {
    const { onChange, defaultChecked } = this.props;
    onChange(defaultChecked);
  }

  render() {
    const {
      disabled, className, name, value, onChange, label, color,
    } = this.props;
    const CheckboxClass = classNames({
      'checkbox-btn': true,
      disabled,
    });

    return (
      <label
        className={`${CheckboxClass} ${className ? ` checkbox-btn--${className}` : ''}`}
        htmlFor={name}
      >
        <input
          className="checkbox-btn__checkbox"
          type="checkbox"
          id={name}
          name={name}
          onChange={onChange}
          checked={value}
          disabled={disabled}
        />
        <span
          className="checkbox-btn__checkbox-custom"
          style={color ? { background: color, borderColor: color } : {}}
        >
          <CheckIcon />
        </span>
        {className === 'button'
          ? (
            <span className="checkbox-btn__label-svg">
              <CheckIcon className="checkbox-btn__label-check" />
              <CloseIcon className="checkbox-btn__label-uncheck" />
            </span>
          ) : ''}
        <span className="checkbox-btn__label">
          {label}
        </span>
      </label>
    );
  }
}

const renderCheckBoxField = (props) => {
  const {
    input, label, defaultChecked, disabled, className, color,
  } = props;
  return (
    <CheckBoxField
      {...input}
      label={label}
      defaultChecked={defaultChecked}
      disabled={disabled}
      className={className}
      color={color}
    />
  );
};

export default renderCheckBoxField;
