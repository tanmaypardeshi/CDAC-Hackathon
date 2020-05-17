import React, {useEffect, useState} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ThemeContextConsumer } from '../../context/themer';
import { Container } from '@material-ui/core';
import {Link} from '@material-ui/icons';
import MaterialTable from 'material-table';

export default function MySummaries(){

    const dummy = null;
    const [mySumms, setMySumms] = useState([]);

    let history = useHistory();

    const fetchSummaries = () => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${localStorage.usertoken}`
            },
            url: "/api/mysummaries",
        })
        .then((response) => {
            setMySumms(response.data.mysummaries);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => { fetchSummaries() }, [dummy]);

    return(
        localStorage.usertoken.length ? 
        <ThemeContextConsumer>
            {(themeContext) => (
                <div style = {{
                    minHeight: "100vh",
                    backgroundColor: themeContext.dark ? '#212121' : "white",
                    color: themeContext.dark ? 'white' : 'black',
                }}>
                    <Container style = {{paddingTop: "8vh"}}>
                        <h1 style = {{fontWeight: 300}}>Summaries</h1>
                        <MaterialTable
                            style = {{
                                backgroundColor: themeContext.dark ? '#424242' : "white",
                                color: themeContext.dark ? 'white' : 'black',
                            }}
                            options={{
                                sorting: true,
                                actionsColumnIndex: -1,
                                headerStyle: {
                                    backgroundColor: themeContext.dark ? '#424242' : "white",
                                    color: themeContext.dark ? 'white' : 'black',
                                },
                                rowStyle: {
                                    backgroundColor: themeContext.dark ? '#535353' : "white"
                                },
                                searchFieldAlignment: 'left',
                                searchFieldStyle: {
                                    color: themeContext.dark ? 'white' : 'black',
                                },
                                showTitle: false
                            }}
                            columns={[
                                { title: 'File Name', field: 'title' },
                            ]}
                            data={mySumms}
                            actions={[{
                                icon: 'notes',
                                iconProps: {style: {color: themeContext.dark ? 'white' : 'black'}},
                                tooltip: 'view summary',
                                onClick: (event, rowdata) => {
                                    console.log(rowdata);
                                    localStorage.setItem('summary', rowdata.summary);
                                    history.push('/viewsummary');
                                }
                            }]}
                        />
                    </Container>
                </div>
            )}
        </ThemeContextConsumer>
        :
        <Redirect to = '/'/>
    )
}