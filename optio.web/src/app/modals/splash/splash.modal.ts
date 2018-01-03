import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '../../modules/modal/modal.module';

@Component({
  selector: 'app-splash-modal',
  templateUrl: './splash.modal.html',
  styleUrls: ['./splash.modal.css']
})
export class SplashModal implements OnInit {
  @ViewChild('content') content;
  modalReference: NgbModalRef;
  modalOption: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    windowClass: 'splash'
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if (window.location.host !== 'localhost:4200') {
      setTimeout(() => this.open());
      setTimeout(() => this.close(), 3000);
    }
  }

  open() {
    this.modalReference = this.modalService.open(this.content, this.modalOption);
  }

  close() {
    this.modalReference.close();
    this.modalReference = null;
  }
}
