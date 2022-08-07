const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User");
const Message = require("./models/Message");
const Course = require("./models/Course");

const cors = require("cors");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRoutes);
require("./connection");

const server = require("http").createServer(app);
const PORT = 5001;
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE"],
  },
});

// app.get("/rooms", async (req, res) => {
//   try{
//     const rooms = await Language.find()
//     res.json(rooms);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

// app.post("/addlanguage", async (req, res) => {
//   const { newLanguage, newFlagCode} = req.body;

//   try{
//     const language = await Language.create({name:newLanguage, flag_code:newFlagCode});    
//     res.status(200).json(language);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

// app.patch("/editlanguage", async (req, res) => {
//   const { formData } = req.body;
//   try{
//     const language = await Language.findById(formData._id);
//     language.name = formData.name
//     language.flag_code = formData.flag_code
//     await language.save()
//     res.status(200).json(language);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

// app.delete("/deletelanguage", async (req, res) => {
//   const { _id } = req.body;

//   try{
//     await Language.findByIdAndDelete(_id);
//     const languages = await Language.find();
//     res.status(200).json(languages);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// });

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);

  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    // 02/11/2022
    // becomes 20220211
    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}



  app.delete('/logout', async (req, res) => {
    try {
      // const {_id, newMessages, status} = req.body;
      // const user = await User.findById(_id);
      // user.status = "offline";
      // user.newMessages = newMessages;
      // await user.save();

      // const members = await User.find();
      // socket.broadcast.emit('new-user', members);
      res.status(200).send();

    } catch (e) {
      res.status(400).send()
      }
    
  })


server.listen(PORT, () => {
  console.log("listening to port", PORT);
});
