import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RootScopeData } from 'src/app/rootscope-data';
import { RootScopeDeclare } from 'src/app/rootscope-declare';
import { CardsService } from '../../services/cards.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-activate-card-layout',
  templateUrl: './activate-card-layout.component.html',
  styleUrls: ['./activate-card-layout.component.scss'],
})
export class ActivateCardLayoutComponent implements OnInit {
  months: any = [];
  years: any = [];

  @Output() getProceedEmit = new EventEmitter<any>();

  @ViewChild('firstFour') private firstElement!: ElementRef;
  @ViewChild('lastFour') private lastElement!: ElementRef;

  activateCardForm!: FormGroup;

  submitted: boolean = false;
  isLoadingCompelete: boolean = true;

  rootScopeData: RootScopeDeclare = RootScopeData;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly cardService: CardsService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.activationCardValidation();
    this.getActivateCardMonthYear();
  }

  ngAfterViewInit(): void {
    this.firstElement.nativeElement.focus();
  }

  get formValidation(): { [key: string]: AbstractControl } {
    return this.activateCardForm.controls;
  }

  activationCardValidation() {
    this.activateCardForm = this.formBuilder.group({
      firstFour: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      lastFour: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(4)])
      ),
      month: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(1)])
      ),
      year: new FormControl(
        null,
        Validators.compose([Validators.required, Validators.minLength(2)])
      ),
    });
  }

  validateInput(type: string) {
    if (type === 'first') {
      if (this.activateCardForm.controls['firstFour'].valid) {
        this.lastElement.nativeElement.focus();
      }
    } else {
      if (this.activateCardForm.controls['lastFour'].valid) {
        this.lastElement.nativeElement.blur();
      }
    }
  }

  onKeyDown(event: any) {
    if (event.keyCode === 13) {
      event.preventDefault();
      this.toProceed();
    }
  }

  toCancel() {
    this.activateCardForm.reset();
    this.router.navigate(['/cards/cardsInquiry/credit']);
  }

  toProceed() {
    this.submitted = true;
    if (this.activateCardForm.valid) {
      this.isLoadingCompelete = false;
      const params = {
        unitId: this.rootScopeData?.userInfo?.UNIT_ID
          ? this.rootScopeData.userInfo.UNIT_ID
          : '',
        cardId:
          this.activateCardForm.value.firstFour +
            ' XXX XXX ' +
            this.activateCardForm.value.lastFour ?? ' ',
      };
      this.cardService.cardDetails(params).subscribe(
        (res: any) => {
          this.isLoadingCompelete = true;
          if (res && res.dataValue && res.dataValue.CardDetails) {
            const data = {
              formData: this.activateCardForm.value,
              canProceed: true,
            };
            this.getProceedEmit.emit(data);
            this.rootScopeData.creditCardListDetail = res.dataValue.CardDetails;
          }
        },
        (err: any) => {
          this.isLoadingCompelete = true;
        }
      );
    } else {
      return;
    }
  }

  getActivateCardMonthYear() {
    this.isLoadingCompelete = false;
    const params = {
      unitId: this.rootScopeData?.userInfo?.UNIT_ID
        ? this.rootScopeData.userInfo.UNIT_ID
        : '',
    };
    this.cardService.getMonthAndYear(params).subscribe(
      (res: any) => {
        this.isLoadingCompelete = true;
        if (
          res &&
          res?.data &&
          res?.data?.length > 0 &&
          res?.data[0]?.activateMonth &&
          res?.data[0]?.activateMonth?.length > 0
        ) {
          this.months = res.data[0].activateMonth;
        }

        if (
          res &&
          res?.data &&
          res?.data?.length > 0 &&
          res?.data[0]?.activateYear &&
          res?.data[0]?.activateYear?.length > 0
        ) {
          this.years = res.data[0].activateYear;
        }
      },
      (err: any) => {
        this.isLoadingCompelete = true;
      }
    );
  }
}
