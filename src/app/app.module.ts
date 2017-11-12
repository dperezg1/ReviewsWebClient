import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppRoutingModule} from './app-routing.module'
import { HomeComponent } from './components/home.component';
import { AppComponent } from './components/app.component';
import { UserService } from './services/user.service';
import {ReviewService} from "./services/reviews.service";
import {CustExtBrowserXhr} from "./cust-ext-browser-xhr";
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import {PromoService} from "./services/promo.service";


@NgModule({
  declarations: [
    HomeComponent,
    AppComponent,
    FileSelectDirective
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [UserService, ReviewService,CustExtBrowserXhr, PromoService],
  bootstrap: [AppComponent]

})
export class AppModule { }


