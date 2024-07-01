import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { User } from 'src/app/shared/models/user';
import { BreadcrumbService } from 'xng-breadcrumb';
import { UserShow, UsersService } from '../users/users.service';

@Component({
  selector: 'app-user-detailed',
  templateUrl: './user-detailed.component.html',
  styleUrls: ['./user-detailed.component.scss']
})
export class UserDetailedComponent implements OnInit {
  user?: UserShow;
  page: number = 1;

  constructor(
    private userService: UsersService,
    private route: ActivatedRoute,
    private bcService: BreadcrumbService
  ) {
    this.bcService.set('@UserDetailed', ' ');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.userService.show(id, { page: this.page }).subscribe({
      next: response => {
        this.user = response.user;
        this.bcService.set('@UserDetailed', `User# ${response.user.id} - ${response.user.name}`);
      },
      error: error => {
        console.error(error);
      }
    });
  }
}
