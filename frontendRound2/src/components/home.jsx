import React, {useState, useEffect} from 'react';
import {IconButton, Paper, Container, Typography, makeStyles, Grid, Card, CardHeader, Avatar, CardContent, Divider, InputBase} from '@material-ui/core';
import {Search} from '@material-ui/icons';
import {Welcome} from './welcome';
import {ThemeContextConsumer} from '../context/themer';
import newslight from '../images/newslight.svg'
import newsdark from '../images/newsdark.svg'
import axios from 'axios';
import { Skeleton } from '@material-ui/lab';
import { getCookie } from '../functions/cookiefns';
import { red, pink, purple, deepPurple, indigo, blue, teal, green, orange, deepOrange, brown, blueGrey} from '@material-ui/core/colors'



const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(2)
    },
    img : {
        [theme.breakpoints.up('md')]: {
            maxWidth: '25vw'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%'
        },
        maxHeight: 'auto'
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
    card: {
        minHeight: '30vh'
    }
}))

export const Home = () => {

    const classes = useStyles();

    const dummy = null;

    const [news, setNews] = useState([]);
    const [newsValue, setNewsValue] = useState('');
    const [newsReceived, setNewsReceived] = useState(false);
    const avatarcolors = [red[500], pink[500], purple[500], deepPurple[500], indigo[500], blue[500], teal[500], green[500], orange[500], deepOrange[500], brown[500], blueGrey[500]];

    const fetchNews = () => {
        const cookie = getCookie("usertoken")
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${cookie}`
            },
            url: "/api/news",
        })
        .then((response) => {
            //sessionStorage.setItem('news', response.data.data);
            sessionStorage.setItem('news', JSON.stringify(response.data.data));
            setNews(response.data.data);
            setNewsReceived(true);
            //setNews(response.data.news);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => {
        if(typeof sessionStorage.news === 'undefined')
            fetchNews();
        else{
            setNews(JSON.parse(sessionStorage.news));
            setNewsReceived(true);
        }
        //console.log(JSON.parse(sessionStorage.news));

    },[dummy]);

    const handleChange = (event) => {
        setNewsValue(event.currentTarget.id);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        // const cookie = getCookie("usertoken")
        // axios({
        //     method: "POST",
        //     headers: {
        //         "Access-Control-Allow-Origin": "*",
        //         "Content-Type" : "application/json",
        //         "Authorization": `Bearer ${cookie}`
        //     },
        //     data: {
        //         "headline" : newsValue
        //     },
        //     url: "/api/postnews",
        // })
        // .then((response) => {
        //     setNewsValue('');
        //     sessionStorage.setItem('news', JSON.stringify(response.data.data));
        //     setNews(response.data.data);
        //     setNewsReceived(true);
        // })
        // .catch((err) => console.log(err));
    }

    const CardSkeleton = () => {
        return(
            <ThemeContextConsumer>
                {(themeContext) => (
                    <Grid item xs = {12} sm = {12} md = {4} lg = {4}>
                    <Card 
                        className = {classes.card}
                        style = {{
                            backgroundColor: themeContext.dark ? '#424242' : "white",
                            
                    }}>
                    <CardHeader
                        avatar = {<Skeleton variant='circle' width = {40} height = {40}/>}
                        title = {<Skeleton width = '40%'/>}
                        subheader = {<Skeleton width = '30%'/>}
                        align = 'left'                        
                    />
                    <CardContent>
                        <Skeleton/>
                        <Skeleton/>
                        <Skeleton/>
                    </CardContent>
                    </Card>
                </Grid>
                )}
            </ThemeContextConsumer>
        )
    }

    return(
        <ThemeContextConsumer>
            {(themeContext) => (
                <div style = {{
                    minHeight: "100vh",
                    backgroundColor: themeContext.dark ? '#212121' : "white",
                    color: themeContext.dark ? 'white' : 'black',
                }}>
                    <Container style = {{paddingTop: '8vh'}}>
                        <img className = {classes.img} src={themeContext.dark ? newsdark : newslight} alt=""/>
                        {/* <Typography variant = "h2" style = {{marginTop: '5vh'}}>
                            NEWS
                        </Typography> */}

                        <Paper component="form" className={classes.root} style = {{
                            backgroundColor: themeContext.dark ? '#424242' : "white",
                        }}>
                            <InputBase
                                fullWidth
                                id = "query"
                                className={classes.input}
                                placeholder="Search for news"
                                inputProps={{ 'aria-label': 'search for documents' }}
                                onChange={handleChange}
                                onSubmit={handleSubmit}
                                value = {newsValue}
                                style = {{
                                    color: themeContext.dark ? 'white' : 'black'
                                }}
                            />
                            
                            <Divider className={classes.divider} orientation="vertical" style = {{
                                          backgroundColor: themeContext.dark && "grey"
                            }}/>
                            
                            <IconButton className={classes.iconButton} aria-label="directions" onClick={handleSubmit} type="submit">
                                <Search style = {{
                                    color: themeContext.dark ? 'white' : 'grey'
                                }}/>
                            </IconButton>
                        </Paper>

                        <Grid container spacing = {3} style = {{marginTop: '5vh'}}> 
                        {
                            newsReceived 
                            ? 
                            news.map((content, index) => {
                                return(
                                    <Grid item xs = {12} sm = {12} md = {4} lg = {4}>
                                        <Card
                                            className = {classes.card}
                                            key = {index} 
                                            style = {{
                                            // dark bluish bg: '#392e57'
                                            backgroundColor: themeContext.dark ? '#424242' : "white",
                                            color: themeContext.dark ? "white" : "black"
                                            }}
                                        >
                                            <CardHeader
                                                avatar = {
                                                    <Avatar 
                                                        aria-label = 'author'
                                                        style = {{
                                                            color: 'white',
                                                            backgroundColor: avatarcolors[Math.round(Math.random() * 12)]
                                                        }}>
                                                        {content.Publisher.split(" ").map((n)=>n[0]).join("")}
                                                    </Avatar>
                                                }
                                                title = {content.Publisher
                                                }
                                                subheader = {
                                                    <div style = {{color: themeContext.dark && 'white'}}>
                                                        {content.Hours}
                                                    </div>
                                                }
                                                align = 'left'
                                                style = {{
                                                    color: themeContext.dark ? "white" : "black"
                                                }}                                        
                                            />
                                            <CardContent>
                                                <Typography align = 'left' color = 'inherit' display = 'block' variant="h6">  
                                                <a 
                                                    href={content.Links} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    style = {{textDecoration: 'none', color: themeContext.dark ? "white" : "black"}}
                                                >
                                                    {content.Headlines}
                                                </a>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            }) 
                            : 
                            <>
                                <CardSkeleton/>
                                <CardSkeleton/>
                                <CardSkeleton/>
                            </>   
                        }
                        </Grid>
                    </Container>
                    <Welcome/>
                </div>   
            )}
        </ThemeContextConsumer>
    );
}
