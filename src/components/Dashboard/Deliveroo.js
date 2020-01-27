import React, {Component} from 'react';
import { Col } from 'antd';
import CurrentOrder from './CurrentOrder';

export default class Deliveroo extends Component {
    render(){
        return(
            <Col className="gutter-row" span={8}>
                <div className="main-content-box">
                    <div className="sub-header"><img src="/assets/images/Deliveroo.png"/></div>
                    <div className="header-content">
                        <CurrentOrder/>
                    </div>
                </div>
            </Col>
        )
    }
}


