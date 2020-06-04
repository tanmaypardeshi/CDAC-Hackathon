import React, {useState} from 'react';
import { DropzoneArea } from 'material-ui-dropzone';
import { makeStyles, Button, Snackbar, Typography, Step, Stepper, StepLabel, StepContent, Grid, Fade, Slide} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import { ThemeContextConsumer } from '../../context/themer';
import SL from '../../images/SLn.svg';
import SD from '../../images/SDn.svg';
import {SnackbarProvider, useSnackbar} from 'notistack';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import {useHistory} from 'react-router-dom';
import Tesseract from 'tesseract.js';
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
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    dropZoneDark: {
        backgroundColor: '#424242',
        color: 'white',
        marginTop: "1vh",
        minHeight: '20%',
        [theme.breakpoints.up('md')]: {
            maxWidth: '60%',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%',
        },
    },
    dropZoneLight: {
        marginTop: "1vh",
        minHeight: '20%',
        [theme.breakpoints.up('md')]: {
            maxWidth: '60%',
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '90%',
        },
    },
    dZPara : {
        fontWeight: 300
    },
    img : {
        [theme.breakpoints.up('md')]: {
            maxWidth: '32%'
        },
        [theme.breakpoints.down('sm')]: {
            maxWidth: '80%'
        },
        maxHeight: 'auto'
    },
    stepper : {
        [theme.breakpoints.up('md')]: {
            width: '60%',
        },
        marginRight: '2.5%'
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
  }));
  
  
  
