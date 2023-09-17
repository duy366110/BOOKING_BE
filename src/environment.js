const Environment = {
    cors: {
        origins: [
            'http://localhost:3001',
            'http://localhost:3000',
            'https://bookingdb-76c37.web.app',
            'https://bookingdb-76c37.firebaseapp.com',
            'https://booking-2f8ab.web.app',
            'https://booking-2f8ab.firebaseapp.com'
        ]
    },
    port: 8080,
}

module.exports = Environment;