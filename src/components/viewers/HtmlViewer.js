import React from 'react';
import { createPortal } from 'react-dom';

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

export const HtmlViewer = React.forwardRef((props,ref) => {

  let scl = window.innerWidth < 750 ? (window.innerWidth < 500 ? 0.52 : 0.6) : 0.7;

  // switch (screenSizeClass) {
  //   case 'screen-large':
  //     scl = 0.9;
  //     break;
  //   case 'screen-medium':
  //     scl = 0.8;
  //     break;
  //   case 'screen-small':
  //     scl = 0.6;
  //     break;
  //   case 'screen-x-small':
  //     scl = 0.53;
  //     break;
  //   default: 
  //     scl=0.75;
  //     break;
  // }

  const [scale, setScale] = React.useState(scl);
  
  React.useEffect(() => {
    
    if (document.getElementById('htmlViewerIframe') !== null) {
      setScale(document.getElementById('htmlViewerIframe').offsetWidth / 850)

    }
  }, [props.width]);



  React.useImperativeHandle(ref, () => ({
    printIframe (e) {
      const iframe = document.frames
          ? document.frames['htmlViewerIframe']
          : document.getElementById('htmlViewerIframe');
      const iframeWindow = iframe.contentWindow || iframe;
  
      iframe.focus();
      iframeWindow.print();
  
      return false;
    }
  }))

  return (
    <React.Fragment>

      <FunctionalIFrameComponent height={props.height} style={{ backgroundColor: "white" }} >
        <div >
          <div id={'divcontents'} dangerouslySetInnerHTML={{ __html: `<style> html{background-color:white; transform: scale(${scale}); transform-origin: 0 0;} </style> ${props.data}` }}></div>
        </div>

      </FunctionalIFrameComponent>

    </React.Fragment>

  );
})