function VLS() {

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();
    
    const classes = useStyles();
    const history = useHistory();
    
    //stepper states
    const [activeStep, setActiveStep] = useState(0);
    const [disableCancel, setDisableCancel] = useState(false);

    // file status
    const [file, setFile] = useState();
    const [fileName, setFileName] = useState('');
    const [preSummary, setPreSummary] = useState('');

    // ocr status
    const [alertO, setAlertO] = useState(false);
    const [progressO, setProgressO] = useState(0);
    const [statusO, setStatusO] = useState('');

    const handleSubmit = () => {
        const filetype = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();
        setDisableCancel(true);
        const cookie = getCookie("usertoken")
        const uploadkey = enqueueSnackbar('Uploading...', {
            variant: 'info',
            persist: true
        })
        if(filetype === 'docx'){
            const data = new FormData();
            data.append('file', file);
            data.append('filename', fileName);
            axios({
                method: 'POST',
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "multipart/form-data",
                    "Authorization": `Bearer ${cookie}`
                },
                data: data,
                url: '/api/upload',
                onUploadProgress: (ev) => {
                    const progress = Math.round(ev.loaded / ev.total * 100);
                    if(progress === 100) {
                        closeSnackbar(uploadkey);
                        enqueueSnackbar('Summarizing...', {
                            variant: "info",
                            persist: true,
                        })
                    }
                }
            })
            .then((response) => {
                sessionStorage.setItem('summary', response.data.data);
                closeSnackbar();
                enqueueSnackbar('Summarization successful', {
                    persist: false,
                    variant: "success",
                })
                setActiveStep(2);
            })
            .catch((err) => {
                window.alert(err);
                closeSnackbar();
                enqueueSnackbar('Network Error, refresh and try again!', {
                    variant: "error",
                })
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
                    "title": fileName,
                    "content": preSummary,
                    "email": cookie !== '' ? jwt_decode(cookie).identity.email : '',
                },
                url: "/api/summarise",
                onUploadProgress: (ev) => {
                    const progress = Math.round(ev.loaded / ev.total * 100);
                    if(progress === 100) {
                        closeSnackbar(uploadkey);
                        enqueueSnackbar('Summarizing...', {
                            variant: "info",
                            persist: true,
                        })
                    }
                }
            })
            .then((response) => {
                sessionStorage.setItem('summary', response.data.data);
                closeSnackbar();
                enqueueSnackbar('Summarization successful', {
                    persist: false,
                    variant: "success",
                })
                setActiveStep(2);
            })
            .catch((err) => {
                closeSnackbar();
                enqueueSnackbar('Network Error, Please try again', {
                    variant: "error",
                })
                //console.log(err);
            });
        }
        
    }
    
    const handleReset = () => {
        setActiveStep(0);
        //fileName = '';
        setFileName('');
        //preSummary = '';
        setPreSummary('');
        enqueueSnackbar('File removed', {
            variant: 'error'
        })
    }
  
    const steps = [
        'Select a file to summarize', 
        <Button 
            onClick = {handleSubmit} 
            disabled = {activeStep !== 1 || disableCancel}
            variant = "contained"
            color = "primary"
            style = {{color: "white"}}
        >
            Upload
        </Button>,
        <Button 
            onClick = {() => {history.push('/viewsummary')}} 
            disabled = {activeStep !== 2}
            variant = "contained"
            color = "primary"
            style = {{color: "white"}}
        >
            View Summary
        </Button>
    ];
      
    function getStepContent(step) {
        switch (step) {
            case 0:
            return `Select a text file, docx file or an image`;
            case 1:
            return (
                <>
                <Button 
                    onClick = {handleReset}
                    variant = "contained"
                    color = "secondary"
                    style = {{marginRight: '-7px'}}
                    disabled = {disableCancel}
                >
                    Remove
                </Button>
                <Typography style = {{marginTop:'1vh'}}>{fileName}</Typography>
                </>
            );
            case 2:
            return `${getCookie("usertoken") !== "" ? "Summary added to 'My Summaries'" : "Login to store summaries"}`;
            default:
            return 'Unknown step';
        }
    }
  

    const handleChange = (event) => {
        const filename = event[0].name;
        const filetype = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2).toLowerCase();

        if(filetype === 'txt'){
            var fileToLoad = event[0];
            var fileReader = new FileReader();

            fileReader.onload = (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                //preSummary = textFromFileLoaded;
                setPreSummary(textFromFileLoaded);
            }

            if(fileToLoad){
                fileReader.readAsText(fileToLoad, "UTF-8");
                //fileName = event[0].name;
                setFileName(event[0].name);
            }
            setActiveStep(1);
            enqueueSnackbar('File added!', {
                variant: 'success'
            })
        }
        else if(filetype === 'docx'){
            setFile(event[0]);
            setFileName(event[0].name);
            setActiveStep(1);
            enqueueSnackbar('File added!', {
                variant: 'success'
            })
        }
        else if(filetype === 'png' || filetype === 'jpg' || filetype === 'bmp' || filetype === 'jpeg'){
            //console.log('img');
            setFileName(event[0].name);
            setAlertO(true);
            Tesseract.recognize(
                event[0],
                'eng',
                {
                    logger: m => {
                        setStatusO(m.status);
                        setProgressO(Math.round(m.progress*100));
                    }
                }
            ).then(({data: {text}}) => {
                setPreSummary(text);
                setAlertO(false);
                setActiveStep(1);
                enqueueSnackbar('Text recognized!', {
                    variant: "success",
                });
            })
        }
        else {
            window.alert('INVALID FILE TYPE .' + filetype + ' selected! See select file dialog for supported types!')
        }
    }
  
    return (
        <ThemeContextConsumer>
            {
                (themeContext) => (
                    <div 
                        style = {{
                            minHeight: "100vh",
                            backgroundColor: themeContext.dark && '#212121',
                            color: themeContext.dark && 'white',
                    }}>
                            <Grid
                                container
                                direction = "column"
                                justify = "flex-start"
                                alignItems = "center"
                            >

                            <img src={themeContext.dark ? SD : SL} alt="Summarize" className = {classes.img}/>

                            <DropzoneArea 
                                onDrop = {handleChange}
                                filesLimit = {1}
                                //showPreviews = {true}
                                showPreviewsInDropzone = {false}
                                //useChipsForPreview = {true}
                                acceptedFiles = {
                                    ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/bmp', 'image/jpeg', 'image/png']
                                }
                                dropzoneClass = {themeContext.dark ? classes.dropZoneDark : classes.dropZoneLight}
                                dropzoneParagraphClass = {classes.dZPara}
                                dropzoneText = "Drag/Click/Tap to select your file and summarize"
                                showAlerts = {false}
                            />

                            <Stepper 
                                className = {classes.stepper} 
                                activeStep={activeStep} 
                                orientation="vertical"
                                style = {{
                                    backgroundColor: themeContext.dark && '#212121',
                                    color: themeContext.dark && 'white'
                                }}
                                >
                                {
                                    steps.map((label, index) => (
                                        <Step key={label}>
                                        <StepLabel>
                                            <div style = {{
                                                backgroundColor: themeContext.dark && '#212121',
                                                color: themeContext.dark && 'white'
                                            }}>
                                                {label}
                                            </div>
                                        </StepLabel>
                                        <StepContent>
                                            <div>{getStepContent(index)}</div>
                                        </StepContent>
                                        </Step>
                                ))}
                            </Stepper>
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
                        </Grid>
                    </div>
                )
            }
        </ThemeContextConsumer>
    );
  }

export default function Summarizer(){
    const lastLocation = JSON.parse(JSON.stringify(useLastLocation()));
    return(
        <SnackbarProvider maxSnack = {1}>
            {
                (lastLocation === null)
                ?
                    <Fade in = {true}>
                        <div><VLS/></div>
                    </Fade>
                :
                    (lastLocation.pathname === '/anomalies')
                    ?
                        <Slide in = {true} direction = "right">
                            <div><VLS/></div>
                        </Slide>
                    :
                        <Slide in = {true} direction = "left">
                            <div><VLS/></div>
                        </Slide>
            }
        </SnackbarProvider>
    );
}
