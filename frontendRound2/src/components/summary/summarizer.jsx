import React, {useState, Fragment, useRef, createRef} from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { Container, makeStyles, Button, Snackbar, Slide} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import { ThemeContextConsumer } from '../../context/themer';
import SL from '../../images/SL.svg';
import SD from '../../images/SD.svg';
import { ArrowForward, Close, Check } from '@material-ui/icons';
import {SnackbarProvider, useSnackbar} from 'notistack';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import Tesseract from 'tesseract.js';

const useStyles = makeStyles((theme) => ({
    dropZoneDark: {
        backgroundColor: '#424242',
        color: 'white',
        marginTop: "5vh",
        minHeight: '20%',
        [theme.breakpoints.up('md')]: {
            maxWidth: '60%',
            marginLeft: '20%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%',
            marginLeft: '5%'
        },
    },
    dropZoneLight: {
        marginTop: "5vh",
        minHeight: '20%',
        [theme.breakpoints.up('md')]: {
            maxWidth: '60%',
            marginLeft: '20%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%',
            marginLeft: '5%'
        },
    },
    dZPara : {
        fontWeight: 300
    },
    img : {
        [theme.breakpoints.up('md')]: {
            maxWidth: '60%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%'
        },
        maxHeight: 'auto'
    },
    alert : {
        maxHeight: '100%',
        maxWidth: '100%',
        minWidth: 288,
        transition: theme.transitions.create(['top', 'right', 'bottom', 'left'], {
            easing: 'ease'
        }),
        [theme.breakpoints.down('sm')]: {
            left: '0 !important',
            right: '0 !important',
            width: '100%'
        }
    }
}))

function MyApp(){
    
    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    
    const history = useHistory();
    const classes = useStyles();

    var fileName = useRef('');
    var preSummary = useRef('');

    var fileKey = useRef(0);
    var uploadKey = useRef(0);

    const [alertO, setAlertO] = useState(false);
    const [progressO, setProgressO] = useState(0);
    const [statusO, setStatusO] = useState('');

    const selectedFileAction = () => (
        <Button
            style = {{color: "white"}}
            endIcon = {<ArrowForward/>}
            onClick = {handleUpload}
        >
            Upload
        </Button>
    )

    const dummyAction = (percentage) => (
        <Button
            style = {{color: "white"}}>
            {percentage + '%'}
        </Button>
    )

    const viewSummaryAction = () => (
        <Button
            style = {{color: "white"}}
            endIcon = {<ArrowForward/>}
            onClick = {() => {history.push('/viewSummary')}}
        >
            View Summary
        </Button>
    )

    const handleChange = (event) => {
        if(event[0].name.split('.').pop() === 'txt'){
            var fileToLoad = event[0];
            var fileReader = new FileReader();

            fileReader.onload = (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                preSummary = textFromFileLoaded;
            }

            if(fileToLoad){
                fileReader.readAsText(fileToLoad, "UTF-8");
                fileName = event[0].name;
                fileKey = enqueueSnackbar('File Selected', {
                    persist: true,
                    variant: "success",
                    action: selectedFileAction,
                });
            }
        } else {
            //console.log(URL.createObjectURL(event[0]));
            setAlertO(true);
            Tesseract.recognize(
                event[0],
                'eng',
                {
                    logger: m => {
                        console.log(m);
                        setStatusO(m.status);
                        setProgressO(Math.round(m.progress*100));
                    }
                }
            ).then(({data: {text}}) => {
                preSummary = text;
                setAlertO(false);
                fileKey = enqueueSnackbar('Text recognized!', {
                    persist: true,
                    variant: "success",
                    action: selectedFileAction,
                });
            })
        }
    }

    const handleUpload = () => {


        if(preSummary !== '' && fileName !== ''){
            closeSnackbar(fileKey);
            uploadKey = enqueueSnackbar('Uploading...', {
                variant: "info",
            })
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json",
                    "Authorization": `Bearer ${localStorage.usertoken}`
                },
                data: {
                    "title": fileName,
                    "content": preSummary,
                    "email": (localStorage.usertoken.length ? jwt_decode(localStorage.usertoken).identity.email : ""),
                },
                url: "/api/summarise",
                onUploadProgress: (ev) => {
                    const progress = Math.round(ev.loaded / ev.total * 100);
                    if(progress === 100) {
                        closeSnackbar(uploadKey);
                        enqueueSnackbar('Summarizing...', {
                            variant: "info",
                            persist: true,
                        })
                    }
                }
            })
            .then((response) => {
                console.log(response);
                localStorage.setItem('summary', response.data.data);
                closeSnackbar();
                enqueueSnackbar('Summarization successful', {
                    persist: true,
                    variant: "success",
                    action: viewSummaryAction,
                })
            })
            .catch((err) => {
                // enqueueSnackbar(err, {
                //     variant: "error",
                //     persist: true,
                //     action: viewSummaryAction
                // })
                console.log(err);
            });

        }
        
    }

    return(
        <ThemeContextConsumer>
                {(themeContext) => (
                    <div 
                    style = {{
                        minHeight: "100vh",
                        backgroundColor: themeContext.dark ? '#212121' : "white",
                        color: themeContext.dark ? 'white' : 'black',
                    }}>
                        
                            <Container style = {{paddingTop: "8vh"}}>
                                
                                <img src={themeContext.dark ? SD : SL} alt="Summarize" className = {classes.img}/>
                                <DropzoneArea 
                                    onDrop = {handleChange}
                                    filesLimit = {1}
                                    showPreviewsInDropzone = {false}
                                    acceptedFiles = {['text/plain', 'image/bmp', 'image/jpeg', 'image/png', 'image/pbm']}
                                    dropzoneClass = {themeContext.dark ? classes.dropZoneDark : classes.dropZoneLight}
                                    dropzoneParagraphClass = {classes.dZPara}
                                    dropzoneText = "Drag/Click to select your file and summarize"
                                    showAlerts = {false}
                                />
                                <Snackbar 
                                    open = {alertO}
                                    anchorOrigin = {{horizontal: 'left', vertical: 'bottom'}}
                                    >
                                    <Alert 
                                        variant = "filled" 
                                        severity="info"
                                        action = {progressO + '%'}
                                        className = {classes.alert}
                                    >
                                        {statusO}
                                    </Alert>
                                </Snackbar>

                            </Container>
                        
                    </div>
                )}
            </ThemeContextConsumer>
    )
}

export default function Summarizer(){
    return(
        <SnackbarProvider 
            maxSnack = {1}>
            <MyApp/>
        </SnackbarProvider>
    );
}