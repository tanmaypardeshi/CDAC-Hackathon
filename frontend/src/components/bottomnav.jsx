import React, {useEffect} from 'react';
import { makeStyles, AppBar, Tabs, Tab, Toolbar } from '@material-ui/core';
import {ThemeContextConsumer} from '../context/themer';
import { useLocation, useHistory } from 'react-router-dom';

const useStyles = makeStyles({
	appBar: {
		top: 'auto',
		bottom: 0,
		flexGrow: 1
	}
});

export default function BottomNav() {
	const classes = useStyles();
	
	const [value, setValue] = React.useState(0);
	const history = useHistory();
	const location = useLocation();

	useEffect(() => {
        const route = location.pathname;
        if(route === '/')
            setValue(0);
        else if(route === '/irquery')
            setValue(1);
        else if(route === '/summarizer')
			setValue(2);
		else if(route === '/anomalies')
			setValue(3);
        else
            setValue(-1);
    }, [location])

	const handleChange = (event, newValue) => {
		setValue(newValue);
		switch(newValue){
			case 0:
				history.push('/');
				break;
			case 1:
				history.push('/irquery');
				break;
			case 2:
				history.push('/summarizer');
				break;
			case 3:
				history.push('/anomalies');
				break;
			default:
				console.log("Mazaak hai kya?")
		}
	}

	return (
		<ThemeContextConsumer>
			{(themeContext) => (
				<>
				<Toolbar/>
				<AppBar position = "fixed" className = {classes.appBar} style = {{
					backgroundColor: themeContext.dark ? '#212121' : 'white',
					color: themeContext.dark && 'black'
				}}>
					<Toolbar>	  
							<Tabs
								value={value}
								onChange={handleChange}
								indicatorColor="primary"
								textColor="primary"
								color = "inherit"
								style = {{width: '100%'}}
								centered
								variant = "fillwidth"
							>
								<Tab label="News" style = {{color: themeContext.dark && 'white'}}/>
								<Tab label="Search" style = {{color: themeContext.dark && 'white'}} />
								<Tab label="Summarize" style = {{color: themeContext.dark && 'white'}}/>
								<Tab label="Anomalies" style = {{color: themeContext.dark && 'white'}}/>
							</Tabs>
					</Toolbar>
				</AppBar>
				</>
			)}
		</ThemeContextConsumer>
		
	);
}