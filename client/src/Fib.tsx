import React, { Component } from "react";
import axios from "axios";

type Props = {};
type State = {
  seenIndexes: Array<number>;
  values: Array<{ number: number }>;
  index: number;
};

export default class Fib extends Component<Props, State> {
  state: State = {
    seenIndexes: [],
    values: [],
    index: 0,
  };

  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }

  fetchValues = () => {
    fetch("api/values/current")
      .then((response) => response.json())
      .then((data) => this.setState({ values: data }));
  };

  fetchIndexes = () => {
    fetch("api/values/index")
      .then((response) => response.json())
      .then((data) => this.setState({ index: data.index }));
  };

  renderSeenIndexes = () => {
    return this.state.seenIndexes.map((number) => number);
  };

  renderValues = () => {
    const entries = [];
    for (let key in this.state.values) {
      entries.push(
        <div
          key={key}
        >{`  For index ${key} I calculated ${this.state.values[key].number}`}</div>
      );
    }

    return entries;
  };

  onChange = (event: any) => {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ index: parseInt(value) });
  };

  handleSubmit = async (event: any) => {
    event.preventDefault();
    const { index } = this.state;
    await axios.post("/api/values", { index });
  };

  render(): React.ReactNode {
    return (
      <>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor="index">Enter your index: </label>
            <input
              id="index"
              value={this.state.index}
              onChange={this.onChange}
              type="number"
            />
            <button type="submit">Submit</button>
          </form>

          <h3>Index:</h3>
          {this.renderSeenIndexes()}

          <h3>Values: </h3>
          {this.renderValues()}
        </div>
      </>
    );
  }
}
