import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styles from './Navigator.module.scss';

class Navigator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: false,
        }
    }

    render() {
        const Links = () => Object.keys(this.props.refs).map(key => <li><Link to={this.props.refs[key].ref} onClick={() => {this.setState({expanded: false})}}>{this.props.refs[key].title}</Link></li>);
        return(
            <div className={styles.navigationWrapper}>
                <div className={styles.navigationLeft}>
                    <Link to={this.props.home} onClick={() => this.setState({expanded: false})}><h1>ARCC</h1></Link>
                </div>
                    <div className={styles.navigationRight}>
                    <ul className={styles.navigationList}> 
                        <Links/>
                    </ul>
                    <button className={styles.ctabutton}>Contribute</button>
                    <div className={[styles.mobileButton, (this.state.expanded) ? styles.mobileButtonExpanded : ""].join(" ")} onClick={(e) => {
                        this.setState({expanded: !this.state.expanded})
                    }}>
                        <div/><div/>
                    </div>
                </div>
                <div className={[styles.collapsable, (this.state.expanded ? styles.expanded : "")].join(" ")}>
                    <ul className={styles.collapsableNavList}> 
                        <Links/>
                    </ul>
                </div>
            </div>
        )
    }
}

Navigator.propTypes = {
    refs: PropTypes.objectOf(PropTypes.shape({
        title: PropTypes.string.isRequired, 
        destination: PropTypes.string.isRequired
    }).isRequired).isRequired
}

export default Navigator;