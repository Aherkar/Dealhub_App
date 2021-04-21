import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule ,MatTableDataSource} from '@angular/material/table';
import { DashboardService } from '../dashboard.service';
import { HttpErrorResponse } from '@angular/common/http';
import {Router} from "@angular/router";
import {  filter } from 'rxjs/operators';

export class DashBoardModel
{
  _user_code:string;
}

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
  dataSource:any;
  listData: MatTableDataSource<any>;
  searchKey: string;
  dashboardData:any[]=[];
  constructor(private _dashboardservice:DashboardService,private router: Router) { }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  _dashboardmodel:DashBoardModel=new DashBoardModel();

  Drafts:any=0;
  Submitted:any=0;
  Rejected:any=0;
  ApprovedOBF:any=0;
  ApprovedPPL:any=0;

  

  ngOnInit() {
    // Get list of columns by gathering unique keys of objects found in DATA.
   this.CallDashBoardService();
   this.GetCount();
   
  }

  CallDashBoardService()
  {
    this._dashboardmodel._user_code=localStorage.getItem("UserName");
    this._dashboardservice.GetDashBoardData(this._dashboardmodel).subscribe(Result=>{
      debugger;
      console.log("DashBoardData");
      console.log(Result);
      var loginresult =Result;
      this.dashboardData=JSON.parse(Result);
       this.BindGridDetails();



    
     
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
  }

  GetCount()
  {
    this._dashboardmodel._user_code=localStorage.getItem("UserName");
    this._dashboardservice.GetDashBoardDataCount(this._dashboardmodel).subscribe(Result=>{
      debugger;
      console.log("DashBoardData Count");
      console.log(Result);
      var countresult =JSON.parse(Result);
      //this.dashboardData=JSON.parse(Result);
      this.Drafts=countresult[0].count;
      this.Submitted=countresult[1].count;
      this.Rejected=countresult[3].count;
      this.ApprovedOBF=countresult[2].count;



    
     
    },
    (error:HttpErrorResponse)=>{
      debugger;
      if (error.status==401)
      {
        this.router.navigateByUrl('/login');
        
      }
      
    }
    );
  }

  BindGridDetails()// code given by kirti kumar shifted to new function
  {
    const columns = this.dashboardData
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
      header: column.replace("_"," "),
      cell: (element: any) => `${element[column] ? element[column] : ``}`     
    }
  })
  this.displayedColumns = this.columns.map(c => c.columnDef);
  this.displayedColumns.push('Action');
  console.log(this.columns);
  console.log(this.displayedColumns);
  // Set the dataSource for <mat-table>.
  // this.dataSource = DATA
  debugger;
  this.listData = new MatTableDataSource(this.dashboardData);
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
    console.log(issueId);
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
