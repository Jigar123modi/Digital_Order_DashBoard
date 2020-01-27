import React, {Component} from 'react';
import { Collapse } from 'antd';
import Order from './Order';

export default class CollapseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFull: false,
            activeKey: ''
        }
    }

    render(){
        const { orders = [] } = this.props;

        return(
            <Collapse bordered={false}>
                {orders.map((orderDetails, index) => (
                    <Order orderDetails={orderDetails} key={orderDetails.Id} index={index+1} sendToKitchen={this.props.sendToKitchen} {...this.props}/>
                ))}
            </Collapse>
        )
    }
}

