import React, { useEffect, useState } from 'react';
import {createStore, combineReducers, applyMiddleware } from 'redux';
import {taskMiddleware} from 'react-palm/tasks';
import {Provider, useDispatch} from 'react-redux';
import KeplerGl from 'kepler.gl'
import {addDataToMap} from 'kepler.gl/actions';
import PropTypes from 'prop-types';
import keplerGlReducer from 'kepler.gl/reducers';
import df2000 from '../../data/df2000.json';
import df2001 from '../../data/df2001.json';
import df2002 from '../../data/df2002.json';
import df2003 from '../../data/df2003.json';
import df2004 from '../../data/df2004.json';
import df2005 from '../../data/df2005.json';
import df2006 from '../../data/df2006.json';
import df2007 from '../../data/df2007.json';
import df2008 from '../../data/df2008.json';
import df2009 from '../../data/df2009.json';
import df2010 from '../../data/df2010.json';
import df2011 from '../../data/df2011.json';
import df2012 from '../../data/df2012.json';
import df2013 from '../../data/df2013.json';
import df2014 from '../../data/df2014.json';
import df2015 from '../../data/df2015.json';
import df2016 from '../../data/df2016.json';
import df2017 from '../../data/df2017.json';
import configLight from '../../data/configLight.json';
import configDark from '../../data/configDark.json';
import { ThemeContextConsumer } from '../../context/themer';
import { Fab, makeStyles, Menu, MenuItem, Fade, Slide, Tooltip } from '@material-ui/core';
import { Today } from '@material-ui/icons';
import { useLastLocation } from 'react-router-last-location';

const datasets = [df2000, df2001, df2002, df2003, df2004, df2005, df2006, df2007, df2008, df2009, df2010, df2011, df2012, df2013, df2014, df2015, df2016, df2017];

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: {
      activeSidePanel: null,
      currentModal: null,
      readOnly: true
    }
  })
});

const store = createStore(reducers, {}, applyMiddleware(taskMiddleware));

const useStyles = makeStyles((theme) => ({
    root: {
        position: 'fixed',
        top: theme.spacing(9),
        left: theme.spacing(1),
        borderRadius: 0,
        zIndex: 10
    },
    extendedIcon: {
        marginRight: theme.spacing(1)
    },
    menu: {
        backgroundColor: '#212121',
        color: 'white'
    }
}))

export default function Anomalies(){

    const classes = useStyles();

    const [year, setYear] = useState(2000);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    const handleSelect = (event, index, menuItem) => {
        setSelectedIndex(index);
        setYear(menuItem);
        handleClose();
    }

    const menuItems = [2000,2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017];

    return(
        <ThemeContextConsumer>
            {(themeContext) => ( 
            <Provider store = {store}>
                <Map theme = {themeContext} year = {year}/>
                <Tooltip 
                    title = {"Select Year"} 
                    placement = "right" 
                    arrow
                >
                    <Fab 
                        aria-label = 'year' 
                        variant = 'extended' 
                        className = {classes.root} 
                        onClick = {handleClick}
                        size = "small"
                        style = {{
                            backgroundColor: (themeContext.dark ? '#29323c' : '#f7f7f7'),
                            color: themeContext.dark && 'white',
                            borderRadius: 0
                    }}>
                        <Today fontSize="small" style = {{color: themeContext.dark && 'white'}} className = {classes.extendedIcon}/>
                        {year}
                    </Fab>
                </Tooltip>
                <Menu
                    id = 'year-menu'
                    anchorEl = {anchorEl}
                    keepMounted
                    open = {Boolean(anchorEl)}
                    onClose = {handleClose}
                    classes = {{paper: (themeContext.dark && classes.menu)}}
                >
                {
                    menuItems.map((menuItem, index) => (
                        <MenuItem 
                            key = {menuItem} 
                            selected = {index === selectedIndex}
                            onClick = {(event) => {handleSelect(event, index, menuItem)}}
                            style = {{
                                backgroundColor: (themeContext.dark && '#212121'),
                                color: (themeContext.dark && 'white')}}
                        >
                                {menuItem}
                        </MenuItem>
                    ))
                }
                </Menu>
            </Provider>
            )}
        </ThemeContextConsumer>
    )
}

