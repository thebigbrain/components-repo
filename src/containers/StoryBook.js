import React from 'react';
import {flattenStorybook} from '../stories';

const StorybookContext = React.createContext();

class StorybookProvider extends React.Component {
  state = {
    stories: null
  };

  constructor(props) {
    super(props);
    setTimeout(() => {
      this.setState({stories: flattenStorybook()});
    }, 300);
  }

  render() {
    if (!this.state.stories) return null;
    const {children} = this.props;
    return (
      <StorybookContext.Provider value={this.state.stories}>
        {typeof children === 'function' ? children(this.state.stories) : children}
      </StorybookContext.Provider>
    );
  }
}

export default {
  Provider: StorybookProvider,
  Consumer: StorybookContext.Consumer
};
