import { Component, OnInit } from '@angular/core';
// import { User } from '../shared/models/user';
import { User, UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsersForUser().subscribe({
      next: response => this.users = response.users
    })
  }
}
