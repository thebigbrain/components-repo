import React from 'react';
import {Icon, Button} from 'antd';
import Upload from '../upload/Upload';


class Toolbar extends React.Component {
  render() {
    return (
      <Upload action='http://localhost:4000/upload'  multiple directory>
        <Button type='default'><Icon type='upload'/>上传组件</Button>
      </Upload>
    );
  }
}

export default Toolbar;
