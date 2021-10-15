import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import MainPage from './components/MainPage/MainPage';

import Document from './components/Document/Document';
import Sintetic from './components/Sintetic/Sintetic';
import Sarja from './components/Sarja/Sarja';
import Raport from './components/Raport/Raport';
import Iesire from './components/Iesire/Iesire';
import history from "./utils/history";
import { Route, Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import axios from 'axios';


//For prod

axios.defaults.baseURL = "http://10.1.3.72:8080/documente";
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, Authorization, Access-Control-Allow-Origin';
axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN_FROM_INSTANCE';

const routing = (

  <Router history={history} basename={'/docuser'}>
    <div>
      <Route exact path="/docuser" component={App} />
      <Route path="/main" component={MainPage} />
      <Route path="/document" component={Document} />
      <Route path="/sintetic" component={Sintetic} />
      <Route path="/sarja" component={Sarja} />
      <Route path="/raport" component={Raport} />
      <Route path="/iesire" component={Iesire} />
    </div>
  </Router>

)






//develop
/*
const routing = (

  <Router history={history} basename={'/documente'}>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/main" component={MainPage} />
      <Route path="/document" component={Document} />
      <Route path="/sintetic" component={Sintetic} />
      <Route path="/sarja" component={Sarja} />
      <Route path="/raport" component={Raport} />
      <Route path="/iesire" component={Iesire} />
    </div>
  </Router>

)
*/


ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
