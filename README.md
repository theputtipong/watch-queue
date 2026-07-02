# WatchQueue (Enterprise Edition)

โปรเจกต์แบบ Full-Stack ที่ให้ผู้ใช้สามารถค้นหาวิดีโอและจัดการคิวส่วนตัว (Queue) ได้แบบ Real-time พร้อมระบบ Optimistic UI และป้องกัน Race Condition อย่างสมบูรณ์

## 🚀 เทคโนโลยีที่ใช้ (Tech Stack)

- **Frontend:** Next.js (App Router), React, Tailwind CSS, TanStack Query (React Query), Lucide Icons
- **Backend:** Node.js, Express, TypeScript, Zod (Schema Validation)
- **Storage:** In-memory Storage (สามารถสลับเป็น Database จริงได้ง่าย)

---

## 💻 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Installation & Run)

กรุณาเปิด Terminal ขึ้นมา 2 หน้าต่าง เพื่อรัน Frontend และ Backend แยกกัน

### 1. การรัน Backend (API Server)

เซิร์ฟเวอร์จะรันอยู่ที่ `http://localhost:3001`

```bash
cd backend
npm install
npm run dev
```

### 2. การรัน Frontend (Web UI)

เว็บจะรันอยู่ที่ `http://localhost:3000`

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 วิธีจำลองการเกิด Network Failure (เพื่อดูระบบ Rollback)

โปรเจกต์นี้มีระบบ Optimistic UI หากเกิดข้อผิดพลาดในการส่งข้อมูล UI จะย้อนกลับ (Rollback) ไปยังค่าเดิมโดยอัตโนมัติ

**วิธีทดสอบ:**

1. รันทั้ง Frontend และ Backend ตามปกติ
2. เปิดหน้าเว็บ `http://localhost:3000`
3. สลับไปที่ Terminal ของ Backend แล้วกด `Ctrl + C` เพื่อปิด Backend ทิ้งชั่วคราว
4. กลับไปที่หน้าเว็บ แล้วลองกดปุ่ม "Add to Queue" หรือ "Mark as Watched"
5. คุณจะเห็นว่าปุ่มตอบสนองทันที (Optimistic) แต่หลังจากนั้นไม่นาน จะเกิด **Network Error Toast** แจ้งเตือนขึ้นมา และสถานะของปุ่มจะเด้งกลับไปเป็นเหมือนเดิม (Rollback) อย่างสวยงาม!

---

## 📂 โครงสร้างโฟลเดอร์หลัก (Key Directories)

- `frontend/src/api/` - กองรวม Fetch calls + แยกประเภท Error
- `frontend/src/hooks/` - ที่สถิตของ Business Logic (เช่น `useQueueStateMachine.ts`, `useCatalog.ts`)
- `frontend/src/components/` - UI ล้วนๆ ไม่มี Fetch Logic ปะปน
- `backend/src/controllers/` - ระบบ Zod Validation และจัดการ Request/Response
- `backend/src/services/` - ระบบ State Machine Validation ของ Queue
