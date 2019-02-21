import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';

class UITable extends Component {
  constructor(props) {
    super(props);
    this.state = this.ingressDataTransform(props);
  }

  ingressDataTransform = (props) => {
    const state = {};

    state['data'] = props.data;
    state['sort'] = {
      column: 'none',
      direction: 'sorting_asc',
      sortname: '',
    };
    state['displayRows'] = props.displayRows > props.data.length ? props.data.length : props.displayRows;

    return state;
  };

  componentDidUpdate = (prevProps) => {
    if(prevProps !== this.props) {
      this.setState(...this.state, {
        data: this.props.data,
        displayRows: this.props.displayRows
      });
    }
  }

  handleClick = (sortColumn) => {
    const sortData = this.state.data;
    let tableSort = this.state.sort;

    // The Intl.Collator object is a constructor for collators, objects that enable language sensitive string comparison.
    const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

    if (tableSort.column && tableSort.column === sortColumn && tableSort.direction === 'sorting_asc') {
      tableSort = {
        column: sortColumn,
        direction: 'sorting_desc',
        sortname: 'descending',
      };
      sortData.sort((b, a) => {
        return collator.compare(a[sortColumn], b[sortColumn]);
      });
    } else {
      tableSort = {
        column: sortColumn,
        direction: 'sorting_asc',
        sortname: 'ascending',
      };
      sortData.sort((a, b) => {
        return collator.compare(a[sortColumn], b[sortColumn]);
      });
    }

    this.setState(...this.state, {
      data: sortData,
      sort: tableSort
    }, () => {
      this.dispatchChoiceEvent();
    });
  };

  dispatchChoiceEvent = () => {
    if(this.props.onClick) {
      this.props.onClick(this.state);
    }
  }

  renderHeaderRow = (row) => {
    const sort = this.state.sort;
    return (
      <thead>
        <tr>
          {
            row.map((column) => {
              let className = null;
              let sortName = null;
              let label = column.label;

              // For multi-line label support with PropType Validation
              if(typeof label === 'object' && !React.isValidElement(label)) {
                label = '';
              }

              if(column.sort && sort.column) {
                className =  sort.column === column.name ? sort.direction : 'sorting';
                sortName = sort.column === column.name ? sort.sortname : 'none';
                label = <button className="button naked">{label}</button>
              }

              return (
                <th
                  className={className}
                  key={`${this.props.name}-${column.name}`}
                  onClick={column.sort && this.handleClick.bind(this, column.name)}
                  aria-sort={sortName}
                  style={{width: column.width}}>
                  {label}
                </th>
              );
            })
          }
        </tr>
      </thead>
    );
  };

  rowRender = (row, headers, rowIndex) => {
    if(this.props.rowRender) {
      return this.props.rowRender(row, headers, rowIndex);
    }

    return(
      <tr key={`${this.props.name}-${rowIndex}`}>
        {
          headers.map((header, index) => {
            return this.cellRender(row, header, index);
          })
        }
      </tr>
    );
  }

  cellRender = (row, header, columnIndex) => {
    const value = header.cellRender || header.key;

    if(typeof value === 'function') {
      return <td key={columnIndex} className={header.columnClass}>{value(row, header)}</td>;
    }

    return(
      <td key={columnIndex} className={header.columnClass}>
        {row[value]}
      </td>
    );
  }

  renderBodyRows = (rows) => {
    const headers = this.props.headers;
    const displayRows = this.state.displayRows;
    const rowsLength = rows.length;
    let bodyRows = [];

    if(rowsLength) {
      for(let i=0; i<rowsLength; i++) {
        if(i >= displayRows) {
          break;
        }
        bodyRows[i] = this.rowRender(rows[i], headers, i);
      }
    } else {
      bodyRows = (
        <tr>
          <td colspan={headers.length} className="text-center">{this.props.noDataText}</td>
        </tr>
      );
    }

    return(
      <tbody>
        {bodyRows}
      </tbody>
    );
  }

  render() {
    const props = this.props;

    return (
      <table id={props.name} aria-label={props.ariaLabel} className={props.className}>
        {this.renderHeaderRow(props.headers)}
        {this.renderBodyRows(this.state.data)}
      </table>
    );
  }

  /**
   * Default Props for this component
   */
  static defaultProps = {
    data: [],
    displayRows: 10
  }

  static propTypes = {
    /**
     * Base for id calcuation should be unique on a page
     * @type {[type]}
     */
    name: PropTypes.string.isRequired,
    /**
     * Class(es) for the Table
     * @type {[type]}
     */
    className: PropTypes.string,
    /**
     * Table Headers
     * @type {[type]}
     */
    headers: PropTypes.arrayOf(
      PropTypes.shape({
        /**
         * Label name for header column
         */
        label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.object // Not exactly object, React converts HTML to React Objects
        ]).isRequired,
        /**
         * Base for header column id calcuation should be unique for table and used for sorting
         */
        name: PropTypes.string.isRequired,
        /**
         * This value should be grabbed from the data object to render in the table
         */
        key: PropTypes.string,
        /**
         * Enabling sorting feature
         */
        sort: PropTypes.bool,
        /**
         * Render custom cell
         */
        cellRender: PropTypes.func,
        /**
         * Class(es) for columns
         */
        columnClass: PropTypes.string,
        /**
         * What to show when the table has no data.
         * @type {[type]}
         */
        noDataText: PropTypes.any
      })
    ).isRequired,
    /**
     * Table Data (Object key value pairs in a array)
     * @type {[type]}
     */
    data: PropTypes.arrayOf(
      PropTypes.shape({

      })
    ).isRequired,
    /**
     * For screen reader users.
     * @type {[type]}
     */
    ariaLabel: PropTypes.string.isRequired,
    /**
     * Display no. of rows in table
     * @type {[type]}
     */
    displayRows: PropTypes.number,
    /**
     * Render Custom rows
     * @type {[type]}
     * @param {object} row
     * @param {array} headers
     * @param {number} rowIndex
     */
    rowRender: PropTypes.func
  };
}

export default UITable;
