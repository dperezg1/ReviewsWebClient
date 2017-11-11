import {Component, OnInit,Input,Output,EventEmitter}from '@angular/core';
import{Movie} from '../models/Movie'
import {UserService} from '../services/user.service'
import {User} from "../models/User";
import {MovieService} from "../services/movie.service";
import {FileUploader} from "ng2-file-upload";

@Component ({
    selector: 'home',
    templateUrl: '../htmls/home.component.html',
    styleUrls: ['../css/home.component.css','../css/homeStyle.component.css','../css/pagination.css','../css/bootstrap.min.css','../css/dropdownmenu.css'],
    providers: [UserService, MovieService]
})

export class HomeComponent implements  OnInit {
  public uploader:FileUploader = new FileUploader({url:'http://proyecto17api.dis.eafit.edu.co/upload',itemAlias:"userFile"});
  private searcherFlag:boolean;
  private movieToDelete:Movie;
  @Input() public editingid:string;
  @Input() public editingtitle:string;
  @Input() public editingyear:string;
  @Input() public editingdirector:string;
  @Input() public editingsize:string;
  @Input() public editinggenre:string;
  @Input() public editingvisibility:string;
  @Input()  public editingowner:string;
  @Input()  public editingshared:string[];
  @Input() public editingurl:string;
  public searched2:string;
  public searched1:string;
  public genres:string[];
  public visibility:string[];
  public showingMoviesRow1:Movie[];
  public showingMoviesRow2:Movie[];
  public allMovies:Movie[];
  public activeUser:User;
  public pager:number[];
  public lastPage: number;
  public numberOfPages: number;
  public isLogged: boolean;
  public myContents: boolean;
  public divHeight:string;




  constructor(private userService:UserService,private movieService: MovieService) {
    this.searcherFlag=true;
    this.myContents=false;
    this.divHeight="420px";
    this.userService.getLogUserInfo().then(res=>{
      if(res.status.toString().indexOf("200")==-1){
        this.isLogged=false;
      }else
        {
          this.loguedUser();
          this.activeUser=res;
        }
    })
    this.movieService.getAllMovies().then(res=> {
      this.allMovies = res;
      this.genres = ["Action", "Adventure", "Comedy", "Crime", "Drama", "Romance", "Horror", "Musical", "Science fiction", "Mystery"];
      this.visibility = ["public", "private"];
      this.refreshContent();
    })

  }

  ngOnInit():void {
  }

  search(searchTerm:string):void{
    this.movieService.searchMovieByTitle(searchTerm).then(res=>{
      this.allMovies=res;
      console.log(this.allMovies);
      this.refreshContent();
    })
  }

  saveMovieToDeleteAndOpenConfirmModal(movie:Movie):void{
    this.movieToDelete = movie;
    document.getElementById("confirmModal").className=("modal in");
  }


  deleteThisMovie():void{
    let movie = this.movieToDelete;
    this.movieService.deleteMovie(movie._id.toString()).then(res=>{
      this.myContent();
      document.getElementById("confirmModal").className=("modal fade in hide");
    })
  }

  searchByGenre(genre:string):void{
    this.myContents=false;
    this.divHeight="420px";
    this.movieService.getAllMoviesByGenre(genre).then(res=>{
      this.allMovies=res;
      this.refreshContent();
    })
  }

  changePage(id:string):void {
    if(document.getElementById(id).className.indexOf("strong")==-1)
    {
      document.getElementById(id).className = "strong";
      document.getElementById(this.lastPage.toString()).className = "pagerButton";
      this.lastPage = +id;
      this.getRowsFromAllMovies(+id);
    }
  }


  createMovie(item:any,title:string,year:string,director:string,size:string,url:string,genre:string, visibility:string):void{
    if(title!="" && year!="" && director!="" && size!="" && url!="" && genre!="" && visibility!="") {
      this.userService.getLogUserInfo().then(res => {
        let movie = res;
        if (movie) {
          movie = {
            "_id": "",
            "title": title,
            "year": year,
            "director": director,
            "genre": genre,
            "size": size,
            "imageUrl": url,
            "visibility": visibility,
            "filename": item.file.name,
            "shared_with": [],
            "owner_username": JSON.parse(movie._body).username
          }
        }
        this.movieService.createMovie(movie).then(ress => {
          console.log(ress);
          if (ress) {
            item.upload();
            document.getElementById("loginErrorMsg6").className = "alert alert-error";
            document.getElementById("createButton").style.display="none";
            this.uploader.onCompleteItem= function(item:any, response: any, status:any, headers: any){
              document.getElementById("loginErrorMsg").className = "alert hide alert-error";
              document.getElementById("createButton").style.display="block";
              document.getElementById("uploadCloser").click();
            };
          }
          else {
            document.getElementById("loginErrorMsg").className = "alert alert-error";
          }
        });
      });
    }else{
      document.getElementById("loginErrorMsg2").className="alert alert-error";
      document.getElementById("loginErrorMsg2").textContent="Please fill all the blanks!"
    }
  }

