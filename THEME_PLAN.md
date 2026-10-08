# แผนการปรับปรุงธีม VS Code / GitHub Modern (Dual-Theme)

## 1. ปัญหาเดิมที่พบ
- การใช้สีแดงสด (`#FF0000`) กับตัวอักษร, ชื่อฟังก์ชัน, และอาร์กิวเมนต์ ทำให้ตัวหนังสือจ้า แสบตา และดูเหมือน Error ตลอดเวลา
- พอเปลี่ยนเป็นสีขาวล้วน ทำให้ข้อความกลืนกัน ขาด Hierarchy ทางสายตา (Syntax, Type, Method name, Active state ไม่เด่นชัด)

## 2. โทนสีใหม่: VS Code / GitHub Modern
- **Accent Primary**: Blue `#3B82F6` (Dark) / `#2563EB` (Light) — สบายตา ชัดเจน มาตรฐาน IDE
- **Syntax / Method Highlight**: Sky Blue `#60A5FA` (Dark) / `#1D4ED8` (Light) — ไฮไลต์ชื่อฟังก์ชันและตัวแปร
- **Type Badge & Values**: Cyan / Indigo อ่อนๆ แยกหมวดหมู่ข้อมูล
- **Success / Completed**: Emerald `#10B981` (เช่น ทำแล็บเสร็จแล้ว, แก้บั๊กสำเร็จ)
- **Warning / Tips**: Amber `#F59E0B`
- **Error**: Rose `#EF4444`

## 3. ขั้นตอนการลงมือทำ
1. **`globals.css`**: ตั้งค่า CSS Variables สำหรับ VS Code / GitHub Modern tokens
2. **`WikiViewer.tsx`**: ปรับสีชื่อ Method, พารามิเตอร์, แท็บตัวอย่าง, Breadcrumbs ให้ใช้โทน Blue Slate ที่มี Hierarchy
3. **`TutorialViewer.tsx`**: ปรับสี Progress Bar, หมายเลขสเต็ป, แท็กหมวดหมู่ ให้ดูเรียบร้อย สบายตา
4. **`ChallengeArena.tsx`**: ปรับสีโจทย์และไฮไลต์โค้ด ให้ดูเป็นมืออาชีพ
5. **`SimulatorPlayground.tsx`**: ปรับสี F9 Console, Explorer Tree, และปุ่มรัน ให้เป็นสไตล์ VS Code
6. **ทดสอบ Build และตรวจสอบการแสดงผลจริงทั้ง Dark และ Light Mode**
