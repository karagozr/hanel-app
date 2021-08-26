import React from 'react';
import { createPortal } from 'react-dom';
import { useScreenSizeClass } from '../../utils/media-query';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { useEffect } from 'react/cjs/react.production.min';

const FunctionalIFrameComponent = ({
    height,
    children,
    title,
    ...props
  }) => {
    const [contentRef, setContentRef] = React.useState(null)
    
    const mountNode =
      contentRef?.contentWindow?.document?.body
    

    return (
        
      <iframe id={"htmlViewerIframe"} title={title} {...props} ref={setContentRef} width={'100%'} height={height}>
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    )
  }

export const HtmlViewer = (props) => {
  const screenSizeClass = useScreenSizeClass();
    
    let scl;
    switch (screenSizeClass) {
      case 'screen-large':
        scl = 0.9;
        break;
      case 'screen-medium':
        scl = 0.8;
        break;
      case 'screen-small':
        scl = 0.6;
        break;
      case 'screen-x-small':
        scl = 0.53;
        break;
      default: 
        scl=0.75;
        break;
    
    }

    const [scale, setScale] = React.useState(scl);
    const ref = React.useRef(null);
    React.useEffect(()=>{
        if(ref.current!==null){
            setScale(ref.current.offsetWidth/800)
            
        }
    },[props.width]);


    return (
        <React.Fragment>
            
            <FunctionalIFrameComponent height={props.height} >
                <div ref={ref} id={'divcontents'} dangerouslySetInnerHTML={{ __html: `<style> html{background-color:white; transform: scale(${scale}); transform-origin: 0 0;} </style> ${props.data}` }}></div>
            </FunctionalIFrameComponent>

        </React.Fragment>

    );
}
