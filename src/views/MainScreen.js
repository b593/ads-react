import React, {Component} from 'react';
import {connect} from "react-redux";
import {Dashboard, Mail, News, Calendar, Database} from './';
import {Button, Container, Icon, Menu} from "semantic-ui-react";
import {Login} from "./Login";
import {navigatePop} from "../store/actions";

import {News as ReadNews} from "../components/news";

import {Details as TeamDetails} from "../components/team";
import {Details as PlayerDetails} from "../components/player";
import {Details as CoachDetails} from "../components/coach";

const componentMap = {
    'mail': <Mail/>,
    'news': <News/>,
    'calendar': <Calendar/>,
    'database': <Database/>,

    // AppsSubView
    'readNews': <ReadNews/>,

    // Teams Views
    'teamDetails': <TeamDetails/>,
    'playerDetails': <PlayerDetails/>,
    'coachDetails': <CoachDetails/>,
};


class MainScreenView extends Component {
    render() {
        const viewComponent = componentMap[this.props.view];
        const {loggedIn} = this.props;
        if (viewComponent) {
            return (
                <div>
                    <Menu className="top fixed">
                        <Button fluid onClick={() => this.props.back()} size="massive">
                            <Icon name="step backward"/> Back
                        </Button>
                    </Menu>
                    <Container style={{marginTop: '80px'}} textAlign="center">
                        {viewComponent}
                    </Container>
                </div>
            );
        }


        return loggedIn ? <Dashboard/> : <Login/>;
    }
}

const mapDispatchToProps = dispatch => {
    return {
        back() {
            dispatch(navigatePop())
        }
    };
};
const mapStateToProps = ({navigation, game}) => {
    const loggedIn = Object.keys(game).length > 0;
    return {
        view: navigation.view,
        loggedIn
    }
};
const MainScreen = connect(mapStateToProps, mapDispatchToProps)(MainScreenView);
export {MainScreen};

