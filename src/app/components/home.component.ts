import {Component, OnInit,Input,Output,EventEmitter}from '@angular/core';
import{Review} from '../models/Review'
import {UserService} from '../services/user.service'
import {User} from "../models/User";
import {ReviewService} from "../services/reviews.service";

@Component ({
    selector: 'home',
    templateUrl: '../htmls/home.component.html',
    styleUrls: ['../css/home.component.css','../css/homeStyle.component.css','../css/pagination.css','../css/bootstrap.min.css','../css/dropdownmenu.css'],
    providers: [UserService, ReviewService]
})

export class HomeComponent implements  OnInit {
    private searcherFlag: boolean;
    private reviewToDelete: Review;
    @Input() public editingid: string;
    @Input() public editingproduct: string;
    @Input() public editingbrand: string;
    @Input() public editingcategory: string;
    public categories: string[];
    public brands: string[];
    public showingMoviesRow1: Review[];
    public showingMoviesRow2: Review[];
    public allReviews: Review[];
    public activeUser: User;
    public pager: number[];
    public lastPage: number;
    public numberOfPages: number;
    public isLogged: boolean;
    public myContents: boolean;
    public divHeight: string;


    constructor(private userService: UserService, private reviewService: ReviewService) {
        this.searcherFlag = true;
        this.myContents = false;
        this.divHeight = "420px";
        this.userService.getLogUserInfo().then(res => {
            if (res.status.toString().indexOf("200") == -1) {
                this.isLogged = false;
            } else {
                this.loguedUser();
                this.activeUser = res;
            }
        });
        this.reviewService.getAllReviews().then(res => {
            this.allReviews = res;
            this.categories = ["Clothes", "Accesories", "Cars", "Motorcycles", "Shoes", "Make up", "Technology", "Watches"];
            this.brands = ["Nike", "Adidas", "Puma", "Guess", "Lacoste", "Victoria's Secret", "Zara", "Microsoft" ,"Stradivarius", "Asus", "HP", "BMW", "Mercedes Benz"];

                this.refreshContent();
        })

    }

    ngOnInit(): void {
    }

    search(searchTerm: string): void {
        this.reviewService.searchReviews(searchTerm).then(res => {
            this.allReviews = res;
            console.log(this.allReviews);
            this.refreshContent();
        })
    }

    saveReviewToDeleteAndOpenConfirmModal(review: Review): void {
        this.reviewToDelete = review;
        document.getElementById("confirmModal").className = ("modal in");
    }


    deleteReview(): void {
        let review = this.reviewToDelete;
        this.reviewService.deleteReview(review._id.toString()).then(res => {
            this.myContent();
            document.getElementById("confirmModal").className = ("modal fade in hide");
        })
    }

    searchByCategory(category: string): void {
        this.myContents = false;
        this.divHeight = "420px";
        this.reviewService.getAllReviewsByCategory(category).then(res => {
            this.allReviews = res;
            this.refreshContent();
        })
    }

    changePage(id: string): void {
        if (document.getElementById(id).className.indexOf("strong") == -1) {
            document.getElementById(id).className = "strong";
            document.getElementById(this.lastPage.toString()).className = "pagerButton";
            this.lastPage = +id;
            this.getRowsFromAllMovies(+id);
        }
    }

    createReview(product: string, link: string, brand: string, category: string): void {
        if (product != "" && link != "" && brand != "" && category != "") {
            this.userService.getLogUserInfo().then(res => {
                console.log("demole")
                let user = res;
                let review = res;
                if (user) {
                    review = {
                        "_id": "",
                        "owner_username": JSON.parse(user._body).username,
                        "product": product,
                        "youtubeName": "",
                        "youtubeImage": "",
                        "youtubeDate": "",
                        "youtubeLink": link,
                        "category": category,
                        "brand": brand,
                        "verifiedUser": false,
                        "goodRate": 0,
                        "badRate": 0
                    }
                }
                this.reviewService.createReview(review).then(ress => {
                        document.getElementById("uploadCloser").click();
                        this.refreshContent();
                });
            });
        } else {
            document.getElementById("loginErrorMsg2").className = "alert alert-error";
            document.getElementById("loginErrorMsg2").textContent = "Please fill all the blanks!"
        }
    }

