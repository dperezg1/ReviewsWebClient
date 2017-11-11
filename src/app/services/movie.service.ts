/**
 * Created by USER on 01/08/2017.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Movie } from '../models/Movie';

@Injectable()
export class MovieService {
    private headers = new Headers({"Content-Type": "application/json"});
    private movieUrl = 'http://localhost:3000';

  constructor(private http: Http) {
    }


    createMovie(movie: Movie): Promise<Movie> {
        return this.http.post(this.movieUrl+ "/movie", JSON.stringify(movie), {headers: this.headers, withCredentials: true})
            .toPromise()
            .then(res => res.json() as Movie )
            .catch(this.handleError);
    }

    deleteMovie(_id: string): Promise<void>{
      let url = this.movieUrl + "/deleteMovie";
      return this.http.post(url, JSON.stringify({_id:_id}) ,{headers: this.headers, withCredentials: true})
        .toPromise()
        .then(()=>null)
        .catch(this.handleError)
    }

    getAllMovies(): Promise<Movie[]> {
        return this.http.get(this.movieUrl+'/movie')
            .toPromise()
            .then(courses => courses.json() as Movie[])
            .catch(this.handleError);
    }

    searchMovieByTitle(searchTerm : string): Promise<Movie[]> {
      let url = this.movieUrl + "/searchMovie";
      return this.http.post(url,JSON.stringify({searchTerm:searchTerm}) ,{headers: this.headers})
        .toPromise()
        .then(res=> res.json() as Movie[])
        .catch(this.handleError)
    }

    getAllMoviesByGenre(searchTerm: string): Promise<Movie[]> {
        return this.http.post(this.movieUrl+"/movieGenre", JSON.stringify({searchTerm:searchTerm}), {headers: this.headers})
            .toPromise()
            .then(res => res.json() as Movie[])
            .catch(this.handleError);
    }

    getMyMovies(username : string): Promise<Movie[]> {
      let url = this.movieUrl + "/myContent";
      return this.http.post(url, JSON.stringify({username:username}),{headers: this.headers, withCredentials: true})
        .toPromise()
        .then(res=> res.json() as Movie[])
        .catch(this.handleError)
    }

    getMoviesSharedWithMe(username : string): Promise<Movie[]> {
      let url = this.movieUrl + "/sharedWithMe";
      return this.http.post(url,JSON.stringify({username:username}) ,{headers: this.headers, withCredentials: true})
        .toPromise()
        .then(res=> res.json() as Movie[])
        .catch(this.handleError)
    }

    shareMovieWith(_id: string, username: string): Promise<any> {
      return this.http.post(this.movieUrl+ "/shareMovie", JSON.stringify({"_id":_id,"username":username}), {headers: this.headers, withCredentials: true})
        .toPromise()
        .then(res => res as any )
        .catch(this.handleError);
    }

  updateMovie(movie: Movie): Promise<any> {
    return this.http.post(this.movieUrl+"/update", JSON.stringify(movie), {headers: this.headers, withCredentials: true})
      .toPromise()
      .then(res => res as any)
      .catch(this.handleError);
  }


    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
