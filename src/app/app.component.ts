import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
      { field: "id" },
      {
        field: "athlete",
        width: 150
      },
      { field: "age" },
      { field: "country" },
      { field: "year" },
      { field: "sport" },
      { field: "gold" },
      { field: "silver" },
      { field: "bronze" }
    ];
    this.defaultColDef = {
      width: 120,
      resizable: true
    };
    this.rowModelType = "serverSide";
    this.cacheBlockSize = 100;
    this.maxBlocksInCache = 10;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    /*this.http
      .get("/getPaginatedData")
      .subscribe((data: any) => {
        var idSequence = 0;
        data.forEach(function(item) {
          item.id = idSequence++;
        });*/
    var datasource = this.serverSideDatasource();
    params.api.setServerSideDatasource(datasource);

  }

  public serverSideDatasource() {
    return {
      getRows(params) {
        console.log('params.request', params.request);
        console.log('params', params);
        console.log('request url->', `/getPaginatedData?startRow=${params.request.startRow}&endRow=${params.request.endRow}`)
        this.http.get(`/getPaginatedData?startRow=${params.request.startRow}&endRow=${params.request.endRow}`).subscribe(
          (response) => {
            params.successCallback(response.rows, response.lastRow);
          },
          (error) => {
            params.failCallback();
          });
      }
    }
  };
}
