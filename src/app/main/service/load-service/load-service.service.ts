import { Injectable } from '@angular/core';
import { SET_APP_SETTINGS } from './../../settings/settings';

@Injectable({
    providedIn: 'root'
})
export class LoadServiceService {

    constructor() { }


    getSettings(): Promise<any> {

        const promise = new Promise<void>((resolve, reject) => {
            resolve();
            if (10 < 9) {
                reject();
            }
        })
            .then(settings => {
                function IsPC() {
                    var userAgentInfo = navigator.userAgent;
                    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
                    var isPC = true;
                    for (var v = 0; v < Agents.length; v++) {
                        if (userAgentInfo.indexOf(Agents[v]) > 0) { isPC = false; break; }
                    }
                    if (!isPC) {
                        SET_APP_SETTINGS({
                            mode: 'over',
                            hasBackdrop: true,
                            opened: false
                        })
                    }
                }
                IsPC();
                return settings;
            }, error => {
                console.error(error);
            });

        return promise;
    }
}