  login(): void {
    this.userService.loginUser()
      .then();
  }

  logout():void{
    this.userService.logoutUser().then(res=>{ console.log(res)});
    document.getElementById("loginButton").textContent="Log In";
    document.getElementById("loginButton").removeEventListener('click');
    if(this.isLogged==true){
      document.getElementById("upload").setAttribute('data-target',"");
      this.isLogged=false;
    }
 //   document.getElementById("loginButton").setAttribute('href',"http://proyecto17api.dis.eafit.edu.co/login");
  }

  loguedUser():void{
    document.getElementById("closeLoginModal").click();
    document.getElementById("loginErrorMsg").className="alert alert-error hide";
    document.getElementById("loginButton").textContent="Log Out";
    document.getElementById("loginButton").setAttribute('href',"");
    document.getElementById("loginButton").addEventListener('click', (event =>{
      this.logout();
    }));
    this.isLogged=true;
    document.getElementById("loginModal").id = "loguedInModal";
  }

  changeLoginModalId():void{
    document.getElementById("loguedInModal").id = "loginModal";
    document.getElementById("loginButton").removeEventListener('click');
  }


  register(username:string, passw:string, passw2:string): void {
    if (passw == passw2) {
      this.userService.createUser(username, passw)
        .then(res => {
          console.log(res);
          if (res._body.toString().indexOf("exitosamente") != -1) {
           document.getElementById("registerModalCloser").click();
            this.login();
          }else{
            document.getElementById("loginErrorMsg1").className = 'alert alert-error';
            document.getElementById("loginErrorMsg1").textContent=res._body.toString();
          }
        });
    }else{
      document.getElementById("loginErrorMsg1").className = 'alert alert-error';
      document.getElementById("loginErrorMsg1").textContent="the passwords doesn't match.";
    }


  }

  home():void{
    this.searcherFlag=true;
    this.myContents=false;
    this.divHeight="420px";
    this.movieService.getAllMovies().then(res=> {
      this.allMovies = res;
      console.log(res);
      this.refreshContent();
    })
  }

  nextPage():void{
   if(this.lastPage<this.numberOfPages) {
     var next:string;
     let next = this.lastPage + 1;
     this.changePage(next.toString());
   }
  }

  prevPage():void{
    if(this.lastPage>1){
      var  prev:string;
      let prev = this.lastPage-1;
      this.changePage(prev.toString());
    }
  }

  myContent():void{
    this.searcherFlag=false;
    this.userService.getLogUserInfo().then(res=> {
      if(res.status.toString().indexOf("200")!=-1) {
        this.myContents=true;
        this.divHeight="530px";
        this.movieService.getMyMovies(JSON.parse(res._body).username).then(ress => {
          this.allMovies = ress;
          this.refreshContent();
        })
      }
    })
  }


  contentSharedWithMe():void{
    this.searcherFlag=false;
    this.userService.getLogUserInfo().then(res=> {
      if(res.status.toString().indexOf("200")!=-1) {
        this.divHeight="420px";
        this.myContents=false;
        this.movieService.getMoviesSharedWithMe(JSON.parse(res._body).username).then(ress => {
          this.allMovies = ress;
          this.refreshContent();
        })
      }
    })
  }

  refreshContent():void{
    var i: number;
    i = 0;
    this.showingMoviesRow1 = [];
    this.showingMoviesRow2 = [];
    this.pager = [];

    var sobrante: number;
    sobrante = this.allMovies.length % 8;
    if (sobrante == 0) {
      this.numberOfPages = this.allMovies.length / 8;
    } else {
      this.numberOfPages = (this.allMovies.length + 8 - sobrante) / 8;
    }
    i = 1;
    while (i < this.numberOfPages) {
      this.pager.push(i + 1);
      i++;
    }
    this.lastPage = 1;

    this.getRowsFromAllMovies(1);
  }

