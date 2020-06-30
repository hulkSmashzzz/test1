const nodemailer = require('nodemailer');
const config = require('../config/mailer');
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.USER,
        pass: config.PASS
    }
});

module.exports= {
    sendmail(from,to,subject,html){
        return new Promise((resolve,reject)=>{
            transport.sendMail({from,subject,to,html},(err,info)=>{
                if(err) reject(err);
                resolve(info);

            });
        });
    }
}