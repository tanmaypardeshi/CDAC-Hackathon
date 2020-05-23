import React, {useState, useRef} from 'react';
import ird from '../../images/IRDn.svg'
import irl from '../../images/IRLn.svg'
import { ThemeContextConsumer } from '../../context/themer';
import { makeStyles, Grid, Paper, InputBase, Divider, IconButton, Button, Menu, MenuItem,  Card, CardContent, CardActionArea, Typography, CardHeader, Fade, Slide } from '@material-ui/core';
import {ArrowDropDown, Search, Bookmark} from '@material-ui/icons';
import axios from 'axios';
import {SnackbarProvider, useSnackbar} from 'notistack';
import { getCookie } from '../../functions/cookiefns';
import { useLastLocation } from 'react-router-last-location';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
        padding: '2px 4px',
        [theme.breakpoints.up('md')]: {
            width: '60%'
        },
        [theme.breakpoints.down('sm')]: {
            width: '90%'
        },
        margin: theme.spacing(2)
      },
    input: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
    title: {
        fontWeight: 300,
        textDecoration: 'none'
    },
    card: {
        marginTop: theme.spacing(2),
        [theme.breakpoints.up('md')]: {
            width: '60%'
        },
        [theme.breakpoints.down('sm')]: {
            width: '90%'
        },
    },
    img: {
        [theme.breakpoints.up('md')]: {
            maxWidth: '33%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80%'
        },
        maxHeight: 'auto',
    },
    menu: {
        backgroundColor: '#424242',
        color: 'white'
    }
  }));

