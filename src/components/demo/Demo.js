import React from 'react';
import styles from './Demo.css';
import Common from './Common';

// const Common = import('./Common');

class Demo extends React.Component {
  render() {
    return (
      <div className={styles.demo}>
        <span>a demo</span>
        <Common/>
        {this.props.children}
      </div>
    );
  }
}

export default Demo;
