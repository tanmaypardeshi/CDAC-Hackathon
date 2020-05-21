import React, {useState} from 'react';
import {ThemeContextConsumer} from '../../context/themer';
import { SwipeableDrawer, makeStyles, CardHeader, IconButton, Divider, InputBase, Card, Paper, Typography, LinearProgress, CardContent, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Send } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import { getCookie } from '../../functions/cookiefns';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    drawerdark: {
        background: '#212121'
    },
    drawerdark: {
        background: '#212121'
    },
    list: {
        [theme.breakpoints.up('md')]: {
            width: '35vw',
        },
        [theme.breakpoints.down('sm')]: {
            width: '90vw'
        },
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
        margin: theme.spacing(1)
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
}))

export const Qna = ({isOpen, handleOpen, handleClose}) => {

    const classes = useStyles();

    // Q and A handlers
    const [questionField, setQuestionField] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [title, setTitle] = useState('');
    const [paragraph, setParagraph] = useState('');
    
    // Conditional Rendering handlers
    const [searching ,setSearching] = useState(false);
    const [questionAsked, setQuestionAsked] = useState(false);
    const [answerReceived ,setAnswerReceived] = useState(false);


    const handleQuestionChange = (event) => {
        setQuestionField(event.currentTarget.value);
        setQuestion(event.currentTarget.value);
    }

    const handleQuestionSubmit = (event) => {
        event.preventDefault();
        // setQuestion(questionField);
        setQuestionField('');
        setSearching(true);
        setQuestionAsked(true);
        setAnswerReceived(false);
        axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${getCookie("usertoken")}`
                },
                data: {
                    "question" : question,
                },
                url: "/api/qna",
            }).then((response) => {
                console.log(response.data.data.answer);
                setTitle(response.data.data.title);
                setAnswer(response.data.data.answer);
                setParagraph(response.data.data.paragraph);
                setSearching(false);
                setAnswerReceived(true);
            }).catch((err) => {
                setAnswer('Error');
                setAnswerReceived(true);
                setSearching(false);
            })
    }

    return(
        <ThemeContextConsumer>
            {(themeContext) => (
                <SwipeableDrawer
                    classes = {{ paper: (themeContext.dark ? classes.drawerdark : classes.drawerlight)}}
                    anchor = "right"
                    open = {isOpen}
                    onOpen = {handleOpen}
                    onClose = {handleClose}
                >
                        <List className = {classes.list} style = {{
                            backgroundColor: themeContext.dark && '#212121',
                            color: themeContext.dark && 'white'
                        }}>
                                <Typography variant = 'h5' align = 'center' gutterBottom>
                                    Q and A
                                </Typography>
                            <Paper component="form" className={classes.paper} style = {{
                                backgroundColor: themeContext.dark ? '#424242' : "white",
                            }}>
                                <InputBase
                                    fullWidth
                                    id = "query"
                                    className={classes.input}
                                    placeholder="Enter your question"
                                    onChange={handleQuestionChange}
                                    onSubmit={handleQuestionSubmit}
                                    value={questionField}
                                    style = {{
                                        color: themeContext.dark ? 'white' : 'black'
                                    }}
                                />
                                
                                <Divider className={classes.divider} orientation="vertical" style = {{
                                            backgroundColor: themeContext.dark && "grey"
                                }}/>
                                
                                <IconButton className={classes.iconButton} aria-label="submit" onClick={handleQuestionSubmit} type="submit">
                                    <Send style = {{color: themeContext.dark ? 'white' : 'grey'}}/>
                                </IconButton>
                            </Paper>
                            {(searching) && <LinearProgress/>}
                    {
                        questionAsked && 
                            <ListItem>
                                <ListItemText
                                    primary = {
                                        <Alert variant="filled" severity="info" icon = {false} style = {{
                                            marginTop:'1vh',
                                            marginLeft: '5vh'
                                            }}>
                                            {question}
                                        </Alert>
                                    }
                                />
                            </ListItem>
                    }
                    {
                        answerReceived && 
                        <>
                            <ListItem>
                                <ListItemText
                                    primary = "Title"
                                    secondary = {<div style = {{color: themeContext.dark && '#848484'}}>{title}</div>}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary = "Answer"
                                    secondary = {
                                        <Alert 
                                            variant="filled" 
                                            severity="success" 
                                            icon = {false} 
                                            style = {{marginTop:'1vh', marginRight: '5vh'}}
                                            >
                                            {answer}
                                        </Alert>
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary = "We found your answer here"
                                    secondary = {
                                        <Card style = {{
                                            backgroundColor: themeContext.dark ? '#424242': '#eeeeee',
                                            color: themeContext.dark && 'white'    
                                        }}>
                                            <CardContent> {paragraph} </CardContent>
                                        </Card>
                                    }
                                />
                            </ListItem>
                        </>
                    }
                    
                    </List>
                </SwipeableDrawer>
            )}
        </ThemeContextConsumer>
    );
}

Qna.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired
}
