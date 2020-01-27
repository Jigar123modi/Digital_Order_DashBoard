import React, { Component } from 'react';
import { Collapse } from 'antd';
import { dateFormat1, dateFormat2 } from '../../timeformat';
import { statuses } from './statuses';
const Panel = Collapse.Panel;

const Header = ({ isError, isSuccess, date, orderNumber, firstName }) => (
    <div className="menu-text">
        {console.log(isError, "==>", isSuccess)}
        <div className="center-block order-details">
            <div className="menu-sub-txt">Order Number <span>{orderNumber}, {firstName}</span></div>
            <div>{date}</div>
        </div>
        {isError ? <div className="order-status">FAILED TO SEND</div> : isSuccess ? <div className="order-status">Success</div> : ''}
        {/*<div className="success-block">
         {isError && <div className="color-white text-center">SUCCESS</div> }
         </div>*/}
    </div>
);


export default class CollapseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFull: false
        }
    }

    handleShowFull = () => {
        this.setState((state) => ({ showFull: !state.showFull }));
    };

    getBasketDetails = (items = []) => {
        if (!this.state.showFull) {
            items = items.slice(0, 4);
        }
        return items.map((item, index) => (
            <p key={index}>{item.Quantity}x {item.Name.length > 35 ? `${item.Name.slice(0, 34)}...` : item.Name} </p>
        ))
    };

    render() {
        const { showFull } = this.state;
        const { orderDetails, index, isRecent } = this.props;
        const { order_num, first_name, sub_total, orderBasket, Id, processed, orderNumber, utc_date } = orderDetails;
        const { basket } = orderBasket;
        const isError = parseInt(processed) === (parseInt(statuses.cancel.processed) ||
            parseInt(processed) === parseInt(statuses.storeClose.processed) ||
            parseInt(processed) === parseInt(statuses.orderCancellationProcessed.processed) ||
            parseInt(processed) === parseInt(statuses.orderCancel.processed));
        const retryError = (parseInt(processed) === parseInt(statuses.unableToConnect.processed) ||
            parseInt(processed) === parseInt(statuses.myCentralFail.processed) ||
            parseInt(processed) === parseInt(statuses.unknown.processed) ||
            parseInt(processed) === parseInt(statuses.posErrorAccess.processed) ||
            parseInt(processed) === parseInt(statuses.posErrorNoEndPoint.processed))
        return (
            <Panel {...this.props} header=
                {<Header
                    isError={isError}
                    isSuccess={isRecent}
                    orderNumber={order_num}
                    firstName={first_name}
                    total={basket.Total}
                    date={dateFormat1(utc_date, this.props.timeZone)}
                />} key={index} className={(isError || retryError) ? 'error' : isRecent ? 'success' : ''}>
                <React.Fragment>
                    {
                        !(parseInt(processed) === parseInt(statuses.cancel.processed) ||
                            parseInt(processed) === parseInt(statuses.storeClose.processed) ||
                            parseInt(processed) === parseInt(statuses.orderCancellationProcessed.processed)) &&

                        <div className="sub-content">
                            <div className="details">
                                <p>First Name: <b>{first_name}</b></p>
                                <p>Order Total: <b>${sub_total}</b></p>
                                <p>Created: <b>{dateFormat2(utc_date, this.props.timeZone)}</b></p>
                                {isRecent && <p>Order Number: <b>{orderNumber}</b></p>}
                            </div>
                            <div className="details-content">
                                <h4>Order Details:</h4>
                                {this.getBasketDetails(basket.Items)}
                                {basket.Items.length > 4 &&
                                    <a onClick={this.handleShowFull}>{showFull ? 'Collapse' : 'SHOW FULL ORDER'}</a>}
                            </div>
                        </div>
                    }
                    {isError ? <React.Fragment>
                        <div className="content-box">
                            {(parseInt(processed) === parseInt(statuses.cancel.processed) ||
                                parseInt(processed) === parseInt(statuses.storeClose.processed)) &&
                                <div>
                                    <div className="text-center">Offline</div>
                                    <button className="btn green-btn centered" onClick={() => this.props.sendToKitchen(Id, order_num, 'cancel')}>
                                        Cancel</button></div>}
                            {parseInt(processed) === parseInt(statuses.orderCancellationProcessed.processed) &&
                                <h3 className="text-center upper-text">Cancelling the order....</h3>}
                        </div>
                    </React.Fragment> :
                        <React.Fragment>
                            {
                                parseInt(processed) === parseInt(statuses.sendToPOS.processed) &&
                                <div className="text-center upper-text grey">SENDING TO KITCHEN...</div>
                            }
                            {
                                parseInt(processed) === parseInt(statuses.requestSend.processed) &&
                                <div className="text-center upper-text grey">REQUEST SENDING...</div>
                            }
                            {
                                parseInt(processed) === parseInt(statuses.acceptFromPOS.processed) &&
                                <div className="text-center upper-text success">SENT SUCCESSFULLY TO POS</div>
                            }
                            {
                                parseInt(processed) === parseInt(statuses.waitDODToPickOrder.processed) &&
                                <button className="btn btn-success green-btn"
                                    onClick={() => this.props.sendToKitchen(Id, order_num)}>SEND TO KITCHEN</button>
                            }
                            {
                                retryError
                                &&
                                <button className="btn btn-success red-btn"
                                    onClick={() => this.props.sendToKitchen(Id, order_num)}>Retry</button>
                            }
                        </React.Fragment>}
                </React.Fragment>
            </Panel>
        )
    }
}