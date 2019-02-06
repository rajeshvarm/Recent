/* Base Libraries */
import React, { Component } from 'react';
import Header from './Header';
import AddPreferenceButton from './AddPreferenceButton';
import Preferences from './Preferences';
import LiveChat from './LiveChat';

class LandingPage extends Component {
  render() {
    return (
      <main>
        <Header />
        <AddPreferenceButton />
        <Preferences />
        <LiveChat />
      </main>
    );
  }
}

export default LandingPage;