import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cors from "cors"
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/ReviewProduct");

const AkunSchema = mongoose.Schema({
    username : {type : String, required : true},
    password : {type : String, required : true},
    email : {type : String, required : true}
});

const Akun = mongoose.model('AkunUser', AkunSchema);

const ProductsSchema = mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    price : Number,
    user : {type : mongoose.Types.ObjectId, ref : "AkunUser", required : true}
});

const Product = mongoose.model("Product", ProductsSchema);

const ReviewSchema = mongoose.Schema({
    user : {type : mongoose.Types.ObjectId, ref : "AkunUser", required: true},
    product : {type : mongoose.Types.ObjectId, ref : "Product", required : true},
    rating : {type : Number, enum : [1,2,3,4,5], required : true},
    comment : {type: String, required : false},
    createAt : {type : Date}
});

const ReviewModel = mongoose.model("Review", ReviewSchema)
const Auth = (req,res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Ambil tokennya saja
    if(!token) return res.status(422).json({message : "Token tidak di temukan"})
    try{
const verified = jwt.verify(token, "sigma");
req.user = verified
next()
    }
    catch(error){
        res.status(500).json({message : `Server error on auth because ${error}`})
    }
}


app.get("/AllProduct", async (req, res) => {
    try {
        const ProductAll = await Product.find({}).populate("user", "username email"); // Populate user
        res.status(200).json(ProductAll);
    } catch (error) {
        res.status(500).json({ message: `Server error on get all product: ${error}` });
    }
});


app.post("/Product", Auth, async(req,res) => {
    try{
        const {name, description} = req.body;
        const userId = req.user.id;
        const newProduct = new Product({
            name,
            description,
            user : userId
        });
        await newProduct.save();
        res.status(200).json({message : "Product berhasil di tambah"})
    }
    catch(error){
        res.status(500).json({message : `Server error on add product because :${error}`})
    }
});

app.post("/register", async(req,res) => {
    try{
        const {email, username, password} = req.body;
        const AkunUser = await Akun.findOne({email})
        if(AkunUser) return res.status(422).json({message : "email sudah di gunakan"});
        if(!email.includes("@gmail.com")) return res.status(422).json({message : "Email harus menggunakan @gmail.com"});
        const enkripsi = await bcrypt.hash(password, 10);
        const newAccount = new Akun({
            username,
            password : enkripsi,
            email
        });
        await newAccount.save();
        res.status(200).json({
            message : "Berhasil membuat akun"
        })
    }
    catch(error){
        res.status(500).json({
            message : `Server error on register because ${error}`
        })
    }
});

app.post("/login", async(req,res) => {
    try{
        const {email, password} = req.body;
        const AkunUser = await Akun.findOne({email});
        if(!AkunUser) return res.status(422).json({message : "Akun tidak di temukan"});
        if(!(bcrypt.compare(password, AkunUser.password))) return res.status(422).json({message : "Password salah"});
        const token = jwt.sign(
            {id : AkunUser._id},
            "sigma",
            {expiresIn : '1h'}
        )
        res.status(200).json({message : "Berhasil login", token})
    }
    catch(error){
        res.status(500).json({message : `Server error on login becuase :${error}`})
    }
})

app.get("/review/:productId", async(req, res) => {
    try{
        const Reviews = await ReviewModel.find({product : req.params.productId})
        .populate("user", "username")
        .populate("product", "name");
        res.status(200).json(Reviews)
    }
    catch(error){
        res.status(500).json({message : `Server error on get review because ${error}`})
    }
});

app.post("/ReviewProduct/:productId", Auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const userId = req.user.id; // Ambil user dari token
        const productId = req.params.productId;

        // Cek apakah user sudah pernah mereview produk ini
        const existingReview = await ReviewModel.findOne({ user: userId, product: productId });
        if (existingReview) {
            return res.status(422).json({ message: "Tidak bisa mereview lagi karena sudah ada" });
        }

        // Buat review baru dengan user dan product yang benar
        const newReview = new ReviewModel({
            user: userId,
            product: productId,
            rating,
            comment,
            createAt: new Date()
        });

        await newReview.save();
        res.status(200).json({ message: "Berhasil merating product" });

    } catch (error) {
        res.status(500).json({ message: `Server error on ReviewProduct because ${error}` });
    }
});

app.listen(5005, console.log("server berjalan di port 5005"))