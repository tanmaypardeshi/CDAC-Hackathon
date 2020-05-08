import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import { SummaryContextConsumer } from '../context/summary';
import { ThemeContextConsumer } from '../context/themer';

export default function MySummaries(){

    const [mySumms, setMySumms] = useState([]);
    const [dummyvar, setDummyVar] = useState();
    let history = useHistory();

    const fetchSummaries = () => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                Authorization: `Bearer ${localStorage.usertoken}`
            },
            url: "http://localhost:5000/mysummaries",
        })
        .then((response) => {
            //console.log(response.data.mysummaries[0].title);
            console.log(response.data.mysummaries.length);
            setMySumms(response.data.mysummaries);
            //console.log(response.data.mysummaries);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => { fetchSummaries() }, [dummyvar]);

    // const handleClick = (event) => {
    //     //console.log(event.currentTarget.value);
    //     //console.log(mySumms[event.currentTarget.value].summary);
    // }

    return(
        localStorage.length 
        ?
        <SummaryContextConsumer>
            {(summContext) => (
                <ThemeContextConsumer>
                    {(themeContext) => (
                        <div className={
                            "col justify-content-center pt-5 pl-5 pr-5 text-" 
                            + (themeContext.dark ? "light" : "dark")
                            + " bg-" + (themeContext.dark ? "dark" : "white")                        
                        }
                        style = {{
                            minHeight:"100vh",
                            minWidth: "100vw"
                        }}>
                            {
                                mySumms.length ? <>
                                <div className="container pt-3">
                                    <h1 className="display-4 pl-4">
                                        Your Summaries
                                    </h1>
                                </div>
                                <div className="container pt-3">
                                    <table 
                                    className={"table table-bordered table-striped table-hover table-" + (themeContext.dark ? "dark" : "light")}>
                                        <thead>
                                            <tr>
                                                <th scope = "col">#</th>
                                                <th scope = "col">File Name</th>
                                                <th scope = "col">Summary Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                mySumms.map((contents,index) => {
                                                    return(
                                                        <tr>
                                                            <th scope = "row">{index+1}</th>
                                                            <td>{contents.title}</td>
                                                            <td>
                                                                <button 
                                                                type = "button" 
                                                                className="btn btn-link" 
                                                                value={index} 
                                                                onClick={(event) => {
                                                                    //console.log(mySumms[event.currentTarget.value].summary);
                                                                    summContext.putSummary(mySumms[event.currentTarget.value].summary);
                                                                    history.push('/viewsummary');
                                                                }}
                                                                >
                                                                    Link
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                </>
                                :
                                <div className="container pt-3">
                                    <h1 className="display-4 pl-4">
                                        Nothing to see here yet!
                                    </h1>
                                </div>
                            }
                        </div>
                    )}
                </ThemeContextConsumer>
            )}
        </SummaryContextConsumer>
        
        :
        //Auto-redirection to home page if user is not logged in
        <>
        <Redirect to = '/'/>
        </>
    );
}
