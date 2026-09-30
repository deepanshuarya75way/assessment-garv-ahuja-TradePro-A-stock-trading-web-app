require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");


const cors = require("cors");
const cookieParser = require("cookie-parser");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UsersModel = require("./schemas/UserSchema");


const app = express();

const PORT = process.env.PORT || 3002;
const url = process.env.MONGO_URL;

app.use(express.json());
app.use(cookieParser());

const HoldingsModel = require('./schemas/HoldingSchema');
const PositionsModel = require('./schemas/PositionsSchema');
const OrdersModel = require('./schemas/OrdersSchema');

const TransferHistory = mongoose.model("TransferHistory",new mongoose.Schema({
    sender:mongoose.Schema.Types.ObjectId,
    receiver:mongoose.Schema.Types.ObjectId,
    stock:String,
    amount:Number,
    quantity:Number,
    price:Number,
    Date:{
        type:Date,
        default:Date.now
    }
}));

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3003"
]
app.use(cors({
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Blocked CORS origin:", origin);
            callback(new Error("Not allowed by CORS"));
        }

    },
    credentials: true
}));

async function main() {
    await mongoose.connect(url);
}

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });


// app.get("/addHoldings", (req,res)=>{
//     let tempHolding = [
//   {
//     name: "BHARTIARTL",
//     qty: 2,
//     avg: 538.05,
//     price: 541.15,
//     net: "+0.58%",
//     day: "+2.99%",
//   },
//   {
//     name: "HDFCBANK",
//     qty: 2,
//     avg: 1383.4,
//     price: 1522.35,
//     net: "+10.04%",
//     day: "+0.11%",
//   },
//   {
//     name: "HINDUNILVR",
//     qty: 1,
//     avg: 2335.85,
//     price: 2417.4,
//     net: "+3.49%",
//     day: "+0.21%",
//   },
//   {
//     name: "INFY",
//     qty: 1,
//     avg: 1350.5,
//     price: 1555.45,
//     net: "+15.18%",
//     day: "-1.60%",
//     isLoss: true,
//   },
//   {
//     name: "ITC",
//     qty: 5,
//     avg: 202.0,
//     price: 207.9,
//     net: "+2.92%",
//     day: "+0.80%",
//   },
//   {
//     name: "KPITTECH",
//     qty: 5,
//     avg: 250.3,
//     price: 266.45,
//     net: "+6.45%",
//     day: "+3.54%",
//   },
//   {
//     name: "M&M",
//     qty: 2,
//     avg: 809.9,
//     price: 779.8,
//     net: "-3.72%",
//     day: "-0.01%",
//     isLoss: true,
//   },
//   {
//     name: "RELIANCE",
//     qty: 1,
//     avg: 2193.7,
//     price: 2112.4,
//     net: "-3.71%",
//     day: "+1.44%",
//   },
//   {
//     name: "SBIN",
//     qty: 4,
//     avg: 324.35,
//     price: 430.2,
//     net: "+32.63%",
//     day: "-0.34%",
//     isLoss: true,
//   },
//   {
//     name: "SGBMAY29",
//     qty: 2,
//     avg: 4727.0,
//     price: 4719.0,
//     net: "-0.17%",
//     day: "+0.15%",
//   },
//   {
//     name: "TATAPOWER",
//     qty: 5,
//     avg: 104.2,
//     price: 124.15,
//     net: "+19.15%",
//     day: "-0.24%",
//     isLoss: true,
//   },
//   {
//     name: "TCS",
//     qty: 1,
//     avg: 3041.7,
//     price: 3194.8,
//     net: "+5.03%",
//     day: "-0.25%",
//     isLoss: true,
//   },
//   {
//     name: "WIPRO",
//     qty: 4,
//     avg: 489.3,
//     price: 577.75,
//     net: "+18.08%",
//     day: "+0.32%",
//   },
//     ];
//     tempHolding.forEach ( (item)=>{
//         let newHolding = new HoldingsModel({
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price: item.price,
//             net: item.net,
//             day: item.day,
//         })
//         newHolding.save()
//             .then(() => {
//                 console.log("Holding data is saved");
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     });
//     res.send("saved");
// });


// app.get("/addPositions", (req,res)=>{
//     let tempPositions = [
//   {
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   {
//     product: "CNC",
//     name: "JUBLFOOD",
//     qty: 1,
//     avg: 3124.75,
//     price: 3082.65,
//     net: "+10.04%",
//     day: "-1.35%",
//     isLoss: true,
//   },
// ];
//     tempPositions.forEach ( (item)=>{
//         let newPosition = new PositionsModel({
//             product: item.product,
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price:item.price,
//             net: item.net,
//             day: item.day,
//             isLoss: item.isLoss,
//         })
//         newPosition.save()
//             .then(() => {
//                 console.log("Position data is saved");
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     });
//     res.send("saved");
// });

