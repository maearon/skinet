import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { User } from 'src/app/shared/models/user';
import { BreadcrumbService } from 'xng-breadcrumb';
import { User, UsersService } from '../users/users.service';

@Component({
  selector: 'app-user-detailed',
  templateUrl: './user-detailed.component.html',
  styleUrls: ['./user-detailed.component.scss']
})
export class UserDetailedComponent implements OnInit {
  user?: User;
  constructor(private userService: UsersService, private route: ActivatedRoute,
    private bcService: BreadcrumbService) {
      this.bcService.set('@UserDetailed', ' ');
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    id && this.userService.getUserDetailed(+id).subscribe({
      next: user => {
        this.user = user;
        this.bcService.set('@UserDetailed', `User# ${user.id} - user.status`);
      }
    })
  }
}
