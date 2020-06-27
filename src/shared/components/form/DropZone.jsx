import React, { PureComponent } from 'react';
import Dropzone from 'react-dropzone';

class DropZoneField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(file) {
    const { onChange } = this.props;
    onChange(file.map(fl => Object.assign(fl, {
      preview: URL.createObjectURL(fl),
    })));
  }

  removeFile(index, e) {
    const { onChange, value } = this.props;
    e.preventDefault();
    onChange(value.filter((val, i) => i !== index));
  }

  render() {
    const {
      value, customHeight, name,
    } = this.props;

    const files = value;

    return (
      <div className={`dropzone dropzone--single${customHeight ? ' dropzone--custom-height' : ''}`}>
        <Dropzone
          accept="image/jpeg, image/png"
          name={name}
          multiple={false}
          onDrop={(fileToUpload) => {
            this.onDrop(fileToUpload);
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="dropzone__input">
              {(!files || files.length === 0)
              && (
              <div className="dropzone__drop-here">
                <span className="lnr lnr-upload" /> Drop file here to upload
              </div>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>
        {files && Array.isArray(files) && files.length > 0
        && (
        <aside className="dropzone__img">
          <img src={files[0].preview} alt="drop-img" />
          <p className="dropzone__img-name">{files[0].name}</p>
          <button className="dropzone__img-delete" type="button" onClick={e => this.removeFile(0, e)}>
            Remove
          </button>
        </aside>
        )}
      </div>
    );
  }
}

const renderDropZoneField = (props) => {
  const { input, customHeight } = props;
  return (
    <DropZoneField
      {...input}
      customHeight={customHeight}
    />
  );
};

export default renderDropZoneField;
