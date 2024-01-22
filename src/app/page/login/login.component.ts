import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackServices } from '../../core/services/snack.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    CommonModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  signInForm: boolean = false;
  data: any;
  isAdmin! : boolean;
  loginForm: FormGroup;
  signupForm: FormGroup;
  avatarPreview: string | ArrayBuffer | null = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  defalt_Admin = {
    email: 'agusmart94@gmail.com',
    first_name: 'emmanuel',
    last_name: 'agu',
    username: 'aguChukwuemeka',
    password: '1234',
    approved: true,
    admin: true,
    id: '869',
    createdAt: '2024-01-21T13:51:22.652Z',
  };
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private _snackBar: SnackServices,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      // avatar: [null, Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    sessionStorage.setItem('admin', JSON.stringify(this.defalt_Admin || []));
  }

  onSignInForm() {
    this.signInForm = !this.signInForm;
  }

  onAvatarChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const file = inputElement.files?.[0];

    if (file) {
      this.signupForm.patchValue({ avatar: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmitSignForm() {
    if (this.signupForm.valid) {
      console.log('new-user :', this.signupForm.valid);
      const newUser = {
        email: this.signupForm.value.email,
        first_name: this.signupForm.value.first_name,
        last_name: this.signupForm.value.last_name,
        avatar: this.signupForm.value.avatar,
        username: this.signupForm.value.username,
        password: this.signupForm.value.password,
        approved: false,
        admin: false,
      };
      console.log('new-user :', newUser);

      this.userService.addUser(newUser).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.data = response;
          this.setupLDB();
          this.signupForm.reset();
          this.signInForm = true;
          this._snackBar.openSuccessSnackBar(
            'User added successfully',
            'Success'
          );
        },
        (error) => {
          console.error('Error adding user:', error);
          this.signupForm.reset();
          this._snackBar.openFailureSnackBar('User sign-up failed', 'Failed');
        }
      );
    }
  }

  setupLDB() {
    let newUser: any[] = [];
    let initializedUser: any[] = [];
    const user = sessionStorage.getItem('users');
    newUser = JSON.parse(user || '[]');
    if (!Array.isArray(newUser)) {
      // initializedUser.push(this.data);
      newUser = [this.data];
      initializedUser = [...newUser, this.data];
      sessionStorage.setItem('users', JSON.stringify(initializedUser));
    } else {
      // newUser.push(this.data);
      newUser = [...newUser, this.data];
    }
    sessionStorage.setItem('users', JSON.stringify(newUser));
  }

  onSubmitLogin() {
    if (this.loginForm.valid) {
      const enteredUsername = this.loginForm.value.username;
      const enteredPassword = this.loginForm.value.password;

      const admin = JSON.parse(sessionStorage.getItem('admin') || '');
      const user = JSON.parse(sessionStorage.getItem('users') || '');

      console.log('Admin', admin);
      console.log('User', user);

       if (user && user.password === enteredPassword && admin && admin.admin) {
         this.isAdmin = true;
         sessionStorage.setItem('isAdmin', JSON.stringify(this.isAdmin));
       } else if (user && user.password === enteredPassword && user.approved) {
         console.log('Login successful:', user);
         this.loginForm.reset();
         this._snackBar.openSuccessSnackBar(
           'User successfully logged in',
           'Success'
         );
         this.router.navigate(['/home']);
       } else {
         console.error('Invalid credentials or unapproved user');
         this._snackBar.openWarningSnackBar(
           'Invalid credentials or unapproved user',
           'Caution'
         );
       }

      // this.userService.getUserByUsername(enteredUsername).subscribe(
      //   (user) => {
      //     if (user && user.password === enteredPassword && user.approved) {
      //       if (user.admin) {
      //         sessionStorage.setItem('isAdmin', JSON.stringify(user.admin));
      //       }
      //       console.log('Login successful:', user);
      //       this.loginForm.reset();
      //       this._snackBar.openSuccessSnackBar(
      //         'User successfully login',
      //         'Success'
      //       );
      //       this.router.navigate(['/home']);
      //     } else {
      //       console.error('Invalid credentials or unapproved user');
      //       this._snackBar.openWarningSnackBar(
      //         'invalid credentials or unapproved user',
      //         'Caution'
      //       );
      //     }
      //   },
      //   (error) => {
      //     console.error('Error fetching user:', error);
      //     this._snackBar.openFailureSnackBar(error, 'Failed');
      //   }
      // );
    }
  }
}
