import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import {
  MatHeaderCellDef,
  MatCellDef,
  MatRowDef,
  MatHeaderRowDef,
} from '@angular/material/table';
import { AuthService } from '../../../auth/services/auth.service';
@Component({
  selector: 'app-students',
  imports: [
    MatTableModule,
    MatHeaderCellDef,
    MatCellDef,
    MatRowDef,
    MatHeaderRowDef,
  ],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements OnInit {
  dataSource: any;
  displayedColumns: string[];

  constructor(private service: AuthService) {
    this.displayedColumns = ['position', 'name', 'subjectName', 'degree'];
  }

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents() {
    this.service.getUsers('students').subscribe((res: any) => {
      // نُرجع الطلاب الذين لديهم مواد فقط
      this.dataSource = res?.flatMap((student: any) => {
        if (student?.subject) {
          // إذا كان الطالب لديه مواد، نقوم بإرجاع بيانات كل مادة
          return student.subject.map((sub: any) => ({
            name: student.username,
            subjectName: sub.name,
            degree: sub.degree,
          }));
        }
        return []; // إذا لم يكن لدى الطالب مواد، نُرجع مصفوفة فارغة
      });
    });
  }
}
