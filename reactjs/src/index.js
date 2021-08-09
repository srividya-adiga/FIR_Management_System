import React from 'react';
import ReactDOM from 'react-dom';
import LoginPage from './loginPage';
import Home from './component/home';
import RegisterAdmin from './component/addAdmin';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Offence from './component/offence';
import Offence_Add from './component/offence_add';
import FileCase from './component/file_case';
import ViewFIRS from './component/view_firs';
import ViewFIRAdmin from './component/viewFIRAdmin';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      {/* <div> */}
      <Switch>
        <Route exact path='/'>
        <LoginPage />
        </Route>
        <Route exact path='/home'>
        <Home />
        </Route>
        <Route exact path='/add_admin'>
        <RegisterAdmin />
        </Route>
        <Route exact path='/offence'>
        <Offence />
        </Route>
        <Route exact path='/offence_add'>
        <Offence_Add />
        </Route>
        <Route exact path='/file_fir'>
        <FileCase />
        </Route>
        <Route exact path='/view_fir'>
        <ViewFIRS />
        </Route>
        <Route exact path='/view_fir_admin'>
        <ViewFIRAdmin />
        </Route>
      </Switch>
      {/* </div> */}
    </Router>
    
  </React.StrictMode>,
  document.getElementById('root')
);