import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './navigator.module.scss';

function Navigator(props) {
    return(
        <div className={styles.navigationWrapper}>
            <div className={styles.navigationLeft}>
                <Link to={props.home}><h1>UW RAVEN</h1></Link>
            </div>
            <div className={styles.navigationRight}>
                <ul className={styles.navigationList}> 
                    { Object.keys(props.refs).map(key => <li><Link to={props.refs[key].ref}>{props.refs[key].title}</Link></li>)}
                </ul>
                <button className={styles.ctabutton}>Contribute</button>
            </div>
        </div>
    )
}

Navigator.propTypes = {
    refs: PropTypes.objectOf(PropTypes.shape({
        title: PropTypes.string.isRequired, 
        destination: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default Navigator;