import { Component } from '@angular/core';
import {
  GridApi,
  ColumnApi,
  ColDef,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  GridReadyEvent,
  IServerSideGetRowsRequest
} from 'ag-grid-community';

import { TransactionListService } from './transaction-list.service';
import { TransactionEntity } from '../../models/transaction.entity';
import { IServerSideGetRowsResponse } from '../../models/server-side-get-rows.response';


@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {

  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;
  private columnDefs: Array<ColDef>;
  private defaultColDef: ColDef;
  private rowModelType: string;
  private cacheBlockSize: number;
  private maxBlocksInCache: number;
  private rowData: Array<TransactionEntity>;

  constructor(private transactionListService: TransactionListService) {
    this.columnDefs = [
      { field: 'accountStatementLineEntityId', sort: 'desc' },
      { field: 'bookingDate' },
      { field: 'valueDate' },
      {
        field: 'paymentPurpose',
        width: 400,
        filter: 'agTextColumnFilter',
        filterParams: {
          filterOptions: ['contains', 'notContains'],
          caseSensitive: true,
          newRowsAction : 'keep',
        }
      },
      { field: 'amount'},
      { field: 'currency' },
      { field: 'iban' },
      { field: 'accountName' }
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true,
      sortable: true
    };
    this.rowModelType = 'serverSide';
    this.cacheBlockSize = 10;
    this.maxBlocksInCache = 10;
  }
  /**
   * @param params is of type GridReadyEvent
   * @returns void
   * @description this method prepares the datasource and
   * and is binded to gridReady event of ag-grid.
   */
  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const datasource: IServerSideDatasource = this.serverSideDatasource();
    params.api.setServerSideDatasource(datasource);
  }
  /**
   * @returns IServerSideDatasource
   * @description this method prepares the payloads, makes http call and
   * returns datasource.
   */
  public serverSideDatasource(): IServerSideDatasource {
    return {
      getRows: (params: IServerSideGetRowsParams) => {

        const request: IServerSideGetRowsRequest = {
          startRow: params.request.startRow,
          endRow: params.request.endRow,
          filterModel: params.request.filterModel,
          sortModel: params.request.sortModel,
          groupKeys: params.request.groupKeys,
          valueCols: params.request.pivotCols,
          pivotCols: params.request.rowGroupCols,
          rowGroupCols: params.request.rowGroupCols,
          pivotMode: params.request.pivotMode
        };

        this.transactionListService.getTransactions(request).subscribe(
          (response: IServerSideGetRowsResponse) => {
            params.successCallback(response.rows, response.lastRow);
          },
          (error) => {
            params.failCallback();
          });
      }
    };
  }
}
