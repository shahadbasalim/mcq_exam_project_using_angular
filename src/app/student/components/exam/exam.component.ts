import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { DoctorService } from '../../../doctor/services/doctor.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';

@Component({
  selector: 'app-exam',
  imports: [MatRadioModule, MatButtonModule, CommonModule],
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss'],
})
export class ExamComponent implements OnInit {
  id: any;
  subject: any;
  user: any;
  total: number = 0;
  showResults: boolean = false;
  studentInfo: any;
  userSubjects: any[] = [];
  validExam: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private service: DoctorService,
    private notification: NotificationService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getSubject();
    this.getLogedInUser();
  }

  getSubject() {
    this.service.getSubject(this.id).subscribe((res: any) => {
      this.subject = res;
    });
  }

  getLogedInUser() {
    this.auth.getRole().subscribe((res: any) => {
      this.user = res;
      this.getUserData();
    });
  }

  getUserData() {
    this.auth.getStudent(this.user.userId).subscribe((res: any) => {
      this.studentInfo = res;
      this.userSubjects = res?.subject ? res.subject : [];
      this.calcValidExam();
    });
  }

  calcValidExam() {
    const existingSubject = this.userSubjects.find(
      (subj) => subj.id === this.id
    ); // اذا تحقق الشرط راح ترجع لي الاوبجكت حق المادة المختبرة
    if (existingSubject) {
      this.validExam = false;
      this.total = existingSubject.degree;
      this.notification.warn('لقد قمت بحل هذا الامتحان من قبل');
    }
  }

  delete(index: number) {
    this.subject.questions.splice(index, 1);

    const model = {
      name: this.subject.name,
      questions: this.subject.questions,
    };

    this.service.updateSubject(model, this.id).subscribe((res: any) => {
      this.notification.success('تم حذف السؤال بنجاح');
    });
  }

  getAnswer(event: any) {
    let value = event.value;
    let questionIndex = event.source.name;
    this.subject.questions[questionIndex].studentAnswer = value;
  }

  getResult() {
    this.total = 0;
    this.subject.questions.forEach((question: any) => {
      if (question.studentAnswer == question.correctAnswer) {
        this.total++; // total = total + 1
      }
    });
    this.showResults = true;
    this.userSubjects.push({
      name: this.subject.name,
      id: this.id,
      degree: this.total,
    });
    const model = {
      username: this.studentInfo.username,
      email: this.studentInfo.email,
      password: this.studentInfo.password,
      subject: this.userSubjects,
    };
    this.auth.updateStudent(this.user.userId, model).subscribe((res: any) => {
      this.notification.success('تم تسجيل النتيجة بنجاح');
    });
  }
}
