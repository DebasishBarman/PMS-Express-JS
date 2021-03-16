const mongoose=require('mongoose');
mongoose.connect("mongodb+srv://deba:1234@cluster0.rkwkw.mongodb.net/passwordmg?authSource=admin&replicaSet=atlas-gh1az4-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true",
{useCreateIndex:true,useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('Connected Successfully.'))
.catch((err)=>console.log(err));
var passwordSchema=new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    createdOn:{
        type:Date,
        default:Date.now()
    }
});
var PasswordModel=mongoose.model('passwordcats',passwordSchema);
module.exports=PasswordModel;
