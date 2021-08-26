/* eslint-disable import/no-anonymous-default-export */
import React from 'react';
import './footer.scss';

export default ({ ...rest }) => {
  return <footer className={'footer'} {...rest} />;
};
