import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserApiService, UserEdit } from '../user-detailed/user-detailed.service';

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

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userApiService: UserApiService,
    private toastr: ToastrService
  ) {
    this.id = this.route.snapshot.params['id'];

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      password_confirmation: ['']
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
        if (response.flash) {
          this.toastr.success(...response.flash);
          this.router.navigate(['/']);
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
        if (response.flash_success) {
          this.toastr.success(...response.flash_success);
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
