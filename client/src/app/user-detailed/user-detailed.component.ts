import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
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
  user: UserShow | null = null;
  microposts: Micropost[] = [];
  id: string = '';
  page: number = 1;
  totalCount: number = 1;
  // currentUser: any;
  private routeSub?: Subscription;  // Mark as optional
  private userSub?: Subscription;   // Mark as optional
  // currentUser$: Observable<CurrentUser | null> = of(null);
  currentUser: { value: CurrentUser | null, error: string } = { value: null, error: '' };
  loading: boolean = true;

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
  }

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.id = id;
        this.loadData(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  private loadData(id: string): void {
    this.userApiService.show(id, { page: this.page }).subscribe(response => {
      this.user = response.user;
      this.microposts = response.microposts;
      this.totalCount = response.total_count;
    });
  }

  handlePageChange(pageNumber: number): void {
    this.page = pageNumber;
    if (this.user) {
      this.loadData(this.user.id.toString());
    }
  }

  handleFollow(event: Event): void {
    event.preventDefault();
    if (this.id) {
      this.relationshipApiService.create({ followed_id: this.id }).subscribe(response => {
        if (response.follow) {
          this.loadData(this.user?.id.toString() || '');
        }
      });
    }
  }

  handleUnfollow(event: Event): void {
    event.preventDefault();
    if (this.user) {
      this.relationshipApiService.destroy(this.user.id).subscribe(response => {
        if (response.unfollow) {
          this.loadData(this.user?.id.toString() || '');
        }
      });
    }
  }

  removeMicropost(micropostId: number, event: Event): void {
    event.preventDefault();
    if (confirm("Are you sure?")) {
      this.micropostApiService.remove(micropostId).subscribe(response => {
        if (response.flash) {
          // flashMessage(...response.flash);
          this.toastr.success(...response.flash);
          this.loadData(this.user?.id.toString() || '');
        }
      });
    }
  }

  get isCurrentUser(): boolean {
    return (this.currentUser && this.currentUser.value?.id !== parseInt(this.id || '1') || true)
  }
}
