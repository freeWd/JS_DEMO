import React, { useState, Component } from "react";
import ReactDom from "react-dom";
import {
  BrowserRouter as Router,
  StaticRouter,
  Route,
  Redirect,
  Switch,
  Link,
  useLocation,
  useRouteMatch,
  Prompt,
  useParams
} from "react-router-dom";

// ============ Redirect ============
export class App1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: true
    };
  }

  switchRedirect = () => {
    this.setState(({ isRedirect }) => ({
      isRedirect: !isRedirect
    }));
  };

  render() {
    return (
      <Router>
        <span>{this.state.isRedirect ? "开" : "关"}</span>
        <button onClick={this.switchRedirect}>开关（使用Redirect）</button>
        <ul>
          <li>
            <Link to="/test1">go test1</Link>
          </li>
          <li>
            <Link to="/test2">go test2</Link>
          </li>
        </ul>

        <Switch>
          <Route path="/test1">Test1 page</Route>
          <Route path="/test2">
            <RedirectTest isRedirect={this.state.isRedirect} />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function RedirectTest(props) {
  let location = useLocation();
  console.log(location);
  if (props.isRedirect) {
    return <Redirect to={{ pathname: "/test1" }} />;
  }
  return <span>Test2 Page</span>;
}

// ReactDom.render(<App1 />, document.getElementById("root"));

// ============ Custom Link ============

export class App2 extends React.Component {
  render() {
    return (
      <Router>
        <ul>
          <li>
            <CustomLik
              to="/test1"
              label="test1 label"
              activeOnlyWhenExact={true}
            />
          </li>
          <li>
            <CustomLik to="/test2" label="test2 label" />
          </li>
        </ul>

        <Switch>
          <Route exact path="/test1">
            test1 page
          </Route>
          <Route path="/test2">test2 page</Route>
        </Switch>
      </Router>
    );
  }
}

function CustomLik({ to, label, activeOnlyWhenExact }) {
  const match = useRouteMatch({
    path: to,
    exact: activeOnlyWhenExact
  });
  console.log(to, label);
  console.log(match, "<----match---");
  return (
    <div className={match ? "active" : ""}>
      {match && ">>"}
      <Link to={to}>{label}</Link>
    </div>
  );
}

// ReactDom.render(<App2 />, document.getElementById("root"));

// ============ Prevent Transitions 路由销毁的守卫 ============
export class App3 extends React.Component {
  render() {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/test1-form">Test1 Form</Link>
          </li>
          <li>
            <Link to="/test2">Test2</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/test1-form" exact children={<TestForm />}></Route>
          <Route path="/test2" children={<h3>Test2 Page</h3>}></Route>
        </Switch>
      </Router>
    );
  }
}

function TestForm() {
  let [isBlocking, setIsBlocking] = useState(false);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        event.target.reset();
        setIsBlocking(false);
      }}
    >
      <Prompt
        when={isBlocking}
        message={location =>
          `Are you sure you want to go to ${location.pathname}`
        }
      />
      <label>Text:</label>
      <input
        type="text"
        onChange={event => {
          setIsBlocking(event.target.value.length > 0);
        }}
      />
      <button type="submit">提交</button>
    </form>
  );
}

// ReactDom.render(<App3 />, document.getElementById("root"));

// ============ No Match 404 ============
class NoMatchExample extends React.Component {
  render() {
    return (
      <Router>
        <ul>
          <li>
            <Link to="/test1">Test1 Link</Link>
          </li>
          <li>
            <Link to="/test2">Test2 Link</Link>
          </li>
          <li>
            <Link to="/no-match">Test3 Link</Link>
          </li>
        </ul>
        <Switch>
          <Route path="/test1">
            <h1>Test1 Page</h1>
          </Route>
          <Route path="/test2">
            <h1>Test2 Page</h1>
          </Route>
          <Route path="/*">
            <NoMatch />
          </Route>
        </Switch>
      </Router>
    );
  }
}

function NoMatch() {
  const location = useLocation();
  return (
    <div>
      <h1>
        No Match for
        <code>{location.pathname}</code>
      </h1>
    </div>
  );
}

// ReactDom.render(<NoMatchExample/>, document.getElementById('root'));

// ================== 路由组件的嵌套（递归路径） ===================
export class RecursiveExample extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/:id">
            <Person />
          </Route>
          <Route path="/">
            <Redirect to="/0"></Redirect>
          </Route>
        </Switch>
      </Router>
    );
  }
}

