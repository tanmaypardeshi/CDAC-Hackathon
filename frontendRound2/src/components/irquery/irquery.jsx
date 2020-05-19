import React, {useState, useRef} from 'react';
import ird from '../../images/IRD.svg'
import irl from '../../images/IRL.svg'
import { ThemeContextConsumer } from '../../context/themer';
import { makeStyles, Grid, Paper, InputBase, Divider, IconButton, Button, Menu, MenuItem, CircularProgress, Card, CardContent, CardActionArea, CardActions, Typography, CardHeader } from '@material-ui/core';
import {ArrowDropDown, Search, Bookmark} from '@material-ui/icons';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {SnackbarProvider, useSnackbar} from 'notistack';
import { getCookie } from '../../functions/cookiefns';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        alignItems: 'center',
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
            maxWidth: '25vw'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%'
        },
        maxHeight: 'auto',
        marginTop: "8vh"
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
        console.log(event.target.id, event.target.value);
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
                    "filter" : ( (search.filter === 0 || search.filter === 1) ? "Name" : "Author"),
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
                console.log(err);
                enqueueSnackbar('Network error', {
                    variant: 'error'
                })
            });
        }
    }

    const handleBookmark = (event) => {
        //console.log(results[event.currentTarget.id])
        
        // const index = event.currentTarget.id;    //  get index of q to be bookmarked
        // let newResults = [...results];
        // newResults[index] = {...newResults[id], is_bookmark: !newResults[id].is_bookmarked}; //modify is_bookmarked at index
        // setResults(newResults);

        // if(newResults[index].is_bookmark){
        //     axios({
        //         method: "POST",
        //         headers: {
        //             "Access-Control-Allow-Origin": "*",
        //             "Content-Type" : "application/json",
        //             "Authorization": `Bearer ${localStorage.usertoken}`
        //         },
        //         data: {
        //             "title": newResults[index].title,
        //             "content": newResults[index].content,
        //             "author_name": newResults[index].author_name,
        //             "link": newResults[index].link
        //         },
        //         url: "/api/bookmark",
        //     }).then((response) => {
        //         console.log(response);
        //     }).catch((err) => {
        //         console.log(err);
        //     })
        // } else {
        //     axios({
        //         method: "POST",
        //         headers: {
        //             "Access-Control-Allow-Origin": "*",
        //             "Content-Type" : "application/json",
        //             "Authorization": `Bearer ${localStorage.usertoken}`
        //         },
        //         data: {
        //             "title": newResults[index].title,
        //             "content": newResults[index].content,
        //             "author_name": newResults[index].author_name,
        //             "link": newResults[index].link
        //         },
        //         url: "/api/removebookmark",
        //     }).then((response) => {
        //         console.log(response);
        //     }).catch((err) => {
        //         console.log(err);
        //     })
        // }

        
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
                            backgroundColor: themeContext.dark ? '#424242' : "white",
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
                                {!search.filter ? 'Filter' : search.filter === 1 ? 'By name' : 'By author'}
                            </Button>

                            <Menu
                                id="filter"
                                anchorEl = {anchorEl}
                                open={Boolean(anchorEl)}
                                keepMounted
                                onClose={handleClose}
                            >
                                <MenuItem 
                                    id = "filter" 
                                    value={1} 
                                    onClick = {(event) => {handleChange(event); handleClose()}}
                                >
                                    By Name
                                </MenuItem>
                                <MenuItem 
                                    id = "filter" 
                                    value={2} 
                                    onClick = {(event) => {handleChange(event); handleClose()}}
                                >
                                    By Author
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
                                        // dark bluish bg: '#392e57'
                                        backgroundColor: themeContext.dark ? '#424242' : "white",
                                        color: themeContext.dark ? "white" : "black"
                                        }}
                                        
                                        >
                                        <CardHeader
                                            action = {
                                                //typeof localStorage.usertoken !== 'undefined' ?
                                                getCookie("usertoken") !== '' ?
                                                <IconButton aria-label = "bookmark" onClick = {handleBookmark} id = {index}>
                                                    <Bookmark style = {{
                                                        color: result.is_bookmark ? 'gold' : themeContext.dark ? 'white' : 'grey'
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
    return(
        <SnackbarProvider maxSnack = {1}>
            <MyApp/>
        </SnackbarProvider>
    )
}