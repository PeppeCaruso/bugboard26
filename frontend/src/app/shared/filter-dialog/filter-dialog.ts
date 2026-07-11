import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

export interface FilterData {
  filterTypes: string[];
  filterStatuses: string[];
  filterPriorities: string[];
  dateFrom: Date | null;
  dateTo: Date | null;
}


@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatChipsModule, MatButtonModule, MatDividerModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './filter-dialog.html',
  styleUrl: './filter-dialog.css',
})
export class FilterDialogComponent {
  typeOptions = ['bug', 'feature', 'question', 'documentation'];
  statusOptions = ['todo', 'in_progress', 'done'];
  priorityOptions = ['low', 'medium', 'high'];

  filterTypes: string[];
  filterStatuses: string[];
  filterPriorities: string[];
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  constructor(
    public dialogRef: MatDialogRef<FilterDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FilterData,
  ) {
    this.dateFrom = data.dateFrom || null;
    this.dateTo = data.dateTo || null;
    this.filterTypes = [...data.filterTypes];
    this.filterStatuses = [...data.filterStatuses];
    this.filterPriorities = [...data.filterPriorities];
  }

  toggleFilter(value: string, filterArray: string[]): void {
    const index = filterArray.indexOf(value);
    if (index >= 0) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
  }

  isSelected(value: string, filterArray: string[]): boolean {
    return filterArray.includes(value);
  }

  apply(): void {
    this.dialogRef.close({
      filterTypes: this.filterTypes,
      filterStatuses: this.filterStatuses,
      filterPriorities: this.filterPriorities,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo,
    });
  }

  reset(): void {
    this.filterTypes = [];
    this.filterStatuses = [];
    this.filterPriorities = [];
    this.dateFrom = null;
    this.dateTo = null;
  }

  close(): void {
    this.dialogRef.close();
  }
}