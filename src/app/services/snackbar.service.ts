import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private matSnackBar: MatSnackBar) { }

  showSnackbarCssStyles(message: string, header:string, duration:number) {
    let snackBarColor = this.matSnackBar.open(message, header, {
      duration: duration,
      panelClass: ["snack-style"]
    });
    snackBarColor.onAction().subscribe(() => {
      snackBarColor.dismiss();
    });
  }
}
