import React, { useEffect } from 'react';
import {makeStyles, AppBar, Avatar, Toolbar, IconButton, Tooltip, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer, Divider, Slide, useScrollTrigger, Link, Tabs, Tab, Hidden} from '@material-ui/core';
import {Brightness4, Brightness7, LockOpen, Lock, AssignmentInd, Description, Search, Bookmarks, History, QuestionAnswer, Menu, Timeline} from '@material-ui/icons';
import { blue } from '@material-ui/core/colors';
import ListIcon from '@material-ui/icons/List';
import { useState} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Login } from '../auth/login';
import { Register } from '../auth/register';
import { Qna } from './qna/qna';
import { ThemeContextConsumer } from '../context/themer';
import PropTypes from 'prop-types';
import {getUserFromCookie, getCookie} from '../functions/cookiefns';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    }, 
    nav:{
        boxShadow: "none",
        flexWrap: "wrap"
    },
    title: {
        fontWeight: 300,
        flexGrow: 1
    },
    list: {
        width: 250,
    },
    avatar: {
        color: theme.palette.getContrastText(blue[900]),
        backgroundColor: blue[500],
        marginRight: theme.spacing(2),
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
    { icon: <History/>, name: 'My Questions', id: 'myqna'},
    { icon: <Bookmarks/>, name: 'Bookmarked Queries', id: 'mybookmarks'},
    { icon: <Lock/>, name: 'Log out', id: 'logout'}
]

const userNActions = [
    { icon: <LockOpen/>, name: 'Login', id: 'login'},
    { icon: <AssignmentInd/>, name: 'Register', id: 'register'}
]

const commonActions = [
    { icon: <Description/>, name: 'Summarize Docs', id: 'summarizer' },
    { icon: <Search/>, name: 'Document Search', id: 'irquery'},
    { icon: <Timeline/>, name: 'Anomaly Detection', id: 'anomalies'},
    { icon: <QuestionAnswer/>, name: 'Q and A', id: 'qna'}
]
  
export default function ButtonAppBar(props) {

    //const dummy = null;
    const [dummy, setDummy] = useState(null);
    const [timer, setTimer] = useState(null);

    useEffect(() => {
        handleAuthChange();
    },[dummy])

    let location = useLocation();

    useEffect(() => {
        const route = location.pathname;
        console.log(route);
        if(route === '/')
            setValue(0);
        else if(route === '/irquery')
            setValue(1);
        else if(route === '/summarizer')
            setValue(2);
        else if(route === '/anomalies')
            setValue(3);
        else
            setValue(-1);
    }, [location])
    
    const classes = useStyles();
    let history = useHistory();

    const [open, setOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showReg, setShowReg] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const [actions, setActions] = useState([...userNActions, ...commonActions]);
    const [username, setUsername] = useState('');
    const [value, setValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        const value = newValue;
        setValue(value);

        switch(value){
            case 0:
                history.push('/');
                break;
            case 1:
                history.push('/irquery');
                break;
            case 2:
                history.push('/summarizer');
                break;
            case 3:
                history.push('/anomalies');
                break;
            default:
                console.log('Ye kya kar diya tune');
        }
    };

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
            setLoggedIn(false);
            setActions([...userNActions, ...commonActions]);
            setUsername('');
            clearTimeout(timer);
            document.cookie = "usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            history.push('/');
        } else if (event.currentTarget.id === 'qna'){
            setShowChat(true);
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
        var cookie = getUserFromCookie();
        if(cookie !== ''){
            setLoggedIn(true);
            setActions([...userActions, ...commonActions]);
            setUsername(cookie);
            setTimer(setTimeout(() => {
                alert('Usertoken has expired. Please login again, if required.')
                setLoggedIn(false);
                setActions([...userNActions, ...commonActions]);
                setUsername('');
                document.cookie = "usertoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                history.push('/');
            }, 30 * 60 * 1000));
        } else {
            setLoggedIn(false);
            setActions([...userNActions, ...commonActions]);
            setUsername('');
        }
    }
  
    return (
        <ThemeContextConsumer>
            {(themeContext) => (
                <HideOnScroll {...props}>
                <div className={classes.root} style = {{
                    color: themeContext.dark && "white",
                }}>
                  <AppBar position="fixed" className={classes.nav} color = 'inherit' style = {{
                    backgroundColor: themeContext.dark && '#212121'
                  }}>
                    <Toolbar>
                        <Tooltip title = 'menu'>
                            {
                            (loggedIn)
                            ?
                            <Avatar className = {classes.avatar} onClick={handleOpen}>
                                {username.split(" ").map((n)=>n[0]).join("")}
                            </Avatar>
                            :
                            <IconButton edge = "start" className = {classes.menuButton} color = "inherit" aria-label = "menu" onClick={handleOpen}>
                                <Menu/>
                            </IconButton>
                            }
                        </Tooltip>
                        <Link id='' href='/' variant = "h5" className = {classes.title} onClick = {handleClick} color="inherit"> 
                            CLASP
                        </Link>
                        {value >= 0 &&
                        <Hidden smDown>  
                            <Tabs
                                value={value}
                                onChange={handleTabChange}
                                indicatorColor="primary"
                                textColor="primary"
                                color = "inherit"
                                style = {{width: '100%'}}
                            >
                                <Tab label="News" style = {{color: themeContext.dark && 'white'}}/>
                                <Tab label="Search" style = {{color: themeContext.dark && 'white'}} />
                                <Tab label="Summarize" style = {{color: themeContext.dark && 'white'}}/>
                                <Tab label="Anomalies" style = {{color: themeContext.dark && 'white'}}/>
                            </Tabs>
                        </Hidden>
                        }
                        <Tooltip title = {"Q and A" + (getCookie("usertoken") === '' ? ', Login to access' : '')}>
                            <IconButton 
                                aria-label = "chat" 
                                onClick={() => {
                                    if(getCookie("usertoken")!== '')
                                        setShowChat(true);
                                }} 
                            >
                                <QuestionAnswer style = {{color: themeContext.dark ? 'white' : 'black'}}/>
                            </IconButton>
                        </Tooltip>
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
                        <SwipeableDrawer
                              anchor = "left"
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
                                  (loggedIn)
                                  ? 
                                  <ListItem>
                                      <ListItemText primary = {username}/>
                                  </ListItem>
                                  :
                                  null
                              }
                              {
                                  actions.map((action, index) => (
                                      <>
                                      {action.id === 'summarizer' && <Divider style = {{
                                          backgroundColor: themeContext.dark && "grey"
                                      }}/>}
                                      <ListItem button onClick = {handleClick} key = {index} id = {action.id} 
                                      disabled = {(getCookie("usertoken")==='' && action.id === 'qna')}>
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
                    </Toolbar>
                    
                  </AppBar>
                  <Toolbar/>
                  <Login isOpen = {showLogin} handleClose = {handleLoginClose}/>
                  <Register isOpen = {showReg} handleClose = {handleSignUpClose}/>
                  {
                      getCookie("usertoken") !== '' && 
                      <Qna isOpen = {showChat} handleOpen = {() => setShowChat(true)} handleClose = {() => setShowChat(false)}/>
                  }
                  
                </div>
                
                </HideOnScroll>
            )}
        </ThemeContextConsumer>
      
    );
  }