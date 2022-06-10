import 'devextreme/dist/css/dx.common.css';

import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';

import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import { FilterAreaProvider, NavigationProvider } from './contexts';
import { useScreenSizeClass } from './utils/media-query';
import {Content} from './Content';
import UnauthenticatedContent from './UnauthenticatedContent';
import { AppProvider, useAuth} from './contexts';
import { AlertPanel } from './components/alert-box/alertPanel';
import { DxLoadPanel } from './components/loading-box/loadPanel';

import { locale, loadMessages } from 'devextreme/localization';

import * as trMessages from "devextreme/localization/messages/tr.json";


const Main = React.memo(({screenSizeClass}) => {
  return (
    <NavigationProvider>
        <div className={`app ${screenSizeClass}`}>
            <Content/> 
        </div>
      </NavigationProvider>  
  )
  
})

const App = () => {
  const auth = useAuth();
  const screenSizeClass = useScreenSizeClass();
  useEffect(()=>{
  },[auth.state]);
  
return(
  <div>
    {
      auth.state? 
      (<Main screenSizeClass={screenSizeClass}/>):
      (<div 
        style={{ 
          //backgroundImage: 'url(https://media.giphy.com/media/BHNfhgU63qrks/giphy.gif)', 
          backgroundSize: 'cover', height: '100vh', width: '100%', padding: 0, margin: 0 }} 
          >
        <UnauthenticatedContent />
      </div>)
    }
  </div>
)

  
}
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  loadMessages(trMessages);
 
  locale('tr');
  localStorage.removeItem('invoice-filter');
  localStorage.removeItem('invoice-data');
  localStorage.removeItem('invoice-company-data');

  return (
    <AppProvider>
    <Router>
      <div id="mainContent">
          <DxLoadPanel />
          <AlertPanel />
          <FilterAreaProvider>
            <App/>
          </FilterAreaProvider>
          
      </div>
    </Router>
    </AppProvider>
  );
}
