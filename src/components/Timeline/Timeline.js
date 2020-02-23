import React from 'react';
import styles from './Timeline.module.scss';

const Timeline = ({waypoints, progress}) => {
    return (
        <div className={styles.container}>
            <div className={styles.progressBarContainer}>
                <div className={styles.backgroundBar}/>
                <div className={styles.completedBar} style={{width: `${progress * 100}%`}}/>
                {waypoints.map((waypoint, i) => {
                    const percent = `${waypoint.progress * 100}%`;
                    return(<div 
                        className={[
                            styles.waypointMarker,
                            (progress > waypoint.progress) ? styles.waypointMarkerComplete : ''
                        ].join(" ")} 
                        style={
                            (i < waypoints.length - 1) ? 
                                {marginLeft: `calc(${percent} - 6px)`} : 
                                {right: 0}}>
                    </div>)
                })}
                <div className={styles.currentProgressWaypoint} style={{marginLeft: `calc(${progress * 100}% - 12px)`}}/>
            </div>
            <div className={styles.labels}>
                {waypoints.map((waypoint, i) => {
                    const percent = `${waypoint.progress * 100}%`;
                    return(
                        <p className={styles.waypointLabel} style={(i < waypoints.length - 1) ? {marginLeft: `calc(${percent} - 6px)`} : {right: 0}}>
                            {waypoint.title || percent}
                        </p>
                    )
                })}
            </div>
        </div>
    );
};

export default Timeline;