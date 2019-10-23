import React, { Component } from 'react';

import SettingsModal from '../modals/SettingsModal.js';
import Tag from '../tag/Tag.js';

import './StatusBar.css';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

export default class StatusBar extends Component {
    constructor(props) {
        super(props);

        this.state = {
            settings: false,
            auth: false,
        };
    };

    handleLogout() {
        fetch(API_URL + '/api/auth/token', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('@notify-change/access_token'),
            })
        })
        .then(() => {
            localStorage.removeItem('@notify-change/access_token');
            window.location.reload(false);
        });
    };

    handleClick = (event) => {
        if([event.target.name] === 'logout'){
            window.location.reload(false);
        }else{
            this.setState({[event.target.name]: true});   
        }
    };

    handleClose = (name) => {
        this.setState({[name]: false});
    };

    handleClickChecker = () => {
        fetch(API_URL + '/api/checker', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        }).then(() => {
            this.props.fetch_api();
        })
        .catch(error => {
            alert("Error: " + error);
        });
    };

    getAPIStatusColor(){
        if(this.props.api_status === 'online'){
            return "is-success";
        }else if(this.props.api_status === 'offline'){
            return "is-danger";
        }else{
            return "is-black";
        }
    }

    getCheckerStatusColor(){
        if(this.props.checker_status === 'error'){
            return "is-black";
        }else if(this.props.checker_status === 'offline'){
            return "is-danger";
        }else if(this.props.checker_status === 'stopped'){
            return "is-warning";
        }else if(this.props.checker_status === 'online'){
            return "is-success";
        }
        return "is-white";
    }

    render(){
        return (
            <div className="level status">
                <div className="level-left">
                    <div className="level-item">
                        <Tag name="api" content={this.props.api_status} color={this.getAPIStatusColor()} />
                    </div>
                    <div className="level-item">
                        <Tag name="checker" content={this.props.checker_status} color={this.getCheckerStatusColor()} click={this.handleClickChecker}/>
                    </div>
                </div>
        
                <div className="level-right">
                    <div className="level-item">
                        <button className="button" name="settings" onClick={this.handleClick} disabled={this.props.api_status === 'online' ? false : true}>Settings</button>
                    </div>

                    <div className="level-item">
                        <button className="button is-danger" name="logout" onClick={this.handleLogout} disabled={this.props.api_status === 'online' ? false : true}>Logout</button>
                    </div>
                </div>

                <SettingsModal active={this.state.settings} handleClose={this.handleClose}/>
            </div>
        )
    }

}