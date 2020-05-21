import React from 'react';
import { Container, Typography, Grid } from '@material-ui/core';
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
        margin: 10,
        padding: 10,
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
    Number.prototype.padding = function(base, chr) {
        var len = (String(base || 10).length - String(this).length) + 1; 
        return len > 0 ? new Array(len).join(chr || '0') + this : this; 
    }

    return(
        typeof sessionStorage.summary !== 'undefined' ?
        <ThemeContextConsumer>
            {(themeContext) => (
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
                                        d.getDate().padding() + '-' + 
                                        (d.getMonth()+1).padding() + '-' +
                                        d.getFullYear() + '_' +
                                        d.getHours().padding() + '-' +
                                        d.getMinutes().padding() + '-' +
                                        d.getSeconds().padding() + '.pdf'
                                }>
                                    {({blob, url, loading, error}) => (
                                            loading ? 'Loading document...' : <PictureAsPdf style = {{color: themeContext.dark ? 'white' : 'black'}}/>
                                    )}
                                </PDFDownloadLink>
                            </Typography>
                        </Grid>
                        
                        
                        <Typography variant = "body1" align='justify'>{sessionStorage.summary}</Typography>
                    </Container>
                </div>
            )}
        </ThemeContextConsumer> :
        <Redirect to = '/summarizer'/>
    )
}