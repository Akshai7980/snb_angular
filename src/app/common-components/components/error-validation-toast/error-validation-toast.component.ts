import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-error-validation-toast',
  templateUrl: './error-validation-toast.component.html',
  styleUrls: ['./error-validation-toast.component.scss']
})
export class ErrorValidationToastComponent implements OnInit {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  rootScopeData: RootScopeDeclare = RootScopeData;
  constructor(private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    setTimeout(()=>{
      this.closeToast();
    }, 5000);
  }

  closeToast() {
    this.rootScopeData.validationErrorToast = false;
  }

}
