import React from 'react';

import { LoadPanel } from 'devextreme-react/load-panel';
import { useLoad } from '../../contexts'




export const DxLoadPanel = (props) => {
    const {state} = useLoad();
    return (
        <div className={"load-panel"}>
            <LoadPanel
                shadingColor="rgba(0,0,0,0.4)"
                position={'center'}
                visible={state.open}
                showIndicator={true}
                shading={true}
                showPane={true}
            />
        </div>
    );
}


