// Changes are being made from zod branch
const express = require('express');
const { type } = require('os');
const z = require('zod');
const port = 3000;

const app = express();

app.use(express.json());//

/*
// Underhodd of app.use();
 const temp = JSON.parse(req.body);
 return temp;
*/

function checkpass (password) {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/;
  
    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
  
    return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
  };


const schema = z.object({
    username: z.string(),
    password: z.string().refine((data) => checkpass(data), {message: "Password must contain Cap, small, special, and integers"}),
    email: z.string().email({ message: "Pls enter valid email address" })

})



function userMiddleware(req, res, next){
    // do some auth 
    // name, email, pass
    const username = req.headers.username;
    const password = (req.headers.password);
    const email = req.headers.email;

    console.log(typeof(password) + password);

    const response = schema.safeParse({
                                    username,
                                    password, 
                                    email
        });

    if(response.success != true){
        // res.status(501).end('Wrong Cred fromat'); // to sent this msg to frontend 
        res.json(response);
    }
    else{
        // req.newParameter = 'This is a new String added in middleware';
        next();
    }

}

app.get('/', (req, res) => {
    res.status(200).json('Get comfortable with Zod and middlewares');
})

app.post('/user', userMiddleware, (req, res)=>{
    // Auth is being done in userMiddleware;
    // send cred in headers
    res.status(200).json({status: 'Good to go'});

})

app.use((err, req, res, next) => {
    res.json({
        msg: "Server crashed this is a Global catch"
    })
})

app.listen(port, ()=>{
    console.log(`Listening at PORT ${port}`);
})
