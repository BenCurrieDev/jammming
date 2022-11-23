import React from 'react';
import './Track.css';

export class Track extends React.Component {
    constructor(props) {
        super(props);
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
    }
    
    addTrack() {
        let trackToAdd = this.props.track;
        this.props.onAdd(trackToAdd);
    }

    removeTrack() {
        let trackToRemove = this.props.track;
        this.props.onRemove(trackToRemove);
    }
    
    renderAction() {
        return (this.props.isRemoval ? <button className="Track-action" onClick={this.removeTrack}>-</button> : <button className="Track-action" onClick={this.addTrack}>+</button>);
    }
    
    render() {
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist}  |  {this.props.track.album}</p>
                </div>
                {this.renderAction()}
            </div>
        );
    }
}