// app.get("/addPositions", (req,res)=>{
//     let tempPositions = [
//   {
//     product: "CNC",
//     name: "EVEREADY",
//     qty: 2,
//     avg: 316.27,
//     price: 312.35,
//     net: "+0.58%",
//     day: "-1.24%",
//     isLoss: true,
//   },
//   {
//     product: "CNC",
//     name: "JUBLFOOD",
//     qty: 1,
//     avg: 3124.75,
//     price: 3082.65,
//     net: "+10.04%",
//     day: "-1.35%",
//     isLoss: true,
//   },
// ];
//     tempPositions.forEach ( (item)=>{
//         let newPosition = new PositionsModel({
//             product: item.product,
//             name: item.name,
//             qty: item.qty,
//             avg: item.avg,
//             price:item.price,
//             net: item.net,
//             day: item.day,
//             isLoss: item.isLoss,
//         })
//         newPosition.save()
//             .then(() => {
//                 console.log("Position data is saved");
//             })
//             .catch((err) => {
//                 console.log(err);
//             });
//     });
//     res.send("saved");
// });

app.post("/signup",async(req,res)=>{
    
    try{

    const{name,email,password}=req.body;

    const userExists = await UsersModel.findOne({email});

    if(userExists){
        return res.status(400).json({
            message:"User already exists"
        });
    }

    const hashPassword = await bcrypt.hash(password,10);

    const User = new UsersModel({
        name:name,
        email:email,
        password:hashPassword,
    });

    await User.save();

    res.status(201).json({
         message: "Signup successful"
    });

}catch(err){
    console.log(err);

    res.status(500).json({
        message:"signup failed"
    });
}
})



app.post("/login",async(req,res)=>{

    try{

    const {email,password}=req.body;

    const user = await UsersModel.findOne({email});

    if(!user){
        return res.status(401).json({
            message:"Please register yourself"
        })
    }
    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
        return res.status(401).json({
            message:"Wrong email or password"
        });
    }

    const token = jwt.sign(
        {
            userId:user._id,
            email:user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1d"
        }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    res.json({
    message: "Login successful"
    });

}catch(err){
    res.status(500).json({
        message:"Login failed"
    });
}
});


app.get("/users",async(req,res)=>{

    try{
        const users = await UsersModel.find({},"name email");
        res.json(users);
    }
    catch(err){
        res.status(500).json({message:"Could not get users"});
    }
})

app.get('/allHoldings', async (req, res) => {

    try {

        const token = req.cookies.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const holdings = await HoldingsModel.find({
            userId: decoded.userId
        });
        res.json(holdings);
    }
    catch(err){
        res.status(401).json({message:"Unauthorized"});
    }
});

app.get("/transferStock",async(req,res)=>{

    try{
        const token = req.cookies.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const {receiverId,stock,amount} = req.body;

        if(!receiverId || !stock || !amount || amount<=0){
            return res.status(400).json({
                message:"Please provide stock , receiver and amount"
            })
        }

        const senderId = decoded.userId;

        const sender = await HoldingsModel.findOne({
            userId:senderId,
            name:stock
        });

        if(!sender){
            res.status(400).json({
                message:"You are not the stock owner"
            });
        }

        const price = sender.price;

        if(!price || price<=0){
            res.status(400).json({
                message:"Stock price is invalid"
            });
        }
        
        const quantity = Number(amount)/price;

        if(sender.qty*price<Number(amount)){
            res.status(400).json({
                message:"Insufficient stock value"
            });
        }

        sender.qty -=quantity;
        await sender.save();


        let receiver = await HoldingsModel.findOne({
            userId:receiverId,
            name:stock
        })

        if(receiver){
            receiver.qty += quantity;
            receiver.price = price;
            await receiver.save();
        }else{
            receiver = new HoldingsModel({
                userId:receiverId,
                name:stock,
                qty:quantity,
                avg:price,
                price:price,
                net:"0%",
                day:"0%"
            });
            await receiver.save();
        }

        await TransferHistory.create({
            sender:senderId,
            receiver:receiverId,
            stock,
            amount:Number(amount),
            quantity,
            price
        });

        res.json({
            message:"Stock has been transferred successfully",
            quantity:quantity.toFixed(4),
            price
        });
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:err.message
        });
    }
});


app.get("/transferHistory",async (req,res)=>{

    try{

        const token = req.cookies.token;
        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const history = await TransferHistory.find({
            $or:[
                {sender:decoded.userId},
                {receiver:decoded.userId}
            ]
        }).sort({data:-1});

        res.json(history);

    }catch(err){
        res.status(401).json({
            message:"Unautorized"
        });
    }
});






app.get('/allPositions', async (req, res) => {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
});

app.post('/newOrder', async (req, res) => {

    const newOrder = new OrdersModel({
        name: req.body.name,
        qty: req.body.qty,
        price: req.body.price,
        mode: req.body.mode,
    });

    await newOrder.save();

    res.send("order saved");
});

app.post("/logout", (req, res) => {

   res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        expires: new Date(0)
    });

    res.json({
        message: "Logout successful"
    });
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});