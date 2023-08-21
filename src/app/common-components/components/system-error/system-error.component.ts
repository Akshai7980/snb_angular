import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';

@Component({
  selector: 'app-system-error',
  templateUrl: './system-error.component.html',
  styleUrls: ['./system-error.component.scss']
})
export class SystemErrorComponent implements OnInit {
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
    this.rootScopeData.showSystemError = false;
  }

}
