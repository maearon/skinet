import { Component, OnInit } from '@angular/core';
import { User, UsersService } from './users.service';
import { AccountService } from '../account/account.service';
import { Observable, of } from 'rxjs';
import { User as CurrentUser } from '../shared/models/user';
// import { PageEvent } from '@angular/material/paginator';
// import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  page: number = 1;
  total_count: number = 1;
  currentUser$: Observable<CurrentUser | null> = of(null);

  constructor(
    private usersService: UsersService,
    // private snackBar: MatSnackBar
    public accountService: AccountService
  ) {
    this.currentUser$ = this.accountService.currentUser$;
  }

  ngOnInit(): void {
    this.setUsersList();
  }

  setUsersList(): void {
    this.usersService.index({ page: this.page }).subscribe({
      next: (response: { users: User[]; total_count: number }) => {
        this.users = response.users;
        this.total_count = response.total_count;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }

  handlePageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.setUsersList();
  }

  removeUser(index: number, userId: number): void {
    const sure = window.confirm("Are you sure?");
    if (sure) {
      this.usersService.destroy(userId).subscribe({
        next: (response: any) => {
          // this.snackBar.open('User deleted successfully', 'Close', { duration: 2000 });
          this.setUsersList();
        },
        error: (error: any) => {
          console.error(error);
        }
      });
    }
  }
}
