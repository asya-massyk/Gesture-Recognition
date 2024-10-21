const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cv = require('opencv4nodejs');
// Не забувайте ініціалізувати Mediapipe Hands, якщо ви його плануєте використовувати
const { Hands } = require('@mediapipe/hands');

// Ініціалізація додатка Express
const app = express();
const PORT = 3000;

// Налаштування CORS для того, щоб дозволити з'єднання між клієнтом і сервером
app.use(cors());

// Додаємо статичний сервер для папки uploads
app.use('/uploads', express.static('uploads'));

// Переконайся, що папка 'uploads' існує
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Налаштування Multer для збереження завантажених файлів
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Вкажи папку для збереження
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Унікальне ім'я файлу
    },
});

const upload = multer({ storage: storage });

// Масив для жестів
const gestures = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 
    'А', 'Б', 'В', 'Г', 'Ґ', 'Д', 'Е', 'Є', 'Ж', 'З', 'И', 'І', 'Ї', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ь', 'Ю', 'Я', 
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' 
];

// Маршрут для завантаження зображень
app.post('/upload', upload.single('file'), async (req, res) => {
    if (req.file) {
        const imagePath = path.join(__dirname, req.file.path);

        // Обробка зображення за допомогою OpenCV
        const image = await cv.imreadAsync(imagePath);
        // Тут можна реалізувати логіку для розпізнавання жестів за допомогою Mediapipe Hands

        // Повертає URL завантаженого зображення і розпізнаний жест
        const gesture = gestures[Math.floor(Math.random() * gestures.length)]; // Заглушка для жесту
        res.json({
            imageUrl: `http://localhost:${PORT}/uploads/${req.file.filename}`,
            gesture: gesture
        });

        // Видалення файлу після обробки
        fs.unlink(imagePath, (err) => {
            if (err) console.error(`Не вдалося видалити файл: ${err}`);
            else console.log('Файл видалено');
        });
    } else {
        return res.status(400).send('No file uploaded.');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущено на http://localhost:${PORT}`);
});
