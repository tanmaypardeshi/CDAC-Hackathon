import React, {useState} from 'react';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';
import {Link} from '@material-ui/core';
import SummSlide from '../images/summslide.svg'
import Cover from '../images/cover.svg'
import IRSlide from '../images/irslide.svg'
import QnaSlide from '../images/qnaslide.svg'
import { useHistory } from 'react-router-dom';

export const Welcome = () => {

    const [open, setOpen] = useState(true);
    const history = useHistory();

    const handleClick = (event) => {
        event.preventDefault();
        history.push('/' + event.currentTarget.id)
    }

    return(
        !localStorage.usertoken.length && 
        <div /* style = {{ position: "relative", width: '100%', height: 500}} */>
            <AutoRotatingCarousel
                label = "Get Started"
                ButtonProps = {{
                    style: {
                        color: 'white',
                        backgroundColor: 'transparent'
                    }
                }}
                open = {open}
                onClose = {()=>setOpen(false)}
                onStart = {()=>setOpen(false)}
                mobile = {false}
                autoplay = {true}
                style = {{position:"absolute"}}
            >
                <Slide
                    title = "Welcome to CLASP"
                    subtitle = "COVID-19 Literature Analysis and Summarization Platform"
                    media = {<img src = {Cover}/>}
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
                    media = {<img src = {SummSlide}/>}
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
                    media = {<img src = {IRSlide}/>}
                    mediaBackgroundStyle={{ backgroundColor: '#424242'}}
                    style={{ backgroundColor: '#212121' }}
                />
                <Slide
                    title = {
                        <Link id='qna' href = '/qna' color="inherit" onClick = {handleClick} disabled>
                            Ask
                        </Link>
                    }
                    subtitle = "and you shall receive (the answer to your COVID-19 related queries)"
                    media = {<img src = {QnaSlide}/>}
                    mediaBackgroundStyle={{ backgroundColor: '#424242' }}
                    style={{ backgroundColor: '#212121' }}
                />

            </AutoRotatingCarousel>
        </div>
    );
}
