import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';

import { isLoggedIn, getAccessToken } from '../services/utils';

const { Content } = Layout;




export const PrivateRoute = ({ component: Component, ...rest }) => {
    // console.log('---', isLoggedIn());
    // console.log('loca', getAccessToken());
    return (
        isLoggedIn() ?
            <div>

                <Route {...rest} render={(routeProps) => (
                    <Component {...routeProps} />
                )} />
            </div> :
            <Redirect to='/login' />
    )
}

export const LoginRoute = ({ component: Component, ...rest }) => {
    return (
        !isLoggedIn() ?
            <Route {...rest} render={(routeProps) => (
                <Component {...routeProps} />)} />
            :
            <Redirect to='/' />
    )
}