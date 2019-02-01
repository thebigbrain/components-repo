import React from 'react';
import {Empty} from 'antd';

class Preview extends React.Component {
  render() {
    const {story} = this.props;
    let c = story && story.render && story.render();
    return (
      <div className='preview'>{c || (<Empty/>)}</div>
    );
  }
}

export default Preview;
