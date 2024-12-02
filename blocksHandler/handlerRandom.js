const { faker } = require('@faker-js/faker');

module.exports.handlerRandom = function ({ language, options, type, command, fromNumber = 0, toNumber = 5 }) {
    // Random generator helpers
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
    const getRandomNumber = (from, to) => Math.floor(Math.random() * (to - from + 1)) + from;

    // Language dictionaries
    const dictionaries = {
        EN: {
            firstNames: Array.from({ length: 10 }, () => faker.name.firstName()),
            lastNames: Array.from({ length: 10 }, () => faker.name.lastName()),
            products: Array.from({ length: 10 }, () => faker.commerce.productName()),
            genders: ["Male", "Female", "Other"],
            domains: [
                "example.com",
                "gmail.com",
                "yahoo.com",
                "hotmail.com",
                "outlook.com",
                "test.com",
                "domain.com",
                "mail.com",
                "webmail.com",
                "live.com"
            ],
        },
        VN: {
            firstNames: ["An", "Bình", "Chi", "Duy", "Lan", "Hương", "Mai", "Nam", "Phúc", "Tú"],
            lastNames: ["Nguyễn", "Trần", "Lê", "Phạm", "Vũ", "Đỗ", "Hoàng", "Hồ", "Ngô", "Phan"],
            products: [
                "Máy tính",
                "Điện thoại",
                "Tai nghe",
                "Máy tính bảng",
                "Màn hình",
                "Máy in",
                "Máy ảnh",
                "Đồng hồ thông minh",
                "Bàn phím",
                "Chuột",
                "Loa Bluetooth",
                "Thiết bị mạng",
                "USB flash drive",
                "Máy chiếu",
                "Smart TV",
                "Thiết bị chơi game",
                "Router Wi-Fi",
                "Camera an ninh",
                "Phụ kiện điện thoại",
                "Thiết bị VR"
            ],
            genders: ["Nam", "Nữ", "Khác"],
            domains: [
                "example.vn",
                "gmail.com.vn",
                "yahoo.com.vn",
                "hotmail.com.vn",
                "outlook.com.vn",
                "test.vn",
                "domain.vn",
                "mail.vn",
                "webmail.vn",
                "live.com.vn"
            ],
        },
        CN: {
            firstNames: [
                "Wei", "Xiao", "Ming", "Hua", "Jian",
                "Li", "Xiu", "Tao", "Mei", "Jun",
                "Fang", "Qiang", "Ying", "Nan", "Ling"
            ],
            lastNames: [
                "Wang", "Li", "Zhang", "Liu", "Chen",
                "Yang", "Huang", "Zhao", "Wu", "Xu"
            ],
            products: [
                "电脑", "手机", "耳机", "平板", "显示器",
                "打印机", "相机", "智能手表", "键盘", "鼠标",
                "蓝牙音响", "路由器", "USB闪存驱动器", "投影仪",
                "智能电视", "游戏设备", "监控摄像头", "手机配件",
                "虚拟现实设备", "电源适配器", "硬盘驱动器"
            ],
            genders: ["男", "女", "其他"],
            domains: [
                "example.cn",
                "163.com",
                "qq.com",
                "sina.com",
                "hotmail.com.cn",
                "outlook.cn",
                "test.cn",
                "domain.cn",
                "mail.cn",
                "webmail.cn",
                "live.cn"
            ],
        },
        RU: {
            firstNames: [
                "Ivan", "Anna", "Dmitry", "Olga", "Nikolay",
                "Svetlana", "Alexey", "Tatiana", "Maxim", "Elena",
                "Andrey", "Yulia", "Sergey", "Ekaterina", "Vladimir"
            ],
            lastNames: [
                "Ivanov", "Petrov", "Sidorov", "Smirnov", "Kuznetsov",
                "Popov", "Vasiliev", "Morozov", "Fedorov", "Lebedev"
            ],
            products: [
                "Ноутбук", "Смартфон", "Наушники", "Планшет", "Монитор",
                "Принтер", "Камера", "Умные часы", "Клавиатура", "Мышь",
                "Bluetooth-колонка", "Роутер", "USB-флешка", "Проектор",
                "Смарт-телевизор", "Игровая приставка", "Видеокамера",
                "Аксессуары для телефона", "VR-устройство", "Блок питания", "Жесткий диск"
            ],
            genders: ["Мужчина", "Женщина", "Другой"],
            domains: [
                "example.ru",
                "mail.ru",
                "yandex.ru",
                "gmail.com",
                "hotmail.ru",
                "outlook.ru",
                "test.ru",
                "domain.ru",
                "webmail.ru",
                "live.ru"
            ],
        },
    };

    // Random data generation based on type
    try {
        let result;

        if (options === "simple") {
            const dict = dictionaries[language];

            switch (type) {
                case "email":
                    result = `${getRandomElement(dict.firstNames).toLowerCase()}@${getRandomElement(dict.domains)}`;
                    break;
                case "password":
                    result = Math.random().toString(36).slice(-8); // Random 8 character password
                    break;
                case "fullname":
                    result = `${getRandomElement(dict.firstNames)} ${getRandomElement(dict.lastNames)}`;
                    break;
                case "firstname":
                    result = getRandomElement(dict.firstNames);
                    break;
                case "lastname":
                    result = getRandomElement(dict.lastNames);
                    break;
                case "product":
                    result = getRandomElement(dict.products);
                    break;
                case "number":
                    result = getRandomNumber(fromNumber, toNumber);
                    break;
                case "gender":
                    result = getRandomElement(dict.genders);
                    break;
                default:
                    return { success: false, message: "Invalid type for Simple options" }
            }
        } else if (options === "advanced") {
            // Custom command logic (you can modify this part to handle custom commands)
            if (command) {
                result = eval(command);
            } else {
                return { success: false, message: "Command is required for Advanced options" }
            }
        } else {
            throw new Error("Invalid options value");
        }

      //  console.log("kq =>", result);

        return { success: true, message: "Success", data: result }; // Return successful result
    } catch (error) {
        return { success: false, message: error.message }; // Return error message
    }
}