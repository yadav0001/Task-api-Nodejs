const sgMail = require('@sendgrid/mail')

const sendgridAPIKey =process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {

    sgMail.send({ 
        to:email,
        from:'naveen179801@gmail.com',
        subject:'Welcom to family',
        text:`Hi ${name}, Hope you found our services useful`
    }).then(()=>{
    console.log('Working')
    }).catch((e) =>{
        console.log(e)
    })

}

const sendByeEmail = (email, name) => {

    sgMail.send({
        to:email,
        from:'naveen179801@gmail.com',
        subject:'GoodBye',
        text:`Hey ${name}, It's sad to see you go`
    }).then(()=>{
    console.log('Working')
    }).catch((e) =>{
        console.log(e)
    })
    
}

module.exports = {
    sendWelcomeEmail,sendByeEmail
}