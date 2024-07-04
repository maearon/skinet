import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserApiService, UserEdit } from '../user-detailed/user-detailed.service';
import { titleCase } from '../shared/helpers/string-helpers';
import { AccountService } from '../account/account.service';
import { User as CurrentUser } from '../shared/models/user';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class EditComponent implements OnInit {
  @ViewChild('inputEl', { static: false }) inputEl!: ElementRef<HTMLInputElement>;
  userForm: FormGroup;
  id: string;
  user: UserEdit = {} as UserEdit;
  gravatar = '';
  errors: string[] = [];
  current_user: { value: CurrentUser | null, error: string } = { value: null, error: '' };
  loading = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userApiService: UserApiService,
    private toastr: ToastrService,
    public accountService: AccountService,
  ) {
    this.id = this.route.snapshot.params['id'];

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password_confirmation: ['']
    });

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
    this.getUserInfo();
  }

  getUserInfo(): void {
    this.userApiService.edit(this.id).subscribe({
      next: response => {
        if (response.user) {
          this.user = response.user;
          this.userForm.patchValue({
            name: response.user.name,
            email: response.user.email,
          });
          this.gravatar = response.gravatar;
        }
        if (response.user) {
          if (
            response.user.id !== this.current_user.value?.id ||
            response.user.name !== this.current_user.value?.name ||
            response.user.email !== this.current_user.value?.email
          ) {
            this.router.navigate(['/']);
            this.toastr.warning(`
              ${titleCase(response.user.name)} data fetch complete but not current user
              ${titleCase(this.current_user.value?.name)} you only update data Profile for self
            `);
          } else {
            this.toastr.success(`${titleCase(response.user.name)} data fetch complete`);
          }
        }
      },
      error: error => {
        console.error('Error fetching user info:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      return;
    }

    this.userApiService.update(this.id, { user: this.userForm.value }).subscribe({
      next: response => {
        this.inputEl.nativeElement.blur();
        if (response.status === 200) {
          this.toastr.success(response.message);
          this.getUserInfo();
        }
        if (response.error) {
          this.errors = response.error;
          this.toastr.error('Error updating user.');
        }
      },
      error: error => {
        console.error('Error updating user:', error);
      }
    });
  }
}
