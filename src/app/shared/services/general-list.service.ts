import { Injectable } from '@angular/core';
import { sp } from '@pnp/sp';
import { Web } from '@pnp/sp/webs';
import { IList } from '@pnp/sp/lists';
import { Item, IItemAddResult, IItemUpdateResult } from '@pnp/sp/items';
import { IEmailProperties } from '@pnp/sp/sputilities';
import { IFields, IFieldInfo } from '@pnp/sp/fields';

@Injectable({
    providedIn: 'root'
})
export class GeneralListService {

    public get(listName: string, orderField = '', orderAscending = true): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                // const listExpand = this.variables.ListExpands[listName];
                // if (listExpand) {

                // }
                let query = sp.web.lists.getByTitle(listName).items;

                if (orderField !== '') {
                    query = query.orderBy(orderField, orderAscending);
                }

                const items = query.top(4999).get();
                // console.log({items});
                resolve(items);
            } else {
                reject('Failed getting list data...');
            }
        });
    }

    public async getByField(listName: string, fieldFilter: string, valueFilter: any, orderField = '', orderAscending = true): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                let query = sp.web.lists.getByTitle(listName).items.filter(`${fieldFilter} eq ${valueFilter}`);

                if (orderField !== '') {
                    query = query.orderBy(orderField, orderAscending);
                }

                const items = query.get();
                console.log({items});
                resolve(items);
            } else {
                reject('Failed getting list data...');
            }
        });
    }

    public getSub(listName: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                const items = sp.web.lists.getByTitle(listName).items.getAll();
                console.log({items});
                resolve(items);
            } else {
                reject('Failed getting list data...');
            }
        });
    }

    public getItemById(listName: string, itemId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                const item =   sp.web.lists.getByTitle(listName).items.getById(itemId).get();
                resolve(item);
                console.log({item});
            } else {
                reject('Failed getting list data...');
            }
        });
    }

    public add(listName: string, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                sp.web.lists.getByTitle(listName).items.add(item).then((result: any) => {
                    resolve(result);
                });
            } else {
                reject('Failed adding list item...');
            }
        });
    }

    public update(listName: string, itemId: any, item: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                const list = sp.web.lists.getByTitle(listName);
                list.items.getById(itemId).update(item).then((result: any) => {
                    console.log('updated');
                    console.log(result);
                    resolve(result);
                });
            } else {
                reject('Failed updating list data...');
            }
        });
    }

    public delete(listName: string, itemId: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sp !== null && sp !== undefined) {
                const list = sp.web.lists.getByTitle(listName);
                list.items.getById(itemId).delete().then((result: any) => {
                    resolve(result);
                });
            } else {
                reject('Failed deleting list data...');
            }
        });
    }

}
