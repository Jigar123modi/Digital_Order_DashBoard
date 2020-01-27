import React, {Component} from 'react';
import  CollapseComponent from './CollapseComponent';

export default class RecentOrder extends Component {
    render(){
        const { lastCompletedOrders } = this.props;
        return(
            <CollapseComponent orders={lastCompletedOrders} {...this.props} isRecent={true}/>
        )
    }
}