import React from 'react';
import './test-view.scss';
import {useGuide} from '../../contexts/hooks'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const _cari = useGuide();

  const onHandleClick = async ()=>{
    var result = await _cari.getCariList();
    console.log("CARI LIST : ",result);
  }

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Test View</h2>
      <div className={'content-block'}>
        <div className={'dx-card responsive-paddings'}>
          <button onClick={onHandleClick} >TIKLA </button>
        </div>
      </div>
    </React.Fragment>
)
};
