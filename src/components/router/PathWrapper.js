import React from 'react';

export default class PathWrapper extends React.Component {
  render() {
    const {path, children} = this.props;
    return (<React.Fragment path={path}>{children}</React.Fragment>)
  }
}
