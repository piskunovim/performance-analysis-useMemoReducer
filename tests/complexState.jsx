const Benchmark = require("benchmark");
const React = require("react");
const ReactDOM = require("react-dom");
const { useMemoReducer } = require("use-memo-reducer");
const { createStore, combineReducers } = require("redux");
const { Provider, connect } = require("react-redux");
const { JSDOM } = require("jsdom");
const { render, fireEvent } = require("@testing-library/react");

const suite = new Benchmark.Suite();

const dom = new JSDOM("<!doctype html><html><body></body></html>");
global.window = dom.window;
global.document = dom.window.document;
global.navigator = { userAgent: "node.js" };

const ComplexStateWithUseMemoReducer = () => {
  const [useSelector, dispatch] = useMemoReducer(
    (state, action) => {
      switch (action.type) {
        case "toggle":
          return { ...state, toggle: !state.toggle };
        case "setText":
          return { ...state, text: action.text };
        default:
          return state;
      }
    },
    { toggle: false, text: "" }
  );

  const state = useSelector((state) => state);

  return (
    <div>
      <button onClick={() => dispatch({ type: "toggle" })}>Toggle</button>
      <input
        value={state.text}
        onChange={(e) => dispatch({ type: "setText", text: e.target.value })}
      />
    </div>
  );
};

const ComplexStateWithUseReducer = () => {
  const [state, dispatch] = React.useReducer(
    (state, action) => {
      switch (action.type) {
        case "toggle":
          return { ...state, toggle: !state.toggle };
        case "setText":
          return { ...state, text: action.text };
        default:
          return state;
      }
    },
    { toggle: false, text: "" }
  );

  return (
    <div>
      <button onClick={() => dispatch({ type: "toggle" })}>Toggle</button>
      <input
        value={state.text}
        onChange={(e) => dispatch({ type: "setText", text: e.target.value })}
      />
    </div>
  );
};

const complexReducer = (state = { toggle: false, text: "" }, action) => {
  switch (action.type) {
    case "TOGGLE":
      return { ...state, toggle: !state.toggle };
    case "SET_TEXT":
      return { ...state, text: action.text };
    default:
      return state;
  }
};

const storeForComplex = createStore(complexReducer);

const ComplexStateWithRedux = ({ toggle, text, onToggle, onSetText }) => (
  <div>
    <button onClick={onToggle}>Toggle</button>
    <input value={text} onChange={(e) => onSetText(e.target.value)} />
  </div>
);

const mapComplexStateToProps = (state) => ({
  toggle: state.toggle,
  text: state.text,
});

const mapComplexDispatchToProps = (dispatch) => ({
  onToggle: () => dispatch({ type: "TOGGLE" }),
  onSetText: (text) => dispatch({ type: "SET_TEXT", text }),
});

const ConnectedComplexStateWithRedux = connect(
  mapComplexStateToProps,
  mapComplexDispatchToProps
)(ComplexStateWithRedux);

suite
  .add("useMemoReducer - Complex State", function () {
    const { container } = render(<ComplexStateWithUseMemoReducer />);
    const button = container.querySelector("button");
    const input = container.querySelector("input");
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: "New Text" } });
  })
  .add("useReducer - Complex State", function () {
    const { container } = render(<ComplexStateWithUseReducer />);
    const button = container.querySelector("button");
    const input = container.querySelector("input");
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: "New Text" } });
  })
  .add("Redux - Complex State", function () {
    const { container } = render(
      <Provider store={storeForComplex}>
        <ConnectedComplexStateWithRedux />
      </Provider>
    );
    const button = container.querySelector("button");
    const input = container.querySelector("input");
    fireEvent.click(button);
    fireEvent.change(input, { target: { value: "New Text" } });
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
