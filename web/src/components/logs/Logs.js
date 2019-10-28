import React, { Component } from 'react';

import './Logs.css';

const API_URL = process.env.REACT_APP_API_ENDPOINT;

function n(n){
    return n > 9 ? "" + n: "0" + n;
}

export default class Logs extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sw: null,
            data: [],
            background: 'white',
        };
    }

    componentDidMount() {
        this.fetchLogs();
        this.setupTimer();

        window.Notification.requestPermission().then(perm => {
            if(perm === 'granted'){
                navigator.serviceWorker.getRegistration(`${process.env.PUBLIC_URL}/service-worker.js`).then(sw => {
                    this.setState({sw: sw})
                });
            }
        });
    }
      
    setupTimer() {
        fetch(API_URL + '/api/config')
        .then(_response => _response.json())
        .then(response => {
            if(response != null){
                this.timer = setInterval(() => this.fetchLogs(), (response['delay']*1000)/2);
            }
        });
    }

    notificate = (title, body) => {
        const options = {
            "body": body,
            "icon": "/favicon.ico"
        };
        this.state.sw.showNotification(title, options);
    }

    fetchLogs = () => {
        this.setState({background: '#23d160'});
        fetch(API_URL + '/api/websites/logs')
        .then(_response => _response.json())
        .then(response => {
            this.setState({ data: response });

            if(this.state.sw !== null){
                response.forEach((el, index) => {
                    if(el['read'] === 0){
                        this.notificate(el['title'], el['name']);
                        this.handleRead({target: { id: index }});
                    }
                });
            }
        });
        setTimeout(() => {
            this.setState({background: 'white'});
        }, 150);
    }

    handleRead = (event) => {
        this.setState({background: '#23d160'});
        console.log(event.target.id)
        fetch(API_URL + '/api/websites/logs', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token:  localStorage.getItem('@notificc/access_token'),
                id:     event.target.id === 'readAll' ? 'all' :
                            this.state.data[event.target.id]['id'],
                read:   event.target.id === 'readAll' ? '1' : 
                            this.state.data[event.target.id]['read'] === 0 ? 1 : 0,
            })
        })
        .catch(() => {
            alert('Error while trying to change read log: ' + event.target.id);
        }).then(() => {
            this.fetchLogs();
        });
    }

    handleDelete = (event) => {
        this.setState({background: '#d12323'});
        fetch(API_URL + '/api/websites/logs', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: localStorage.getItem('@notificc/access_token'),
                id: event.target.id === 'deleteAll' ? 'all' : event.target.id,
            })
        })
        .catch(() => {
            alert('Error while trying to delete log: ' + event.target.id);
        }).then(() => {
            this.fetchLogs();
        });
    }

    getDateFormatted = (timestamp) => {
        var date = new Date(timestamp);
        return n(date.getDate()) + '/' + n(date.getMonth()) + ' ' + n(date.getHours()) + ':' + n(date.getMinutes()) + ':' + n(date.getSeconds());
    }

    render() {
        if(this.props.apiStatus !== 'online') return null;

        return (
            <div id='logs' className='box' style={{backgroundColor: this.state.background}}>

                <div className='header centered'>
                    <span className='title'>
                        Logs
                    </span>

                    <span className='header-control'>
                        <i className='fas fa-sync pointer' title='Refresh logs' onClick={this.fetchLogs}></i>
                        <i className='fa fa-tasks pointer' title='Mark all as read' id='readAll' onClick={this.handleRead}></i>
                        <i className='fa fa-trash pointer' title='Delete all' id='deleteAll' onClick={this.handleDelete}></i>
                    </span>
                </div>

                <div id='content'>
                    {this.state.data.map((x, index) => 
                        <div className={'content-line ' + (x['read'] ? '' : 'unread')} key={x['id']}>
                            <span className='icon'>
                                <i className='fa fa-book'></i>
                            </span>
                            
                            <a href={x['url']}>
                                {x['name']}
                            </a>

                            <span>
                            : {x['title']}
                            </span>

                            <div className='content-control'>
                                <span className='registry-control-item logs-time'>
                                    {this.getDateFormatted(x['time'])}
                                </span>

                                {x['read'] ? 
                                    <i className='content-control-item far fa-check-circle pointer' title='Mark as unread' id={index} onClick={this.handleRead}></i> :
                                    <i className='content-control-item fas fa-check-circle pointer' title='Mark as read' id={index} onClick={this.handleRead}></i>
                                }
                                <i className='content-control-item fas fa-times pointer' title='Delete' id={x['id']} onClick={this.handleDelete}></i>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
