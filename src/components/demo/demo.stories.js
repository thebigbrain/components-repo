import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {linkTo} from '@storybook/addon-links';

import {Button, Welcome} from '@storybook/react/demo';

import {withNotes} from '../../addons/demo-notes';

storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')}/>);

storiesOf('DemoButton', module)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>)
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </Button>
  ));


storiesOf('DemoButtonWithNodes', module)
  .addDecorator(withNotes)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>, {
    notes: 'This is a very simple Button and you can click on it.',
  })
  .add(
    'with some emoji',
    () => (
      <Button onClick={action('clicked')}>
        <span role="img" aria-label="so cool">
          😀 😎 👍 💯
        </span>
      </Button>
    ),
    {notes: 'Here we use some emoji as the Button text. Doesn&apos;t it look nice?'}
  );
