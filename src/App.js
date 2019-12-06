import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route
 } from 'react-router-dom'
import Navigator from './components/navigator/navigator';
import {
  Home
} from './pages'

const subpages = {
  vehicle: {
    ref: '/vehicle',
    component: <div>Primary Vehicle</div>,
    title: 'Primary Vehicle'
  },
  gnc: {
    ref: '/gnctestbed',
    component: <div>GNC</div>,
    title: 'GNC Testbed'
  },
  contact: {
    ref: '/contact',
    component: <div>Contact us</div>,
    title: 'Contact'
  }

}

function App() {
  return (
    <Router>
      <Navigator home={'/'} refs={subpages}/>
      <Switch>
        <Route exact path='/'>
          { <Home></Home> } 
        </Route>
        {
          Object.keys(subpages).map(key =>
            <Route exact path={subpages[key].ref}>
              { subpages[key].component }
            </Route>)
        }
      </Switch>
    </Router>
  );
}

export default App;
