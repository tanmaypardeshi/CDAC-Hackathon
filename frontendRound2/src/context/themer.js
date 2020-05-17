import React, {useState, createContext} from 'react';
const {Provider, Consumer} = createContext();

const ThemeContextProvider = props => {
    const [dark, setDark] = useState(false);
    function toggleTheme(){
        setDark(!dark);
    }

    return (
        <Provider value = {{dark, toggleTheme}}>
            {props.children}
        </Provider>
    )
}

export {ThemeContextProvider, Consumer as ThemeContextConsumer}


