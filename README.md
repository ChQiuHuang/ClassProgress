# 現在啥課 - ClassProgress

一個簡單的 Angular 課程時間追蹤器，幫助學生和老師即時查看目前和即將開始的課程。

## 功能特色

- 顯示目前正在進行的課程資訊：
  - 課程名稱
  - 開始和結束時間
  - 課程進度條
  - 剩餘時間顯示

- 顯示下一節課程資訊：
  - 課程名稱
  - 開始和結束時間

- 自動更新：
  - 每秒更新時間和進度
  - 自動切換課程顯示
  - 特殊時段提示（下課、放學、週末）

## 系統需求

- Node.js 18.x 或更高版本
- npm 或 yarn

## 安裝步驟

1. 複製專案：
```bash
git clone https://github.com/ChiuHuang/ClassProgress
```

2. 安裝依賴：
```bash
npm install
```

3. 啟動開發伺服器：
```bash
ng serve
```

4. 開啟瀏覽器訪問：
```
http://localhost:4200
```

## 課表設定

課表可在 `app.component.ts` 中的 `schedule` 物件進行修改，格式如下：

```typescript
{
  '週一': [
    { startTime: '08:40', endTime: '09:20', duration: 40, subject: '課程名稱' },
    // ... 其他課程
  ],
  // ... 其他日期
}
```

## 授權

MIT License
