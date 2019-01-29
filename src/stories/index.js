import {configure, getStorybook as _getStorybook} from '@storybook/react';
import * as StoryUtil from './utils';
import Events from '@storybook/core-events';

export const getStorybook = _getStorybook;
const StoryStore = new Map();


function loadStories() {
  const reqStories = require.context('../components', true, /\.stories\.js$/);
  reqStories.keys().forEach(filename => reqStories(filename));
}

configure(loadStories, module);

export function configureStory(api) {
  let stories = getStorybook().map(v => {
    return {
      kind: v.kind,
      stories: v.stories.map(s => {
        StoryStore.set(StoryUtil.toStoryID(v.kind, s.name), s);
        return s.name;
      })
    }
  });
  api.emit(Events.SET_STORIES, {stories});
}

export function getStoryById(id) {
  return StoryStore.get(id);
}
