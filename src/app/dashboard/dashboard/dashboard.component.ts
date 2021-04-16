import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table';

const DATA: any[] = [
  {projectname: 'Flipkart', Code: 'abcd', OppId: '00212', CreatedOn: '23/10/21', CreatedBy: 'Ankur',Vertical:'E-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Amazon', Code: 'xyz', OppId: '21502', CreatedOn: '23/09/21', CreatedBy: 'Sarvesh',Vertical:'D-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'xyz', OppId: '21502', CreatedOn: '23/09/21', CreatedBy: 'Dhanraj',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Vikas',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Vikas',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'kirti',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'kirti',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Sailesh',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Sailesh',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Ankita',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
  {projectname: 'Alpha', Code: 'cde', OppId: '52364', CreatedOn: '23/09/21', CreatedBy: 'Ankita',Vertical:'F-Comm',ProjectType:'Warehouse',PaymentTerms:'Invoice'},
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  columns:Array<any>;
  displayedColumns:Array<any>;
  theRemovedElement:any;
  dataSource:any;
  listData: MatTableDataSource<any>;
  searchKey: string;
  constructor() { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.

    const columns = DATA
      .reduce((columns, row) => {
        return [...columns, ...Object.keys(row)]
      }, [])
      .reduce((columns, column) => {
        return columns.includes(column)
          ? columns
          : [...columns, column]
      }, [])
    // Describe the columns for <mat-table>.
    this.columns = columns.map(column => {
      return { 
        columnDef: column,
        header: column,
        cell: (element: any) => `${element[column] ? element[column] : ``}`     
      }
    })
    this.displayedColumns = this.columns.map(c => c.columnDef);
    this.displayedColumns.push('Action');
     
     this.theRemovedElement  = this.columns.shift();
     
     console.log("columns"+this.columns);
     console.log("theRemovedElement"+this.theRemovedElement);
    // console.log(this.displayedColumns);
    // Set the dataSource for <mat-table>.
    // this.dataSource = DATA
    debugger;
    this.listData = new MatTableDataSource(DATA);
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
    // this.listData.filterPredicate = (data, filter) => {
    //   return this.displayedColumns.some(ele => {
    //     return ele != 'actions' && data[ele].toLowerCase().indexOf(filter) != -1;
    //   });
    // };
  }

  ngAfterViewInit() {
    this.listData.sort = this.sort;
    this.listData.paginator = this.paginator;
  }
 
  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  getToolTipData(issueId: any): any {
    debugger;
    //  alert(JSON.stringify(issueId));
    return JSON.stringify(issueId);
    //console.log(issueId);
    // const issue = this.data.find(i => i.number === issueId);
    // return `Title: ${issue.title} ||
    //     State: ${issue.state} ||
    //     Date: ${issue.created_at}`;
}

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }
   
  onEdit(row){
    console.log(row);
  }

}
