import React from 'react';
import { 
  BrowserRouter as Router,
  Switch,
  Route, 
  Redirect
 } from 'react-router-dom'
import Navigator from './Components/Navigator/Navigator';
import {
  Home,
  Team
} from './Pages/Index'

const subpages = {
  contact: {
    ref: '/team',
    component: Team,
    title: 'Our Team'
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
        <Route path='/team'><Team/></Route>
        <Redirect to={{pathname: '/'}}/>
      </Switch>
    </Router>
  );
}

export default App;
