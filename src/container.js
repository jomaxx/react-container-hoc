import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function noop() {}

const defaults = {
  mapStateToProps(state) {
    return { state };
  },

  mapSetStateToProps(setState) {
    return { setState };
  },

  mergeProps(props, stateProps, setStateProps) {
    return Object.assign({}, props, stateProps, setStateProps);
  },
};

export default function container(
  mapStateToProps = defaults.mapStateToProps,
  mapSetStateToProps = defaults.mapSetStateToProps,
  mergeProps = defaults.mergeProps,
  {
    componentWillMount,
    componentDidMount,
    componentWillReceiveProps = noop,
    shouldComponentUpdate,
    componentWillUpdate = noop,
    componentDidUpdate,
    componentWillUnmount,
  } = {}
) {
  return function containerFactory(WrappedComponent) {
    class Container extends Component {
      constructor(props) {
        super(props);
        this.state = {};
        this.setState = this.setState.bind(this);
        this.stateProps = mapStateToProps(this.state, this.props);
        this.setStateProps = mapSetStateToProps(this.setState, this.props);
      }

      componentWillReceiveProps(nextProps) {
        this.setStateProps = mapSetStateToProps(this.setState, nextProps);
        componentWillReceiveProps.call(this, nextProps);
      }

      componentWillUpdate(nextProps, nextState) {
        this.stateProps = mapStateToProps(nextState, nextProps);
        componentWillUpdate.call(this, nextProps, nextState);
      }

      render() {
        return (
          <WrappedComponent
            {...mergeProps(
              this.props,
              this.stateProps,
              this.setStateProps
            )}
          />
        );
      }
    }

    Container.prototype.componentWillMount = componentWillMount;
    Container.prototype.componentDidMount = componentDidMount;
    Container.prototype.shouldComponentUpdate = shouldComponentUpdate;
    Container.prototype.componentDidUpdate = componentDidUpdate;
    Container.prototype.componentWillUnmount = componentWillUnmount;

    Container.displayName = `container(${
      WrappedComponent.displayName
      || WrappedComponent.name
      || 'Component'
    })`;

    Container.WrappedComponent = WrappedComponent;

    hoistNonReactStatic(Container, WrappedComponent);

    return Container;
  };
}
