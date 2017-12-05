import { Injectable, ErrorHandler } from '@angular/core';

@Injectable()
export class OptioErrorHandler implements ErrorHandler {
  handleError(error) {
    alert(error);
  }
}
