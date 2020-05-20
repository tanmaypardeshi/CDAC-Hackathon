import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, IconButton} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setUserTokenCookie } from '../functions/cookiefns';

export const Login = ({isOpen, handleClose}) => {


    const [values, setValues] = useState({
        email: '',
        password: '',
		showPassword: false,
	})
	
	const [emailErr, setEmailErr] = useState(false);
	const [passErr, setPassErr] = useState(false);
	const [loginErr, setLoginErr] = useState(false);

    const handleChange = (event) => {
		setValues({...values, [event.currentTarget.id]: event.currentTarget.value });
		if(event.currentTarget.id === 'email')
			setEmailErr(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(event.currentTarget.value));
		if(event.currentTarget.id === 'password')
			setPassErr(event.currentTarget.value.length ? false : true)
    }

    const handleShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword});
    }

    const handleSubmit = (event) => {
		event.preventDefault();
		if(!values.email.length)
			setEmailErr(true);
		if(!values.password.length)
			setPassErr(true);

		if(!emailErr && !passErr && values.password.length && values.email.length){
			axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": values.email,
                    "password": values.password
                },
                url: "/api/login",
            })
            .then((response) => {
				setUserTokenCookie(response.data.data.token);
				setLoginErr(false);
				handleClose();
            })
            .catch((err) => {
				setLoginErr(true);
				console.log(err);
            })
		}
    }
  
    return (
      <div>
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
			<form onSubmit = {handleSubmit}>
				<DialogTitle id="form-dialog-title">Login</DialogTitle>
				<DialogContent>
					<TextField
						error = {emailErr}
						variant="outlined"
						margin="normal"
						id="email"
						label="Email Address"
						type="email"
						onChange = {handleChange}
						helperText = {emailErr ? values.email.length ? "Invalid Email Address" : "Required!" : null}
						autoFocus required fullWidth
					/>
					<TextField
						error = {passErr}
						variant = "outlined"
						margin="normal"
						id="password"
						label="Password"
						type={values.showPassword ? 'text' : 'password'}
						onChange = {handleChange}
						helperText = {passErr ? "Required!" : loginErr ? "Invalid Credentials" : null}
						InputProps = {{
							endAdornment: 
								<IconButton
									aria-label = "toggle password visibility"
									onClick = {handleShowPassword}    
								>
									{values.showPassword ? <Visibility /> : <VisibilityOff />}
								</IconButton>
						}}
						required fullWidth
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="secondary">
						Cancel
					</Button>
					<Button onClick={handleSubmit} color="primary" type = "submit">
						Login
					</Button>
				</DialogActions>
			</form>
			
        </Dialog>
      </div>
    );
  }

  Login.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      handleClose: PropTypes.func.isRequired
  }