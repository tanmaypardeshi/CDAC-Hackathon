import React from 'react';
import {makeStyles, AppBar, Avatar, Toolbar, Typography, Grid, IconButton, Tooltip, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Divider, Slide, useScrollTrigger, Link} from '@material-ui/core';
import {Brightness4, Brightness7, MoreVert, LockOpen, Lock, AssignmentInd, Chat, Description, Search, Bookmarks} from '@material-ui/icons';
import { blue } from '@material-ui/core/colors';
import ListIcon from '@material-ui/icons/List';
import { useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Login } from '../auth/login';
import { Register } from '../auth/register';
import jwt_decode from 'jwt-decode';
import { ThemeContextConsumer } from '../context/themer';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    nav:{
        boxShadow: "none",
    },
    title: {
        fontWeight: 300
    },
    list: {
        width: 250,
    },
    avatar: {
        color: theme.palette.getContrastText(blue[900]),
        backgroundColor: blue[500]
    }
}));

function HideOnScroll(props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({ target: window ? window() : undefined });
  
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
}
  
HideOnScroll.propTypes = {
    children: PropTypes.element.isRequired,
    window: PropTypes.func,
};


const userActions = [
    { icon: <ListIcon/>, name: 'My Summaries', id: 'mysummaries' },
    { icon: <Chat/>, name: 'Q and A', id: 'qna'},
    { icon: <Bookmarks/>, name: 'Bookmarked Queries', id: 'qbookmarks'},
    { icon: <Lock/>, name: 'Log out', id: 'logout'}
]

const userNActions = [
    { icon: <LockOpen/>, name: 'Login', id: 'login'},
    { icon: <AssignmentInd/>, name: 'Register', id: 'register'}
]

const commonActions = [
    { icon: <Description/>, name: 'Summarize', id: 'summarizer' },
    { icon: <Search/>, name: 'Search', id: 'irquery'}
]
  
export default function ButtonAppBar(props) {
    
    const classes = useStyles();
    let history = useHistory();

    const [open, setOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const [loggedIn, setLoggedIn] = useState(localStorage.usertoken.length ? true : false);
    const [actions, setActions] = useState(localStorage.usertoken.length ? [...userActions, ...commonActions] : [...userNActions, ...commonActions])

    const handleClose = () => {
        setOpen(false);
    };
    
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClick = (event) => {
        event.preventDefault();
        handleClose();
        if(event.currentTarget.id === 'login'){
            setShowLogin(true);
        } else if (event.currentTarget.id === 'register') {
            setShowReg(true);
        } else if (event.currentTarget.id === 'logout') {
            localStorage.setItem('usertoken', '');
            localStorage.setItem('summary', '');
            setLoggedIn(false);
            setActions([...userNActions, ...commonActions]);
            history.push('/');
        } else {
            console.log(event.currentTarget.id);
            history.push('/' + event.currentTarget.id);
        }
    }

    const handleLoginClose = () => {
        setShowLogin(false);
        handleAuthChange();
    }

    const handleSignUpClose = () => {
        setShowReg(false);
        handleAuthChange();
    }

    const handleAuthChange = () => {
        if(localStorage.usertoken.length){
            setLoggedIn(true);
            setActions([...userActions, ...commonActions]);
        }
    }
  
    return (
        <ThemeContextConsumer>
            {(themeContext) => (
                <HideOnScroll {...props}>
                <div className={classes.root} style = {{
                    color: themeContext.dark ? "white" : "black"
                }}>
                  <AppBar position="fixed" className={classes.nav} color = "transparent">
                    <Toolbar>
                        <Link id='' href='/' variant = "h5" className = {classes.title} onClick = {handleClick} color="inherit"> 
                            CLASP
                        </Link>
                      <Grid
                          container
                          direction = "row"
                          justify = "flex-end"
                          alignItems = "center"
                      >
                          <Tooltip title = "Toggle Theme">  
                              <IconButton aria-label = "theme" onClick={() => {themeContext.toggleTheme()}}> 
                                  { 
                                      themeContext.dark
                                      ? 
                                      <Brightness7 style = {{color: "white"}}/> 
                                      : 
                                      <Brightness4 style = {{color: "black"}}/> 
                                  }
                              </IconButton>
                          </Tooltip>
                          
                          <Tooltip title = "Menu">
                              {
                                  loggedIn && localStorage.usertoken.length
                                  ?
                                  <Avatar className = {classes.avatar} onClick={handleOpen}>
                                      {jwt_decode(localStorage.usertoken).identity.name.split(" ").map((n)=>n[0]).join("")}
                                  </Avatar>
                                  :
                                  <IconButton aria-label = "theme" onClick={handleOpen}>
                                      <MoreVert style = {{color: themeContext.dark ? "white" : "black"}}/>
                                  </IconButton>
                              }
                          </Tooltip>
          
                          <SwipeableDrawer
                              anchor = "right"
                              open = {open}
                              onClose = {handleClose}
                              onOpen = {handleOpen}
                          >
                              <List className = {classes.list} style = {{
                                height: "100vh",
                                backgroundColor: themeContext.dark ? 'black' : "white",
                                color: themeContext.dark ? "white" : "black"
                              }}>
                              {
                                  loggedIn && localStorage.usertoken.length
                                  ? 
                                  <ListItem>
                                      <ListItemText primary = {jwt_decode(localStorage.usertoken).identity.name}/>
                                  </ListItem>
                                  :
                                  null
                              }
                              {
                                  actions.map((action) => (
                                      <>
                                      {action.name === 'Summarize' && <Divider style = {{
                                          backgroundColor: themeContext.dark && "grey"
                                      }}/>}
                                      <ListItem button onClick = {handleClick} key = {action.key} id = {action.id}>
                                          <ListItemIcon style = {{
                                              color: themeContext.dark ? "white" : "black"
                                          }}>
                                              {action.icon}
                                          </ListItemIcon>
                                          <ListItemText primary = {action.name}/>
                                      </ListItem>
                                      </>
                                  ))
                                  
                              }
                              </List>
                          </SwipeableDrawer>
                      </Grid>
                    </Toolbar>
                  </AppBar>
                  <Login isOpen = {showLogin} handleClose = {handleLoginClose}/>
                  <Register isOpen = {showReg} handleClose = {handleSignUpClose}/>
                </div>
                </HideOnScroll>
            )}
        </ThemeContextConsumer>
      
    );
  }