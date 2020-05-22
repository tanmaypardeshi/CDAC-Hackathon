import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, MenuItem, IconButton} from '@material-ui/core';
import {Visibility, VisibilityOff} from '@material-ui/icons';
import PropTypes from 'prop-types';
import axios from 'axios';
import { setUserTokenCookie } from '../functions/cookiefns';

export const Register = ({isOpen, handleClose}) => {

	const [values, setValues] = useState({
		email: '',
		name: '',
		password: '',
		cnfpass: '',
		profession: 'student',
        showPassword: false,
    })

    const [errors, setErrors] = useState({
        emailErr: false,
        nameErr: false,
        passwordErr: false,
        cnfpassErr: false,
        registerErr: false,
    })
	
	const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value });

        if(event.target.name === 'name'){
            setErrors({...errors, nameErr: (event.target.value === '')});
        }
        else if(event.target.name === 'email'){
            setErrors({...errors, emailErr: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(event.target.value)});
        } 
        else if (event.target.name === 'password'){
            var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
            setErrors({...errors, passwordErr: !strongRegex.test(event.target.value)});
        } 
        else if (event.target.name === 'cnfpass') {
            setErrors({...errors, cnfpassErr: (values.password !== event.target.value)});
        }

    }

    const handleShowPassword = () => {
        setValues({...values, showPassword: !values.showPassword})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!errors.emailErr && !errors.passwordErr && !errors.cnfpassErr && !errors.nameErr){
            axios({
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type" : "application/json"
                },
                data: {
                    "email": values.email,
                    "name": values.name,
                    "password": values.password,
                    "profession": values.profession
                },
                url: "/api/register",
            })
            .then((response) => {                
                setUserTokenCookie(response.data.data.token);
                setErrors({...errors, registerErr: false});
                handleClose();
            })
            .catch((err) => {
                setErrors({...errors, registerErr: true});
            });
        }
    }
  
    return (
      <div>
        <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form onSubmit = {handleSubmit}>
          <DialogTitle id="form-dialog-title">Register</DialogTitle>
          <DialogContent>
            <TextField
                variant = "outlined"
                margin="normal"
				id="name"
				name="name"
                label="Name"
				type="name"
                onChange = {handleChange}
                error = {errors.nameErr}
                helperText = {errors.nameErr && "Your name is required"}
                autoFocus required fullWidth
            />
            <TextField
                error = {errors.emailErr}
                variant = "outlined"
                margin="normal"
				id="email"
				name="email"
                label="Email Address"
				type="email"
                onChange = {handleChange}
                helperText = {
                    errors.emailErr 
                    ?
                    values.email.length ? "Invalid email address format" : "Email Address is required"
                    : 
                    null
                }
                required fullWidth
            />
            <TextField
                variant = "outlined"
                error = {errors.passwordErr}
                helperText = {
                    errors.passwordErr 
                    ?
                        values.password.length 
                        ? 
                        "Password must have atleast 8 characters with 1 small letter, capital letter, number and symbol"
                        :
                        "Password is required"
                    :
                    null
                    }
                margin="normal"
				id="password"
				name="password"
                label="Password"
				type={values.showPassword ? 'text' : 'password'}
				onChange = {handleChange}
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
            <TextField
                variant = "outlined"
                error = {errors.cnfpassErr}
                helperText = {
                    errors.cnfpassErr 
                    ?
                    values.cnfpass.length ? "Passwords do not match" : "You need to confirm password"
                    : 
                    null
                }
                margin="normal"
				id="cnfpass"
				name="cnfpass"
                label="Confirm Password"
				type={values.showPassword ? 'text' : 'password'}
				onChange = {handleChange}
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
            <TextField
				variant = "outlined"
				margin = "normal"
				id="profession"
				name="profession"
				label="Select"
				value = {values.profession}
                onChange = {handleChange}
                error = {errors.registerErr}
                helperText = {errors.registerErr && (values.email + " is already registered!")}
				select required fullWidth
            >
				<MenuItem selected value = "student">student</MenuItem>
				<MenuItem value = "teacher">teacher</MenuItem>
				<MenuItem value = "researcher">researcher</MenuItem>
				<MenuItem value = "other">other</MenuItem>
			</TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" type = "submit">
              Register
            </Button>
          </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }

  Register.propTypes = {
      isOpen: PropTypes.bool.isRequired,
      handleClose: PropTypes.func.isRequired
  }