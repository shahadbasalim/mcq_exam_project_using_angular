import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    MatRadioModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  users: any[] = [];
  type: string = 'students';
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private notification: NotificationService,
  ) {}

  ngOnInit() {
    this.createForm();
    this.getUsers();
  }

  createForm() {
    this.loginForm = this.fb.group({
      type: [this.type, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  getRole(event: any) {
    this.type = event.value;
    this.getUsers();
  }

  getUsers() {
    this.service.getUsers(this.type).subscribe((res: any) => {
      this.users = res;
    });
  }

  submit() {
    let index = this.users.findIndex(
      (item) =>
        item.email == this.loginForm.value.email &&
        item.password == this.loginForm.value.password
    );
    if (index == -1) {
      this.notification.error('الايميل او كلمة المرور غير صحيحة');

    } else {
      const model = {
        username: this.users[index].username,
        role: this.type,
        userId: this.users[index].id,
      }
      this.service.login(model).subscribe((res) => {
        this.service.user.next(res);
        this.notification.success('تم تسجيل االدخول بنجاح');
        this.router.navigate(['/subjects']);
      });
    }
  }
}
