import React, { Component } from 'react';
import axios from 'axios';
import { notification, Input, Icon } from 'antd';
import { baseURL } from '../../constants'

import Loader from '../Loader';
import { setAccessToken } from '../services/utils';

import './login.css';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { credentials: { userName: '', password: '' }, loading: false }
    }

    handleChange = (event) => {
        const field = event.target.name;
        const credentials = this.state.credentials;
        credentials[field] = event.target.value;
        return this.setState({ credentials: credentials });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const { userName, password } = this.state.credentials;
        if (!userName || !password) {
            notification['error']({
                message: 'Username and Password not be an empty!',
                description: '',
            });
        } else {
            this.setState({ loading: true });
            axios.post(baseURL + '/DOD/dodLogin', { userName: userName, password: password }).then((res) => {
                this.setState({ loading: false });
                setAccessToken(res.data.accessToken);
                window.location = '/';
            }).catch(error => {
                this.setState({ loading: false });
                notification['error']({
                    message: error.response.data.user_msg,
                    description: '',
                });
            })
        }
    };

    render() {
        return (
            <div className="vertical-alignment-helper">
                <Loader isLoading={this.state.loading} />
                <div className="modal-dialog vertical-align-center">
                    <div className="modal-content">
                        <a href="javascript:void(0);" className="logo"></a>
                        <div className="modal-body">
                            <div className="row login-form ">
                                <div className="col-xs-12 text-center">
                                    <h2>User Authentication</h2>
                                </div>
                                <div className="panel-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <form onSubmit={this.handleSubmit}>
                                                <div className="login-content">
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <Input
                                                                placeholder="Enter your username"
                                                                prefix={<Icon type="user" style={{ color: '#ffd401', fontSize: 18 }} />}
                                                                value={this.state.credentials.userName}
                                                                name="userName"
                                                                onChange={this.handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-group">
                                                        <div className="input-group">
                                                            <Input
                                                                placeholder="Enter your Password"
                                                                prefix={<Icon type="lock" style={{ color: '#ffd401', fontSize: 18 }} />}
                                                                value={this.state.credentials.password}
                                                                name="password"
                                                                type="password"
                                                                onChange={this.handleChange}
                                                            />
                                                        </div>
                                                        <div className="form-group text-center row save-btn">
                                                            <div className="col-xs-12 text-center">
                                                            </div>
                                                            <button type="submit" className="btn btn-save" onClick={this.handleSubmit}>Sign In
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

