import React, {Component} from 'react';
import {Layout} from 'antd';
import {Router} from '@reach/router';
// import {
//   TransitionGroup,
//   CSSTransition
// } from "react-transition-group";
import Theme from 'components/theme/Theme';
import './App.css';
import ComponentRepo from 'components/repo/ComponentRepo';
import PreviewProvider from 'containers/PreviewProvider';
import StoryBook from 'containers/StoryBook';
import Toolbar from 'components/toolbar/Toolbar';


const AppLayout = React.memo(({children, location}) => {
  return (
    <Layout>
      <Layout.Sider>
        <StoryBook.Provider><ComponentRepo/></StoryBook.Provider>
      </Layout.Sider>
      <Layout>
        <React.Fragment>
          <Layout.Header><Toolbar/></Layout.Header>
          <Layout.Content>
            <StoryBook.Provider>
              <Router>
                <PreviewProvider path='/preview/:storyId'/>
              </Router>
            </StoryBook.Provider>
          </Layout.Content>
          <Layout.Footer>Footer</Layout.Footer>
        </React.Fragment>
      </Layout>
    </Layout>
  )
});

class App extends Component {
  render() {
    return (
      <Theme.Provider className="App">
        <AppLayout/>
        {/*<Location>*/}
          {/*{({ location }) => (*/}
            {/*<TransitionGroup>*/}
              {/*<CSSTransition*/}
                {/*key={location.key}*/}
                {/*classNames="fade"*/}
                {/*timeout={500}*/}
              {/*>*/}
                {/**/}
              {/*</CSSTransition>*/}
            {/*</TransitionGroup>*/}
          {/*)}*/}
        {/*</Location>*/}
      </Theme.Provider>
    );
  }
}

export default App;
