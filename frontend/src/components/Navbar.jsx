import React, {useContext, useState} from 'react'
import {Modal, Button, Dropdown, Form, Row, Col} from 'react-bootstrap';
import {ThemeContextConsumer} from '../context/themer';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { Link, Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

export default function NavBar(props) {

    
    let history = useHistory();
    const [showLogIn, setShowLogIn] = useState(false);
    const toggleLogIn = () => setShowLogIn(!showLogIn);

    const [showSignUp, setShowSignUp] = useState(false);
    const toggleSignUp = () => setShowSignUp(!showSignUp);

    const [loginValidated, setLoginValidated] = useState(false);
    const [signupValidated, setSignupValidated] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const [signUpError, setSignUpErr] = useState(false);
    const [pwdmismatch, setPwdMismatch] = useState(false);

    const [emailAddr, setEmailAddr] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confpass, setConfPass] = useState("");
    const [job, setJob] = useState("student");

    const [tokenUser, setTokenUser] = useState("");

    const handleSignInSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
         if (form.checkValidity() === false) {
            event.stopPropagation();
            setLoginValidated(true);
        } else {
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": emailAddr,
                    "password": password
                },
                url: "/api/login",
            })
            .then((response) => {
                localStorage.setItem('usertoken', response.data.data.token);
                setTokenUser(jwt_decode(localStorage.usertoken).identity.name);
                toggleLogIn();
            })
            .catch((err) => {
                console.log(err);
                setLoginError(true);
            })
        }
    };

    const handleSignUpSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if(form.checkValidity() === false){
            event.stopPropagation();
            setSignupValidated(true);
        } else if (password !== confpass) {
            setPwdMismatch(true);
        } else {
            setPwdMismatch(false);
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": emailAddr,
                    "name": name,
                    "password": password,
                    "profession": job
                },
                url: "/api/register",
            })
            .then((response) => {
                localStorage.setItem('usertoken', response.data.data.token);
                setTokenUser(jwt_decode(localStorage.usertoken).identity.name);
                toggleSignUp();
            })
            .catch((err) => {
                console.log(err);
                setSignUpErr(true);
            });
        }
    }

    const logOut = (e) => {
        e.preventDefault();
        localStorage.clear();   // WARNING: COMPLETELY CLEARS LOCALSTORAGE
        setTokenUser(null);
        setLoginError(false);
        setLoginValidated(false);
        setSignupValidated(false);
        setPwdMismatch(false);
        setSignUpErr(false);
        history.push('/');
    }


    return(
                <ThemeContextConsumer>
                {(context)=> (
                    <div>
                    <nav className={"navbar justify-content-between fixed-top text-" + (context.dark ? 'light' : 'dark')}>
                    <a className={"navbar-brand mb-0 h1 text-" + (context.dark ? 'light' : 'dark')} href="/">CLASP</a>
                    <Dropdown>
                    <Dropdown.Toggle 
                    variant={(context.dark ? 'outline-light' : 'outline-dark')} 
                    id="dropdown-basic" 
                    bsPrefix="default" 
                    style={{
                        content: "none"
                    }}>
                        {
                            localStorage.length 
                            ? 
                            <strong>{jwt_decode(localStorage.usertoken).identity.name.split(" ").map((n)=>n[0]).join("")}</strong>
                            : 
                            <i className="fas fa-bars"></i>
                        }
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {
                                (localStorage.length) ? 
                                <>
                                <Dropdown.Item> 
                                    {localStorage.length ? jwt_decode(localStorage.usertoken).identity.name : null}
                                </Dropdown.Item>
                                <Link to = '/mysummaries' style={{ textDecoration: 'none', color: 'black' }}>
                                    <Dropdown.Item as = "button">My Summaries</Dropdown.Item>
                                </Link>
                                <Dropdown.Divider />
                                <Dropdown.Item as = "button" onClick={logOut}>Log Out</Dropdown.Item>
                                </>
                                :
                                <>
                                <Dropdown.Item onClick={toggleLogIn}>Sign In</Dropdown.Item>
                                <Dropdown.Item onClick={toggleSignUp}>Sign Up</Dropdown.Item>
                                </>
                            }
                            <Dropdown.Divider />
                            
                            <Link to = '/' style={{ textDecoration: 'none', color: 'black' }}>
                            <Dropdown.Item as = "button">
                                Home
                            </Dropdown.Item>
                            </Link>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={context.toggleTheme}>
                                Dark Mode <FontAwesomeIcon icon = {(context.dark ? faToggleOn : faToggleOff)}/>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </nav>
    
                <Modal show={showLogIn} onHide={toggleLogIn} size="sm" centered>
                    <Modal.Header closeButton>
                    <Modal.Title>Sign In</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                    <Form noValidate validated={loginValidated} onSubmit={handleSignInSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Control 
                                type="email" 
                                placeholder="Email Address" 
                                onChange={(e)=>{
                                    setEmailAddr(e.target.value)
                                }}
                                required
                            />
                            <Form.Control.Feedback type = "invalid">
                                "Email Address required!" 
                            </Form.Control.Feedback>
                        </Form.Group>
    
                        <Form.Group controlId="formBasicPassword">
                            <Form.Control 
                            type="password"
                            placeholder="Password" 
                            onChange = {(e) => {
                                setPassword(e.target.value)
                            }}
                            required
                            />
                            {loginError
                            ?
                            <p className="text-danger"><small>"Invalid Credentials!"</small></p>
                            :null}
                            <Form.Control.Feedback type = "invalid">
                                "Password required!"
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Button variant="primary" type="submit" block>
                            Sign In
                        </Button>
                    </Form>
                    </Modal.Body>
                </Modal>
    
                <Modal show = {showSignUp} onHide = {toggleSignUp} size="sm" centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Sign Up</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate validated={signupValidated} onSubmit={handleSignUpSubmit}>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control 
                                    type="email" 
                                    placeholder="Email Address"
                                    onChange = {(e)=>setEmailAddr(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type = "invalid">
                                    "Email Address required!"
                                </Form.Control.Feedback>
                            </Form.Group>
    
                            <Form.Group controlId="formBasicText">
                                <Form.Control 
                                    type="text" 
                                    placeholder="Name"
                                    onChange = {(e)=>setName(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type = "invalid">
                                    "Name required!"
                                </Form.Control.Feedback>
                            </Form.Group>
    
                            <Form.Group controlId="formBasicPassword">
                                <Form.Control 
                                type="password"
                                placeholder="Password"
                                onChange = {(e)=>setPassword(e.target.value)}
                                required
                                />
                                <Form.Control.Feedback type = "invalid">
                                    "Password required!"
                                </Form.Control.Feedback>
                            </Form.Group>
    
                            <Form.Group controlId="formBasicConfirmPassword">
                                <Form.Control 
                                type="password"
                                placeholder="Confirm Password"
                                onChange = {(e)=>setConfPass(e.target.value)}
                                required
                                />
                                <p className="text-danger">
                                    <small>
                                        {
                                            pwdmismatch 
                                            ?
                                            '"Passwords do not match!"'
                                            :
                                            null
                                        }
                                    </small>
                                    <Form.Control.Feedback type = "invalid">
                                        "Password required!"
                                    </Form.Control.Feedback>
                                </p>
                                
                            </Form.Group>
    
                            <Form.Group controlId="exampleForm.SelectCustom">
                                <Form.Label>Select a profession</Form.Label>
                                    <Form.Control 
                                    as="select" 
                                    onChange = {(e)=>setJob(e.target.value)}
                                    custom required>
                                        <option selected value = "student">Student</option>
                                        <option value = "student">Teacher</option>
                                        <option value = "student">Researcher</option>
                                        <option value = "student">Other</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type = "invalid">
                                        "Select a profession!"
                                    </Form.Control.Feedback>
                                    
                                    {
                                        signUpError 
                                        ? 
                                        <p className="text-danger">
                                            <small>
                                                "Account already exists!"
                                            </small>
                                        </p>
                                        :
                                        null
                                    }
                            </Form.Group>
    
                            <Button variant="primary" type="submit" block>
                                Sign Up
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
    
                </div>
                )}
            </ThemeContextConsumer>
            
        
    );
}
