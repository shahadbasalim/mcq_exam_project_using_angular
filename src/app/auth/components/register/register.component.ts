import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-register',
  imports: [MatInputModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  userForm!: FormGroup;
  students: any[] = [];
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {}

  createForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.createForm();
    this.getStudents();
  }

  getStudents() {
    this.service.getUsers('students').subscribe((res: any) => {
      this.students = res;
    });
  }

  submit() {
    const model = {
      username: this.userForm.value.username,
      email: this.userForm.value.email,
      password: this.userForm.value.password,
    };

    let index = this.students.findIndex(
      (item) => item.email == this.userForm.value.email
    );
    if (index !== -1) {
      this.notification.error('الايميل موجود مسبقا');
    } else {
      this.service.createUser(model).subscribe((res: any) => {
        this.notification.success('تم انشاء الحساب بنجاح');
        const model = {
          username: res.username,
          role: 'students',
          userId: res.id,
        };
        this.service.login(model).subscribe((res) => {
          this.service.user.next(res);
        });
        this.router.navigate(['/subjects']);
      });
    }
  }
}
