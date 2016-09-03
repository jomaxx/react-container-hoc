import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

function noop() {}

function mapStateToPropsDefault(state) {
  return { state };
}

function mapSetStateToPropsDefault(setState) {
  return { setState };
}

function mergePropsDefault(props, stateProps, setStateProps) {
  return Object.assign({}, props, stateProps, setStateProps);
}

function createContainerFactory(
  mapStateToProps = mapStateToPropsDefault,
  mapSetStateToProps = mapSetStateToPropsDefault,
  mergeProps = mergePropsDefault,
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

        // lifecycles
        this.componentWillMount = componentWillMount;
        this.componentDidMount = componentDidMount;

        this.componentWillReceiveProps = (...args) => {
          const [nextProps] = args;

          if (mapSetStateToProps.length > 1) {
            this.setStateProps = mapSetStateToProps(this.setState, nextProps);
          }

          return componentWillReceiveProps.apply(this, args);
        };

        this.shouldComponentUpdate = shouldComponentUpdate;

        this.componentWillUpdate = (...args) => {
          const [nextProps, nextState] = args;

          if (nextState !== this.state || mapStateToProps.length > 1) {
            this.stateProps = mapStateToProps(nextState, nextProps);
          }

          return componentWillUpdate.apply(this, args);
        };

        this.componentDidUpdate = componentDidUpdate;
        this.componentWillUnmount = componentWillUnmount;
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

export default function container(...args) {
  if (args.length < 4 && typeof args[args.length - 1] === 'object') {
    return createContainerFactory.apply(this, Object.assign(
      [undefined, undefined, undefined, args.pop()],
      args
    ));
  }

  return createContainerFactory.apply(this, args);
}
