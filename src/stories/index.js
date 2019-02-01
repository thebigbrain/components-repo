import {configure, getStorybook} from '@storybook/react';
import * as StoryUtil from './utils';

let __storyStore = null;


function loadStories() {
  const reqStories = require.context('../components', true, /\.stories\.js$/);
  reqStories.keys().forEach(filename => reqStories(filename));
}

configure(loadStories, module);

export function flattenStorybook() {
  if (__storyStore) return __storyStore;
  __storyStore = new Map();

  getStorybook().forEach(v => {
    return v.stories.forEach(s => {
      let id = StoryUtil.toStoryID(v.kind, s.name);
      __storyStore.set(id, {
        id,
        kind: v.kind,
        fileName: v.fileName,
        name: s.name,
        render: s.render
      });
    });
  });
  return __storyStore;
}

export function getStoryById(id) {
  return __storyStore.get(id);
}
