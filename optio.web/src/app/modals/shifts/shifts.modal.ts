import { Component, ViewChild, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '../../modules/modal/modal.module';
import { DataService } from '../../services/data.service';
import { Shift } from '../../objects/shift';

@Component({
  selector: 'app-shifts-modal',
  templateUrl: './shifts.modal.html',
  styleUrls: ['./shifts.modal.css']
})
export class ShiftsModal implements OnInit {
  @ViewChild('content') content: any;
  modalReference?: NgbModalRef;
  modalOption: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    size: 'lg'
  };
  shifts: any;
  selectedShift?: Shift;

  constructor(private modalService: NgbModal,
    private dataService: DataService) { }

  ngOnInit() {
  }

  open() {
    this.shifts = this.dataService.shifts.filter(x =>
      x.isValid && x.id !== 40 && x.id !== 41 && x.id !== 42 );
    this.selectShift(this.shifts[0]);
    this.modalReference = this.modalService.open(this.content, this.modalOption);
  }

  selectShift(shift: Shift) {
    if (!this.selectedShift) this.selectedShift = undefined;
    this.deselectShift();
    this.selectedShift = shift;
    this.selectedShift.isSelected = true;
  }

  deselectShift() {
    if (this.selectedShift) this.selectedShift.isSelected = false;
  }

  close() {
    this.modalReference!.close();
    this.modalReference = undefined;
  }
}
