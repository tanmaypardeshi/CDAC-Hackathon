import React from 'react';
import { Dialog, Button, Hidden, AppBar, makeStyles, Toolbar, Grid, Container } from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import I404 from '../images/404m.svg';
import S404 from '../images/404s.svg';

const useStyles = makeStyles((theme) => ({
    appBar: {
        top: 'auto',
        bottom: 0,
    },
    img: {
        maxWidth: '100vw',
        maxHeight: 'auto',
    }
}))

export default function E404(){

    const bg = `url(${require('../images/404.svg')})`;

    const classes = useStyles();
    const history = useHistory();

    return(
        <Dialog fullScreen open = {true}>
            <Hidden smDown>    
                <div 
                    style={{
                        backgroundImage: bg,
                        backgroundSize: "cover",
                        backgroundAttachment: 'fixed',
                        height: "100vh",
                        width: "100vw",
                        backgroundPosition: 'center center',
                        backgroundRepeat: 'no-repeat',
                }}>
                    <AppBar position = "fixed" color = "transparent" className = {classes.appBar}>
                        <Toolbar>
                            <Grid  
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >   
                                <Button variant = "contained" color = "primary" onClick = {()=>history.push('/')}>Go Home</Button>
                            </Grid>
                        </Toolbar>
                    </AppBar>
                </div>
            </Hidden>
            <Hidden mdUp>    
                <div 
                    style={{
                        height: "100vh",
                        width: "100vw",
                        backgroundColor: '#1d262d'
                }}>
                    <Container>   
                        <img src={I404} alt="" className = {classes.img}/>
                        <Grid  
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >   
                        <Button variant = "contained" color = "primary" onClick = {()=>history.push('/')}>Go Home</Button>
                        </Grid>
                    </Container>
                </div>
            </Hidden>
        </Dialog>
    );
}