/**
 * Created by USER on 01/08/2017.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Promo } from '../models/Promo';

@Injectable()
export class PromoService {
    private headers = new Headers({"Content-Type": "application/json"});
    private reviewUrl = 'http://localhost:3000';

    constructor(private http: Http) {
    }

    searchPromo(searchTerm: string): Promise<Promo[]> {
        let url = this.reviewUrl + "/searchPromo";
        return this.http.post(url, JSON.stringify({searchTerm: searchTerm}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Promo[])
            .catch(this.handleError)
    }

    getAllPromosByCategory(searchTerm: string): Promise<Promo[]> {
        return this.http.post(this.reviewUrl + "/searchPromoByCategory", JSON.stringify({searchTerm: searchTerm}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Promo[])
            .catch(this.handleError);
    }

    getAllPromos(): Promise<Promo[]> {
        return this.http.get(this.reviewUrl + "/promos", {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Promo[])
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
