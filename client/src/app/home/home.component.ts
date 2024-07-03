import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MicropostApiService } from './home.service';
import { CreateResponse, ListResponse, Micropost } from '../shared/models/micropost';
// import { Store } from '@ngrx/store';
// import { fetchUser, selectUser } from './session.slice';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { User as CurrentUser } from '../shared/models/user';
import { AccountService } from '../account/account.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  page: number = 1;
  feedItems: Micropost[] = [];
  totalCount: number = 1;
  following: number = 0;
  followers: number = 0;
  micropostCount = 0;
  micropost: number = 0;
  gravatar: string = '';
  content: string = '';
  image: File | null = null;
  imageName: string = '';
  errors: string[] = [];
  loading: boolean = true;
  userData: { value: CurrentUser | null, error: string } = { value: null, error: '' };
  currentUser$: Observable<CurrentUser | null> = of(null);

  @ViewChild('inputEl') inputEl!: ElementRef;
  @ViewChild('inputImage') inputImage!: ElementRef;

  constructor(
    private micropostService: MicropostApiService,
    public accountService: AccountService
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user: CurrentUser | null) => {
        this.userData.value = user;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.userData.error = err.message || 'An error occurred';
        this.loading = false;
      }
    });
    // this.currentUser$ = this.accountService.currentUser$;
    // this.userData.value = this.currentUser$;
  }

  ngOnInit(): void {
    this.fetchUserData();
  }

  fetchUserData() {
    this.currentUser$.subscribe(() => {
      this.setFeeds();
      this.loading = false;
    }).unsubscribe(
      // (error: HttpErrorResponse) => {
      // console.error('Failed to fetch user', error);
      // this.loading = false;
      // }
    );
  }

  // fetchUserData() {
  //   // Fetch user data and set loading to false after fetching
  //   this.setFeeds();
  //   this.loading = false;
  // }

  setFeeds() {
    this.micropostService.getAll(this.page).subscribe(
      response => {
        this.feedItems = response.feed_items;
        this.totalCount = response.total_count;
        this.following = response.following;
        this.followers = response.followers;
        this.micropostCount = response.micropost;
        this.gravatar = response.gravatar;
      },
      error => {
        console.log(error);
      }
    );
  }

  handlePageChange(pageNumber: number) {
    this.page = pageNumber;
    this.setFeeds();
  }

  handleContentInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.content = target.value;
  }

  handleImageInput(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      const sizeInMegabytes = target.files[0].size / 1024 / 1024;
      if (sizeInMegabytes > 512) {
        alert('Maximum file size is 512MB. Please choose a smaller file.');
        this.image = null;
        target.value = '';
      } else {
        this.image = target.files[0];
        this.imageName = target.files[0].name;
      }
    }
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('micropost[content]', this.content);
    if (this.image) {
      formData.append('micropost[image]', this.image, this.imageName);
    }

    this.micropostService.create(formData).subscribe(
      response => {
        if (response.flash) {
          this.inputEl.nativeElement.blur();
          // this.flashMessage(...response.flash);
          this.content = '';
          this.image = null;
          this.inputImage.nativeElement.value = '';
          this.errors = [];
          this.setFeeds();
        }
        if (response.error) {
          this.inputEl.nativeElement.blur();
          this.errors = response.error;
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  removeMicropost(micropostId: number) {
    const sure = window.confirm('Are you sure?');
    if (sure) {
      this.micropostService.remove(micropostId).subscribe(
        response => {
          if (response.flash) {
            // this.flashMessage(...response.flash);
            this.setFeeds();
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  flashMessage(type: string, message: string) {
    // Implement your flash message logic here
    console.log(`${type}: ${message}`);
  }
}
