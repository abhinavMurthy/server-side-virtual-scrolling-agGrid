import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html'
})
export class TransactionListComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private defaultColDef;
  private rowModelType;
  private cacheBlockSize;
  private maxBlocksInCache;
  private rowData: Array<object>;

  constructor(private http: HttpClient) {
    this.columnDefs = [
      { field: 'accountStatementLineEntityId' },
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

  public serverSideDatasource() {
    return {
      getRows: (params) => {
        console.log('params.request', params.request);
        console.log('params', params);
        console.log('request url->', `/getPaginatedData?startRow=${params.request.startRow}&endRow=${params.request.endRow}`);
        console.log(params.request.sortModel);
        this.http.get(`/getPaginatedData?startRow=${params.request.startRow}&endRow=${params.request.endRow}`).subscribe(
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
