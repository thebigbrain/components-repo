import React from 'react';
import {List} from 'antd';
import StoryBook from '../../containers/StoryBook';
import addons from '@storybook/addons';
// import Events from '@storybook/core-events';
import {Link} from '@reach/router';


function toText(v){
  return `"${v.kind}"."${v.name}"`;
}

class ComponentRepo extends React.Component {
  renderItem = (item) => {
    return (
      <Link to={`preview/${item.id}`}>
        <List.Item>{toText(item)}</List.Item>
      </Link>
    )
  };

  renderList = (stories) => {
    return (
      <List
        dataSource={stories.values()}
        renderItem={this.renderItem}
      />
    );
  };

  constructor(props) {
    super(props);

    this.channel = addons.getChannel();

    // this.channel.emit(Events.SET_CURRENT_STORY);
  }

  render() {
    return (
      <StoryBook.Consumer>{this.renderList}</StoryBook.Consumer>
    );
  }
}

export default ComponentRepo;
