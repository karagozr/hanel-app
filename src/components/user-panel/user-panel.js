/* eslint-disable jsx-a11y/alt-text */
import React, { useMemo } from 'react';
import { useHistory } from "react-router-dom";
import ContextMenu, { Position } from 'devextreme-react/context-menu';
import List from 'devextreme-react/list';
import { useAuth } from '../../contexts';
import './user-panel.scss';
import userIcon from '../../img/user-icon.png'

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ menuMode }) {
  const { state, logout } = useAuth();
  const history = useHistory();


  function navigateToProfile() {
    history.push("/profile");
  }
  const menuItems = useMemo(() => ([
    {
      text: 'Profile',
      icon: 'user',
      onClick: navigateToProfile
    },
    {
      text: 'Logout',
      icon: 'runner',
      onClick: logout
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ]), [logout]);

  return (
    <div className={'user-panel'}>
      <div className={'user-info'}>
        <div className={'image-container'}>
        <img src={userIcon} className={'user-image'} style={{
              background : `no-repeat #fff`}}/>
          {/* <div
            style={{
              background : `url(../../img/user-icon.png) no-repeat #fff`,
              //backgroundSize: 'cover'
            }}
             /> */}
        </div>
        <div className={'user-name'}>{state.fullName}</div>
      </div>

      {menuMode === 'context' && (
        <ContextMenu
          items={menuItems}
          target={'.user-button'}
          showEvent={'dxclick'}
          width={210}
          cssClass={'user-menu'}
        >
          <Position my={'top center'} at={'bottom center'} />
        </ContextMenu>
      )}
      {menuMode === 'list' && (
        <List className={'dx-toolbar-menu-action'} items={menuItems} />
      )}
    </div>
  );
}
