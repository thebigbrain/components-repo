import React from 'react';
import {Empty} from 'antd';


class Fetch extends React.Component {
  state = {
    data: null
  };

  render() {
    if (this.state.data == null) return <Empty/>;

    const {children} = this.props;

    return (
      <React.Fragment>
        {typeof children === 'function' ? children(this.state.data): <Empty/>}
      </React.Fragment>
    );
  }
}

export default Fetch;
