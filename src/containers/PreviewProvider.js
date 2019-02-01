import React from 'react';
import {Empty} from 'antd';
import Preview from '../components/preview/Preview';
import StoryBook from './StoryBook';


class PreviewProvider extends React.Component {
  renderPreview = (stories, storyId) => {
    if (!storyId) return (<Empty/>);
    let story = stories.get(storyId);
    return (<Preview story={story}/>);
  };

  render() {
    const {storyId} = this.props;

    return (
      <StoryBook.Consumer>
        {(stories) => this.renderPreview(stories, storyId)}
      </StoryBook.Consumer>
    );
  }
}

export default PreviewProvider;
