const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
module.exports.handelrImapReadMail =
    async (
        emailService,
        email,
        password,
        folder = 'INBOX',
        options = {
            isUnreadMails: true,
            isMark: false,
            isGetLatest: true,
            includesFrom: '',
            includesTo: '',
            includesSubject: '',
            includesBody: '',
            readEmailMinute: 0,
            flags: { isGlobal: false, isCaseInsensitive: false, isMultiline: false }
        },
        regex = '',
        timeout = 30,
        imapHost = 'imap.gmail.com',
        imapPort = 993,
        isTLS = true
    ) => {

        let host, port, tls;
        switch (emailService.toLowerCase()) {
            case 'gmail':
                host = 'imap.gmail.com';
                port = 993;
                tls = true;
                break;
            case 'outlook':
            case 'hotmail':
                host = 'imap-mail.outlook.com';
                port = 993;
                tls = true;
                break;
            case 'yahoo':
                host = 'imap.mail.yahoo.com';
                port = 993;
                tls = true;
                break;
            case 'custom':
                host = imapHost;
                port = imapPort;
                tls = isTLS;
                break;
            default:
                return { success: false, message: 'Unsupported email emailService' };
        }

        const config = {
            imap: {
                user: email,
                password: password,
                host: host,
                port: port,
                tls: tls,
                tlsOptions: {
                    rejectUnauthorized: false  // Bỏ qua kiểm tra chứng chỉ tự ký
                },
                authTimeout: 10000,
            }
        };

        try {
            // Kết nối tới server IMAP
            const connection = await imaps.connect(config);

            await connection.openBox(folder);

            // Tùy chọn tìm email
            const searchCriteria = [];
            if (options.isUnreadMails) searchCriteria.push('UNSEEN');

            // Nếu isGetLatest = false, lọc theo điều kiện khác
            if (!options.isGetLatest) {

                if (options.readEmailMinute) {
                    const dateFrom = new Date(Date.now() - options.readEmailMinute * 60 * 1000);
                    searchCriteria.push(['SINCE', dateFrom]);
                }
                if (options.includesFrom) searchCriteria.push(['FROM', options.includesFrom]);
                if (options.includesTo) searchCriteria.push(['TO', options.includesTo]);
                if (options.includesSubject) searchCriteria.push(['SUBJECT', options.includesSubject]);
                if (options.includesBody) {
                    // `BODY` tìm kiếm trong nội dung email
                    searchCriteria.push(['BODY', options.includesBody]);
                }
            } else {
                searchCriteria.push(['SINCE', new Date()]);
            }

            const fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
                markSeen: options.isMark
            };

            // Lấy email từ folder
            const messages = await connection.search(searchCriteria, fetchOptions);

            if (messages.length > 0) {
                // Sắp xếp email theo ngày gửi
                messages.sort((a, b) => b.attributes.date - a.attributes.date);

                let selectedMessages = options.isGetLatest ? [messages[0]] : messages; // Đảm bảo luôn là một mảng

                let result = [];

                for (let message of selectedMessages) {
                    const all = message.parts.find(part => part.which === '');

                    if (!all) return { success: false, message: 'Email not found' };

                    const id = message.attributes.uid;
                    const idHeader = `Imap-Id: ${id}\r\n`;

                    const parsed = await simpleParser(idHeader + all.body);

                    // Xử lý nội dung email: loại bỏ các ký tự xuống dòng và khoảng trắng không cần thiết
                    // const cleanContent = parsed.text.replace(/\r?\n|\r/g, ' ').trim();
                    const cleanContent = parsed.text ? parsed.text.replace(/\r?\n|\r/g, ' ').trim() : ''

                    const emailDetails = {
                        from: parsed.from.text,
                        to: parsed.to ? parsed.to.text : '',
                        subject: parsed.subject,
                        content: cleanContent
                    };

                    // Nếu có `regex` và khớp, thêm trường `extractedData`
                    if (regex && parsed.text) {
                        // Xây dựng chuỗi flag từ lựa chọn của người dùng
                        let flags = '';
                        if (options.flags.isGlobal) flags += 'g';
                        if (options.flags.isCaseInsensitive) flags += 'i';
                        if (options.flags.isMultiline) flags += 'm';

                        const _regex = new RegExp(regex, flags); // Sử dụng các flag đã chọn

                        const match = parsed.text.match(_regex);

                        if (match) {
                            // Nếu có nhiều kết quả, trả về mảng các kết quả khớp
                            emailDetails.extractedData = match.length > 1 ? match : [match[0]];
                        } else {
                            // Nếu không có kết quả khớp
                            emailDetails.extractedData = null;
                        }
                    }

                    result.push(emailDetails);
                }

                closeConnectionAfterTimeout(connection, timeout);

                return { success: true, message: 'success', data: options.isGetLatest ? result[0] : result };
            }

            closeConnectionAfterTimeout(connection, timeout);

            return { success: false, message: 'No emails found' };

        } catch (error) {
            return { success: false, message: error };
        }
    }
function closeConnectionAfterTimeout(connection, timeout) {
    setTimeout(() => connection.end(), timeout * 1000);
}