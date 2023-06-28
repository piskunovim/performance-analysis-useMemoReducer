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

const ListWithUseMemoReducer = () => {
  const [useSelector, dispatch] = useMemoReducer((state, action) => {
    if (action.type === "add") {
      return [...state, `Item ${state.length}`];
    }
    return state;
  }, []);

  const items = useSelector((state) => state);

  return (
    <div>
      <button onClick={() => dispatch({ type: "add" })}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const ListWithUseReducer = () => {
  const [items, dispatch] = React.useReducer((state, action) => {
    if (action.type === "add") {
      return [...state, `Item ${state.length}`];
    }
    return state;
  }, []);

  return (
    <div>
      <button onClick={() => dispatch({ type: "add" })}>Add Item</button>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

const listReducer = (state = [], action) => {
  if (action.type === "ADD_ITEM") {
    return [...state, `Item ${state.length}`];
  }
  return state;
};

const storeForList = createStore(listReducer);

const ListWithRedux = ({ items, addItem }) => (
  <div>
    <button onClick={addItem}>Add Item</button>
    <ul>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  </div>
);

const mapListStateToProps = (state) => ({
  items: state,
});

const mapListDispatchToProps = (dispatch) => ({
  addItem: () => dispatch({ type: "ADD_ITEM" }),
});

const ConnectedListWithRedux = connect(
  mapListStateToProps,
  mapListDispatchToProps
)(ListWithRedux);

suite
  .add("useMemoReducer - List Rendering", function () {
    const { container } = render(<ListWithUseMemoReducer />);
    const button = container.querySelector("button");
    fireEvent.click(button);
  })
  .add("useReducer - List Rendering", function () {
    const { container } = render(<ListWithUseReducer />);
    const button = container.querySelector("button");
    fireEvent.click(button);
  })
  .add("Redux - List Rendering", function () {
    const { container } = render(
      <Provider store={storeForList}>
        <ConnectedListWithRedux />
      </Provider>
    );
    const addButton = container.querySelector("button");
    fireEvent.click(addButton);
  })
  .on("cycle", function (event) {
    console.log(String(event.target));
  })
  .on("complete", function () {
    console.log("Fastest is " + this.filter("fastest").map("name"));
  })
  .run({ async: true });
