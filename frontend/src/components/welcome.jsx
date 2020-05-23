import React, {useState} from 'react';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';
import {Link, Hidden} from '@material-ui/core';
import SummSlide from '../images/summslide.svg';
import Cover from '../images/cover.svg';
import IRSlide from '../images/irslide.svg';
import QnaSlide from '../images/qnaslide.svg';
import AnomalySlide from '../images/anomalyslide.svg';
import { useHistory } from 'react-router-dom';
import { getCookie } from '../functions/cookiefns';

export const Welcome = () => {

    const [open, setOpen] = useState(true);
    const history = useHistory();

    const handleClick = (event) => {
        event.preventDefault();
        history.push('/' + event.currentTarget.id)
    }

    return(
        (getCookie("usertoken") === '' && typeof sessionStorage.visited === 'undefined') ?
        <div /* style = {{ position: "relative", width: '100%', height: 500}} */>
            <Hidden smDown>
                <AutoRotatingCarousel
                    label = "Get Started"
                    ButtonProps = {{
                        style: {
                            color: 'white',
                            backgroundColor: 'transparent'
                        }
                    }}
                    open = {open}
                    onClose = {()=>{
                        setOpen(false);
                        sessionStorage.setItem('visited', true);
                    }}
                    onStart = {()=>setOpen(false)}
                    mobile = {false}
                    autoplay = {true}
                    style = {{position:"absolute"}}
                >
                    <Slide
                        title = "Welcome to CLASP"
                        subtitle = "COVID-19 Literature Analysis and Summarization Platform"
                        media = {<img src = {Cover} alt=''/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121' }}
                    />
                    <Slide
                        title = {
                            <Link id='summarizer' href = '/summarizer' color="inherit" onClick = {handleClick}>
                                Summarize
                            </Link>
                        }
                        subtitle = "and quickly review your documents in an easy way"
                        media = {<img src = {SummSlide} alt=''/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121' }}
                    />
                    <Slide
                        title = {
                            <Link id='irquery' href = '/irquery' color="inherit" onClick = {handleClick}>
                                Find
                            </Link>
                        }
                        subtitle = "documents by their names and authors"
                        media = {<img src = {IRSlide} alt=''/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242'}}
                        style={{ backgroundColor: '#212121' }}
                    />
                    <Slide
                        title = "Ask"
                        subtitle = "and you shall receive (the answer to your COVID-19 related queries)"
                        media = {<img src = {QnaSlide} alt=''/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121' }}
                    />
                    <Slide
                        title = {
                            <Link id='anomalies' href = '/anomalies' color="inherit" onClick = {handleClick} disabled>
                                Detect anomalies
                            </Link>
                        }
                        subtitle = "and be on the safer side"
                        media = {<img src = {AnomalySlide} alt=''/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121' }}
                    />

                </AutoRotatingCarousel>
            </Hidden>
            <Hidden mdUp>
                <AutoRotatingCarousel
                    label = "Get Started"
                    ButtonProps = {{
                        style: {
                            color: 'white',
                            backgroundColor: 'transparent'
                        }
                    }}
                    open = {open}
                    onClose = {()=>{
                        setOpen(false);
                        sessionStorage.setItem('visited', true);
                    }}
                    onStart = {()=>setOpen(false)}
                    mobile = {true}
                    autoplay = {true}
                    style = {{position:"absolute"}}
                >
                    <Slide
                        title = "Welcome to CLASP"
                        subtitle = "COVID-19 Literature Analysis and Summarization Platform"
                        media = {<img src = {Cover} alt='' style = {{width: '90%', height: 'auto'}}/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121'}}
                    />
                    <Slide
                        title = {
                            <Link id='summarizer' href = '/summarizer' color="inherit" onClick = {handleClick}>
                                Summarize
                            </Link>
                        }
                        subtitle = "and quickly review your documents in an easy way"
                        media = {<img src = {SummSlide} alt='' style = {{width: '90%', height: 'auto'}}/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121'}}
                    />
                    <Slide
                        title = {
                            <Link id='irquery' href = '/irquery' color="inherit" onClick = {handleClick}>
                                Find
                            </Link>
                        }
                        subtitle = "documents by their names and authors"
                        media = {<img src = {IRSlide} alt='' style = {{width: '90%', height: 'auto'}}/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242'}}
                        style={{ backgroundColor: '#212121'}}
                    />
                    <Slide
                        title = "Ask"
                        subtitle = "and you shall receive (the answer to your COVID-19 related queries)"
                        media = {<img src = {QnaSlide} alt='' style = {{width: '90%', height: 'auto'}}/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121'}}
                    />
                    <Slide
                        title = {
                            <Link id='anomalies' href = '/anomalies' color="inherit" onClick = {handleClick} disabled>
                                Detect anomalies
                            </Link>
                        }
                        subtitle = "and be on the safer side"
                        media = {<img src = {AnomalySlide} alt='' style = {{width: '90%', height: 'auto'}}/>}
                        mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                        style={{ backgroundColor: '#212121'}}
                    />
                </AutoRotatingCarousel>
            </Hidden>
            
        </div> : null
    );
}
