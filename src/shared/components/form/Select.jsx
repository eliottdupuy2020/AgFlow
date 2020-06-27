import React, { PureComponent } from 'react';
import Select from 'react-select';

class SelectField extends PureComponent {
  handleChange = (selectedOption) => {
    const { onChange } = this.props;
    onChange(selectedOption);
  };

  render() {
    const {
      value, name, placeholder, options,
    } = this.props;

    return (
      <Select
        name={name}
        value={value}
        onChange={this.handleChange}
        options={options}
        clearable={false}
        className="react-select"
        placeholder={placeholder}
        classNamePrefix="react-select"
      />
    );
  }
}

const renderSelectField = (props) => {
  const {
    input, meta, options, placeholder, className,
  } = props;
  return (
    <div className={`form__form-group-input-wrap ${className}`}>
      <SelectField
        {...input}
        options={options}
        placeholder={placeholder}
      />
      {meta.touched && meta.error && <span className="form__form-group-error">{meta.error}</span>}
    </div>
  );
};

export default renderSelectField;
