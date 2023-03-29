// const sql = require('mssql')

// const config = {
//   user: 'Thiendeptrai',
//   password: 'TranPhuocThien26092003',
//   server: 'Eye-KimaKenShin\\MSSQLSERVER',
//   database: 'Nodejs',
//   options: {
//     encrypt: true, // for azure
//     trustServerCertificate: true // change to true for local dev / self-signed certs
//   }

// }

// async function connect() {
//   try {
//   await sql.connect(config)
//   console.log('Kết nối thành công');
//  } catch (err) {
//   console.log('Kết nối thất bại ', {err});
//  }

// }
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'Nodejs',
    'Thiendeptrai',
    'TranPhuocThien26092003',
    {
        host: 'localhost',
        dialect: 'mssql',
        logging: false,
    },
);
async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', { error });
    }
}
module.exports = { connect };
