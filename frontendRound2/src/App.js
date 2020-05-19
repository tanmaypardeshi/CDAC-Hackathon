import React, { useRef } from 'react';
import Navbar from './components/navbar';
import {Home} from './components/home';
import IRQuery from './components/irquery/irquery';
import Summarizer from './components/summary/summarizer';
import ViewSummary from './components/summary/viewsummary';
import MySummaries from './components/summary/mysummaries';
import BottomNav from './components/bottomnav';
import './App.css';
import { useEffect } from 'react';
import {Fab, makeStyles, Zoom, useScrollTrigger, Hidden, Collapse} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import PropTypes from 'prop-types';
import {BrowserRouter, Switch, Route} from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

function App(props) {

  // Scroll FAB handler
  
  const topRef = useRef(null);
  const {window} = props;
  const handleClick = () => {
    topRef.current.scrollIntoView({behavior : "smooth"});
  }

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  return (
    <BrowserRouter>
      <div className="App" ref={topRef}> 
        <Navbar/>
        <Switch>
          <Route exact path = '/' component = {Home}/>
          <Route path = '/irquery' component = {IRQuery}/>
          <Route path = '/summarizer' component = {Summarizer}/>
          <Route path = '/viewsummary' component = {ViewSummary}/>
          <Route path = '/mysummaries' component = {MySummaries}/>
        </Switch>
        <Zoom in={trigger}>
          <Fab color="primary" size="small" aria-label="scroll back to top" onClick={handleClick} className={useStyles().root}>
            <KeyboardArrowUpIcon />
          </Fab>
        </Zoom>
        <Hidden mdUp>
          <Collapse in = {!trigger}>  
            <BottomNav/>
          </Collapse>  
        </Hidden>
      </div>
    </BrowserRouter>
  );
}

App.propTypes = {
  window: PropTypes.func,
};

export default App;
