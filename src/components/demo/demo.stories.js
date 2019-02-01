import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import Demo from './Demo';

storiesOf('Demo', module)
  .add('a simpe demo with some emoji', () => (
    <Demo onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Demo>
  ));