function Person() {
  let { url } = useRouteMatch();
  let { id } = useParams();
  let person = find(id);

  return (
    <React.Fragment>
      <h3>{person.name} ’s Friends</h3>
      <ul>
        {person.friends.map(id => (
          <li key={id}>
            <Link to={`${url}/${id}`}>{find(id).name}</Link>
          </li>
        ))}
      </ul>

      <Switch>
        <Route path={`${url}/:id`}>
          <Person />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

const PEEPS = [
  { id: 0, name: "Michelle", friends: [1, 2, 3] },
  { id: 1, name: "Sean", friends: [0, 3] },
  { id: 2, name: "Kim", friends: [0, 1, 3] },
  { id: 3, name: "David", friends: [1, 2] }
];

function find(id) {
  return PEEPS.find(p => {
    return p.id == id;
  });
}
// ReactDom.render(<RecursiveExample />, document.getElementById("root"));

// ============ Router Config ============
const routes = [
  {
    path: "/sandwiches",
    component: Sandwiches
  },
  {
    path: "/tacos",
    component: Tacos,
    routes: [
      {
        path: "/tacos/bus",
        component: Bus
      },
      {
        path: "/tacos/cart",
        component: Cart
      }
    ]
  }
];

export function RouterConfigExample() {
  return (
    <Router>
      <ul>
        <li>
          <Link to="/sandwiches">sandwiches link</Link>
        </li>
        <li>
          <Link to="/tacos">tacos link</Link>
        </li>
      </ul>

      <Switch>
        {routes.map((routeItem, index) => (
          <RouteWithSubRoutes key={index} {...routeItem} />
        ))}
        <Route></Route>
      </Switch>
    </Router>
  );
}

function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => <route.component {...props} routes={route.routes} />}
    />
  );
}

function Sandwiches(props) {
  console.log(props, "<----props");
  return <h2>Sandwiches</h2>;
}

function Tacos({ routes }) {
  return (
    <div>
      <h2>Tacos</h2>
      <ul>
        <li>
          <Link to="/tacos/bus">Bus Link</Link>
        </li>
        <li>
          <Link to="/tacos/cart">Cart Link</Link>
        </li>
      </ul>

      <Switch>
        {routes.map((routeItem, index) => (
          <RouteWithSubRoutes key={index} {...routeItem} />
        ))}
      </Switch>
    </div>
  );
}

function Bus() {
  return <h5>Bus Page</h5>;
}

function Cart() {
  return <h5>Cart Page</h5>;
}

// ReactDom.render(<RouterConfigExample />, document.getElementById("root"));

// ================= StaticRouter Context  for the server-side render =================
function RouteStatus(props) {
  return (
    <Route
      render={({ staticContext }) => {
        if (staticContext) {
          staticContext.statusCode = props.statusCode;
        }

        return <div>{props.children}</div>;
      }}
    />
  );
}

function PrintContext(props) {
  return <p>Static Context: {JSON.stringify(props.staticContext)}</p>;
}

export class StaticRouterExample extends Component {
  constructor(props) {
    super(props);
    this.staticContext = {};
  }

  render() {
    return (
      <StaticRouter context={this.staticContext}>
        <div>
          <RouteStatus statusCode={404}>
            <p>Route with statusCode 404</p>
            <PrintContext staticContext={this.staticContext}></PrintContext>
          </RouteStatus>
        </div>
      </StaticRouter>
    );
  }
}

// ReactDom.render(<StaticRouterExample />, document.getElementById("root"));

// ================== Request Parameter ==================
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function QueryParamsExample() {
  let query = useQuery();
  console.log(query.get("name"));
  return (
    <>
      <h2>Accounts</h2>
      <ul>
        <li>
          <Link to="/account?name=tom">Tom</Link>
        </li>
        <li>
          <Link to="/account?name=jack">Jack</Link>
        </li>
        <li>
          <Link to="/account?name=blank">Blank</Link>
        </li>
      </ul>

      <Child name={query.get("name")} />
    </>
  );
}

function Child({ name }) {
  return <div>{name ? <h3>UserName is {name}</h3> : <h3>No User</h3>}</div>;
}

ReactDom.render(
  <Router>
    <QueryParamsExample />
  </Router>,
  document.getElementById("root")
);
