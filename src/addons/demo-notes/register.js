import React from 'react';
import addons from '@storybook/addons';
import styled from '@emotion/styled';

const NotesPanel = styled.div({
  margin: 10,
  width: '100%',
  overflow: 'auto',
});

class Notes extends React.Component {
  state = {
    text: '',
  };

  onAddNotes = text => {
    this.setState({text});
  };

  componentDidMount() {
    const {channel, api} = this.props;
    // Listen to the notes and render it.
    channel.on('demo-notes/add_notes', this.onAddNotes);

    // Clear the current notes on every story change.
    this.stopListeningOnStory = api.onStory(() => {
      // this.onAddNotes('');
    });
  }

  render() {
    const {text} = this.state;
    const {active} = this.props;
    const textAfterFormatted = text ? text.trim().replace(/\n/g, '<br />') : '';

    return active ? <NotesPanel dangerouslySetInnerHTML={{__html: textAfterFormatted}}/> : null;
  }

  // This is some cleanup tasks when the Notes panel is unmounting.
  componentWillUnmount() {
    if (this.stopListeningOnStory) {
      this.stopListeningOnStory();
    }

    this.unmounted = true;
    const {channel} = this.props;
    channel.removeListener('demo-motes/add_notes', this.onAddNotes);
  }
}

// Register the addon with a unique name.
addons.register('demo-notes', api => {
  // Also need to set a unique name to the panel.
  addons.addPanel('demo-notes/panel', {
    title: 'Notes',
    render: ({active}) => <Notes channel={addons.getChannel()} api={api} active={active}/>,
  });
});
