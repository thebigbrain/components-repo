import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import './addons';
// import './stories';

// import addons from '@storybook/addons';
// import {Provider} from '@storybook/ui';
// import ManagerProvider from '@storybook/core/dist/client/manager/provider';
// import renderStorybookUI from '@storybook/ui';
// import Events from '@storybook/core-events';
// import { configureStory } from './stories';
//
// import * as StoryUtils from './stories/utils';


// class ReactProvider extends Provider {
//   constructor() {
//     super();
//
//     this.channel = addons.getChannel();
//   }
//
//   getElements(type) {
//     return addons.getElements(type);
//   }
//
//   // getPanels() {
//   //   return addons.getPanels();
//   // }
//
//   renderPreview(kind, story) {
//     // return <App story={StoryUtils.toStoryID(kind, story)}/>;
//   }
//
//   handleAPI(api) {
//     // no need to do anything for now.
//
//     configureStory(api);
//
//     api.onStory((kind, story) => {
//       this.channel.emit(Events.SET_CURRENT_STORY, StoryUtils.toStoryID(kind, story));
//     });
//
//     addons.loadAddons(api);
//   }
// }

// renderStorybookUI(document.getElementById('root'), new ManagerProvider());
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