function MyApp() {
    const classes = useStyles();
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const [anchorEl, setAnchorEl] = useState(null);
    const [search, setSearch] = useState({
        filter: 0,
        query: ''
    })

    // Search handlers
    const [showResult, setShowResult] = useState(false);
    const [results, setResults] = useState({});

    // Scroll handler
    const searchRef = useRef(null);

    const handleChange = (event) => {
        setSearch({...search, [event.target.id] : event.target.value});
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };
    
    const handleOpen = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if(search.query !== ''){
            enqueueSnackbar('Searching...', {
                variant: 'info',
                persist: true
            })
            var cookie = getCookie("usertoken");
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${cookie}`
                },
                data: {
                    "query" : search.query,
                    "filter" : ( (search.filter === 0 || search.filter === 1) ? "Author" : "Name"),
                    //"email": (cookie !== '' ? jwt_decode(cookie).identity.email : "")
                },
                url: "/api/irquery",
            })
            .then((response) => {
                setResults(response.data.data);
                setShowResult(true);
                closeSnackbar();
                searchRef.current.scrollIntoView({behavior : "smooth"});
            })
            .catch((err) => {
                enqueueSnackbar('Search Error, please refresh and try again!', {
                    variant: 'error'
                })
            });
        }
    }

    const handleBookmark = (event) => {
        
        const index = event.currentTarget.id;    //  get index of q to be bookmarked
        let newResults = [...results];
        newResults[index] = {...newResults[index], is_bookmarked: !newResults[index].is_bookmarked}; //modify is_bookmarkeded at index
        setResults(newResults);
        const cookie = getCookie("usertoken");
        if(newResults[index].is_bookmarked){
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${cookie}`
                },
                data: {
                    "title": newResults[index].title,
                    "content": newResults[index].content,
                    "author_name": newResults[index].author_name,
                    "link": newResults[index].link
                },
                url: "/api/bookmark",
            }).then((response) => {
                //console.log(response);
            }).catch((err) => {
                window.alert(err);
            })
        } else {
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${cookie}`
                },
                data: {
                    "title": newResults[index].title,
                    "content": newResults[index].content,
                    "author_name": newResults[index].author_name,
                    "link": newResults[index].link
                },
                url: "/api/remove_bookmark",
            }).then((response) => {
                //console.log(response);
            }).catch((err) => {
                window.alert(err);
            })
        }

        
    }

    //dark blue bg: #020230

    return(
        <ThemeContextConsumer>
            {(themeContext) => (
                <div style = {{
                    minHeight: "100vh",
                    backgroundColor: themeContext.dark ? '#212121' : "white",
                    color: themeContext.dark ? "white" : "black"
                }}>
                    <Grid
                        container
                        direction = "column"
                        justify = "flex-start"
                        alignItems = "center"
                    >
                    <img src={themeContext.dark ? ird : irl} alt="BG" className = {classes.img}/> 
                    
                        <Paper component="form" className={classes.root} style = {{
                            backgroundColor: themeContext.dark ? '#424242' : "#fafafa",
                        }}>
                            <InputBase
                                fullWidth
                                id = "query"
                                className={classes.input}
                                placeholder="Search for documents"
                                inputProps={{ 'aria-label': 'search for documents' }}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                style = {{
                                    color: themeContext.dark ? 'white' : 'black'
                                }}
                            />
                            
                            <Button 
                                onClick = {handleOpen}
                                endIcon = {<ArrowDropDown/>} 
                                style = {{marginLeft: "1px", color: themeContext.dark ? 'white' : 'grey'}}
                            >
                                {!search.filter ? 'Filter' : search.filter === 1 ? 'By Author' : 'By Title'}
                            </Button>

                            <Menu
                                id="filter"
                                anchorEl = {anchorEl}
                                open={Boolean(anchorEl)}
                                keepMounted
                                onClose={handleClose}
                                classes = {{paper: (themeContext.dark && classes.menu)}}
                            >
                                <MenuItem 
                                    id = "filter" 
                                    value={1} 
                                    onClick = {(event) => {handleChange(event); handleClose()}}
                                    style = {{
                                        backgroundColor: (themeContext.dark && '#424242'),
                                        color: (themeContext.dark && 'white' )   
                                    }}
                                >
                                    By Author
                                </MenuItem>
                                <MenuItem 
                                    id = "filter" 
                                    value={2} 
                                    onClick = {(event) => {handleChange(event); handleClose()}}
                                    style = {{
                                        backgroundColor: (themeContext.dark && '#424242'),
                                        color: (themeContext.dark && 'white' )   
                                    }}
                                >
                                    By Title
                                </MenuItem>
                            </Menu>

                            <Divider className={classes.divider} orientation="vertical" style = {{
                                          backgroundColor: themeContext.dark && "grey"
                            }}/>
                            
                            <IconButton className={classes.iconButton} aria-label="directions" onClick={handleSubmit} type="submit">
                                <Search style = {{
                                    color: themeContext.dark ? 'white' : 'grey'
                                }}/>
                            </IconButton>
                        </Paper>
                        {
                        showResult && 
                        <>
                        <div ref = {searchRef}></div>
                        {
                            results.map((result, index) => {
                                return(
                                    <Card 
                                        className={classes.card} 
                                        key = {index} 
                                        style = {{
                                        backgroundColor: themeContext.dark ? '#424242' : "white",
                                        color: themeContext.dark ? "white" : "black"
                                        }}
                                        
                                        >
                                        <CardHeader
                                            action = {
                                                getCookie("usertoken") !== '' ?
                                                <IconButton aria-label = "bookmark" onClick = {handleBookmark} id = {index}>
                                                    <Bookmark style = {{
                                                        color: (result.is_bookmarked ? 'gold' : (themeContext.dark ? 'white' : 'grey'))
                                                    }}/>
                                                </IconButton>
                                                :
                                                null
                                            }
                                            title = {
                                            <a 
                                                href={result.link} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style = {{textDecoration: 'none', color: themeContext.dark ? "white" : "black"}}
                                            >
                                                {result.title}
                                            </a>
                                            }
                                            subheader = {
                                            <div style = {{color: themeContext.dark && 'white'}}>-{result.author_name}</div>}
                                            align = 'left'
                                            style = {{
                                                color: themeContext.dark ? "white" : "black"
                                            }}
                                        />
                                        <CardActionArea
                                            onClick = {() => {window.open(result.link, '_blank', 'noopener noreferrer')}}
                                        >
                                            <CardContent>
                                                <Typography variant="body2" component="p" align='left' gutterBottom>
                                                {result.content.split(" ").splice(0, 50).join(" ") + "..."}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                );
                            })
                        }
                        </>
                        }
                    </Grid>
                </div>
            )}
        </ThemeContextConsumer>
        
    );
}

export default function IRQuery(){
    const lastLocation = JSON.parse(JSON.stringify(useLastLocation()));
    return(
        <SnackbarProvider maxSnack = {1}>
            {
                (lastLocation === null)
                ?
                    <Fade in = {true}>
                        <div>
                            <MyApp/>
                        </div>
                    </Fade>
                :
                    (lastLocation.pathname === '/')
                    ?
                        <Slide in = {true} direction = "left">
                            <div>
                                <MyApp/>
                            </div>
                        </Slide>
                    :
                        <Slide in = {true} direction = "right">
                            <div>
                                <MyApp/>
                            </div>
                        </Slide>

            }
            <MyApp/>
        </SnackbarProvider>
    )
}