import React, {Component} from 'react';
// import addons from '@storybook/addons';
// import Events from '@storybook/core-events';
// import { getStoryById } from './stories';
import {Empty, Layout} from 'antd';
import {Router} from "@reach/router"
import Theme from './components/theme/Theme';
// import logo from './logo.svg';
import './App.css';
import ComponentRepo from './components/repo/ComponentRepo';

const AppLayout = ({children}) => (
  <Layout>
    <Layout.Sider>
      <ComponentRepo/>
    </Layout.Sider>
    <Layout>
      <Layout.Header>
        {/*<Breadcrumb>*/}
        {/*<Breadcrumb.Item><Link to='/'>Home</Link></Breadcrumb.Item>*/}
        {/*/!*<Breadcrumb.Item><Link to={'app.center'}>Application Center</Link></Breadcrumb.Item>*!/*/}
        {/*<Breadcrumb.Item><Link to={'component.list/compos'}>Component List</Link></Breadcrumb.Item>*/}
        {/*<Breadcrumb.Item>An Application</Breadcrumb.Item>*/}
        {/*</Breadcrumb>*/}
      </Layout.Header>
      <Layout.Content><Empty/></Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  </Layout>
);

class App extends Component {
  state = {
    preview: null
  };

  render() {
    return (
      <Theme.Provider className="App">
        <Router>
          <AppLayout path='/'></AppLayout>
          <ComponentRepo path='component.list/:list'/>
        </Router>
      </Theme.Provider>
    );
  }
}

export default App;
