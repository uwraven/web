import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route, 
  Redirect
 } from 'react-router-dom'
import Navigator from './Components/Navigator/Navigator';
import {
  Home
} from './Pages/Index'

const subpages = {
  vehicle: {
    ref: '/team',
    component: <div>Primary Vehicle</div>,
    title: 'Team'
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
        <Redirect to={{pathname: '/'}}/>
      </Switch>
    </Router>
  );
}

export default App;
