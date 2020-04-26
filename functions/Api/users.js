const { admin, db } = require("../Util/admin");
const config = require("../Util/config");

const firebase = require("firebase");

firebase.initializeApp(config);

const { validateLoginData, validateSignUpData } = require("../Util/validators");

exports.loginUser = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.stauts(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      return res.status(403).json({ general: "Neispravni podaci..." });
    });
};

exports.signUpUser = (req, res) => 
{   
    const newUser = 
    {
        ...req.body
    }

    const { valid, errors } = validateSignUpData(newUser);
    if(!valid) return res.status(400).json(errors);

    let token, userId;

    db.doc(`/users/${newUser.username}`)
      .get()
      .then(doc => {
          if(doc.exists)
            return res.status(400).json({ username: "Zauzeto korisnicko ime..."});
          else
          {
              return firebase.auth()
                             .createUserWithEmailAndPassword(
                                 newUser.email,
                                 newUser.password
                             )
          }
      })
      .then(data => {
          userId = data.user.uid;
          return data.user.getIdToken();
      })
      .then(idtoken => {
         
          token = idtoken;
          const userCredentials = {
              ...newUser,
              createdAt: new Date().toISOString(),
              userId
          };
        
          delete userCredentials.password;
          delete userCredentials.confirmPassword;

          return db.doc(`/users/${newUser.username}`)
                   .set(userCredentials);
      })
      .then(() => {
          return res.status(201).json({ token });
      })
      .catch(err => {
          console.error(err);
          if(err.code === 'auth/email-already-in-use')
            return res.status(400).json({email: 'Email se koristi vec'})
          else  
            return res.status(500).json({general: 'Nesto ne valja...'});
        
      })
}

deleteImage = (imageName) => {
    const bucket = admin.storage().bucket();
    const path = `${imageName}`;

    return bucket.file(path).delete()
        .then(() => {return})
        .catch((err) => {return});
}

exports.uploadProfilePhoto = (req, res) => 
{
    const BusBoy = require('busboy');
    const path = require('path');
    const os = require('os');
    const fs = require('fs');
    const busboy = new BusBoy({ headers: req.headers});

    let imageFileName;
    let imageToBeUploaded = {};


    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        if(mimetype !== 'image/png' && mimetype !== 'image/jpeg')
            return res.status(400).json({error: "Pogresan tip datoteke..."});


        const imageExtension = filename.split('.')[filename.split('.').length - 1];
        imageFileName = `${req.user.username}.${imageExtension}`;

        const filePath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = { filePath, mimetype};

        file.pipe(fs.createWriteStream(filePath));
    });

    deleteImage(imageFileName);
    busboy.on('finish', () => {
        admin.storage()
             .bucket()
             .upload(imageToBeUploaded.filePath, {
                 resumable: false,
                 metadata: {
                     metadata: {
                         contentType: imageToBeUploaded.mimetype
                     }
                 }
             })
             .then(() => {
                 const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;

                 return db.doc(`/users/${req.user.username}`).update({
                        imageUrl
                    })
             })
             .then(() => res.json({message: 'Slika je uspjesno uploadovana...'}))
             .catch((err) => {
                 console.error(err);
                 return res.status(500).json({error: err.code})
             })
    })

    busboy.end(req.rawBody);
}

exports.getUserDetail = (req, res) => 
{
    let userData = {};

    db.doc(`/users/${req.user.username}`)
      .get()
      .then((doc) => {
          if(doc.exists)
          {
              userData.userCredentials = doc.data();
              return res.json(userData);
          }
      })
      .catch((err) => {
          console.error(err);
          return res.status(500).json({error: err.code});
      })
}

exports.updateUserDetails = (req, res) => 
{
    let document = db.collection('users').doc(`${req.user.username}`);
    document.update(req.body)
            .then(() => {
                res.json({message: 'Updated succesfully'});
            })
            .catch((err) => {
                console.error(error);
                return res.status(500).json({
                    message: "Can't update the value"
                })
            })
}