function Map({theme, year}) {
    const dispatch = useDispatch();
    const lastLocation = JSON.parse(JSON.stringify(useLastLocation()));
    //const data = df2000;
    useEffect(() => {
        dispatch(
            addDataToMap({
                datasets: {
                    info: {
                        label: "unnamed",
                        id: "unnamed"
                    },
                    data: datasets[year-2000]
                },
                option: {
                    centerMap: true,
                    readOnly: true,
                },
                config: theme.dark ? configDark : configLight
            })
        );
    }, [dispatch, theme, year])

    return(
        <ThemeContextConsumer>
            {(themeContext) => (
                (lastLocation === null)
                ?
                <Fade in = {true}>
                    <div>
                        <KeplerGl 
                            id="unnamed" 
                            mapboxApiAccessToken = "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pza3FrOXh6MW05dTQzcWd1M3I3c2E0eCJ9.z0MFFrHYNbdK-QVHKrdepw" 
                            width = {((window.innerWidth < 992) ? window.innerWidth : (0.9890 * window.innerWidth))} 
                            height = {window.innerHeight}
                            theme = {themeContext.dark ? null : 'light'}
                        />
                    </div>
                </Fade>
                :
                <Slide in = {true} direction = "left">
                    <div>
                        <KeplerGl 
                            id="unnamed" 
                            mapboxApiAccessToken = "pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2pza3FrOXh6MW05dTQzcWd1M3I3c2E0eCJ9.z0MFFrHYNbdK-QVHKrdepw" 
                            width = {window.innerWidth} 
                            height = {window.innerHeight}
                            theme = {themeContext.dark ? null : 'light'}
                        />
                    </div>
                </Slide>
                
            )}
        </ThemeContextConsumer>
    ) 
}

Map.propTypes = {
    theme: PropTypes.any.isRequired,
    year: PropTypes.number.isRequired
} 

