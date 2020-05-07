import React,{ useState, useRef } from "react";
import {Form, InputGroup, Button, DropdownButton, Dropdown, Toast} from 'react-bootstrap';
import {ThemeContextConsumer} from '../context/themer';
import {SummaryContextConsumer} from '../context/summary';
import {Link} from 'react-router-dom';
import axios from "axios";
import Tesseract from 'tesseract.js';
import jwt_decode from 'jwt-decode';

function SelectFileView(props){
    
    const bglight = `url(${require('../imgs/irl.png')})`;
    const bgdark = `url(${require('../imgs/ird.png')})`;

    // Normal File Upload Handlers
    
    const [showAlert, setShowAlert] = useState(false);
    const [text, setText] = useState('Recognizing...');
    const [fileName, setFileName] = useState("");
    const [fileSize, setFileSize] = useState(0);
    const [summary, setSummary] = useState('summary');
    const [uploading, setUploading] = useState(false);
    const [summarizing, setSummarizing] = useState(false);

    // OCR File Upload Handlers

    const [ocrProgStat, setOcrProgStat] = useState();
    const [ocrProgress, setOcrProgress] = useState(0);
    const [showOcr, setShowOcr] = useState(false);

    // Doc Search Handlers

    const [irQuery, setIRQuery] = useState("");
    const [irFilter,setIRFilter] = useState("");
    const [searching, setSearching] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [results, setResults] = useState({})

    // Scroll handler

    const searchRef = useRef(null);
    // const scrollToBottom = () => { searchRef.current.scrollIntoView({behavior : "smooth"}) }
    // useEffect(scrollToBottom, [results]);


    const summarize = () => {

        //console.log(jwt_decode(localStorage.usertoken).identity.email);

        axios({
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${localStorage.usertoken}`
            },
            data: {
                "title":fileName,
                "content":text,
                "email": (localStorage.length ? jwt_decode(localStorage.usertoken).identity.email : ""),
            },
            url: "http://localhost:5000/summarise",
            onUploadProgress: (ev) => {
                const progress = Math.round(ev.loaded / ev.total * 100);
                if(progress === 100) {
                    setUploading(false);
                    setSummarizing(true);
                }
            }
        })
        .then((response) => {
            //console.log(response);
            setSummary(response.data.data);
            setTimeout(() => {
                setSummarizing(false);
                //console.log(summarizing);
            },1000);
        })
        .catch((err) => console.log(err));
    }

    const doOCR = (file) => {
        Tesseract.recognize(
            file,
            'eng',
            { 
                logger: m => {
                    console.log(m)
                    setShowOcr(true);
                    setShowAlert(true);
                    setOcrProgStat(m.status);
                    setOcrProgress(Math.round(m.progress*100));
                } 
            }
        ).then(({ data: { text } }) => {
            console.log(text);
            setText(text);
            setShowOcr(false);
            setUploading(true);
            //summarize();
        })
    }

    const docSubmitHandler = (file) => {
        if(file){
            var fileToLoad = file.target.files[0];
            var fileReader = new FileReader();
            fileReader.onload = (fileLoadedEvent) => {
                var textFromFileLoaded = fileLoadedEvent.target.result;
                setText(textFromFileLoaded);
            }
            if(fileToLoad){
                fileReader.readAsText(fileToLoad, "UTF-8");
                setFileName(file.target.files[0].name);
                setFileSize(file.target.files[0].size);
                setShowAlert(true);
                setUploading(true);
            }
        }
    }

    const searchQueryHandler = (event) => {
        event.preventDefault();
        setSearching(true);
        axios({
            method: "POST",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${localStorage.usertoken}`
            },
            data: {
                "query" : irQuery,
                "filter" : irFilter,
                "email": (localStorage.length ? jwt_decode(localStorage.usertoken).identity.email : "")
            },
            url: "http://localhost:5000/irquery",
            // onUploadProgress: (ev) => {
            //     const progress = Math.round(ev.loaded / ev.total * 100);
            //     if(progress === 100) {
            //         setUploading(false);
            //         setSummarizing(true);
            //     }
            // }
        })
        .then((response) => {
            setResults(response.data.data);
            setSearching(false);
            setShowResult(true);
            searchRef.current.scrollIntoView({behavior : "smooth"});
        })
        .catch((err) => console.log(err));
    }

    return(
        <SummaryContextConsumer>
            {(summcontext) => (
                <ThemeContextConsumer>
                {(context) => (
                    <div style = {{
                        backgroundColor: context.dark ? "#020230" : "white"
                    }}>
                        
                    <div 
                    style={{
                        backgroundImage:  context.dark ? bgdark : bglight,
                        backgroundSize: "cover",
                        backgroundColor: context.dark ? "#020230" : "white" ,
                        height: "100vh",
                        width: "100vw"
                        }}>
    
                        <div className={"container px-5 justify-content-center text-" + (context.dark?"light":"dark")}>
                            <div className="row pt-5 justify-content-center">
                                <p className="lead">
                                    Welcome to
                                </p>
                            </div>
                        
                            <div className="row mt-n4 justify-content-center">
                                    <h1 className="display-1">
                                        CLASP
                                    </h1>
                            </div>
    
                            <div className="row justify-content-center">
                                    <div className="container">
                                        <p className="lead text-center">
                                            COVID-19 Literature Analysis and Summarization Platform
                                        </p>
                                    </div>
                            </div>
    
                            <div className="row pt-3">
                                <div className="col col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                                    <p className = "lead text-center">
                                    Summarize your documents
                                    </p>
    
                                    <label className={"btn btn-block btn-" + (context.dark?"outline-info":"info")}                                >
                                    <i className="fas fa-file-alt"></i> Select a document
                                    <input 
                                        type="file" 
                                        className="form-control-file" 
                                        accept=".txt" 
                                        id="selectFile"
                                        onChange={(file) => {docSubmitHandler(file)}}
                                        hidden
                                    />
                                    </label>
    
                                    <div className="row justify-content-center pb-2">
                                        or
                                    </div>
    
                                    <label className={"btn btn-block btn-" + (context.dark?"outline-primary":"primary")}                                >
                                    <i className="fas fa-image"></i> Select an image
                                    <input 
                                        type="file" 
                                        className="form-control-file" 
                                        accept="image/*" 
                                        id="selectFile"
                                        onChange={(file) => {
                                            
                                            setFileName(file.target.files[0].name);
                                            setFileSize(file.target.files[0].size);
                                            doOCR(URL.createObjectURL(file.target.files[0]))}
                                        }
                                        hidden capture/>
                                    </label>
    
                                    <p className = "lead text-center pt-5">
                                    Search for documents
                                    </p>
    
    
                                    <Form onSubmit = {searchQueryHandler}>
                                        <Form.Group>
                                            <InputGroup>
                                                <Form.Control
                                                type = "search"
                                                aria-describedby = "inputGroupAppend"
                                                name = "search"
                                                variant = "dark"
                                                onChange = {(e) => setIRQuery(e.target.value)
                                                }
                                                />
                                                 <DropdownButton
                                                as={InputGroup.Append}
                                                variant={ (context.dark ? "outline-warning" : "warning")}
                                                title={(irFilter === "" ? "Filter" : (irFilter === "Name" ? "Name" : "Author"))}
                                                id="input-group-dropdown-2"
                                                >
                                                    <Dropdown.Item href="#" onClick = {() => setIRFilter("Name")}>
                                                        Name
                                                    </Dropdown.Item>
                                                    <Dropdown.Item href="#" onClick = {() => setIRFilter("Author")}>
                                                        Author
                                                    </Dropdown.Item>
                                                </DropdownButton>
                                                <InputGroup.Append>
                                                <Button 
                                                variant={ (context.dark ? "outline-danger" : "danger")} 
                                                type="submit"
                                                onClick = {searchQueryHandler}
                                                >
                                                    {searching 
                                                    ? 
                                                    <div className="spinner-border spinner-border-sm text-light" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                    :
                                                    <i className="fas fa-search"></i>
                                                    }
                                                </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                        </Form.Group>
                                    </Form>    
                                </div>
                            </div>
                        </div>
                        {
                            (showAlert)
                            ?
                            <nav className="navbar justify-content-center fixed-bottom">
                                <Toast>
                                    <Toast.Header>
                                        <strong className="mr-auto">{fileName}</strong>
                                        <small className="ml-auto pl-1">{fileSize} bytes</small>
                                    </Toast.Header>
                                    <Toast.Body>
                                        {
                                            (showOcr)
                                            ?
                                            <>{ocrProgStat + ": " + ocrProgress + "%"}</>
                                            :
                                            uploading
                                            ? 
                                            <Button 
                                                variant = "outline-dark" 
                                                size = "sm" 
                                                onClick = {summarize}
                                                block>
                                                Upload File?
                                            </Button>
                                            :
                                            summarizing
                                            ?
                                            "Summarizing File"
                                            :
                                            <Link to = '/viewsummary'>
                                                <Button 
                                                variant = "outline-dark" 
                                                size = "sm" 
                                                onClick = {() => {
                                                    summcontext.putSummary(summary)
                                                }}
                                                block>
                                                View Summary
                                            </Button>
                                            </Link>
                                            
                                        }
                                    </Toast.Body>
                                </Toast>
                            </nav>
                            :
                            <></>
                            }
                        
    
                    </div>
                        <div className="container justify-content-center px-5" ref={searchRef}>
                            <div className="row">
                                    {
                                    (showResult)
                                    ?
                                    <>
                                    <h1 className={"display-4 mt-n5 pt-n5" + (context.dark ? " text-white" : "")}>
                                        Results
                                    </h1>
                                    {
                                    results.map((result, index) => {
                                        return(
                                            <div 
                                            className={"card w-100 mb-4 " + (context.dark ? "text-white" : "bg-light")} 
                                            style = {{
                                                background: (context.dark ? "#020220" : "")
                                            }}
                                            key = {index}>
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        {result.title}
                                                    </h5>
                                                    <p className="card-text">
                                                    {result.content}
                                                    </p>
                                                    <blockquote className="blockquote mb-0">
                                                        <footer className="blockquote-footer"><cite title="Source Title">{result.author_name}</cite></footer>
                                                    </blockquote>
                                                    <a href={result.link} className="card-link ml-auto">View Full Article</a>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                    </>
                                    :
                                    null
                                    }
                            </div>
                        </div>
                    </div>
                )}
            </ThemeContextConsumer>
            )}
        </SummaryContextConsumer>
        
    )
}


export default SelectFileView;