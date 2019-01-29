import React from 'react';

class Provider extends React.Component {
  render() {
    const {className, children} = this.props;
    return (
      <div className={className}>{children}</div>
    )
  }
}

export default {
  Provider
}
