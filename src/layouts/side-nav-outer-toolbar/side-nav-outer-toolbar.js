import Drawer from 'devextreme-react/drawer';
import ScrollView from 'devextreme-react/scroll-view';
import React, { useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Header, SideNavigationMenu, Footer } from '../../components';
import './side-nav-outer-toolbar.scss';
import { useScreenSize } from '../../utils/media-query';
import { Template } from 'devextreme-react/core/template';
import { useMenuPatch } from '../../utils/patches';

// eslint-disable-next-line import/no-anonymous-default-export
export default function ({ title, children }) {
  const scrollViewRef = useRef(null);
  const history = useHistory();
  const { isXSmall, isLarge } = useScreenSize();
  const [patchCssClass, onMenuReady] = useMenuPatch();
  const [menuStatus, setMenuStatus] = useState(
     MenuStatus.Closed
  );

  //React.useEffect(()=>{console.log('DEĞİŞTİ İ İ İ ')},[windows.innerHeight])

  const toggleMenu = useCallback(({ event }) => {
    setMenuStatus(
      prevMenuStatus => prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.Opened
        : MenuStatus.Closed
    );
    event.stopPropagation();
  }, []);

  const temporaryOpenMenu = useCallback(() => {
    
    setMenuStatus(
      prevMenuStatus => prevMenuStatus === MenuStatus.Closed
        ? MenuStatus.TemporaryOpened
        : prevMenuStatus
    );
  }, []);

  const onOutsideClick = useCallback(() => {
    setMenuStatus(
      prevMenuStatus => prevMenuStatus !== MenuStatus.Closed
        ? MenuStatus.Closed
        : prevMenuStatus
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLarge]);

  const onNavigationChanged = useCallback(({ itemData: { path }, event, node }) => {
    
    if (menuStatus === MenuStatus.Closed || !path || node.selected) {
      event.preventDefault();
      return;
    }
    
    history.push(path);
    scrollViewRef.current.instance.scrollTo(0);

    setMenuStatus(MenuStatus.Closed);
      event.stopPropagation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history, menuStatus, isLarge]);

  return (
    <div className={'side-nav-outer-toolbar'}>
      <Header
        key={'asdasd-asdasd'}
        className={'layout-header'}
        menuToggleEnabled
        toggleMenu={toggleMenu}
        title={title}
      />
      <Drawer
        className={['drawer', patchCssClass].join(' ')}
        position={'before'}
        closeOnOutsideClick={onOutsideClick}
        openedStateMode={'overlap'}
        revealMode={isXSmall ? 'slide' : 'expand'}
        minSize={isXSmall ? 0 : 50}
        maxSize={250}
        shading={true}
        opened={menuStatus === MenuStatus.Closed ? false : true}
        template={'menu'}
      >
        <div className={'container'}>

          <ScrollArea scrollViewRef={scrollViewRef} children={children}/>
          
          {/* <div className={'footer-block'}>
              {React.Children.map(children, item => {
                return item.type === Footer && item;
              })}
          </div> */}

        </div>

        <Template name={'menu'}>
          <SideNavigationMenu
            compactMode={menuStatus === MenuStatus.Closed}
            selectedItemChanged={onNavigationChanged}
            openMenu={temporaryOpenMenu}
            onMenuReady={onMenuReady}/>
        </Template>
      </Drawer>
    </div>
  );
}


const ScrollArea = ({scrollViewRef,children}) =>{
  const [height, setWidth] = useState(window.innerHeight)

  React.useEffect(() => {
    const handleResize = ({currentTarget}) => setWidth(currentTarget.innerHeight);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return(
    <ScrollView ref={scrollViewRef} height={ height-38} >
            <div className={'content'}>
              {React.Children.map(children, item => {
                return item.type !== Footer && item;
              })}
            </div>
          </ScrollView>
  )
}

const MenuStatus = {
  Closed: 1,
  Opened: 2,
  TemporaryOpened: 3
};
