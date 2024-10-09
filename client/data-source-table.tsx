import { useCallback, useMemo } from "react";
import {
  ColDef,
  GridReadyEvent,
  ModuleRegistry,
  InfiniteRowModelModule,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";

ModuleRegistry.registerModules([InfiniteRowModelModule]);

const rowSelection = {
  mode: "multiRow",
  checkboxes: false,
  headerCheckbox: false,
};

const GridExample = () => {
  const containerStyle = useMemo(
    () => ({ width: "100%", height: "100vh" }),
    []
  );
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const SlNo = (params: { data: any; node: { rowIndex: number } }) => {
    return (
      <div className="flex items-center mt-2">{params.node.rowIndex + 1}</div>
    );
  };

  const DateCellFormater = (params: { data: any }) => {
    console.log(params?.data);
    const formatedDate = new Date(params?.data?.createdAt);
    return (
      <div className="flex items-center mt-2">
        {formatedDate?.toLocaleString()}
      </div>
    );
  };
  // Column definitions
  // const columnDefs: ColDef[] = [
  //   {
  //     headerName: "SL No.",
  //     field: "name",
  //     cellRenderer: SlNo,
  //     minWidth: 100,
  //     resizable: true,
  //   },
  //   {
  //     headerName: "NAME",
  //     field: "name",
  //     cellRenderer: NameLinkCell,
  //     minWidth: 150,
  //     resizable: true,
  //   },
  //   {
  //     headerName: "STATUS",
  //     field: "status",
  //     cellRenderer: DefaultStatusCell,
  //     minWidth: 150,
  //     resizable: true,
  //   },
  //   {
  //     headerName: "CREATED AT",
  //     field: "createdAt",
  //     cellRenderer: DateCellFormater,
  //     minWidth: 150,
  //     resizable: true,
  //   },
  // ];

  const columnDefs: ColDef[] = [
    {
      headerName: "SL No.",
      field: "name",
      cellRenderer: SlNo,
      minWidth: 50,
      resizable: true,
    },
    { headerName: "NAME", field: "tableName", minWidth: 300, resizable: true },
    {
      headerName: "DATASOURCE TYPE",
      field: "type",
      minWidth: 150,
      resizable: true,
    },
    {
      headerName: "STATUS",
      field: "active",
      cellDataType: "string",
      minWidth: 150,
      resizable: true,
    },
    {
      headerName: "CREATED AT",
      field: "createdAt",
      cellRenderer: DateCellFormater,
      minWidth: 150,
      resizable: true,
    },
    // {
    //   headerName: "ACTIONS",
    //   field: "action",
    //   cellRenderer: ActionCellRenderer,
    //   minWidth: 200,
    //   resizable: false,
    //   sortable: false,
    //   filter: false,
    // },
  ];

  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      sortable: true,
    };
  }, []);

  const limit = 5;
  const onGridReady = useCallback(async (params: GridReadyEvent) => {
    let data = await fetch(
      `https://healthqapi.ikurehealthtech.com/api/data/datasource/all?page=1&limit=${limit}`
    );

    data = await data.json();

    const dataSource = {
      rowCount: undefined,
      getRows: async (params: any) => {
        const currentPageNumber = Math.floor(params.endRow / limit);
        let lastRow = -1;
        let list: any = data?.data?.dataSource;

        if (currentPageNumber !== -1) {
          let nextPageData = await fetch(
            `https://healthqapi.ikurehealthtech.com/api/data/datasource/all?page=${currentPageNumber}&limit=${limit}`
          );
          nextPageData = await nextPageData.json();

          list = nextPageData?.data?.dataSource;
        }

        //This line is very important to stop fetching more data
        //If current fetched data is lesser than the limit then that means
        // this is indeed the last page so we add it's length with the startRow
        //and that'd be our total row count
        if (list?.length < limit) {
          lastRow = params?.startRow + list?.length;
        }

        list?.length
          ? params.successCallback(list, lastRow)
          : params.failCallback();
      },
    };
    params.api.setGridOption("datasource", dataSource);
  }, []);
  return (
    <div style={containerStyle}>
      <div style={gridStyle} className={"ag-theme-quartz"}>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowBuffer={0}
          rowSelection={rowSelection}
          rowModelType="infinite"
          cacheBlockSize={limit} //this make sure only rows equal to limit are fetched every time
          cacheOverflowSize={2}
          maxConcurrentDatasourceRequests={1}
          infiniteInitialRowCount={100}
          maxBlocksInCache={10}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default GridExample;
