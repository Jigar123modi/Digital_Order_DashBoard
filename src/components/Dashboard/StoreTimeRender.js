import React, {Component} from 'react';
import moment from 'moment-timezone';
import { dateFormat1,dateFormat3 } from '../../timeformat';

export default class StoreTimeRender extends Component {
    constructor(props){
        super(props);
        this.state = {
            storeTime: moment.tz(props.storeTime,props.timeZone),
        }
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    };



    tick() {
        this.setState({
            storeTime: moment(this.state.storeTime, this.props.timeZone).add(1, 'seconds')
        });
    }

    render() {
        if(dateFormat3(this.state.storeTime, this.props.timeZone) === '01:00:00') {
            window.location.reload();
        }
        return(
            <p>{dateFormat1(this.state.storeTime, this.props.timeZone)}</p>
        )
    }
}
