import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  selector: 'sh-nav-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './nav-search.component.html',
  styleUrl: './nav-search.component.scss',
})
export class NavSearchComponent implements OnChanges {
  @Input() placeholder = 'Search products';
  @Input() value = '';
  @Output() searchSubmit = new EventEmitter<string>();

  readonly searchControl = new FormControl('', { nonNullable: true });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.searchControl.setValue(this.value ?? '', { emitEvent: false });
    }
  }

  submitSearch(): void {
    const value = this.searchControl.value.trim();
    this.searchSubmit.emit(value);
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.searchSubmit.emit('');
  }
}
