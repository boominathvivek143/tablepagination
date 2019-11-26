import React from "react";
import { render } from "react-dom";
import _ from "lodash";
import getTestData from "./Api"
import ReactTable from "react-table";
import "react-table/react-table.css";

const requestData = (pageSize, page, sorted, filtered, response) => {
  console.log("Fetch data: sorted -> ", JSON.stringify(sorted));
  console.log("Fetch data: filter -> ", JSON.stringify(filtered));
  return new Promise((resolve, reject) => {
    let filteredData = response.data;
    if (filtered.length) {
      filteredData = filtered.reduce((filteredSoFar, nextFilter) => {
        return filteredSoFar.filter(row => {
          return (row[nextFilter.id] + "").includes(nextFilter.value);
        });
      }, filteredData);
    }
    // You can also use the sorting in your request, but again, you are responsible for applying it.
    const sortedData = _.orderBy(
      filteredData,
      sorted.map(sort => {
        return row => {
          if (row[sort.id] === null || row[sort.id] === undefined) {
            return -Infinity;
          }
          return typeof row[sort.id] === "string"
            ? row[sort.id].toLowerCase()
            : row[sort.id];
        };
      }),
      sorted.map(d => (d.desc ? "desc" : "asc"))
    );

    const res = {
      rows: sortedData.slice(pageSize * page, pageSize * page + pageSize),
      pages: Math.ceil(filteredData.length / pageSize)
    };
    setTimeout(() => resolve(res));
  });
};


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      pages: null,
      loading: true,
      sorted: []
    };
    this.fetchData = this.fetchData.bind(this);
  }
  fetchData(state, instance) {
    this.setState({ loading: true });
    getTestData(state.pageSize, state.page, state.sorted, state.filtered, requestData).then(
      res => {
        this.setState({
          data: res.rows,
          pages: res.pages,
          loading: false
        });
      }
    );
  }
  render() {
    const { data, pages, loading } = this.state;
    return (
      <div>
        <ReactTable
          columns={[
            {
              Header: "First Name",
              accessor: "firstName"
            },
            {
              Header: "Last Name",
              id: "lastName",
              accessor: d => d.lastName
            },
            {
              Header: "Age",
              accessor: "age"
            }
          ]}
          manual // Forces table not to paginate or sort automatically, so we can handle it server-side
          data={data}
          pages={pages} // Display the total number of pages
          loading={loading} // Display the loading overlay when we need it
          onFetchData={this.fetchData} // Request new data when things change
          sorted={this.state.sorted}
          onSortedChange={(newSort, column) => {
            this.setState({ sorted: newSort });
          }}
        />
        <br />
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));
