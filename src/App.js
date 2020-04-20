import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import axios from 'axios';
import { createWorker } from 'tesseract.js';
import './App.css';

function App() {

  // for page routing
  const [page, setPage] = useState(1);

  // for theme toggler
  const [bgcolor, setBgColor] = useState("light");
  const [textcolor, setTextColor] = useState("dark");
  const [toggle, setToggleState] = useState("off");
  const [dark, setDarkState] = useState(false);

  // OCR handler
  const [ocr, setOcr] = useState('Recognizing...');
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrProgStat, setOcrProgStat] = useState("");
  const [ocrShow, setOcrShow] = useState(false);

  // File handler
  const [filename, setFilename] = useState("");
  const [filesize, setFilesize] = useState(0);

  // POST request handlers
  const [uploadProgress, updateUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [uploading, setUploading] = useState(0);

  // GET request and summary display handlers    
  const [show, setShow] = useState(false);
  const [summary, setSummary] = useState("");

  const worker = createWorker({
    logger: m => {
      console.log(m);
      setOcrProgStat(m.status);
      setOcrProgress(Math.round(m.progress*100));
      setOcrShow(true);
    }
  });

  const doOCR = async (file) => {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(file);
    setOcr(text);
    setOcrShow(false);
    setPage(2);
  };

  const toggleState = () => {
    if(dark){
      setBgColor("light");
      setTextColor("dark");
      setToggleState("off");
      //setHex("#343a40");
      } else {
      setBgColor("dark");
      setTextColor("light");
      setToggleState("on");
      //setHex("#f8f9fa");
      }
      setDarkState(!dark);
  }

  const Page1 = (props) => {
    return(
      <div>
        <div className="row justify-content-center pt-5 mb-n4">
        <p className="text-center" style={{fontSize: 30, fontWeight: '300'}}>
          Welcome to
        </p>
        </div>

        <div className="row justify-content-center">
          <h1 className="display-1">
            CLASP
          </h1>
        </div>

        <div className="row justify-content-center pl-2 pr-2">
          <p className="text-center" style={{fontSize: 20, fontWeight: '300'}}>
            COVID-19 Literature Analysis and Summarization Platform
          </p>
        </div>

        <div className="row justify-content-center pt-5">
					<div className="col col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6">
						<label className={"btn btn-block btn-outline-" + textcolor + " mr-2"}>
							<i className="fas fa-file-alt"></i> Select a document
								<input 
									type="file" 
									className="form-control-file" 
									accept=".txt" 
									id="selectFile"
									onChange={(file) => {
											if(file != null){
													
													if((file.target.files[0].name).split('.').pop() === "txt"){
														var fileToLoad = file.target.files[0];
														var fileReader = new FileReader();
														fileReader.onload = (fileLoadedEvent) => {
															var textFromFileLoaded = fileLoadedEvent.target.result;
															setOcr(textFromFileLoaded);
														}
														fileReader.readAsText(fileToLoad, "UTF-8");
														
													} 
													// else if((file.target.files[0].name).split('.').pop() === "pdf"){
													// 	var pdfUtil = require('pdf-to-text');
													// 	var pdf_path = URL.createObjectURL(file.target.files[0]);

													// 	pdfUtil.pdfToText(pdf_path, function(err,data) {
													// 		if (err) throw(err);
													// 		console.log(data);
													// 	});
													// }

													setPage(2);
													setFilename(file.target.files[0].name);
													setFilesize(file.target.files[0].size);
											}                        
									}}
									hidden
								/>
						</label>
					</div>

				</div>
						
				<div className="row justify-content-center">
					or
				</div>

				<div className="row justify-content-center pt-2">
					<div className="col col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6">
						<label className={"btn btn-block btn-outline-" + textcolor }>
            <i className="fas fa-image"></i> Select an image
              <input 
                type="file" 
                className="form-control-file" 
                accept="image/*" 
                id="selectFile"
                onChange={(file) => {
                    if(file != null){
											doOCR(URL.createObjectURL(file.target.files[0]));
                      setFilename(file.target.files[0].name);
                      setFilesize(file.target.files[0].size);
                    }                        
                }}
                hidden capture/>
            </label>
					</div>
        </div>
        {
          (ocrShow)?
          <div className="row justify-content-center pt-5">
            <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <p className="text-center" style={{fontSize: 20, fontWeight: '300'}}>
                  {ocrProgStat} {ocrProgress}%
              </p>
              <div className="progress" style={{height: 25}}>
                  <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                  role="progressbar" 
                  aria-valuenow={ocrProgress} 
                  aria-valuemin="0" 
                  aria-valuemax="100" 
                  style={{width: ocrProgress+"%"}}></div>
              </div>
            </div>
          </div>
          :
          null
        }
    </div>
    );
  }

  const Page2 = (props) => {
    return (
      <div>
                        
        <div className="row justify-content-center pt-5 mb-n4">
          <p className="text-center" style={{fontSize: 30, fontWeight: '300'}}>
            Selected File:
          </p>
        </div>

        <div className="row justify-content-center">
          <p className="lead text-center text-justify">
            {filename}
          </p>
        </div>

        <div className="row justify-content-center">
          <p className="text-center" style={{fontSize: 20, fontWeight: '300'}}>
            {filesize} bytes
          </p>
        </div>
          
        <div className="row justify-content-center pt-5">
              
                  
          <button 
            className="btn btn-outline-danger mr-2"
            onClick={() => {
              setPage(1);
            }}
          >
            <i className="fas fa-chevron-left"></i> Go Back
          </button>

          <button 
            className="btn btn-outline-info"
            onClick={() => {
                setUploading(1);

                axios({
                    method: "POST",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-Type" : "application/json"
                    },
                    data: {
                        "title":filename,
                        "content":ocr
                    },
                    url: "http://localhost:5000/summarise",
                    onUploadProgress: (ev) => {
                        const progress = ev.loaded / ev.total * 100;
                        updateUploadProgress(Math.round(progress));
                        if (Math.round(progress) === 100) {
                          setTimeout(() => setUploading(2),2000);
                        };
                    }
                })
                .then((response) => {
                    console.log(response.status);
                    setSummary(response.data.data);
                    setUploadStatus(true);

                    setTimeout(() => {
                        setPage(3);
                        setUploading(0);
                        updateUploadProgress(0);
                    },3000)
                })
                .catch((err) => console.log(err));
            }}>
              <i className="fas fa-upload"></i> Upload File?
          </button>
        </div>

        <div className="row justify-content-center pt-5">
        {
            (uploading == 1)
            ?
            <div className="col col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <p className="text-center" style={{fontSize: 20, fontWeight: '300'}}>
                  Uploading file ...
              </p>
              <div className="progress" style={{height: 25}}>
                  <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-info" 
                  role="progressbar" 
                  aria-valuenow={uploadProgress} 
                  aria-valuemin="0" 
                  aria-valuemax="100" 
                  style={{width: uploadProgress+"%"}}>{uploadProgress}%</div>
              </div>
            </div>
            :
            
              (uploading == 2)
              ?
                <button class={"btn btn-outline-"+textcolor} type="button" disabled>
                  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                    Summarizing...
                </button>
              :
              null
            
            
        }
        </div>
              
      </div>
    );
  }

  const Page3 = (props) => {
    return(
      <div>

        <div className="row justify-content-center pt-5 pl-2 pr-2">
          <p className="text-center" style={{fontSize: 20, fontWeight: '300'}}>
            Upload successful! Get your summary below.
          </p>
        </div>


        <div className="row justify-content-center pt-2">

          <button 
            className="btn btn-outline-danger mr-2"
            onClick={() => {
                setPage(1);
                setShow(false);
            }}
            >
              <i className="fas fa-chevron-left"></i> Go Back
          </button>

          <button 
            className={"btn btn-outline-" + textcolor}
            onClick={()=>{

                setShow(true);
            }}
          >
            <i className="fas fa-indent"></i> View Summary
          </button>
        </div>

        <div className="row justify-content-center mt-5 ml-3 mr-3">
          <p className="lead text-justify">{
              (show) ? summary : null
          }</p>
        </div>
      </div>
    );
  }

  const Page = (props) => {
    if(page === 1)
      return <Page1/>
    if(page === 2)
      return <Page2/>
    return <Page3/>
  }
  
  return (
    <div className={{App} + " bg-" + bgcolor + " text-" + textcolor} style = {{minHeight:"100vh"}}>
      <nav className={"navbar fixed-top bg-"+bgcolor}>
        <span className="navbar-brand mb-0 h1">CLASP</span>
        <button 
        className={"btn btn-" + bgcolor + " justify-content-end"} 
        onClick={() => {
            toggleState();
        }}>
        Dark Mode <i className={"fas fa-toggle-" + toggle}></i>
        </button>
      </nav>

      <div className="container pt-5">
        <Page/>
      </div>
    </div>
  );
}

export default App;
