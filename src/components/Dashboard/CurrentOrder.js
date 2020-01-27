import React, {Component} from 'react';
import  CollapseComponent from './CollapseComponent';

export default class CurrentOrder extends Component {
    render(){
        const { orders } = this.props;
        return(
            <CollapseComponent orders={orders} sendToKitchen={this.props.sendToKitchen} {...this.props}/>
        )
    }
}
