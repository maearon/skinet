import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDetailedComponent } from '../user-detailed/user-detailed.component';
import { UsersComponent } from './users.component';
import { ShowFollowComponent } from '../user-show-follow/user-show-follow.component';

const routes: Routes = [
  { path: '', component: UsersComponent },
  { path: ':id', component: UserDetailedComponent, data: { breadcrumb: { alias: 'UserDetailed' } } },
  { path: ':id/:follow', component: ShowFollowComponent, data: { breadcrumb: { alias: 'UserShowFollow' } } }
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
