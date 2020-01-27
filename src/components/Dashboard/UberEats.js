import React, {Component} from 'react';
import { Col } from 'antd';
import CurrentOrder from './CurrentOrder';
import RecentOrder from './RecentOrder';
export default class UberEats extends Component {

    render(){
        const { startupData } = this.props;
        const { lastCompletedOrders,orders } = startupData
        return(
            <Col className="gutter-row" span={8}>
                <div className="main-content-box">
                    <div className="sub-header"><img src="/assets/images/UberEats.png"/></div>
                    <div className="header-content">
                        <CurrentOrder orders={orders} sendToKitchen={(orderId, orderNumber, cancel) => this.props.sendToKitchen(orderId, orderNumber,'uberEats', cancel)} timeZone={this.props.timeZone}/>
                    </div>
                </div>
                <div className="main-content-box">
                      <div className="header-content-recent">
                          <div className="header-recent">
                              <RecentOrder lastCompletedOrders={lastCompletedOrders} timeZone={this.props.timeZone}/>
                          </div>
                      </div>
                </div>
            </Col>
        )
    }
}

