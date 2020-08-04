import { Pipe, PipeTransform } from '@angular/core';

// Provide a way to filter a listview
// Resource from: https://stackblitz.com/edit/angular-filter-list-of-items?file=src%2Fapp%2Ffilter.pipe.ts

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (!searchText) return items;

        return items.filter(item => {
            return Object.keys(item).some(key => {
                return String(item[key]).toLowerCase().includes(searchText.toLowerCase());
            });
        });
    }
}
