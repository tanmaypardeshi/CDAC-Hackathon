import React, {useEffect, useState} from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import axios from 'axios';
import { ThemeContextConsumer } from '../../context/themer';
import { Container, Fade } from '@material-ui/core';
import MaterialTable from 'material-table';
import { getCookie } from '../../functions/cookiefns';

export default function MySummaries(){

    const dummy = null;
    const [mySumms, setMySumms] = useState([]);

    let history = useHistory();

    const fetchSummaries = () => {
        const cookie = getCookie("usertoken");
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
        .catch((err) => window.alert(err));
    }

    useEffect(() => { 
        fetchSummaries() 
    }, [dummy]);

    return(
        getCookie("usertoken") !== '' ? 
        <ThemeContextConsumer>
            {(themeContext) => (
                <Fade in = {true}>
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
                            actions={[
                                {
                                    icon: 'notes',
                                    iconProps: {style: {color: themeContext.dark ? 'white' : 'black'}},
                                    tooltip: 'view summary',
                                    onClick: (event, rowdata) => {
                                        sessionStorage.setItem('summary', rowdata.summary);
                                        history.push('/viewsummary');
                                     }
                                },
                                {
                                    icon:'delete',
                                    iconProps: {style: {color: themeContext.dark ? 'white' : 'black'}},
                                    tooltip: 'delete',
                                    onClick: (event, rowdata) => {
                                        let newTable = [...mySumms];
                                        const index = newTable.indexOf(rowdata);
                                        axios({
                                            method: "POST",
                                            headers: {
                                                "Access-Control-Allow-Origin": "*",
                                                "Content-Type" : "application/json",
                                                "Authorization": `Bearer ${getCookie("usertoken")}`
                                            },
                                            data: {
                                                "title": newTable[index].title,
                                            },
                                            url: "/api/remove_summary",
                                        }).then((response) => {
                                            //console.log(response);
                                            newTable.splice(index,1);
                                            setMySumms(newTable);
                                        }).catch((err) => {
                                            //console.log(err);
                                            window.alert(err);
                                        })
                                    }

                                }
                            ]}
                        />
                    </Container>
                </div>
                </Fade>
            )}
        </ThemeContextConsumer>
        :
        <Redirect to = '/'/>
    )
}