  shareWith(username:string,movie:Movie) :void {
    this.userService.searchUser(username).then(res=>{
      if(res._body.toString().indexOf("error")==-1){
        this.movieService.shareMovieWith(movie._id,username).then(res=>{
          console.log(res);
          if(res.toString().indexOf("hay error")==-1){
            //existe y se agrego exitosamente
            document.getElementById("successModal").className = "modal in";
            this.searched1=null;
            this.searched2=null;
            document.getElementById(movie._id).setAttribute('placeholder',"shared with "+ username);

          }else{
            //algo salio mal
            this.searched1=null;
            this.searched2=null;
            document.getElementById(movie._id).setAttribute('placeholder',"Something wrong");

          }
        })
      }else{
        //usuario no existente
        document.getElementById("errorModal").className = "modal in";
        this.searched1=null;
        this.searched2=null;
        document.getElementById(movie._id).setAttribute('placeholder',username + " doesn't exist");

      }
    })
    this.searched1=null;
    this.searched2=null;
  }


    getRowsFromAllMovies(page:number):void {
    this.showingMoviesRow1 = [];
    this.showingMoviesRow2 = [];
    var i:number;
    i = (page*8) - 8;
    while (i < (page*8) - 4 && i < this.allMovies.length) {
      this.showingMoviesRow1.push(this.allMovies[i]);
      i++;
    }
    i = (page*8) - 8;
    while (i < (page*8) - 4 && i+4 < this.allMovies.length) {
      this.showingMoviesRow2.push(this.allMovies[i+4]);
      i++;
    }
  }

  getMovieToEdit(movie:Movie, genre:string){
    this.editingtitle=movie.title;
    this.editingdirector=movie.director;
    this.editinggenre=genre;
    this.editingsize=movie.size;
    this.editingvisibility=movie.visibility;
    this.editingyear=movie.year;
    this.editingurl=movie.imageUrl;
    this.editingid=movie._id;
    this.editingowner=movie.owner_username;
    this.editingshared=movie.shared_with;
  }

  editMovie():void{
    let movie = new Movie();
    movie ={
      _id:this.editingid,
      title: this.editingtitle,
      year: this.editingyear,
      genre: this.editinggenre,
      size: this.editingsize,
      director: this.editingdirector,
      imageUrl: this.editingurl,
      owner_username: this.editingowner,
      visibility: this.editingvisibility,
      filename: "",
      shared_with: this.editingshared
    };
    console.log(movie);
    this.movieService.updateMovie(movie).then(res=>{
      if(res.status.toString().indexOf("200")!=-1){
        document.getElementById("uploadCloser1").click()
        this.myContent();
      }
    })

  }

  closeErrorModal():void{
    document.getElementById("errorModal").className=("modal fade in hide errorModal");
  }

  closeSuccessModal():void{
    document.getElementById("successModal").className=("modal fade in hide errorModal");
  }
  closeConfirmModal():void{
    document.getElementById("confirmModal").className=("modal fade in hide errorModal");

  }

  closeconfirmAccountModal():void{
    document.getElementById("confirmAccountModal").className=("modal fade in hide errorModal");

  }
  openConfirmDeleteAcc():void{
    document.getElementById("confirmAccountModal").className=("modal  in ");

  }

  deleteThisAccount():void{
    this.userService.getLogUserInfo().then(res=>{
        this.logout();
	let username = JSON.parse(res._body).username;
	this.userService.deleteUser(username).then(ress=>{
        console.log(ress);
        this.closeconfirmAccountModal();
      })
    })
  }

  changeUsername(username:string): void {
    this.userService.searchUser(username).then(res=>{
      if(res._body.toString().indexOf("_id")==-1){
        this.userService.getLogUserInfo()
          .then(res => {
            this.userService.updateUsername(JSON.parse(res._body)._id,username).then(res=>{});
            document.getElementById("usernameModalCloser").click();
          });
      }else {
        document.getElementById("loginErrorMsg3").className="alert alert-error";
      }
    })

  }

  changePassword(passw1:string,passw2:string): void {
      if(passw1==passw2){
        this.userService.getLogUserInfo()
          .then(res => {
            this.userService.updatePassword(JSON.parse(res._body)._id,passw1).then(res=>{});
            document.getElementById("closePasswordModal").click();
          });
      }else {
        document.getElementById("loginErrorMsg4").className="alert alert-error";
      }

  }

}
