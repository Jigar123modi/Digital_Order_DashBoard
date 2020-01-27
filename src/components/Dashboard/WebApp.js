import React, {Component} from 'react';
import {Col} from 'antd';
import CurrentOrder from './CurrentOrder';

export default class WebApp extends Component {
    render() {
        return (
            <Col className="gutter-row" span={8}>
                <div className="main-content-box">
                    <div className="sub-header">WEB/APP</div>
                    <div className="header-content">
                        <CurrentOrder/>
                    </div>
                </div>
            </Col>
        )
    }
}


