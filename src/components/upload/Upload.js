import React from 'react';
import JSZip from 'jszip';

import Webrpc from '../../runtime/webrpc';


// function readFile(file) {
//   const fileReader = new FileReader();
//   return new Promise((resolve, reject) => {
//     fileReader.onload = () => {
//       resolve(fileReader.result);
//     };
//     fileReader.onabort = () => {
//       reject(fileReader.error);
//     };
//     fileReader.readAsArrayBuffer(file);
//   });
// }

async function zipFiles(fileList) {
  const zip = new JSZip();
  for (let file of fileList) {
    zip.file(file.webkitRelativePath, file);
  }
  return await zip.generateAsync({type: 'blob'});
}

class Upload extends React.Component {
  inputPicker = React.createRef();

  onChange = async (evt) => {
    let content = await zipFiles(evt.target.files);
    let data = await Webrpc.upload(content);
    console.log(data);
  };

  onClick = () => {
    this.inputPicker.current.click();
  };

  render() {
    const {directory, multiple, children} = this.props;

    return (
      <React.Fragment>
        <div className="ant-upload ant-upload-select ant-upload-select-text" onClick={this.onClick}>
          <span tabIndex="0" className="ant-upload" role="button">
            <input
              ref={this.inputPicker}
              type="file"
              multiple={Boolean(multiple)}
              directory={Boolean(directory) ? 'true' : null}
              webkitdirectory={Boolean(directory) ? 'true' : null}
              style={{display: 'none'}}
              onChange={this.onChange}
            />
            {children}
          </span>
        </div>
      </React.Fragment>
    );
  }
}

export default Upload;
