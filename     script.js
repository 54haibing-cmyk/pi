const express = require("express");
const fetch = require("node-fetch");

const app = express();

app.use(express.json());

app.use((req,res,next)=>{

    res.header(
        "Access-Control-Allow-Origin",
        "*"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
});

/* Pi 用户验证 */

app.post("/verify-pi-user", async (req,res)=>{

    try{

        const accessToken =
        req.body.accessToken;

        if(!accessToken){

            return res.status(400).json({
                success:false,
                error:"No access token"
            });
        }

        const response = await fetch(
            "https://api.minepi.com/v2/me",
            {
                method:"GET",

                headers:{
                    Authorization:
                    `Bearer ${accessToken}`
                }
            }
        );

        const user = await response.json();

        console.log(user);

        if(user.username){

            return res.json({
                success:true,
                user:user
            });
        }

        return res.status(401).json({
            success:false,
            error:"Invalid Pi user"
        });

    }catch(e){

        console.error(e);

        return res.status(500).json({
            success:false,
            error:e.message
        });
    }
});

app.get("/",(req,res)=>{

    res.send("Pi Backend Running");
});

const PORT =
process.env.PORT || 3000;

app.listen(PORT,()=>{

    console.log(
        "Server running on port " + PORT
    );
});