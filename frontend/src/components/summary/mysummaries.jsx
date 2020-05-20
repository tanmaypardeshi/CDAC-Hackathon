import React, {useEffect, useState, useRef} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ThemeContextConsumer } from '../../context/themer';
import { Container } from '@material-ui/core';
import MaterialTable from 'material-table';
import { getCookie } from '../../functions/cookiefns';

export default function MySummaries(){

    const [dummy, setDummy] = useState(null);
    const [mySumms, setMySumms] = useState([]);
    var cookie = useRef();

    let history = useHistory();

    const fetchSummaries = () => {
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${cookie}`
            },
            url: "/api/mysummaries",
        })
        .then((response) => {
            setMySumms(response.data.mysummaries);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() => { 
        cookie = getCookie("usertoken");
        fetchSummaries() 
    }, [dummy]);

    return(
        cookie !== '' ? 
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
                                    sessionStorage.setItem('summary', rowdata.summary);
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