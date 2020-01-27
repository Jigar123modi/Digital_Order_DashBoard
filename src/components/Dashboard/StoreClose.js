import React, { Component } from 'react';
import { Alert } from 'antd';
import moment from 'moment-timezone';

export default class
    StoreClose extends Component {
    constructor(props) {
        super(props);
        this.state = {
            storeTime: moment.tz(props.storeTime, props.timeZone),
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

    msToHMS = (ms) => {
        if (ms <= 0) {
            return 'Store is Closed';
        } else if (ms <= (60000 * 30)) {
            let seconds = ms / 1000;
            seconds = seconds % 3600;
            let minutes = parseInt(seconds / 60);
            seconds = seconds % 60;
            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            return minutes + ":" + seconds;
        }
        return '';
    };

    render() {
        const endTime = moment.tz(this.props.closeTime, this.props.timeZone);
        const startTime = this.state.storeTime;
        const diff = endTime.diff(startTime);
        return (
            <div className={diff < (60000 * 30) ? "store-close" : "d-none"}>
                <Alert message={this.msToHMS(diff)} type="warning" showIcon />
            </div>
        )
    }
}