import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval } from 'rxjs';

interface TimeSlot {
  startTime: string;
  endTime: string;
  duration: number;
  subject: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatProgressBarModule],
  template: `
  <title>現在啥課</title>
    <div class="container">
      <mat-card class="current-class-card">
        <mat-card-header>
          <mat-card-title>目前課程</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h2>{{ currentClass?.subject || remainingTime }}</h2>
          <p *ngIf="currentClass">
            {{ currentClass.startTime }} - {{ currentClass.endTime }}
          </p>
          <mat-progress-bar
            *ngIf="currentClass"
            mode="determinate"
            [value]="85"
          ></mat-progress-bar>
          <p *ngIf="remainingTime && currentClass">
            剩餘時間: {{ remainingTime }} 還有{{ progressValue }}%
          </p>
        </mat-card-content>
      </mat-card>

      <mat-card class="next-class-card" *ngIf="nextClass">
        <mat-card-header>
          <mat-card-title>下一節課</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h3>{{ nextClass.subject }}</h3>
          <p>{{ nextClass.startTime }} - {{ nextClass.endTime }}</p>
        </mat-card-content>
      </mat-card>
    </div>`,
  styles: [
    `.container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      transform: scale(2); /* 將內容放大 200% */
      transform-origin: top center; /* 將縮放基準點設為上方中央 */
    }
    .current-class-card {
      margin-bottom: 20px;
    }
    .next-class-card {
      background: #f5f5f5;
    }
    mat-card-content {
      padding: 16px;
    }
    body {
      overflow-x: hidden; /* 避免橫向滾動條過多 */
      display: flex;
      justify-content: center; /* 保證內容水平居中 */
    }

`
  ]
})

export class AppComponent implements OnInit {
  // 課表設定
  schedule: { [key: string]: TimeSlot[] } = {
    '週一': [
      { startTime: '08:40', endTime: '09:20', duration: 40, subject: '國語' },
      { startTime: '09:30', endTime: '10:10', duration: 40, subject: '國語' },
      { startTime: '10:30', endTime: '11:10', duration: 40, subject: '藝術-美勞' },
      { startTime: '11:20', endTime: '12:00', duration: 40, subject: '藝術-美勞' },
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '數位資訊家' },
      { startTime: '14:20', endTime: '15:00', duration: 40, subject: '體育' },
      { startTime: '15:10', endTime: '15:50', duration: 40, subject: '英語' }
    ],
    '週二': [
      { startTime: '08:40', endTime: '09:20', duration: 40, subject: '臺灣台語' },
      { startTime: '09:30', endTime: '10:10', duration: 40, subject: '數學' },
      { startTime: '10:30', endTime: '11:10', duration: 40, subject: '自然科學' },
      { startTime: '11:20', endTime: '12:00', duration: 40, subject: '國語' },
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '綜合活動' },
      { startTime: '14:20', endTime: '15:00', duration: 40, subject: '社會' },
      { startTime: '15:10', endTime: '15:50', duration: 40, subject: '社會' }
    ],
    '週三': [
      { startTime: '08:40', endTime: '09:20', duration: 40, subject: '數學' },
      { startTime: '09:30', endTime: '10:10', duration: 40, subject: '藝術-音樂' },
      { startTime: '10:30', endTime: '11:10', duration: 40, subject: '國語' },
      { startTime: '11:20', endTime: '12:00', duration: 40, subject: '主題探究' },
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '教師專業成長時間' },
      { startTime: '14:20', endTime: '15:00', duration: 40, subject: '數位資訊家' },
      { startTime: '15:10', endTime: '15:50', duration: 40, subject: '主題探究' }
    ],
    '週四': [
      { startTime: '08:40', endTime: '09:20', duration: 40, subject: '學校活動' },
      { startTime: '09:30', endTime: '10:10', duration: 40, subject: '主題探究' },
      { startTime: '10:30', endTime: '11:10', duration: 40, subject: '英語' },
      { startTime: '11:20', endTime: '12:00', duration: 40, subject: '數學' },
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '社會' },
      { startTime: '14:20', endTime: '15:00', duration: 40, subject: '體育' },
      { startTime: '15:10', endTime: '15:50', duration: 40, subject: '綜合活動' }
    ],
    '週五': [
      { startTime: '08:40', endTime: '09:20', duration: 40, subject: '自然科學' },
      { startTime: '09:30', endTime: '10:10', duration: 40, subject: '自然科學' },
      { startTime: '10:30', endTime: '11:10', duration: 40, subject: '國語' },
      { startTime: '11:20', endTime: '12:00', duration: 40, subject: '數學' },
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '健康' },
      { startTime: '14:20', endTime: '15:00', duration: 40, subject: '體育' }
    ]
  };

  currentClass: TimeSlot | null = null;
  nextClass: TimeSlot | null = null;
  remainingTime: string = '';
  progressValue: number = 0;

  ngOnInit() {
    // 每秒更新
    interval(1000).subscribe(() => {
      this.updateCurrentClass();
    });
  }
  private updateCurrentClass() {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes
  
    // Day of the week, using array to convert the day number into Chinese day names
    const daysOfWeek = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
    let currentDay = daysOfWeek[now.getDay() - 1];
    if (now.getDay() == 0){
      currentDay = '週日';
    }
    // Handle weekend scenario
    if (currentDay === '週六' || currentDay === '週日') {
      this.currentClass = null;
      this.nextClass = null;
      this.remainingTime = '今天是週末 :)';
      this.progressValue = 0;
      return;
    }
    console.log(daysOfWeek)
    console.log(currentDay)
    console.log(now.getDay() - 1)
    // Get the schedule for the current day
    const daySchedule = this.schedule[currentDay] || [];
  
    // Find the current class (if any)
    this.currentClass = daySchedule.find(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return currentTime >= startMinutes && currentTime < endMinutes;
    }) || null;
  
    // If there's no current class, check if the school day is over
    if (!this.currentClass) {
      const lastClassEndTime = daySchedule[daySchedule.length - 1]?.endTime;
      if (lastClassEndTime) {
        const [lastEndHour, lastEndMin] = lastClassEndTime.split(':').map(Number);
        const lastEndMinutes = lastEndHour * 60 + lastEndMin;
        if (currentTime >= lastEndMinutes) {
          this.currentClass = null;
          this.nextClass = null;
          this.remainingTime = '放學了！';
          this.progressValue = 0;
          return;
        }
      }
    }
  
    // If there is a current class
    if (this.currentClass) {
      const currentIndex = daySchedule.indexOf(this.currentClass);
      this.nextClass = daySchedule[currentIndex + 1] || null;
  
      // Calculate remaining time for the current class
      const [endHour, endMin] = this.currentClass.endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      const remainingMinutes = endMinutes - currentTime;
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingMins = remainingMinutes % 60;
  
      this.remainingTime = `${remainingHours ? remainingHours + '小時 ' : ''}${remainingMins}分鐘`;
  
      // Calculate progress for the current class
      const [startHour, startMin] = this.currentClass.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const totalDuration = endMinutes - startMinutes;
      const elapsed = currentTime - startMinutes;
      this.progressValue = (elapsed / totalDuration) * 100;
    } else {
      // If there is no current class, find the next class
      this.nextClass = daySchedule.find(slot => {
        const [startHour, startMin] = slot.startTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        return currentTime < startMinutes;
      }) || null;
  
      if (this.nextClass) {
        this.remainingTime = `下課了:D`;
      } else {
        this.remainingTime = '今天已經放學了！';
      }
  
      // Reset progress if no current class
      this.progressValue = 0;
    }
  }
  
  
}
