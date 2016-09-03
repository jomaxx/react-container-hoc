import assert, { equal } from 'assert';
import { spy } from 'sinon';
import { jsdom } from 'jsdom';
import container from '../';

const document = jsdom('');
global.document = document;
global.window = document.defaultView;
global.navigator = { userAgent: 'node.js' };

const React = require('react');
const mount = require('enzyme').mount;

function TestComponent(props) {
  return <button {...props} />;
}

function mapStateToProps({ isActive }) {
  return {
    className: isActive ? 'active' : undefined,
  };
}

function mapSetStateToProps(setState) {
  return {
    onClick() {
      setState({ isActive: true });
    },
  };
}

describe('container', () => {
  it('should create container component', () => {
    const { displayName, WrappedComponent } = container()(TestComponent);

    equal(
      displayName,
      'container(TestComponent)'
    );

    equal(
      WrappedComponent,
      TestComponent
    );
  });

  it('should update state', () => {
    const Container = container(
      mapStateToProps,
      mapSetStateToProps
    )(TestComponent);

    const wrapper = mount(<Container>Click</Container>);

    equal(
      wrapper.html(),
      '<button>Click</button>'
    );

    wrapper.find('button').simulate('click');

    equal(
      wrapper.html(),
      '<button class="active">Click</button>'
    );
  });

  it('should mergeProps', () => {
    const Container = container(
      mapStateToProps,
      mapSetStateToProps,
      (ownProps, stateProps, setStateProps) =>
        Object.assign({}, stateProps, setStateProps, ownProps)
    )(TestComponent);

    const wrapper = mount(
      <Container className="test">
        Click
      </Container>
    );

    equal(
      wrapper.html(),
      '<button class="test">Click</button>'
    );

    wrapper.find('button').simulate('click');

    equal(
      wrapper.html(),
      '<button class="test">Click</button>'
    );
  });

  it('should handle lifecycles', () => {
    const componentWillMount = spy();
    const componentDidMount = spy();
    const componentWillReceiveProps = spy();
    const shouldComponentUpdate = spy(() => true);
    const componentWillUpdate = spy();
    const componentDidUpdate = spy();
    const componentWillUnmount = spy();

    const Container = container(
      mapStateToProps,
      mapSetStateToProps,
      {
        componentWillMount,
        componentDidMount,
        componentWillReceiveProps,
        shouldComponentUpdate,
        componentWillUpdate,
        componentDidUpdate,
        componentWillUnmount,
      }
    )(TestComponent);

    const wrapper = mount(<Container />);
    wrapper.setProps({ className: 'test' });
    wrapper.unmount();

    assert(componentWillMount.calledOnce);
    assert(componentDidMount.calledOnce);
    assert(componentWillReceiveProps.calledOnce);
    assert(shouldComponentUpdate.calledOnce);
    assert(componentWillUpdate.calledOnce);
    assert(componentDidUpdate.calledOnce);
    assert(componentWillUnmount.calledOnce);
  });
});
