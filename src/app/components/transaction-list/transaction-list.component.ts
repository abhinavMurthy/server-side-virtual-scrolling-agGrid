import { Component } from '@angular/core';
import {
  GridApi,
  ColumnApi,
  ColDef,
  ColDefUtil,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IAfterGuiAttachedParams,
  GridReadyEvent
} from 'ag-grid-community';

import { TransactionListService } from './transaction-list.service';
import { TransactionEntity } from '../../models/transaction.entity';
import { TransactionRequest } from '../../models/transaction-request.entity';


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
        filter: "agTextColumnFilter" ,
        filterParams: {
          filterOptions: ["contains", "notContains"],
          caseSensitive: true,
        }
      },
      { field: 'amount' },
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
        const requestObj: TransactionRequest = {
          startRow: params.request.startRow,
          endRow: params.request.endRow,
          sortColumnName: params.request.sortModel[0] ? params.request.sortModel[0].colId : undefined,
          sortOrder: params.request.sortModel[0] ? params.request.sortModel[0].sort : 'asc',
          filterModel: JSON.stringify(params.request.filterModel)
        };
        console.log('filter criteria', JSON.stringify(params.request.filterModel));
        // service call for transaction list
        this.transactionListService.getTransactions(requestObj).subscribe(
          (response: any) => {
            params.successCallback(response.rows, response.lastRow);
          },
          (error) => {
            params.failCallback();
          });
      }
    };
  }
}
