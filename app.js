require('dotenv').config();

const User=require('./models/userModel');
var mongoose=require('mongoose');

const connectDB=require('./config/connection');
connectDB('mongodb://127.0.0.1:27017/dynamic-chat-app');

const app=require('express')();

const http=require('http').Server(app);


// user routs
const userRoute=require('./routes/userRoutes');
app.use('/',userRoute);


const io=require('socket.io')(http);

var usp=io.of('/user-namespace');
usp.on('connection',async(socket)=>{
    console.log('User Connected');
    
    var userId=socket.handshake.auth.token;

    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'1'}});
    
    //user broadcast online status
    socket.broadcast.emit('getOnlineUser',{user_id:userId});
    socket.on('disconnect',async()=>{
        console.log('user Disconnected');
        var userId=socket.handshake.auth.token;
        await User.findByIdAndUpdate({_id:userId},{$set:{is_online:'0'}});

        //user broadcast ofline status
        socket.broadcast.emit('getOfflineUser',{user_id:userId});
    })
    
    //chatting implementation
    socket.on('newChat',(data)=>{
    socket.broadcast.emit('loadNewChat',data);
});
});
 

http.listen(3000,()=>{
    console.log('server is running');
})