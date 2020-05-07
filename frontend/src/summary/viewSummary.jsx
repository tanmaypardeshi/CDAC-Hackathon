import React from 'react';
import {SummaryContextConsumer} from '../context/summary';
import { ThemeContextConsumer } from '../context/themer';

export default function summary() {
    return(
        <SummaryContextConsumer>
            {(summContext) => (
                <ThemeContextConsumer>
                    {(themeContext) => (
                        <div 
                        className={
                            "col justify-content-center pt-5 pl-5 pr-5 text-" 
                            + (themeContext.dark ? "light" : "dark")
                            + " bg-" + (themeContext.dark ? "dark" : "light")                        
                        }
                        style = {{
                            minHeight:"100vh",
                            minWidth: "100vw",
                        }}>
                            <h1 className="display-4 pl-4">
                                Your Summary
                            </h1>
                            <div className="row justify-content-center pt-3 pl-5 pr-5">
                                <p className="text-justify">
                                    {summContext.summary}
                                </p>
                            </div>
                        </div>
                    )}
                </ThemeContextConsumer>
            )}
        </SummaryContextConsumer>
    );
}