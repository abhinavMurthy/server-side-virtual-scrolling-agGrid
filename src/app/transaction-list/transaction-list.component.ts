import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GridApi, ColumnApi } from 'ag-grid-community';


export interface TransactionData {
  accountStatementLineEntityId: string;
  bookingDate: string;
  valueDate: string;
  paymentPurpose: string;
  gvc: string;
  gvcText: string;
  amount: number;
  currency: string;
  transactionState: string;
  preBookedAccountStatement: Boolean;
  iban: string;
  accountName: string;
  bankIcon: string;
  bankIconMobile: string;
}

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {
  private gridApi: GridApi;
  private gridColumnApi: ColumnApi;

  private columnDefs;
  private defaultColDef;
  private rowModelType: string;
  private cacheBlockSize: number;
  private maxBlocksInCache: number;
  private rowData: Array<TransactionData>;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      { field: 'accountStatementLineEntityId', sort: 'desc' },
      { field: 'bookingDate' },
      { field: 'valueDate' },
      { field: 'paymentPurpose', width: 400 },
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    const datasource = this.serverSideDatasource();
    params.api.setServerSideDatasource(datasource);
  }

  /**
   * Some comment to describe this method
   */
  public serverSideDatasource(): any {
    return {
      getRows: (params: any) => {

        const sortColName = params.request.sortModel[0] ? params.request.sortModel[0].colId : undefined;
        const colFilter = `&sortColumnName=${sortColName}`;
        this.http.get(
          `/transactions?` +
          `startRow=${params.request.startRow}&` +
          `endRow=${params.request.endRow}${sortColName ? colFilter : ''}&` +
          `sortOrder=${params.request.sortModel[0] ? params.request.sortModel[0].sort : 'asc'}`).subscribe(
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
