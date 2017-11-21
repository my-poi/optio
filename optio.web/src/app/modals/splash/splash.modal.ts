import { Component, ViewEncapsulation, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '../../modules/modal/modal.module';

@Component({
  selector: 'app-splash-modal',
  templateUrl: './splash.modal.html',
  styleUrls: ['./splash.modal.css'],
  encapsulation: ViewEncapsulation.None
})
export class SplashModal implements OnInit {
  @ViewChild('content') content;
  modalReference: NgbModalRef;
  modalOption: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    setTimeout(() => this.open());
    setTimeout(() => this.close(), 3000);
  }

  open() {
    this.modalReference = this.modalService.open(this.content, this.modalOption);
  }

  close() {
    this.modalReference.close();
    this.modalReference = null;
  }
}
