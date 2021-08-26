import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { SingleCard } from './layouts';
import { LoginForm, ResetPasswordForm, ChangePasswordForm, CreateAccountForm } from './components';

// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  return (
   
    <Switch className={'back-ground-denememe'}>
     
      <Route exact path='/login' style ={{ backgroundImage: 'url(http://i.stack.imgur.com/kx8MT.gif)', backgroundSize: 'cover', height: '100vh', padding:0, margin:0 }} >
      
        <SingleCard title="Hanel App - Sign In">
          <LoginForm />
        </SingleCard>
        
      </Route>
      <Route exact path='/create-account' >
        <SingleCard title="Sign Up">
          <CreateAccountForm />
        </SingleCard>
      </Route>
      <Route exact path='/reset-password' >
        <SingleCard
          title="Reset Password"
          description="Please enter the email address that you used to register, and we will send you a link to reset your password via Email."
        >
          <ResetPasswordForm />
        </SingleCard>
      </Route>
      <Route exact path='/change-password/:recoveryCode' >
        <SingleCard title="Change Password">
          <ChangePasswordForm />
        </SingleCard>
      </Route>
      <Redirect to={'/login'} />
    </Switch>
  );
}
