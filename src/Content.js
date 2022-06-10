import React,{useEffect} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavOuterToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import { useScreenSizeClass } from './utils/media-query';
import {FloatActionButton} from './components'

const SwitchRoute = React.memo(()=> {
  return ( <Switch>
            {routes.map(({ path, component }) => (
                <Route exact key={path} path={path} component={component} />
        ))}
        <Redirect to={'/home'} />
        </Switch>)
})


export const Content=React.memo((props) => {

  const screen = useScreenSizeClass();
  useEffect(()=>{ },[screen])

  return (
    <SideNavBarLayout title={appInfo.title}>
      <div id="appBody">
        <FloatActionButton />
        <SwitchRoute/>
      </div>
      {/* <Footer>
        Copyright © 2020-{new Date().getFullYear()} {appInfo.title} Inc.
      </Footer> */}
    </SideNavBarLayout>
  );
})
