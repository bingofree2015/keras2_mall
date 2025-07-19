const axios = require("axios");
const data = {
    name: "John Doe",
    job: "Content Writer"
};
axios
    .post(
        urlString,
        {
            data: data
        },
        {
            headers: {
                Authorization: "Bearer " + token
            }
        }
    )
    .then(res => fn)
    .catch(e => fn);
