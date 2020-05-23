import React from 'react';
import { Container, Typography, Grid, Fade } from '@material-ui/core';
import { ThemeContextConsumer } from '../../context/themer';
import { Redirect } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import { PictureAsPdf } from '@material-ui/icons';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF'
    },
    section: {
        margin: '96px',
        fontSize: '14',
        flexGrow: 1
    }
});

const MyDocument = () => (
    <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text>{sessionStorage.summary !== 'undefined' ? sessionStorage.summary : null}</Text>
      </View>
    </Page>
  </Document>
)

export default function ViewSummary() {
    
    var d = new Date();

    return(
        typeof sessionStorage.summary !== 'undefined' ?
        <ThemeContextConsumer>
            {(themeContext) => (
                <Fade in = {true}>
                    <div style = {{
                    minHeight: '100vh',
                    paddingTop: '5vh',
                    backgroundColor: themeContext.dark && '#212121',
                    color: themeContext.dark && 'white',
                    fontWeight: '300'
                }}>  
                    <Container>
                        <Grid container direction = "row" justify = "space-between" alignItems ="center">
                            <Typography variant = "h2" align='left' gutterBottom>
                                Summary
                            </Typography>
                            <Typography variant = "h2" align = 'right' gutterBottom>
                                <PDFDownloadLink 
                                    document = {<MyDocument/>} 
                                    fileName = {
                                        "CLASP" + 
                                        d.getDate().toString().padStart(2, '0') + '-' + 
                                        (d.getMonth()+1).toString().padStart(2, '0') + '-' +
                                        d.getFullYear().toString().padStart(4, '0') + '_' +
                                        d.getHours().toString().padStart(2, '0') + '-' +
                                        d.getMinutes().toString().padStart(2, '0') + '-' +
                                        d.getSeconds().toString().padStart(2, '0') + '.pdf'
                                }>
                                    {({blob, url, loading, error}) => (
                                            loading 
                                            ? 
                                                'Loading document...' 
                                            : 
                                                <PictureAsPdf style = {{color: themeContext.dark ? 'white' : 'black', fontSize: 40}}/>
                                    )}
                                </PDFDownloadLink>
                            </Typography>
                        </Grid>
                        
                        
                        <Typography variant = "body1" align='justify'>{sessionStorage.summary}</Typography>
                    </Container>
                </div>
                </Fade>
                
            )}
        </ThemeContextConsumer> :
        <Redirect to = '/summarizer'/>
    )
}