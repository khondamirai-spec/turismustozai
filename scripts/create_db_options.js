
const fs = require('fs');
const chunk1 = [
    { "module": "3-modul 3.3 mavzu", "question_text": "Receptionist hujjatlarni qanday tekshiradi?", "id": "b95e64e6-b6cc-4637-8928-e07a37b1fc2b", "option_text": "uxlab turadi", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/3-modul%203.3%20mavzu/2-savol/uxlab%20turadi.png" },
    { "module": "1-modul 1.2 mavzu", "question_text": "Qaysi rasm xizmat madaniyatini to‘g‘ri ko‘rsatadi?", "id": "7fcbeac8-d261-4eb9-be3c-c9329967604c", "option_text": "Sovuqqon yuz", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/1-modul%201.2%20mavzu/5-savol/Sovuqqon%20yuz.png" },
    { "module": "2-modul 2.4 mavzu", "question_text": "Receptionist mehmonni kuzatishda nima qiladi?", "id": "065da753-3ea0-4122-b6ee-ac224b481a8c", "option_text": "uxlash", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/2-modul%202.4%20mavzu/4-test/uxlash.png" },
    { "module": "3-modul 3.1 mavzu", "question_text": "Receptionistning asosiy vazifasi check-in paytida nima?", "id": "f46c644d-9572-452d-9a98-feccb84d3abb", "option_text": "Bozor qilish", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/3-modul%203.1%20mavzu/1-savol/Bozor%20qilish.png" },
    { "module": "4-modul 4.3 mavzu", "question_text": "Ovqatlanish xizmatlari haqida receptionist qanday gapiradi?", "id": "0b31f83c-a291-4238-9f9c-ba51204d8818", "option_text": "Baqirish", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/4-modul%204.3%20mavzu/4-savol/Baqirish.png" },
    { "module": "4-modul 4.3 mavzu", "question_text": "Receptionist qanday jadvalni tushuntiradi?", "id": "2ed29266-9301-4210-8c68-bb59991bcffa", "option_text": "Uyqu vaqti", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/4-modul%204.3%20mavzu/2-savol/Uyqu%20vaqti.png" },
    { "module": "1-modul 1.3 mavzu", "question_text": "Single room qaysi turdagi xona?", "id": "846169ff-a1ec-4f2b-91ad-2a1eeb52c999", "option_text": "Oshxona", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/1-modul%201.3%20mavzu/1-savol/Oshxona.png" },
    { "module": "2-modul 2.1 mavzu", "question_text": "Receptionist qanday ohangda gapiradi?", "id": "deaa9733-ad44-46de-bc1c-181155f9567c", "option_text": "Sovuqqon", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/2-modul%202.1%20mavzu/4-savol/Sovuqqon.png" },
    { "module": "3-modul 3,4 mavzu", "question_text": "Receptionist mehmonni xonaga qanday yo‘naltiradi?", "id": "e8f29b5b-febe-4558-9a0a-dc9f344b9098", "option_text": "Belgflar va so'z bilan ko'raitish", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/3-modul%203.4%20mavzu/5-savol/Belgflar%20va%20so%27z%20bilan%20ko%27raitish.png" },
    { "module": "1-modul 1.3 mavzu", "question_text": "Single room qaysi turdagi xona?", "id": "fb5e3a53-00c6-4c15-84c4-21c57984ffc2", "option_text": "Konferensiya zali", "image_url": "https://pub-2323b0f94bf24efa8844aef22423eade.r2.dev/1-modul%201.3%20mavzu/1-savol/Konferensiya%20zali.png" }
    // ... adding more from the list
];

// I'll skip the manual entry for brevity and just fetch them into the file using a consolidated SQL query
// Since I have the MCP tool, I'll just run one SQL query that returns exactly what I need without truncation by selecting column directly.
