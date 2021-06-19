import React from 'react';
import {Diagram} from './pages/Diagram';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

const App = () => {
  return (
    <Diagram />
    /*
    <BrowserRouter>
      <Switch>
        <Route exact path='/'>
          <Diagram/>
        </Route>
      </Switch>
    </BrowserRouter>
*/
  );
};

export default App;
