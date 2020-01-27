import React, { Component } from 'react';
import axios from 'axios';
import PubNubReact from 'pubnub-react';
import { Row, Col, Select } from 'antd';
import UberEats from './UberEats';
import Deliverioo from './Deliveroo';
import WebApp from './WebApp';
import StoreTimeRender from './StoreTimeRender';
import { baseURL, pubnubKey } from '../../constants';
import Loader from '../Loader';
import { statuses } from './statuses';
import StoreClose from './StoreClose';

import { getAccessToken, decodeToken, clearAccessToken } from '../services/utils';

import './dashboard.css';


const init_state = {
    startupDetails: '',
    apiListenChannelName: '',
    dodListenChannelName: '',
    uberEats: [],
    deliveroo: [],
    web_app: [],
    storeTime: '',
    timeZone: '',
    closeTime: '',
    loadingStartupData: true
};
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeList: [],
            loading: true,
            selectedStore: '',
            userDetails: decodeToken().user,
            ...init_state
        };
        this.pubnubInitialize();
    }

    componentWillMount() {
        this.state.userDetails.role === 'admin' && this.getStoreList();
        this.getStartupDetails(this.state.userDetails.gygStoreId);
        this.pubnubListerner();
    }


    getStoreName = () => {
        return this.state.storeList.find(s => s.storeId === this.state.selectedStore)['store'];
    }

    pubnubInitialize = () => {
        try {
            this.pubnub = new PubNubReact(pubnubKey);
            this.pubnub.init(this);
        } catch (error) {
            console.log('error in pubnub initialization', error);
        }
    };

    pubnubListerner = () => {
        this.pubnub.addListener({
            message: (msg => {
                switch (msg.message.messageType) {
                    case 'newOrderAlert':         
                        this.addOrder(msg.message.data.order.order, msg.message.data.order.orderType, msg.message.data.order.order.order_num);
                        break;
                    case 'orderConfirmation':
                        this.orderConfirmation(msg.message.data.order)
                        break;
                    case 'orderAcknowledgement':
                        this.orderAcceptToProcess(msg.message.data.order);
                        break;
                    case 'orderAcceptToProcess':
                        this.orderAcceptToProcess(msg.message.data.order);
                        break;
                    case 'orderCancelAcknowledgement':
                        this.moveToRecent(msg.message.data.order);
                        break;
                    default:
                        break;
                }
            })
        })
    };

    publishMessage = (message) => {
        this.pubnub.publish({ message: message, channel: this.state.apiListenChannelName });
    };

    addOrder = (order, orderType, orderNumber) => {
        const orders = this.state[orderType]['orders'] || [];
        const index = orders.findIndex(o => o.order_num === orderNumber);
        if (index === -1) {
            this.setState((state) => ({ [orderType]: { ...state[orderType], orders: [...state[orderType].orders, order] } }));
        }
    };

    orderConfirmation = (order) => {
        if (order.isSuccess) {
            this.moveToRecent(order);
        } else {
            this.orderAcceptToProcess(order);
        }
    };

    moveToRecent = (order) => {
        const { uberEats, deliveroo, web_app } = this.state;
        const i = uberEats.orders.findIndex(o => o.order_num === order.order_num);
        if (i !== -1) {
            const orderToRecent = uberEats.orders.splice(i, 1)[0];
            orderToRecent.processed = order.processed;
            orderToRecent.reason = order.reason;
            orderToRecent.orderNumber = order.orderNumber;
            if (uberEats.lastCompletedOrders.length >= 5) {
                uberEats.lastCompletedOrders.shift();
            }
            uberEats.lastCompletedOrders.push(orderToRecent);
            this.setState({ uberEats });
            return;
        }

        const ii = deliveroo.orders.findIndex(o => o.order_num === order.order_num);
        if (ii !== -1) {
            const orderToRecent = deliveroo.orders.splice(i, 1)[0];
            orderToRecent.processed = order.processed;
            orderToRecent.reason = order.reason;
            orderToRecent.orderNumber = order.orderNumber;
            if (deliveroo.lastCompletedOrders.length >= 5)
                deliveroo.lastCompletedOrders.shift();
            deliveroo.lastCompletedOrders.push(orderToRecent);
            this.setState({ deliveroo });
            return;
        }

        const iii = web_app.orders.findIndex(o => o.order_num === order.order_num);
        if (iii !== -1) {
            const orderToRecent = web_app.orders.splice(i, 1)[0];
            orderToRecent.processed = order.processed;
            orderToRecent.reason = order.reason;
            orderToRecent.orderNumber = order.orderNumber;
            if (web_app.lastCompletedOrders.length >= 5)
                web_app.lastCompletedOrders.shift();
            web_app.lastCompletedOrders.push(orderToRecent);
            this.setState({ web_app });
        }
    };

    orderAcceptToProcess = (order) => {
        const { uberEats, deliveroo, web_app } = this.state;
        const i = uberEats.orders.findIndex(o => o.order_num === order.order_num);
        if (i !== -1) {
            uberEats.orders[i].processed = order.processed;
            uberEats.orders[i].reason = order.reason;
            this.setState({ uberEats });
            return;
        }

        const ii = deliveroo.orders.findIndex(o => o.order_num === order.order_num);
        if (ii !== -1) {
            deliveroo.orders[ii].processed = order.processed;
            deliveroo.orders[ii].reason = order.reason;
            this.setState({ deliveroo });
            return;
        }

        const iii = web_app.orders.findIndex(o => o.order_num === order.order_num);
        if (iii !== -1) {
            web_app.orders[iii].processed = order.processed;
            web_app.orders[iii].reason = order.reason;
            this.setState({ web_app });
        }
    };

    getStoreList() {
        this.setState({ ...init_state });
        axios.get(baseURL + '/DOD/storeList', { headers: { 'Authorization': 'Bearer ' + getAccessToken() } }).then(response => {
            this.setState({ storeList: response.data, loading: false, selectedStore: 6 });
        }).catch(error => {
            console.log('error', error);
            this.setState({ loading: false });
        })
    };

    subscribeChannel = (response) => {
        this.pubnub.subscribe({ channels: [response.dodListenChannelName], withPresence: true });
        this.setState({
            apiListenChannelName: response.apiListenChannelName,
            dodListenChannelName: response.dodListenChannelName
        });
    };

    setStartupData = (startupDetails) => {
        this.setState({ startupDetails, uberEats: startupDetails.orders.uberEats, deliveroo: startupDetails.orders.deliveroo, web_app: startupDetails.orders.web_app })
    };

    getStartupDetails = (storeId) => {
        axios.get(baseURL + '/DOD/dodStartUp/' + storeId, { headers: { 'Authorization': 'Bearer ' + getAccessToken() } }).then(response => {
            this.setStartupData(response.data);
            this.subscribeChannel(response.data);
            this.setState({
                storeTime: response.data.storeCurrentTime,
                timeZone: response.data.storeTimeZone, closeTime: response.data.lastAvailableOrderSlotTime,
                loadingStartupData: false
            });
        }).catch(error => {
            this.setState({ loadingStartupData: false });
            console.log('error', error);
        })
    };

    handleChange = (value) => {
        this.unSubscibeChannels();
        this.setState({ selectedStore: value, ...init_state }, () => {
            this.getStartupDetails(value);
        });
    };

    updateStatus = (orderNumber, orderType, cancel) => {
        let orders = this.state[orderType].orders;
        const i = orders.findIndex((order) => order.order_num === orderNumber);
        if (i !== -1) {
            orders[i].processed = cancel === 'cancel' ? statuses.orderCancellationProcessed.processed : statuses.requestSend.processed;
            orders[i].reason = cancel === 'cancel' ? statuses.orderCancellationProcessed.reason : statuses.requestSend.reason;
        }
        this.setState((state) => ({ [orderType]: { ...state[orderType], orders: orders } }));
    };

    sendToKitchen = (orderId, orderNum, orderType, cancel) => {
        let message = {
            messageType: cancel === 'cancel' ? 'orderCancel' : 'sendToKitchen',
            data: {
                order: {
                    Id: orderId,
                    order_num: orderNum,
                    storeName: this.getStoreName()
                }
            }
        };

        this.publishMessage(message);
        this.updateStatus(orderNum, orderType, cancel);
    };

    unSubscibeChannels = () => {
        this.pubnub.unsubscribe({ channels: [this.state.dodListenChannelName] });
    };

    componentWillUnmount() {
        this.unSubscibeChannels();
    }

    render() {
        const { storeList, loading, selectedStore, uberEats, storeTime, timeZone, closeTime, loadingStartupData } = this.state;
        return (
            <div className="dashboard-wrapper">
                <Loader isLoading={loadingStartupData} />
                <div className="header">
                    <div className="left-side">
                        <div className="logo"><img src="/assets/images/gyg-logo.png" alt="" /></div>
                        {storeTime && <StoreClose closeTime={closeTime} storeTime={storeTime} timeZone={timeZone} />}
                    </div>
                    <div className="right-side">
                        <div className="right-side-timezone">{storeTime && <StoreTimeRender storeTime={storeTime} timeZone={timeZone} />}</div>
                        <div className="right-side-dropdown">
                            <Select loading={loading} style={{ width: 250 }} value={selectedStore}
                                onChange={this.handleChange}>
                                {
                                    storeList.map((s, index) => (
                                        <Select.Option value={s.storeId} key={index}>{s.store}</Select.Option>
                                    ))
                                }
                            </Select>
                        </div>
                    </div>
                </div>
                <div className="left_pannel">
                    <h5 className="current">CURRENT ORDERS</h5>
                    <h5>RECENT</h5>
                </div>
                <div className="container border">
                    <Col className="main-wrapper">
                        <Row gutter={16}>
                            <UberEats startupData={uberEats} sendToKitchen={this.sendToKitchen} timeZone={timeZone} />
                            <Deliverioo />
                            <WebApp />
                        </Row>
                    </Col>
                </div>
            </div>
        )
    }

}
export default Dashboard