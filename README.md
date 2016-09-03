# react-container-hoc

Higher order component for managing component state. The ContainerComponent passes state and callbacks for mutating state to a WrappedComponent via props. This allows for a separation of concerns where state is managed by the container and dom layout is handled by a stateless functional component.

## Install
```
npm i react-container-hoc --save
```

## Usage

```js
import React from 'react';
import container from 'react-container-hoc';

function MyButton(props) {
  return (
    <button
      type="button"
      {...props}
    />
  );
}

// default mapStateToProps = (state) => ({ state })
const mapStateToProps = (state) => ({
  className: state.isActive ? 'active' : undefined,
});

// default mapSetStateToProps = (setState) => ({ setState })
const mapSetStateToProps = (setState) => ({
  onClick() {
    setState((state) => {
      const { isActive } = state;
      return { isActive: !isActive };
    });
  },
});

// default mergeProps = (props, stateProps, setStateProps) => Object.assign({}, props, stateProps, setStateProps)
const mergeProps = (props, stateProps, setStateProps) => Object.assign(
  {},
  props,
  stateProps,
  setStateProps
);

export default container(
  mapStateToProps,
  mapSetStateToProps,
  mergeProps,
  {
    componentDidMount() {
      findDOMNode(this).focus();
    },
  }
)(MyButton);

```

## API

### `container([mapStateToProps], [mapSetStateToProps], [mergeProps], [lifecycles]) => containerFactory`

#### `mapStateToProps(state, props) => stateProps`
Use `mapStateToProps` to create `stateProps` which get passed down to the `WrappedComponent` via props.

#### `mapSetStateToProps(setState, props) => setStateProps`
Use `mapSetStateToProps` to create `setStateProps` which are callbacks (used to mutate `state`) that get passed down to the `WrappedComponent` via props. These typically are event handlers (eg. onClick).

#### `mergeProps(props, stateProps, setStateProps) => wrappedComponentProps`
Use `mergeProps` to change the way `props` gets merged with `stateProps` and `setStateProps` before being passed to the `WrappedComponent`.

#### `lifecycles`
`lifecycles` is an object of [react lifecycle methods](https://facebook.github.io/react/docs/component-specs.html#lifecycle-methods)

### `containerFactory(WrappedComponent) => ContainerComponent`
