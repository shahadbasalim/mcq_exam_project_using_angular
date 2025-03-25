import { Component, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NotificationService } from '../../../shared/services/notification.service';
import { DoctorService } from '../../services/doctor.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-exam',
  imports: [
    MatFormFieldModule,
    MatRadioModule,
    MatStepperModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './new-exam.component.html',
  styleUrls: ['./new-exam.component.scss'],
})
export class NewExamComponent implements OnInit {
  name = new FormControl('');
  questionForm!: FormGroup;
  questions: any[] = [];
  correctNum: any;
  subjectName: string | null = null;
  startAdd: boolean = false;
  preview: boolean = false;
  stepperIndex = 0;
  id: any;

  constructor(
    private fb: FormBuilder,
    private notification: NotificationService,
    private service: DoctorService
  ) {}

  ngOnInit() {
    this.createForm();
  }
  createForm() {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      answer1: ['', Validators.required],
      answer2: ['', Validators.required],
      answer3: ['', Validators.required],
      answer4: ['', Validators.required],
    });
  }

  start() {
    if (this.name.value == '') {
      this.notification.error('يرجى ادخال اسم المادة');
    } else {
      this.startAdd = true;
      this.subjectName = this.name.value;
      this.stepperIndex = 1;
    }
  }

  getCorrect(event: any) {
    this.correctNum = event.value;
  }

  createQuestion() {
    if (this.correctNum) {
      const model = {
        question: this.questionForm.value.question,
        answer1: this.questionForm.value.answer1,
        answer2: this.questionForm.value.answer2,
        answer3: this.questionForm.value.answer3,
        answer4: this.questionForm.value.answer4,
        correctAnswer: this.questionForm.value[this.correctNum],
      };
      this.questions.push(model);
      this.questionForm.reset();
    } else {
      this.notification.error('يرجى اختيار الاجابة الصحيحة');
    }
    console.log(this.questions);
  }

  clearForm() {
    this.questionForm.reset();
  }

  cancel() {
    this.questionForm.reset();
    this.questions = [];
    this.subjectName = '';
    this.name.reset();
    this.stepperIndex = 0;
    this.startAdd = false;
  }

  submit() {
    const model = {
      name: this.subjectName,
      questions: this.questions,
    };

    if (this.preview) {
      this.stepperIndex = 2;
    } else {
      this.service.createSubject(model).subscribe((res: any) => {
        this.preview = true;
        this.id = res.id;
      });
    }
  }

  delete(index: number) {
    this.questions.splice(index, 1);

    const model = {
      name: this.subjectName,
      questions: this.questions,
    };

    this.service.updateSubject(model, this.id).subscribe((res: any) => {
      this.notification.success('تم حذف السؤال بنجاح');
    });
  }
}
