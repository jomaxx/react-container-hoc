# react-container-hoc

## Install
```
npm i react-container-hoc --save
```

## Basic Usage

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

const mapStateToProps = (state) => {
  const { isActive = false } = state;
  return { isActive };
};

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

### container([mapStateToProps,] [mapSetStateToProps,] [mergeProps,] [lifecycles]) => containerFactory

#### mapStateToProps(state, props) => stateProps

#### mapSetStateToProps(setState, props) => setStateProps

#### mergeProps(props, stateProps, setStateProps) => wrappedComponentProps

### containerFactory(WrappedComponent) => ContainerComponent
