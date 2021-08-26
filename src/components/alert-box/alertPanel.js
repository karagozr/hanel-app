import React,{useEffect} from 'react';
import { Toast } from 'devextreme-react/toast';
import { useAlert } from '../../contexts/AppContext';

import { alertClear } from '../../contexts/actions';

import './alertPanel.scss'

export const AlertPanel = (props) => {
    
    
    const alert = useAlert();

    const [open, setOpen] = React.useState(false);
    useEffect(() => {
        alert.state.type ? setOpen(true) : setOpen(false);
    }, [alert.state]);
    
    

    const onHiding = (event) => {
        setOpen(false);
        alert.dispatch(alertClear());
    };

    return (
        <Toast
            visible={open}
            message={alert.state.payload}
            type={alert.state.type}
            onVisibleChange={onHiding}
            onHiding={(e)=>console.log('onHiding')}
            displayTime={alert.state.type==='error'?20000:2000}
    />
    );
}
