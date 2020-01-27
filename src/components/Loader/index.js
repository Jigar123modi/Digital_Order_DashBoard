import React, {Component} from 'react';
import './loader.css';
export default class Loader extends Component {

    render(){
        const { isLoading } =  this.props;
        return(<div className={isLoading ? 'loadingPanel d-block' : 'loadingPanel d-none'}/>
        )
    }
}