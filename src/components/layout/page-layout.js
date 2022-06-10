import React from 'react'
import PropTypes from 'prop-types'
import { FilterArea } from '../filter';
import { Button, Drawer } from 'devextreme-react';
import './page-layout.css'

export const PageLayoutWithDrawer = (props) => {

    const {caption,captionComponent,children,openMenu} = props;

    const [opened,setOpened]=React.useState(false);

    return (
        <React.Fragment >
            <h3 className={'content-block dx-card'} style={{padding:10,paddingTop:5,paddingBottom:5}}>
                {caption} <Button stylingMode='text' text='filtre' onClick={e=>setOpened(!opened)} icon={opened ?"chevronright":"chevronleft"} style={{float:"right",marginTop:"-1px",marginBottom:"auto"}}/>   
            </h3>
            <Drawer
                opened={opened}
                animationEnabled={false}
                closeOnOutsideClick={e=>setOpened(false)}
                openedStateMode={"overlap"}
                position={"left"}
                component={e=><div className={'content-block dx-card'} style={{ padding: '10px', backgroundColor:"rgb(35 47 65)"}}>{captionComponent}</div> }
                revealMode={'expand'}
                className="filter-drawer"
                maxSize={250}>

                <div id="content-filter"  className={'content-block dx-card responsive-paddings dx-theme-background-color'} style={{ padding: '5px', margin: '10px'}}>
                    {children}
                </div>

            </Drawer>
        </React.Fragment>
    )
}

PageLayoutWithDrawer.propTypes = {}


export const PageLayout = ({caption,captionComponent,children}) => {
    return (
        <React.Fragment >
            <div className={!captionComponent ?'content-block':'content-block dx-card'} style={{ marginLeft: !captionComponent  && '30px' }}>
                { captionComponent ? captionComponent : caption && caption}
            </div>
            <div className={'content-block dx-card responsive-paddings'} style={{ padding: '5px', margin: '10px'}}>
                {children}
            </div> 
        </React.Fragment>
    )
}

PageLayout.propTypes = {}

