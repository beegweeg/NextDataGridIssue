import React, { useState, useCallback, useMemo } from 'react';
import ReactDataGrid from 'react-data-grid';

const columns = [
  {
    key: 'id',
    name: 'ID',
    width: 60,
    frozen: true,
    sortable: true,
    summaryFormatter() {
      return <strong>Total</strong>;
    }
  },
  {
    key: 'title',
    name: 'Task',
    width: 120,
    editable: true,
    frozen: true,
    resizable: true,
    sortable: true,
    summaryFormatter({ row }) {
      return <>{row.totalCount} records</>;
    }
  },
  {
    key: 'client',
    name: 'Client',
    width: 220,
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'area',
    name: 'Area',
    width: 120,
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'country',
    name: 'Country',
    width: 120,
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'contact',
    name: 'Contact',
    width: 160,
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'assignee',
    name: 'Assignee',
    width: 150,
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'progress',
    name: 'Completion',
    width: 110,
    resizable: true,
    sortable: true,
    formatter(props) {
      const value = props.row.progress;
      return (
        <>
          <progress max={100} value={value} style={{ width: 50 }} /> {Math.round(value)}%
        </>
      );
    }
  },
  // {
  //   key: 'startTimestamp',
  //   name: 'Start date',
  //   width: 100,
  //   resizable: true,
  //   sortable: true,
  //   formatter(props) {
  //     return <TimestampFormatter timestamp={props.row.startTimestamp} />;
  //   }
  // },
  // {
  //   key: 'endTimestamp',
  //   name: 'Deadline',
  //   width: 100,
  //   resizable: true,
  //   sortable: true,
  //   formatter(props) {
  //     return <TimestampFormatter timestamp={props.row.endTimestamp} />;
  //   }
  // },
  // {
  //   key: 'budget',
  //   name: 'Budget',
  //   width: 100,
  //   resizable: true,
  //   sortable: true,
  //   formatter(props) {
  //     return <CurrencyFormatter value={props.row.budget} />;
  //   }
  // },
  {
    key: 'transaction',
    name: 'Transaction type',
    resizable: true,
    sortable: true
  },
  {
    key: 'account',
    name: 'Account',
    width: 150,
    resizable: true,
    sortable: true
  },
  {
    key: 'version',
    name: 'Version',
    editable: true,
    resizable: true,
    sortable: true
  },
  {
    key: 'available',
    name: 'Available',
    resizable: true,
    sortable: true,
    width: 80,
    formatter(props) {
      return <>{props.row.available ? '✔️' : '❌'}</>;
    },
    summaryFormatter({ row: { yesCount, totalCount } }) {
      return (
        <>{`${Math.floor(100 * yesCount / totalCount)}% ✔️`}</>
      );
    }
  }
];

function createRows() {
  const now = Date.now();
  const rows = [];

  for (let i = 0; i < 1000; i++) {
    rows.push({
      id: i,
      title: `Task #${i + 1}`,
      client: 'test',
      area: 'test',
      country: 'test',
      contact: 'test',
      assignee: 'test',
      progress: 'test',
      startTimestamp: 'test',
      endTimestamp: 'test',
      budget: 'test',
      transaction: 'test',
      account: 'test',
      version: 'test',
      available: 'test'
    });
  }

  return rows;
}

export default function MyDataGrid() {
  const [rows, setRows] = useState(createRows);
  const [[sortColumn, sortDirection], setSort] = useState(['id', 'NONE']);
  const [selectedRows, setSelectedRows] = useState(() => new Set());

  const summaryRows = useMemo(() => {
    const summaryRow = { id: 'total_0', totalCount: rows.length, yesCount: rows.filter(r => r.available).length };
    return [summaryRow];
  }, [rows]);

  const sortedRows = useMemo(() => {
    if (sortDirection === 'NONE') return rows;

    let sortedRows = [...rows];

    switch (sortColumn) {
      case 'assignee':
      case 'title':
      case 'client':
      case 'area':
      case 'country':
      case 'contact':
      case 'transaction':
      case 'account':
      case 'version':
        sortedRows = sortedRows.sort((a, b) => a[sortColumn].localeCompare(b[sortColumn]));
        break;
      case 'available':
        sortedRows = sortedRows.sort((a, b) => a[sortColumn] === b[sortColumn] ? 0 : a[sortColumn] ? 1 : -1);
        break;
      case 'id':
      case 'progress':
      case 'startTimestamp':
      case 'endTimestamp':
      case 'budget':
        sortedRows = sortedRows.sort((a, b) => a[sortColumn] - b[sortColumn]);
        break;
      default:
    }

    return sortDirection === 'DESC' ? sortedRows.reverse() : sortedRows;
  }, [rows, sortDirection, sortColumn]);

  const handleRowsUpdate = useCallback(({ fromRow, toRow, updated }) => {
    const newRows = [...sortedRows];

    for (let i = fromRow; i <= toRow; i++) {
      newRows[i] = { ...newRows[i], ...updated };
    }

    setRows(newRows);
  }, [sortedRows]);

  const handleSort = useCallback((columnKey, direction) => {
    setSort([columnKey, direction]);
  }, []);

  return (
        <ReactDataGrid
          rowKey="id"
          columns={columns}
          rows={sortedRows}
          selectedRows={selectedRows}
          onSelectedRowsChange={setSelectedRows}
          onRowsUpdate={handleRowsUpdate}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
          onSort={handleSort}
          summaryRows={summaryRows}
        />
      );
}