import React, {useState, useEffect} from 'react';
import {ThemeContextConsumer} from '../../context/themer';
import { SwipeableDrawer, makeStyles, CardHeader, IconButton, Divider, InputBase, Card, Paper, Typography, LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Send, Description, Cancel, RestorePage, CodeSharp } from '@material-ui/icons';
import { DropzoneArea } from 'material-ui-dropzone';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
    root: {
        //maxWidth: 345,
        [theme.breakpoints.up('md')]: {
            width: '35vw',
        },
        [theme.breakpoints.down('sm')]: {
            width: '90vw'
        },
        height: '100vh',
        borderRadius: 0
    },
    paper: {
        display: 'flex',
        alignItems: 'center',
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
    dropZoneDark: {
        backgroundColor: '#424242',
        color: 'white',
        minHeight: '20%',
    },
    dropZoneLight: {
        minHeight: '20%',
    },
    dZPara : {
        fontWeight: 300,
        fontSize: 18
    },
}))

export const Qna = ({isOpen, handleOpen, handleClose}) => {

    const classes = useStyles();

    // Q and A handlers
    const [questionField, setQuestionField] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    // File content handlers
    const [fileField, setFileField] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    
    // Conditional Rendering handlers
    const [fileUploading, setFileUploading] = useState(false);
    const [searching ,setSearching] = useState(false);
    const [contextObtained, setContextObtained] = useState(false);
    const [questionAsked, setQuestionAsked] = useState(false);
    const [answerReceived ,setAnswerReceived] = useState(false);

    const handleFormChange = (event) => {
        setFileField(event.target.value);
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        setFileName(fileField);
        setFileField('');
        setSearching(true);
        setTimeout(() => {
            setContextObtained(true);
            setSearching(false);
        }, 2000);
        //console.log(question);
        // axios({
            //     method: "POST",
            //     headers: {
            //         "Access-Control-Allow-Origin": "*",
            //         "Content-Type" : "application/json",
            //         "Authorization": `Bearer ${localStorage.usertoken}`
            //     },
            //     data: {
            //         "fileName" : fileName,
            //     },
            //     url: "/api/getcontent",
            // }).then((response) => {
            //     console.log(response);
            // }).catch((err) => {
            //     console.log(err);
            // })
    }

    const handleDropChange = (file) => {
        if(file){ 
            var fileToLoad = file.target.files[0];
            var fileReader = new FileReader();

            fileReader.onload = (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                setFileContent(textFromFileLoaded);
                setFileName(fileToLoad.name);
            }

            if(fileToLoad){
                fileReader.readAsText(fileToLoad, "UTF-8");
            }
        }
    }

    useEffect(() => {
        if(fileContent !== ''){
            console.log(fileName, fileContent);
            setFileUploading(true);
            // axios({
            //     method: "POST",
            //     headers: {
            //         "Access-Control-Allow-Origin": "*",
            //         "Content-Type" : "application/json",
            //         "Authorization": `Bearer ${localStorage.usertoken}`
            //     },
            //     data: {
            //         "fileName" : fileName,
            //         "fileContent": fileContent,
            //     },
            //     url: "/api/getcontent",
            // }).then((response) => {
            //     console.log(response);
            // }).catch((err) => {
            //     console.log(err);
            // })
        }
    }, [fileContent]);

    const handleQuestionChange = (event) => {
        setQuestionField(event.currentTarget.value);
    }

    const handleQuestionSubmit = (event) => {
        event.preventDefault();
        setQuestion(questionField);
        setQuestionField('');
        setSearching(true);
        setQuestionAsked(true);
        setAnswerReceived(false);
        setTimeout(() => {
            setAnswerReceived(true);
            setSearching(false);
            setAnswer("Lorem Ipsum Dolor Adispiscing Sit Amet Adios! Lorem Ipsum Dolor Adispiscing Sit Amet Adios! Lorem Ipsum Dolor Adispiscing Sit Amet Adios! Lorem Ipsum Dolor Adispiscing Sit Amet Adios! Lorem Ipsum Dolor Adispiscing Sit Amet Adios!");
        }, 2000);
        console.log('Hello');
        // axios({
            //     method: "POST",
            //     headers: {
            //         "Access-Control-Allow-Origin": "*",
            //         "Content-Type" : "application/json",
            //         "Authorization": `Bearer ${localStorage.usertoken}`
            //     },
            //     data: {
            //         "question" : question
            //     },
            //     url: "/api/getanswer",
            // }).then((response) => {
            //     console.log(response);
            // }).catch((err) => {
            //     console.log(err);
            // })
    }

    const revertContext = () => {
        setContextObtained(false);
        setFileName('');
        setFileContent('');
        setQuestionField('');
        setFileField('');
        setQuestion('');
        setAnswer('');
        setQuestionAsked(false);
        setAnswerReceived(false);
    }
    return(
        <ThemeContextConsumer>
            {(themeContext) => (
                <SwipeableDrawer
                    anchor = "right"
                    open = {isOpen}
                    onOpen = {handleOpen}
                    onClose = {handleClose}
                >
                    <Card className = {classes.root} style = {{
                        backgroundColor: themeContext.dark ? '#212121' : "white",
                        color: themeContext.dark ? "white" : "black"}}
                    >
                        <CardHeader
                            title = {
                                    contextObtained 
                                    ? 
                                    <>
                                        <Typography variant = 'h6' align = 'center' gutterBottom>
                                            Context: {fileName}
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
                                            
                                            <IconButton className={classes.iconButton} aria-label="cancel" onClick={revertContext}>
                                                <RestorePage style = {{color: themeContext.dark ? 'white' : 'grey'}}/>
                                            </IconButton>
                                            
                                            <IconButton className={classes.iconButton} aria-label="submit" onClick={handleQuestionSubmit} type="submit">
                                                <Send style = {{color: themeContext.dark ? 'white' : 'grey'}}/>
                                            </IconButton>
                                        </Paper>
                                        {(searching) && <LinearProgress/>}
                                        {questionAsked && 
                                            <Alert variant="filled" severity="info" icon = {false} style = {{
                                                marginTop:'1vh',
                                                marginLeft: '5vh'
                                                }}>
                                                {question}
                                            </Alert>
                                        }
                                        {answerReceived &&
                                            <Alert variant = "filled" severity="success" icon = {false} style = {{marginTop:'1vh', marginRight: '5vh'}}>
                                                {answer}
                                            </Alert>
                                        }
                                    </>
                                    :
                                    <>
                                        <Typography variant = 'h6' align = 'center' gutterBottom>
                                            Select document name to obtain context
                                        </Typography>

                                        <Paper component="form" className={classes.paper} style = {{
                                            backgroundColor: themeContext.dark ? '#424242' : "white",
                                        }}>
                                            <InputBase
                                                fullWidth
                                                id = "document"
                                                className={classes.input}
                                                placeholder="Enter or upload document"
                                                onChange={handleFormChange}
                                                onSubmit={handleFormSubmit}
                                                value={fileField}
                                                style = {{
                                                    color: themeContext.dark ? 'white' : 'black'
                                                }}
                                            />
                                            
                                            <Divider className={classes.divider} orientation="vertical" style = {{
                                                        backgroundColor: themeContext.dark && "grey"
                                            }}/>
                                            
                                            <IconButton className={classes.iconButton} aria-label="upload">
                                                <label>  
                                                    <Description style = {{
                                                        color: themeContext.dark ? 'white' : 'grey',
                                                        paddingTop: 5
                                                        }}/>
                                                    <input 
                                                        type="file" 
                                                        className="form-control-file" 
                                                        accept="text/plain" 
                                                        id="selectFile"
                                                        onChange={handleDropChange}
                                                        hidden
                                                    />
                                                </label>
                                            </IconButton>
                                            
                                            <IconButton className={classes.iconButton} aria-label="submit" onClick={handleFormSubmit} type="submit">
                                                <Send style = {{color: themeContext.dark ? 'white' : 'grey'}}/>
                                            </IconButton>
                                        </Paper>
                                        {(searching || fileUploading) && <LinearProgress/>}
                                    </>
                                }
                        />
                    </Card>
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