    logout(): void {
        this.userService.logoutUser().then(res => {
            console.log(res)
        });
        document.getElementById("loginButton").textContent = "Log In";
        document.getElementById("loginButton").removeEventListener('click');
        if (this.isLogged == true) {
            document.getElementById("upload").setAttribute('data-target', "");
            this.isLogged = false;
        }
        //   document.getElementById("loginButton").setAttribute('href',"http://proyecto17api.dis.eafit.edu.co/login");
    }

    loguedUser(): void {
        document.getElementById("loginButton").textContent = "Log Out";
        document.getElementById("loginButton").setAttribute('href', "");
        document.getElementById("loginButton").addEventListener('click', (event => {
            this.logout();
        }));
        this.isLogged = true;
    }

    changeLoginModalId(): void {
        document.getElementById("loguedInModal").id = "loginModal";
        document.getElementById("loginButton").removeEventListener('click');
    }

    home(): void {
        this.searcherFlag = true;
        this.myContents = false;
        this.divHeight = "420px";
        this.reviewService.getAllReviews().then(res => {
            this.allReviews = res;
            console.log(res);
            this.refreshContent();
        })
    }

    nextPage(): void {
        if (this.lastPage < this.numberOfPages) {
            var next: string;
            let next = this.lastPage + 1;
            this.changePage(next.toString());
        }
    }

    prevPage(): void {
        if (this.lastPage > 1) {
            var prev: string;
            let prev = this.lastPage - 1;
            this.changePage(prev.toString());
        }
    }

    myContent(): void {
        this.searcherFlag = false;
        this.userService.getLogUserInfo().then(res => {
            if (res.status.toString().indexOf("200") != -1) {
                this.myContents = true;
                this.divHeight = "530px";
                this.reviewService.getMyReviews(JSON.parse(res._body).username).then(ress => {
                    this.allReviews = ress;
                    this.refreshContent();
                })
            }
        })
    }


    refreshContent(): void {
        var i: number;
        i = 0;
        this.showingMoviesRow1 = [];
        this.showingMoviesRow2 = [];
        this.pager = [];

        var sobrante: number;
        sobrante = this.allReviews.length % 8;
        if (sobrante == 0) {
            this.numberOfPages = this.allReviews.length / 8;
        } else {
            this.numberOfPages = (this.allReviews.length + 8 - sobrante) / 8;
        }
        i = 1;
        while (i < this.numberOfPages) {
            this.pager.push(i + 1);
            i++;
        }
        this.lastPage = 1;

        this.getRowsFromAllMovies(1);
    }

    getRowsFromAllMovies(page: number): void {
        this.showingMoviesRow1 = [];
        this.showingMoviesRow2 = [];
        var i: number;
        i = (page * 8) - 8;
        while (i < (page * 8) - 4 && i < this.allReviews.length) {
            this.showingMoviesRow1.push(this.allReviews[i]);
            i++;
        }
        i = (page * 8) - 8;
        while (i < (page * 8) - 4 && i + 4 < this.allReviews.length) {
            this.showingMoviesRow2.push(this.allReviews[i + 4]);
            i++;
        }
    }

    getReviewToEdit(review: Review) {
        this.editingid = review._id;
        this.editingproduct = review.product;
        this.editingcategory = review.category;
        this.editingbrand = review.brand;
    }

    editReview(): void {
        let review = new Review();
        review = {
            _id: this.editingid,
            owner_username: "",
            product: this.editingproduct,
            youtubeName: "",
            youtubeImage: "",
            youtubeDate: "",
            youtubeLink: "",
            category: this.editingcategory,
            brand: this.editingbrand,
            verifiedUser: false,
            goodRate: 0,
            badRate: 0
        };
        this.reviewService.updateReview(review).then(res => {
            if (res.status.toString().indexOf("200") != -1) {
                document.getElementById("uploadCloser1").click();
                this.myContent();
            }
        })

    }

    closeErrorModal(): void {
        document.getElementById("errorModal").className = ("modal fade in hide errorModal");
    }

    closeSuccessModal(): void {
        document.getElementById("successModal").className = ("modal fade in hide errorModal");
    }

    closeConfirmModal(): void {
        document.getElementById("confirmModal").className = ("modal fade in hide errorModal");

    }

}
