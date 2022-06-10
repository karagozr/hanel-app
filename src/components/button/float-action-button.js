import React from 'react';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import {useActionButton} from '../../contexts'
import {disableActionButton} from '../../contexts/actions'
import { useLocation } from "react-router-dom";

export const FloatActionButton = React.memo(() => {
  

  const actionButton = useActionButton();
  const buttons = actionButton.state.buttons;
  
  const location = useLocation();
  const [locationPath, setLocatioPath]=React.useState(location.pathname);

  React.useEffect(()=>{
    if(locationPath!==location.pathname){
      setLocatioPath(location.pathname);
      actionButton.dispatch(disableActionButton());
    }
  },[actionButton,locationPath,location]);


  if(buttons!==undefined && buttons.length>0){
    return (
      <Fab
        mainButtonStyles={mainButtonStyle}
        actionbuttonstyles={actionButtonStyle}
        style={mainStyle}
        icon={<i className="dx-icon-edit"></i>}
        
        alwaysShowTitle={true}
        
    >
    
    {buttons.map(({icon,title,clickEvent},index)=>(
      <Action style={actionButtonStyle}
        onClick={clickEvent}
        text={title}
        key={`fab-action-${index}`}
      >
        <i className={`dx-icon-${icon}`}></i>
      </Action>
  
    ))}
   
  </Fab>
    );
  }else return null;
  
})

const mainButtonStyle ={
  backgroundColor:'#ff5722',
  height:window.innerWidth<=1080?50:60,
  width:window.innerWidth<=1080?50:60
}
const actionButtonStyle = {
  backgroundColor:'#2f9187b5',
  height:window.innerWidth<=1080?40:50,
  width:window.innerWidth<=1080?40:50
}
const mainStyle = {
  bottom: 40,
  right:0,
  margin:20,
}

