/**
 * Created by USER on 01/08/2017.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Review } from '../models/Review';

@Injectable()
export class ReviewService {
    private headers = new Headers({"Content-Type": "application/json"});
    private reviewUrl = 'http://localhost:3000';

    constructor(private http: Http) {
    }


    createReview(review: Review): Promise<Review> {
        return this.http.post(this.reviewUrl + "/movie", JSON.stringify(review), {
            headers: this.headers,
            withCredentials: true
        })
            .toPromise()
            .then(res => res.json() as Review)
            .catch(this.handleError);
    }

    deleteReview(_id: string): Promise<void> {
        let url = this.reviewUrl + "/deleteMovie";
        return this.http.post(url, JSON.stringify({_id: _id}), {headers: this.headers, withCredentials: true})
            .toPromise()
            .then(() => null)
            .catch(this.handleError)
    }

    getAllReviews(): Promise<Review[]> {
        return this.http.get(this.reviewUrl + '/movie')
            .toPromise()
            .then(courses => courses.json() as Review[])
            .catch(this.handleError);
    }

    searchReviews(searchTerm: string): Promise<Review[]> {
        let url = this.reviewUrl + "/searchMovie";
        return this.http.post(url, JSON.stringify({searchTerm: searchTerm}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Review[])
            .catch(this.handleError)
    }

    getAllReviewsByCategory(searchTerm: string): Promise<Review[]> {
        return this.http.post(this.reviewUrl + "/movieGenre", JSON.stringify({searchTerm: searchTerm}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Review[])
            .catch(this.handleError);
    }

    getMyReviews(username: string): Promise<Review[]> {
        let url = this.reviewUrl + "/myContent";
        return this.http.post(url, JSON.stringify({username: username}), {headers: this.headers, withCredentials: true})
            .toPromise()
            .then(res => res.json() as Review[])
            .catch(this.handleError)
    }

    updateReview(review: Review): Promise<any> {
        return this.http.post(this.reviewUrl + "/update", JSON.stringify(review), {
            headers: this.headers,
            withCredentials: true
        })
            .toPromise()
            .then(res => res as any)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
