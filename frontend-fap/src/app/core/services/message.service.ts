import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private _snackBar: MatSnackBar, private zone: NgZone) {}

  openSnackBar(message: string, action: string, panelClass: string) {
    this.zone.run(() => {
      this._snackBar.open(message, action, {
        duration: 8000,
        panelClass: [panelClass],
      });
    });
  }

  showSuccessSnackBar(message: string) {
    this.openSnackBar(message, 'OK', 'success-snackbar');
  }

  showErrorSnackBar(error: any) {
    this.openSnackBar(this.getErrorMessage(error), 'OK', 'error-snackbar');
  }

  /*
   * Returns User friendly error message
   * TODO
   * */
  getErrorMessage(error: any): string {
    console.log(error);
    if (((error.status / 100) | 0) === 4) {
      // validation error
      return [].concat(error?.error?.message).join(', ');
      return 'No Error Details!';
    } else if (((error.status / 100) | 0) === 5) {
      // other error
      return 'Error with Server Connection!';
    } else {
      return 'Some other Error occurred!';
    }
  }
}
