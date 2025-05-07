import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { interval } from 'rxjs';

interface TimeSlot {
  startTime: string;  // 課程開始時間 (格式: "HH:MM")
  endTime: string;    // 課程結束時間 (格式: "HH:MM")
  duration: number;   // 課程持續時間 (分鐘)
  subject: string;    // 科目名稱
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatProgressBarModule],
  template: `
    <title>現在啥課</title>
    <div class="container">
      <!-- 當前課程卡片 -->
      <mat-card class="current-class-card">
        <mat-card-header>
          <mat-card-title>目前課程</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h2>{{ currentClass?.subject || remainingTime }}</h2>
          <p *ngIf="currentClass">
            {{ currentClass.startTime }} - {{ currentClass.endTime }}
          </p>
          <!-- 課程進度條 -->
          <mat-progress-bar
            *ngIf="currentClass"
            mode="determinate"
            [value]="progressValue"
            color="primary"
            class="custom-progress-bar"
          ></mat-progress-bar>
          <p *ngIf="remainingTime && currentClass">
            剩餘時間: {{ remainingTime }} 還有{{ 100 - progressValue | number:'1.0-0' }}%
          </p>
        </mat-card-content>
      </mat-card>

      <!-- 下一節課卡片 -->
      <mat-card class="next-class-card" *ngIf="nextClass">
        <mat-card-header>
          <mat-card-title>下一節課</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <h3>{{ nextClass.subject }}</h3>
          <p>{{ nextClass.startTime }} - {{ nextClass.endTime }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
      transform: scale(2);
      transform-origin: top center;
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
      overflow-x: hidden;
      display: flex;
      justify-content: center;
    }
    .custom-progress-bar .mat-progress-bar-background {
      background-color: #e0e0e0 !important;
    }
  
    /* 📱 小螢幕裝置適配 */
    @media (max-width: 480px) {
      .container {
        transform: scale(1);
        padding: 10px;
      }
      mat-card-title {
        font-size: 1rem;
      }
      h2, h3 {
        font-size: 1.2rem;
      }
      p {
        font-size: 0.85rem;
      }
      mat-card-content {
        padding: 8px;
      }
    }
  `]
  
})
export class AppComponent implements OnInit {
  /**
   * 課表設定 - 記錄每週各天的課程安排
   * 結構: { '週一': [...課程], '週二': [...課程], ... }
   */
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
      { startTime: '13:30', endTime: '14:10', duration: 40, subject: '教師專業成長時間' }
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

  // 當前課程
  currentClass: TimeSlot | null = null;
  // 下一節課
  nextClass: TimeSlot | null = null;
  // 剩餘時間文字
  remainingTime: string = '';
  // 課程進度百分比
  progressValue: number = 0;

  /**
   * 組件初始化時啟動定時更新
   */
  ngOnInit() {
    // 每秒更新一次課程狀態
    interval(1000).subscribe(() => {
      this.updateCurrentClass();
    });
  }

   // 更新當前課程狀態
  private updateCurrentClass() {
    const now = new Date();
    // 將當前時間轉換為分鐘計數（例如：9:30 = 9*60+30 = 570分鐘）
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    // 星期幾對應表（0=週日, 1=週一, ..., 6=週六）
    const daysOfWeek = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
    const currentDay = daysOfWeek[now.getDay()];

    // 處理週末情況
    if (currentDay === '週六' || currentDay === '週日') {
      this.currentClass = null;
      this.nextClass = null;
      this.remainingTime = '今天是週末 :)';
      this.progressValue = 0;
      return;
    }

    const daySchedule = this.schedule[currentDay] || [];

    this.currentClass = daySchedule.find(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      return currentTime >= startMinutes && currentTime < endMinutes;
    }) || null;

    // 如果沒有當前課程，檢查學校一天是否結束
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

    // 如果有當前課程，計算相關信息
    if (this.currentClass) {
      // 找出下一節課
      const currentIndex = daySchedule.indexOf(this.currentClass);
      this.nextClass = daySchedule[currentIndex + 1] || null;

      // 計算當前課程的剩餘時間
      const [endHour, endMin] = this.currentClass.endTime.split(':').map(Number);
      const endMinutes = endHour * 60 + endMin;
      const remainingMinutes = endMinutes - currentTime;
      const remainingHours = Math.floor(remainingMinutes / 60);
      const remainingMins = remainingMinutes % 60;

      // 格式化剩餘時間顯示
      this.remainingTime = `${remainingHours ? remainingHours + '小時 ' : ''}${remainingMins}分鐘`;

      // 計算當前課程的進度百分比
      const [startHour, startMin] = this.currentClass.startTime.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const totalDuration = endMinutes - startMinutes;
      const elapsed = currentTime - startMinutes;
      this.progressValue = (elapsed / totalDuration) * 100;
    } else {
      // 如果當前沒有課，找出下一節課
      this.nextClass = daySchedule.find(slot => {
        const [startHour, startMin] = slot.startTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        return currentTime < startMinutes;
      }) || null;

      // 設置休息時間的顯示訊息
      this.remainingTime = this.nextClass ? '下課了:D' : '今天已經放學了！';
      this.progressValue = 0;
    }
  }
}
