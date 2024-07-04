import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IUserFollow, UserApiService, UserFollow } from '../user-detailed/user-detailed.service';
import { User as CurrentUser } from '../shared/models/user';
import { AccountService } from '../account/account.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-show-follow',
  templateUrl: './user-show-follow.component.html',
  styleUrls: ['./user-show-follow.component.scss']
})
export class ShowFollowComponent implements OnInit {
  users: UserFollow[] = [];
  xusers: UserFollow[] = [];
  page = 1;
  total_count = 1;
  user: IUserFollow = {} as IUserFollow;
  id = '';
  follow = '';
  current_user: { value: CurrentUser | null, error: string } = { value: null, error: '' };
  loading = true;

  constructor(
    private userFollowService: UserApiService,
    private route: ActivatedRoute,
    public accountService: AccountService,
    private toastr: ToastrService
  ) {
    this.accountService.currentUser$.subscribe({
      next: (user: CurrentUser | null) => {
        this.current_user.value = user;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.message || 'An error occurred');
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.follow = params['follow'];
      this.setFollowPage();
    });
  }

  setFollowPage(): void {
    if (this.id && this.follow) {
      this.userFollowService.follow(this.id, this.page, this.follow).subscribe({
        next: response => {
          this.users = response.users;
          this.xusers = response.xusers;
          this.total_count = response.total_count;
          this.user = response.user;
        },
        error: error => {
          console.error('Error fetching follow data:', error);
        },
        complete: () => {
          this.toastr.success(`${this.titleCase(this.current_user.value?.name)} ${this.titleCase(this.follow)} data fetch complete`);
        }
      });
    }
  }

  handlePageChange(pageNumber: number): void {
    console.log(`active page is ${pageNumber}`);
    this.page = pageNumber;
    this.setFollowPage();
  }

  removeUser(id: number): void {
    const sure = window.confirm("Are you sure?");
    if (sure) {
      this.userFollowService.destroy(id).subscribe({
        next: response => {
          if (response.flash) {
            // Handle flash message
            this.setFollowPage();
          }
        },
        error: error => {
          console.error('Error removing user:', error);
        },
        complete: () => {
          this.toastr.success('User removal complete');
        }
      });
    }
  }

  // Helper function to convert a string to title case
  titleCase(str: string | null | undefined): string {
    if (!str) return '';
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }
}
