# react-container-hoc

Higher order component for managing component state. The ContainerComponent passes state and callbacks (for mutating state) to a WrappedComponent via props. This allows for a separation of concerns where state is managed by the container and dom layout is handled by a stateless functional component.

## Install
```
npm i react-container-hoc --save
```

## Usage

```js
import React from 'react';
import container from 'react-container-hoc';

function MyButton(props) {
  const { isActive, onClick } = props;

  return (
    <button
      type="button"
      className={isActive ? 'active' : undefined}
      onClick={onClick}
    />
  );
}

// default mapStateToProps returns { state }
const mapStateToProps = (state) => {
  const { isActive = false } = state;
  return { isActive };
};

// default mapSetStateToProps returns { setState }
const mapSetStateToProps = (setState) => ({
  onClick() {
    setState((state) => {
      const { isActive = false } = state;
      return { isActive: !isActive };
    });
  },
});

export default container(
  mapStateToProps,
  mapSetStateToProps
)(MyButton);

```

## API

### container([mapStateToProps], [mapSetStateToProps], [mergeProps], [lifecycles])

```js

```

#### `mapStateToProps(state, props)`

#### `mapSetStateToProps(setState, props)`

#### `mergeProps(props, stateProps, setStateProps)`

#### `lifecycles`
