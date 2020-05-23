import React, {useEffect, useState} from 'react';
import { Redirect} from 'react-router-dom';
import axios from 'axios';
import { ThemeContextConsumer } from '../../context/themer';
import { Container, Fade } from '@material-ui/core';
import MaterialTable from 'material-table';
import { getCookie } from '../../functions/cookiefns';

export default function MyBookmarks(){
    const dummy = null;
    const [myBookmarks, setMyBookmarks] = useState([]);

    const fetchBookmarks = () => {
        const cookie = getCookie("usertoken");
        axios({
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type" : "application/json",
                "Authorization": `Bearer ${cookie}`
            },
            url: "/api/myqueries",
        })
        .then((response) => {
            setMyBookmarks(response.data.mysummaries)
        })
        .catch((err) => window.alert(err));
    }

    useEffect(() => { 
        if(getCookie("usertoken") !== '');
            fetchBookmarks();
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
                        <h1 style = {{fontWeight: 300}}>My Bookmarks</h1>
                        <MaterialTable
                            style = {{
                                backgroundColor: themeContext.dark ? '#424242' : "white",
                                color: themeContext.dark ? 'white' : 'black',
                            }}
                            options={{
                                exportButton: true,
                                actionsColumnIndex: -1,
                                sorting: true,
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
                                { title: 'Title', field: 'title' },
                                { title: 'Author',field: 'author_name'},
                            ]}
                            actions={[
                                {
                                    icon: 'link',
                                    iconProps: {style: {color: themeContext.dark ? 'white' : 'black'}},
                                    tooltip: 'Open link',
                                    onClick: (event, rowdata) => {
                                        window.open(rowdata.link, '_blank', 'noopener noreferrer');
                                    }
                                },
                                {
                                    icon: 'delete',
                                    iconProps: {style: {color: themeContext.dark ? 'white' : 'black'}},
                                    tooltip: 'Remove Bookmark',
                                    onClick: (event, rowdata) => {
                                        let newTable = [...myBookmarks];
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
                                                "content": newTable[index].content,
                                                "author_name": newTable[index].author_name,
                                                "link": newTable[index].link
                                            },
                                            url: "/api/remove_bookmark",
                                        }).then((response) => {
                                            //console.log(response);
                                            newTable.splice(index,1);
                                            setMyBookmarks(newTable);
                                        }).catch((err) => {
                                            //console.log(err);
                                            window.alert(err);
                                        })
                                    }
                                }
                            ]}
                            data={myBookmarks}
                            detailPanel = {rowData => {
                                return(
                                    <ThemeContextConsumer>
                                        {(themeContext) => (
                                            <Container style = {{
                                                color: themeContext.dark ? "white" : "black",
                                                padding: '1vh 2vw 1vh 4vw'
                                                }}>
                                                    {rowData.content}
                                            </Container>
                                        )}
                                    </ThemeContextConsumer>
                                )
                            }}
                        />
                    </Container>
                </div>
                </Fade>
                
            )}
        </ThemeContextConsumer>
        :
        <Redirect to = '/'/>
    );
}