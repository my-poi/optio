import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class OptioErrorHandler implements ErrorHandler {
  handleError(error) {
    // alert(error);
    console.log(error.message);
  }
}
