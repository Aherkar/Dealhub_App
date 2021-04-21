import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-obf-creation',
  templateUrl: './obf-creation.component.html',
  styleUrls: ['./obf-creation.component.scss']
})
export class ObfCreationComponent implements OnInit {

  fileToUpload: File = null;
  constructor() { }

  ngOnInit(): void {
  }

}
