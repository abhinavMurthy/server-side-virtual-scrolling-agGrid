import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IServerSideGetRowsRequest } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IServerSideGetRowsResponse } from '../../models/server-side-get-rows.response';

@Injectable({
  providedIn: 'root'
})
export class TransactionListService {

  constructor(private http: HttpClient) { }
  /**
   * @param requestParams is the request payload object for fetching transaction list
   * @returns Observable
   * @description fetches the list of transactions based on start row, end row
   * sortModel and filterModel
   */
  getTransactions(requestParams: IServerSideGetRowsRequest): Observable<IServerSideGetRowsResponse> {
    return this.http.get(
      `/transactions?` +
      `startRow=${requestParams.startRow}&` +
      `endRow=${requestParams.endRow}&` +
      `sortModel=${JSON.stringify(requestParams.sortModel)}&` +
      `filterModel=${JSON.stringify(requestParams.filterModel)}`).pipe(
        map((response: IServerSideGetRowsResponse) => response)
      );
  }
}