// config: {
                //     visState: {
                //       filters: [],
                //       layers: [
                //         {
                //           id: "trdwvpjd",
                //           type: "point",
                //           config: {
                //             dataId: "unnamed",
                //             label: "Point",
                //             color: [
                //               82,
                //               163,
                //               83
                //             ],
                //             columns: {
                //               lat: "Latitude",
                //               lng: "Longitude",
                //               altitude: "none"
                //             },
                //             isVisible: true,
                //             visConfig: {
                //               radius: 10,
                //               fixedRadius: false,
                //               opacity: 0.8,
                //               outline: false,
                //               thickness: 2,
                //               strokeColor: "none",
                //               colorRange: {
                //                 name: "Global Warming",
                //                 type: "sequential",
                //                 category: "Uber",
                //                 colors: [
                //                   "#5A1846",
                //                   "#900C3F",
                //                   "#C70039",
                //                   "#E3611C",
                //                   "#F1920E",
                //                   "#FFC300"
                //                 ]
                //               },
                //               strokeColorRange: {
                //                 name: "Global Warming",
                //                 type: "sequential",
                //                 category: "Uber",
                //                 colors: [
                //                   "#5A1846",
                //                   "#900C3F",
                //                   "#C70039",
                //                   "#E3611C",
                //                   "#F1920E",
                //                   "#FFC300"
                //                 ]
                //               },
                //               radiusRange: [
                //                 0,
                //                 50
                //               ],
                //               filled: true
                //             },
                //             hidden: false,
                //             textLabel: [
                //               {
                //                 field: "none",
                //                 color: [
                //                   255,
                //                   255,
                //                   255
                //                 ],
                //                 size: 18,
                //                 offset: [
                //                   0,
                //                   0
                //                 ],
                //                 anchor: "start",
                //                 alignment: "center"
                //               }
                //             ]
                //           },
                //           visualChannels: {
                //             colorField: "none",
                //             colorScale: "quantile",
                //             strokeColorField: "none",
                //             strokeColorScale: "quantile",
                //             sizeField: "none",
                //             sizeScale: "linear"
                //           }
                //         },
                //         {
                //           id: "06p5cx",
                //           type: "point",
                //           config: {
                //             dataId: "unnamed",
                //             label: "unnamed",
                //             color: [
                //               227,
                //               26,
                //               26
                //             ],
                //             columns: {
                //               lat: "Latitude_Layer",
                //               lng: "Longitude_Layer",
                //               altitude: "none"
                //             },
                //             isVisible: true,
                //             visConfig: {
                //               radius: 20.1,
                //               fixedRadius: false,
                //               opacity: 0.8,
                //               outline: false,
                //               thickness: 0.5,
                //               strokeColor: "none",
                //               colorRange: {
                //                 name: "Global Warming",
                //                 type: "sequential",
                //                 category: "Uber",
                //                 colors: [
                //                   "#5A1846",
                //                   "#900C3F",
                //                   "#C70039",
                //                   "#E3611C",
                //                   "#F1920E",
                //                   "#FFC300"
                //                 ]
                //               },
                //               strokeColorRange: {
                //                 name: "Global Warming",
                //                 type: "sequential",
                //                 category: "Uber",
                //                 colors: [
                //                   "#5A1846",
                //                   "#900C3F",
                //                   "#C70039",
                //                   "#E3611C",
                //                   "#F1920E",
                //                   "#FFC300"
                //                 ]
                //               },
                //               radiusRange: [
                //                 0,
                //                 50
                //               ],
                //               filled: true
                //             },
                //             hidden: false,
                //             textLabel: [
                //               {
                //                 field: "none",
                //                 color: [
                //                   255,
                //                   255,
                //                   255
                //                 ],
                //                 size: 18,
                //                 offset: [
                //                   0,
                //                   0
                //                 ],
                //                 anchor: "start",
                //                 alignment: "center"
                //               }
                //             ]
                //           },
                //           visualChannels: {
                //             colorField: "none",
                //             colorScale: "quantile",
                //             strokeColorField: "none",
                //             strokeColorScale: "quantile",
                //             sizeField: "none",
                //             sizeScale: "linear"
                //           }
                //         }
                //       ],
                //       interactionConfig: {
                //         tooltip: {
                //           fieldsToShow: {
                //             unnamed: [
                //               "Unnamed: 0",
                //               "Unnamed: 0.1",
                //               "Country Name",
                //               "Country Code",
                //               "Country WHO Region"
                //             ]
                //           },
                //           enabled: true
                //         },
                //         brush: {
                //           size: 0.5,
                //           enabled: false
                //         },
                //         geocoder: {
                //           enabled: false
                //         },
                //         coordinate: {
                //           enabled: false
                //         }
                //       },
                //       layerBlending: "normal",
                //       splitMaps: [],
                //       animationConfig: {
                //         currentTime: "none",
                //         speed: 1
                //       }
                //     },
                //     mapState: {
                //       bearing: 0,
                //       dragRotate: false,
                //       latitude: 12.031247000000004,
                //       longitude: 2.1080855000000014,
                //       pitch: 0,
                //       zoom: 1,
                //       isSplit: false
                //     },
                //     mapStyle: {
                //     //   styleType: "light",
                //       topLayerGroups: {},
                //       visibleLayerGroups: {
                //         label: true,
                //         road: true,
                //         border: false,
                //         building: true,
                //         water: true,
                //         land: true,
                //         "3d building": false
                //       },
                //       threeDBuildingColor: [
                //         9.665468314072013,
                //         17.18305478057247,
                //         31.1442867897876
                //       ],
                //       mapStyles: {}
                //     }
                //   }