import React, {useState, useEffect} from 'react';
import {Link, Container, Typography, makeStyles, Grid, Card, CardHeader, Avatar, CardContent} from '@material-ui/core';
import {Welcome} from './welcome';
import {ThemeContextConsumer} from '../context/themer';
import newslight from '../images/newslight.svg'
import newsdark from '../images/newsdark.svg'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    img : {
        [theme.breakpoints.up('md')]: {
            maxWidth: '40%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%'
        },
        maxHeight: 'auto'
    },
}))

export const Home = () => {

    const classes = useStyles();

    const dummy = null;

    const [news, setNews] = useState([
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'},
        {Links: 'https://news.google.com/', Headlines: 'Sample Heading', Publisher: 'John Doe', Hours: '5'}
    ]);

    // const fetchNews = () => {
    //     axios({
    //         method: "GET",
    //         headers: {
    //             "Access-Control-Allow-Origin": "*",
    //             "Content-Type" : "application/json",
    //             "Authorization": `Bearer ${localStorage.usertoken}`
    //         },
    //         url: "/api/news",
    //     })
    //     .then((response) => {
    //         setNews(response.data.news);
    //     })
    //     .catch((err) => console.log(err));
    // }

    // useEffect(() => {

    // },[dummy]);

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
                        <Grid container spacing = {3} style = {{marginTop: '5vh'}}> 
                        {
                            news.map((content, index) => {
                                return(
                                    <Grid item xs = {12} sm = {12} md = {4} lg = {4}>
                                        <Card
                                            key = {index} 
                                            style = {{
                                            // dark bluish bg: '#392e57'
                                            backgroundColor: themeContext.dark ? '#424242' : "white",
                                            color: themeContext.dark ? "white" : "black"
                                            }}
                                        >
                                            <CardHeader
                                                avatar = {
                                                    <Avatar aria-label = 'author'>
                                                        {content.Publisher.split(" ").map((n)=>n[0]).join("")}
                                                    </Avatar>
                                                }
                                                title = {content.Publisher
                                                }
                                                subheader = {
                                                    <div style = {{color: themeContext.dark && 'white'}}>
                                                        {content.Hours} hours ago
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
                        }
                        </Grid>
                    </Container>
                    <Welcome/>
                </div>   
            )}
        </ThemeContextConsumer>
    );
}
