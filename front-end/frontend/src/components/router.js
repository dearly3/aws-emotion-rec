import React, { Component } from 'react';
import { Auth } from "aws-amplify";
import { Route, Redirect, withRouter, Switch, BrowserRouter as Router } from 'react-router-dom'

import Authenticator from './authenticator'
import Dashboard from './dashboard'
import Home from './home'
import NewPresentation from './newPresentation'

class PrivateRoute extends Component {
    state = {
        loaded: false,
        isAuthenticated: false
    }

    componentDidMount() {
        this.authenticate()
        this.unlisten = this.props.history.listen(() => {
            Auth.currentAuthenticatedUser()
              .catch(() => {
                if (this.state.isAuthenticated) this.setState({ isAuthenticated: false })
              })
          });
    }

    componentWillUnmount() {
        this.unlisten()
    }

    authenticate() {
        Auth.currentAuthenticatedUser().then(() => {
            this.setState({ loaded: true, isAuthenticated: true})
        })
        .catch(() => {
            this.props.history.push("/auth")
        })
    }

    render() {
        const { component: Component, ...rest } = this.props
        const { loaded , isAuthenticated} = this.state
        if (!loaded) return null
        return (
          <Route
            {...rest}
            render={props => {
              return isAuthenticated ? (
                <Component {...props} />
              ) : (
                <Redirect
                  to={{
                    pathname: "/auth",
                  }}
                />
              )
            }}
          />
        )
    }

}

PrivateRoute = withRouter(PrivateRoute)

const Routes = () => (
    <Router>
        <Switch>
            <Route exact path='/auth' component={Authenticator} />
            <PrivateRoute exact path='/dashboard' component={Dashboard} />
            <PrivateRoute exact path='/' component={Home} />
            <PrivateRoute exact path="/new-presentation" component={NewPresentation} />
        </Switch>
    </Router>
)

export default Routes
