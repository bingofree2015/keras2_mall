const axios = require('axios');
const data = {
    name: 'John Doe',
    job: 'Content Writer',
};
const urlString = 'https://api.example.com/endpoint';
const token = 'your-token-here';
const fn = (res) => console.log(res);

axios
    .post(
        urlString,
        {
            data: data,
        },
        {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }
    )
    .then((res) => fn(res))
    .catch((e) => fn(e));
