import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { User as CurrentUser } from '../shared/models/user';
import { HttpErrorResponse } from '@angular/common/http';
import { AccountService } from '../account/account.service';
import { MicropostApiService } from '../home/home.service';
import { RelationshipApiService } from './user-relationship.service';
import { UserApiService, UserShow } from './user-detailed.service';
import { Micropost } from '../shared/models/micropost';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-show',
  templateUrl: './user-detailed.component.html',
  styleUrls: ['./user-detailed.component.scss']
})
export class UserDetailedComponent implements OnInit, OnDestroy {
  @ViewChild('inputUnfollow') inputUnfollow!: ElementRef;
  @ViewChild('inputFollow') inputFollow!: ElementRef;

  user: UserShow | null = null;
  microposts: Micropost[] = [];
  id: string | null = '';
  page: number = 1;
  totalCount: number = 1;
  private routeSub?: Subscription;
  private userSub?: Subscription;
  currentUser: { value: CurrentUser | null, error: string } = { value: null, error: '' };
  loading: boolean = true;
  isSubmitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private userApiService: UserApiService,
    private micropostApiService: MicropostApiService,
    private relationshipApiService: RelationshipApiService,
    public accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user: CurrentUser | null) => {
        this.currentUser.value = user;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.message || 'An error occurred');
        this.loading = false;
      }
    });
    this.id = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.setFeeds();
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  setFeeds(): void {
    if (this.id) {
      this.userApiService.show(this.id, { page: this.page }).subscribe(response => {
        this.user = response.user;
        this.microposts = response.microposts;
        this.totalCount = response.total_count;

        // Ensure `current_user_following_user` is set based on the current user state
        if (this.user && this.currentUser.value) {
          this.user.current_user_following_user = response.user.current_user_following_user;
        }
      });
    }
  }

  handlePageChange(pageNumber: number): void {
    this.page = pageNumber;
    this.setFeeds();
  }

  handleFollow(event: Event): void {
    event.preventDefault(); // Prevent default form submission
    this.isSubmitting = true;
    if (this.id) {
      this.relationshipApiService.create({ followed_id: this.id }).subscribe(
        response => {
          this.isSubmitting = false;
          if (response.follow) {
            this.inputFollow.nativeElement.blur();
            // Call `setFeeds()` to refresh the user and micropost data
            this.setFeeds();
          }
        },
        error => {
          this.isSubmitting = false;
          console.log(error);
        }
      );
    }
  }

  handleUnfollow(event: Event): void {
    event.preventDefault(); // Prevent default form submission
    this.isSubmitting = true;
    if (this.id) {
      const userId = Number(this.id);  // Convert `id` from string to number
      this.relationshipApiService.destroy(userId).subscribe(
        response => {
          this.isSubmitting = false;
          if (response.unfollow) {
            this.inputUnfollow.nativeElement.blur();
            // Call `setFeeds()` to refresh the user and micropost data
            this.setFeeds();
          }
        },
        error => {
          this.isSubmitting = false;
          console.log(error);
        }
      );
    }
  }

  removeMicropost(micropostId: number, event: Event): void {
    event.preventDefault();
    if (confirm("Are you sure?")) {
      this.micropostApiService.remove(micropostId).subscribe(response => {
        if (response.flash) {
          this.toastr.success(...response.flash);
          this.setFeeds();
        }
      });
    }
  }

  get currentUserId(): number {
    return this.currentUser.value?.id ?? 0;
  }

  get isCurrentUser(): boolean {
    return this.user ? this.currentUserId === this.user.id : false;
  }
}
