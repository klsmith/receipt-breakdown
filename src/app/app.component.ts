import {Component, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CurrencyMaskModule} from "ng2-currency-mask";
import {MatIcon} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatCommonModule, MatOption} from "@angular/material/core";
import {CommonModule} from "@angular/common";
import {MatSelect} from "@angular/material/select";

export interface Category {
  default?: boolean;
  name?: string;
  total?: number;
}

export interface Item {
  name?: string;
  amount?: number;
  category: number;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CurrencyMaskModule,
    MatIcon,
    MatButtonModule,
    MatTooltip,
    MatFormField,
    MatInput,
    MatLabel,
    MatCommonModule,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatSelect,
    MatOption,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  protected readonly CURRENCY_CONFIG = {
    prefix: '$ ',
    thousands: ',',
    decimal: '.',
    allowNegative: true,
  };

  private readonly UNCATEGORIZED = 0;

  readonly categories: Array<Category>;
  readonly items: Array<Item>;

  total: number;
  tax: number;

  constructor() {
    this.categories = [{
      default: true,
      name: 'Uncategorized',
      total: 0
    }];
    this.total = 0;
    this.tax = 0;
    this.items = [];
  }

  ngOnInit() {
    this.onAddCategoryButtonClick();
    this.onAddItemButtonClick();
  }

  onItemRemoveButtonClick(index: number): void {
    this.items.splice(index, 1);
    this.recalculateTotal();
  }

  onAddItemButtonClick(): void {
    this.items.push({category: this.UNCATEGORIZED});
    this.recalculate();
  }

  onAddCategoryButtonClick(): void {
    this.categories.push({});
    this.recalculate();
  }

  onCategoryRemoveButtonClick(index: number): void {
    this.categories.splice(index, 1);
    this.items
      .filter((item) => item.category === index)
      .forEach((item) => {
        item.category = this.UNCATEGORIZED;
      });
    this.recalculate();
  }

  onTaxChange(): void {
    this.recalculate();
  }

  onItemAmountChange(item: Item, newAmount: number): void {
    item.amount = newAmount;
    this.recalculate();
  }

  onItemCategoryChange(item: Item, newCategory: string): void {
    item.category = parseInt(newCategory);
    this.recalculate();
  }

  recalculate(): void {
    this.recalculateTotal();
    this.categories.forEach((v, i: number) => {
      this.recalculateCategoryTotal(i)
    });
  }

  recalculateCategoryTotal(index: number): void {
    const category = this.categories[index];
    const subtotal = this.sum(this.items
      .filter(item => item.category === index)
      .map(item => item.amount ?? 0));
    const taxlessTotal = this.total - this.tax;
    const categoryTax = (subtotal / taxlessTotal) * this.tax;
    category.total = subtotal + categoryTax;
  }

  recalculateTotal(): void {
    this.total = this.tax + this.sum(this.items.map(item => item.amount ?? 0));
  }

  sum(values: Array<number>): number {
    return values.reduce((a, b) => a + b, 0);
  }

  protected readonly Boolean = Boolean;
}
