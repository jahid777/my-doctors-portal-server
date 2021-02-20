const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs-extra");
const MongoClient = require("mongodb").MongoClient;
require("dotenv").config();
const fileUpload = require("express-fileupload");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7adfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use(express.static("doctors"));
app.use(fileUpload());
// app.use('/doctors', express.static('doctors'));

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("hello from db it's working working");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const appointmentCollection = client
    .db("doctorsPortal")
    .collection("appointments");

  const doctorCollection = client.db("doctorsPortal").collection("doctors");

//   //appointmentForm theke data ase create hoccee server a
//   app.post("/addAppointment", (req, res) => {
//     const appointment = req.body;
//     console.log(appointment);
//     appointmentCollection.insertOne(appointment)
//     .then((result) => {
//       res.send(result.insertedCount > 0);
//     });
//   });

//   //AllPatients  a amra data pathaytsei ja pore pros hoia AppointmentDataTable a jabe
//   app.get("/appointments", (req, res) => {
//     appointmentCollection.find({})
//     .toArray((err, documents) => {
//       res.send(documents);
//     });
//   });


  

//   //dashborad theke date astese click korer maddome ar doctor ar jonno sob dhekacee
//   app.post("/appointmentsByDate", (req, res) => {
//     const date = req.body;
//     const email = req.body.email;
//     doctorCollection.find({ email: email })
//     .toArray((err, doctors) => {
//        const filter = {date: date.date}  
//       if (doctors.length === 0){
//           filter.email = email;
//       }
//         appointmentCollection.find(filter)
//           //date.date disi karon  date name ekta object o chilo tay match korte pare nay
//           .toArray((err, documents) => {
//             res.send(documents);
//           });
//     });
//   });



//   // //input thekeke data ase server a creat korte
//   app.post("/addADoctor", (req, res) => {
//     const file = req.files.file;
//     const name = req.body.name;
//     const email = req.body.email;
//     const filePath =  `${__dirname}/doctors/${file.name}`
//     console.log(name, email, file);

//     const newImg = fs.readFileSync(filePath);
//     const encImg = newImg.toString('base64');

//     var image = {
//       contentType: req.files.file.mimeType,
//       size: req.files.file.size,
//       img: Buffer(encImg, 'base64')
//     }

//     doctorCollection.insertOne({ name, email, image });
//     file.mv(filePath, err => {
//       if (err) {
//         console.log(err);
//         return res.status(500).send({ msg: "image is not Uploaded" });
//       }
//       return res.send({ name: file.name, path: `/${file.name}` });
//     });
    
//   });



//   //doctros component a read korte
//   app.get("/doctors", (req, res) => {
//     doctorCollection.find({})
//     .toArray((err, documents) => {
//       res.send(documents);
//     });
//   });




// // sidebar a doctor identry kore dashbord ar option dhekabe
//   // app.post("/isDoctor", (req, res) => {
//   //   const date = req.body;
//   //   const email = req.body.email;
//   //   doctorCollection.find({ email: email })
//   //   .toArray((err, doctors) => {
//   //      res.send(doctors.length > 0)
//   //   });
//   // });


app.post('/addAppointment', (req, res) => {
  const appointment = req.body;
  appointmentCollection.insertOne(appointment)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
});

app.get('/appointments', (req, res) => {
  appointmentCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
})

app.post('/appointmentsByDate', (req, res) => {
  const date = req.body;
  const email = req.body.email;
  doctorCollection.find({ email: email })
      .toArray((err, doctors) => {
          const filter = { date: date.date }
          if (doctors.length === 0) {
              filter.email = email;
          }
          appointmentCollection.find(filter)
              .toArray((err, documents) => {
                  console.log(email, date.date, doctors, documents)
                  res.send(documents);
              })
      })
})

app.post('/addADoctor', (req, res) => {
  const file = req.files.file;
  const name = req.body.name;
  const email = req.body.email;
  const newImg = file.data;
  const encImg = newImg.toString('base64');

  var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };

  doctorCollection.insertOne({ name, email, image })
      .then(result => {
          res.send(result.insertedCount > 0);
      })
})

app.get('/doctors', (req, res) => {
  doctorCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
});

// app.post('/isDoctor', (req, res) => {
//   const email = req.body.email;
//   doctorCollection.find({ email: email })
//       .toArray((err, doctors) => {
//           res.send(doctors.length > 0);
//       })
// })



//chck admin to show sidebar data
app.get("/isDoctor", (req, res) => {
  const email = req.query.email;
  // console.log(email.email);
  doctorCollection.find({email: email})
   .toArray((err, admin)=>{
    //  console.log(admin)
    if(admin.length === 0){
      res.send({admin: false})
    }
    else{
      res.send({admin: true})
    }
   })
  });








});

app.listen( port,()=>console.log(`connected database server${port}`));
