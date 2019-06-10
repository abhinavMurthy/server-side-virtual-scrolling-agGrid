import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { TransactionRequest } from '../../models/transaction-request.entity';
import { TransactionEntity } from '../../models/transaction.entity';

@Injectable({
  providedIn: 'root'
})
export class TransactionListService {

  constructor(private http: HttpClient) { }
  /**
   * @param requestParams is the request payload object for fetching transaction list
   * @returns Observable
   * @description fetches the list of transactions based on start row, end row
   * sortColumnName and sort order
   */
  getTransactions(requestParams: TransactionRequest): Observable<any> {
    return this.http.get(
      `/transactions?` +
      `startRow=${requestParams.startRow}&` +
      `endRow=${requestParams.endRow}&` +
      `sortColumnName=${requestParams.sortColumnName}&` +
      `sortOrder=${requestParams.sortOrder}`);
  }
}
