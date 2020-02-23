import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './Home.module.scss';
import ThreeRenderer from '../../Components/ThreeRenderer/ThreeRenderer';
import Timeline from '../../Components/Timeline/Timeline';
import Footer from '../../Components/Footer/Footer';
import { HashLink } from 'react-router-hash-link';
import { Link } from 'react-router-dom';

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
                        <HashLink to={"/#contribute"}><button className={"filledButton"}>Get Involved</button></HashLink>
                        <Link to={"/team"}>
                            <button>About ARCC</button>
                        </Link> 
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
                    <h3  id={"contribute"}>Getting Involved</h3>
                    <div className={styles.tiles}>
                        <div className={styles.tile}>
                            <div>
                                <h2>Students</h2>
                                <p>Interested in joining ARCC? We're looking for new members! Students with any level of experience are welcome.</p>
                            </div>
                            <a href={"https://docs.google.com/forms/d/1CAJrfCIOnYouGxX1Qv9lJ-g5DIDP-UwXnsp20-gmyIc/edit"}><button>Join ARCC</button></a>
                        </div>

                        <div className={styles.tile}>
                            <div>
                                <h2>Industry</h2>
                                <p>We are currently looking to develop industry partnerships, including mentorship, in-kind contributions, and sponsorship.</p>
                            </div>
                            <a href={"mailto:arcc@uw.edu"}><button>Contact Us</button></a>
                        </div>

                        <div className={styles.tile}>
                            <div>
                                <h2>Donating</h2>
                                <p>ARCC is pending 501(c)(3) status, please contact us directly to make a contribution.</p>
                            </div>
                            <a href={"mailto:arcc@uw.edu"}><button className={"filledButton"}>Contribute</button></a>
                        </div>
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


const fundraisingMap = {
    waypoints: [{progress: 0, title: " "}, {progress: 0.50}, {progress: 1.0, title: "$3k"}],
    progress: 0.05,
}

const progressMap = {
    waypoints: [
        {progress: 0, title: " "},
        {progress: 0.15, title: "PDR"}, 
        {progress: 0.25, title: "CDR"}, 
        {progress: 0.35, title: "Manufacturing and Testing"},
        {progress: 0.75, title: "Flight Tests"},
        {progress: 1.0, title: "Completion"}
    ],
    progress: 0.2,
}

Home.propTypes = {

};

export default Home;