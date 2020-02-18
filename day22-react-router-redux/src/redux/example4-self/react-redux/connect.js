import React, { Component } from "react";
import ReactReduceContext from "./Context";

export default function connect(mapStateToProps, mapDispatchToProps) {
  return function(UIComponent) {
    class NewComponent extends Component {
      static contextType = ReactReduceContext;

      constructor(props, context) {
        super(props);
        console.log(context);
        const { store } = context;
        this.state = Object.assign(
          {},
          mapStateToProps(store.getState()),
          mapDispatchToProps(store.dispatch)
        );
      }

      componentDidMount() {
        this.unsunscribe = this.context.store.subscribe(() => {
          this.setState(mapStateToProps(this.context.store.getState()));
        });
      }

      shouldComponentUpdate() {
        if (this.state === mapStateToProps(this.context.store.getState())) {
          return false;
        }
        return true;
      }

      componentWillUnmount() {
        this.unsunscribe();
      }

      render() {
        return (
          <React.Fragment>
            <UIComponent {...this.state} />
          </React.Fragment>
        );
      }
    }
    return NewComponent;
  };
}
