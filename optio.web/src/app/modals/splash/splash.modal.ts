import { Component } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '../../modules/modal/modal.module';

@Component({
  selector: 'app-splash-modal',
  templateUrl: './splash.modal.html',
  styleUrls: ['./splash.modal.css']
})
export class SplashModal {
  modalOption: NgbModalOptions = {};
  closeResult: string;

  constructor(public modalService: NgbModal) {
    // this.open('A to splash...');
   }

  open(content) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalService.open(content, this.modalOption).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

}
