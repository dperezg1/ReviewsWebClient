/**
 * Created by USER on 01/08/2017.
 */
import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';
import 'rxjs/Observable';
import {URLSearchParams} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { User } from '../models/User';

@Injectable()
export class UserService {
  private headers = new Headers({"Content-Type":"application/json"});
  private passheaders = new Headers({"Content-Type": "application/x-www-form-urlencoded"});


  private userUrl = 'http://localhost:3000';

  constructor(private http: Http) {
  }

   logoutUser():Promise<any>
  {
    let url= this.userUrl+"/logout";
    return this.http.get(url, {headers: this.passheaders, withCredentials: true} )
      .toPromise()
      .then(res => res as any, res=> res as any)
      .catch(this.handleError)
  }

  getLogUserInfo():Promise<any>
  {
    let url= this.userUrl+"/userInfo";
    return this.http.get(url, {headers: this.passheaders, withCredentials: true})
      .toPromise()
      .then(res => res as any, res=> res as any)
      .catch(this.handleError)
  }

  searchUser(searchTerm : string): Promise<any> {
    let url = this.userUrl + "/searchUser";
    return this.http.post(url,JSON.stringify({searchTerm:searchTerm}) ,{headers: this.headers})
      .toPromise()
      .then(res=> res as any)
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

}
