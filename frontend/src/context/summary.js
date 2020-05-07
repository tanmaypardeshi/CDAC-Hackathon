import React, {useState, createContext} from 'react';
const {Provider, Consumer} = createContext(undefined, undefined);

const SummaryContextProvider = props => {
    const [summary, setSummary] = useState("");
    const putSummary = (summaryArg) => {
        setSummary(summaryArg)
    }

    return(
        <Provider value = {{summary, putSummary}}>
            {props.children}
        </Provider>
    );
}

export {SummaryContextProvider, Consumer as SummaryContextConsumer}

