import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-subjects',
  imports: [CommonModule, RouterModule],
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.scss'],
})
export class SubjectsComponent implements OnInit {
  constructor(
    private service: DoctorService,
    private auth: AuthService,
    private notification: NotificationService,
  ) {}
  subjects: any[] = [];
  user: any;

  ngOnInit(): void {
    this.getUserInfo();
    this.getAllSubjects();
  }
  getAllSubjects() {
    this.service.getAllSubjects().subscribe((res: any) => {
      this.subjects = res;
    });
  }

  getUserInfo() {
    this.auth.getRole().subscribe((res: any) => {
      this.user = res;
    });
  }

  deleteSubjects(index: number) {
    let id = this.subjects[index].id;
    this.subjects.splice(index, 1);
    this.service.deleteSubject(id).subscribe((res: any) => {
      this.notification.success('تم حذف المادة بنجاح');
    });
  }
}
