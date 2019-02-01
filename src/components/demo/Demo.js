import React from 'react';
import styles from './Demo.css';

class Demo extends React.Component {
  render() {
    return (
      <div className={styles.demo}>
        <span>a demo</span>
        {this.props.children}
      </div>
    );
  }
}

export default Demo;
