import logo from "./logo.svg";
import "./App.css";
import getSearchResults from "./search.js";

import React from "react";
import { DAY_STOP_TIME_SECS } from "./utilities";

function SearchButton(props) {
  return (
    <button onClick={props.handleSearch}>
      Find Empty
      <br /> Rooms Near Me
    </button>
  );
}

function ClassroomSchedule(props) {
  const now_left = props.situation.now_time_secs / DAY_STOP_TIME_SECS;
  const now_box = (
    <div className="NowBox" style={{ left: `${100 * now_left}%` }}></div>
  );
  const boxes = props.classroom.courses.map((course) => {
    // console.log(props.situation.now_day);
    if (course.days.includes(props.situation.now_day)) {
      const left = course.strt_time_secs / DAY_STOP_TIME_SECS;
      const width =
        (course.stop_time_secs - course.strt_time_secs) / DAY_STOP_TIME_SECS;
      // console.log(left, width);
      return (
        <div
          className="CourseBox"
          style={{ left: `${100 * left}%`, width: `${100 * width}%` }}
        >
          {course.title}
        </div>
      );
    } else {
      return null;
    }
  });
  return (
    <div className="ClassroomSchedule">
      {boxes} {now_box}
    </div>
  );
}

function ClassroomInfo(props) {}

function ClassroomListing(props) {
  return (
    <div className="ClassroomListing">
      {props.classroom.text}
      <ClassroomSchedule
        situation={props.situation}
        classroom={props.classroom}
      />
    </div>
  );
}

function SearchResults(props) {
  const listItems = props.classrooms.map((classroom) => (
    <ClassroomListing situation={props.situation} classroom={classroom} />
  ));
  return <ul>{listItems}</ul>;
}

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      hasSearched: false,
      situation: null,
      classrooms: null,
    };
    this.handleSearch = this.handleSearch.bind(this);
  }

  async handleSearch(e) {
    let situation, classrooms_sorted;
    [situation, classrooms_sorted] = await getSearchResults();

    // classrooms_sorted = classrooms_sorted.slice(0, 4);
    this.setState({
      hasSearched: true,
      situation: situation,
      classrooms: classrooms_sorted,
    });
  }

  render() {
    return (
      <div className="App">
        {/* <header className="App-header"> */}
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        {/* <p>
          Edit <code>src/App.js</code> and save to reload.
        </p> */}
        {/* <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}
        {/* </header> */}

        <body className="App-body">
          <SearchButton handleSearch={this.handleSearch} />
          {this.state.hasSearched ? (
            <SearchResults
              situation={this.state.situation}
              classrooms={this.state.classrooms}
            />
          ) : null}
        </body>
      </div>
    );
  }
}

export default App;
