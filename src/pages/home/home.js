import React from 'react';
import { Button } from 'devextreme-react/button';
import './home.scss';
import {ExportExcel,ImportExcel} from '../../components'
export default () => {
  const [data, setData]=React.useState([]);

  console.log("data ",data);

  return (
  <React.Fragment>
    <h3 className={'content-block'}>Ana Ekran</h3>
    <div className={'content-block dx-card responsive-paddings'} >
      <div 
      //style={{ height: window.innerHeight-120,margin:'auto', backgroundSize: 'cover', backgroundImage: 'url(https://cdn.dribbble.com/users/43762/screenshots/1438974/media/487e8955c49643b4c79b7b4a05c4f7e4.gif)' }}
      >

      </div>
      
    </div>
  </React.Fragment>
);}
