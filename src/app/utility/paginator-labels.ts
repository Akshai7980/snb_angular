import { MatPaginatorIntl } from "@angular/material/paginator";
import { Subject } from "rxjs";
import { RootScopeData } from "../rootscope-data";
import { RootScopeDeclare } from "../rootscope-declare";

export class TranslatePaginatorLabels implements MatPaginatorIntl {
  changes = new Subject<void>();
  rootScopeData: RootScopeDeclare = RootScopeData;
    firstPageLabel = " "
    itemsPerPageLabel = " "
    lastPageLabel = " "
  
    nextPageLabel = "";
    previousPageLabel = "";
    getRangeLabel(page: number, pageSize: number, length: number): string {
      if (length === 0) {
        return `1 ${this.rootScopeData.ofLabel} 1`;
      }
      const amountPages = Math.ceil(length / pageSize);
      return `${page + 1} ${this.rootScopeData.ofLabel}  ${amountPages}`;
    }
  }


