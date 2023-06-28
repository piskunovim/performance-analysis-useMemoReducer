const Benchmark = require("benchmark");
const React = require("react");
const ReactDOM = require("react-dom");
const { useMemoReducer } = require("use-memo-reducer");
const { createStore } = require("redux");
const { Provider, connect } = require("react-redux");
const { JSDOM } = require("jsdom");
const { render, fireEvent } = require("@testing-library/react");

const suite = new Benchmark.Suite();

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = { userAgent: "node.js" };

const CounterWithUseMemoReducer = () => {
  const [useSelector, dispatch] = useMemoReducer((state, action) => {
    switch (action.type) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      default:
        return state;
    }
  }, 0);

  const count = useSelector((state) => state);

  return (
    <div>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
};

const CounterWithUseReducer = () => {
  const [count, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case "increment":
        return state + 1;
      case "decrement":
        return state - 1;
      default:
        return state;
    }
  }, 0);

  return (
    <div>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
    </div>
  );
};

const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
};

const store = createStore(counterReducer);

const CounterWithRedux = ({ count, increment, decrement }) => (
  <div>
    <button onClick={decrement}>-</button>
    <span>{count}</span>
    <button onClick={increment}>+</button>
  </div>
);

const mapStateToProps = (state) => ({
  count: state,
});

const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch({ type: "INCREMENT" }),
  decrement: () => dispatch({ type: "DECREMENT" }),
});

const ConnectedCounterWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(CounterWithRedux);

// Benchmark for useMemoReducer
suite
  .add("useMemoReducer - Simple Counter", function () {
    const { container } = render(<CounterWithUseMemoReducer />);
    const minusButton = container.querySelector("button:first-child");
    const plusButton = container.querySelector("button:last-child");

    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
  })
  .add("useReducer - Simple Counter", function () {
    const { container } = render(<CounterWithUseReducer />);
    const minusButton = container.querySelector("button:first-child");
    const plusButton = container.querySelector("button:last-child");

    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
  })
  .add("Redux - Simple Counter", function () {
    const { container } = render(
      <Provider store={store}>
        <ConnectedCounterWithRedux />
      </Provider>
    );
    const minusButton = container.querySelector("button:first-child");
    const plusButton = container.querySelector("button:last-child");

    fireEvent.click(plusButton);
    fireEvent.click(minusButton);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
