import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import ThreeRenderer from '../../Components/ThreeRenderer/ThreeRenderer';
import Timeline from '../../Components/Timeline/Timeline';
import Footer from '../../Components/Footer/Footer';

class Home extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return (
            <div className={styles.home}>
                <div className={styles.mission}>
                    <h3>Our Mission</h3>
                    <p><strong>The Autonomous Rocket Control Club</strong> is an organization of students at the University of Washington developing a small scale, reusable rocket control testbed.</p>
                    <div className={styles.row}>
                        <button className={"filledButton"}>Get Involved</button>
                        <button>About ARCC</button>
                    </div>
                </div>
                <div className={styles.vehicle}>
                    <div className={styles.vehicleContentContainer}>
                        <div className={styles.vehicleContent}>
                            <h3>Raven</h3>
                            <p>Our development vehicle, Raven, is propelled by a throttled 35lbf nitrous oxide / ABS hybrid engine. Control is provided by a two axis engine gimbal and cold gas reaction control system</p>
                            <ul>
                                <li>CO2 supercharged propellant delivery</li>
                                <li>Replaceable 3D printed ABS fuel grain</li>
                                <li>Linear actuator driven 2D gimbal</li>
                                <li>3DoF RCS thruster array</li>
                                <li>Full wireless telemetry and remote operation</li>
                            </ul>
                        </div>
                        <ThreeRenderer className={styles.renderer} />
                    </div>
                </div>
                <div className={styles.involved}>
                    <h3>Getting Involved</h3>
                    <div className={styles.tiles}>
                        { Tiles.map(tile => <div className={styles.tile}>
                                <div>
                                    <h2>{tile.title}</h2>
                                    <p>{tile.content}</p>
                                </div>
                                {
                                    !tile.filled ? 
                                    <button>{tile.cta}</button>
                                    :
                                    <button className={"filledButton"}>{tile.cta}</button>
                                }
                            </div>
                        )}
                    </div>
                </div>
                <div className={styles.fundraising}>
                        <h3>Fundraising</h3>
                        <Timeline waypoints={fundraisingMap.waypoints} progress={fundraisingMap.progress}/>
                        <h3>Capstone Progress</h3>
                        <Timeline waypoints={progressMap.waypoints} progress={progressMap.progress}/>
                </div>
                <Footer/>
            </div>
        );
    }
}

const Tiles = [
    {
        title: "Students",
        content: "Interested in joining ARCC? We're looking for new members! Students with any level of experience are welcome.",
        cta: "Join ARCC"
    },
    {
        title: "Industry",
        content: "We are currently looking to develop industry partnerships, including mentorship, in-kind contributions, and sponsorship.",
        cta: "Contact Us"
    },
    {
        title: "Donating",
        content: "ARCC is a 501(c)(3) and can accept most forms of donations. See below for our more information about our fundraising goals.",
        cta: "Contribute",
        filled: true
    }
]

const fundraisingMap = {
    waypoints: [{progress: 0, title: " "}, {progress: 0.50}, {progress: 1.0, title: "Funded"}],
    progress: 0.05,
}

const progressMap = {
    waypoints: [
        {progress: 0, title: " "},
        {progress: 0.15, title: "PDR"}, 
        {progress: 0.25, title: "CDR"}, 
        {progress: 0.50, title: "Manufacturing"},
        {progress: 0.75, title: "Flight Testing"},
        {progress: 1.0, title: "Completion"}
    ],
    progress: 0.2,
}

Home.propTypes = {

};

export default Home;